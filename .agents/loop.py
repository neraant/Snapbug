#!/usr/bin/env python3
"""Run the Snapbug implementer for at most 10 agent calls.

Secrets stay in the environment or under ~/.snapbug. This process mints the
implementer app token, pushes only feat/<task-id>, and opens the pull request.
The agent does not receive the private key or a GitHub token.
"""

from __future__ import annotations

import base64
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

REPO = os.environ.get("SNAPBUG_REPO", "neraant/Snapbug")
OWNER, NAME = REPO.split("/", 1)
APP_ID = os.environ.get("IMPLEMENTER_APP_ID", "180272519")
KEY_PATH = Path(
    os.environ.get("IMPLEMENTER_PRIVATE_KEY_PATH", Path.home() / ".snapbug/implementer.pem")
)
CURSOR_KEY_PATH = Path(os.environ.get("CURSOR_KEY_PATH", Path.home() / ".snapbug/cursor.key"))
HOME_STATE = Path.home() / ".snapbug"
CLONE = HOME_STATE / "src"
MAX_AGENT_CALLS = int(os.environ.get("SNAPBUG_MAX_ITERATIONS", "10"))
FAILURES_BEFORE_BLOCK = 3
MODEL = "grok-4.7"
REQUIRED_CHECKS = ("ci", "agent-review")
TBD = {"P-08", "P-18"}
FORBIDDEN_REFS = {"master", "staging", "production"}
PROTECTED_EXACT = {"docs/SPEC.md"}
PROTECTED_PREFIXES = (".github/", ".cursor/", ".agents/", "docs/decisions/")
TASK_LINE = re.compile(r"^- (P-\d+)\b", re.MULTILINE)
WAIT_SECONDS = 20 * 60
POLL_SECONDS = 30


class LoopError(RuntimeError):
    pass


def section(text: str, heading: str) -> str:
    marker = f"## {heading}\n"
    start = text.find(marker)
    if start == -1:
        return ""
    start += len(marker)
    end = text.find("\n## ", start)
    return text[start:] if end == -1 else text[start:end]


def task_ids(block: str) -> list[str]:
    return [match.group(1) for match in TASK_LINE.finditer(block)]


def select_task(status: str) -> str | None:
    blocked = set(task_ids(section(status, "Blocked")))
    for task_id in task_ids(section(status, "Open")):
        if task_id in TBD or task_id in blocked:
            continue
        return task_id
    return None


def branch_for(task_id: str) -> str:
    if not re.fullmatch(r"P-\d+", task_id) or task_id in TBD:
        raise LoopError(f"refusing task {task_id}")
    branch = f"feat/{task_id}"
    if branch in FORBIDDEN_REFS or not branch.startswith("feat/"):
        raise LoopError(f"refusing branch {branch}")
    return branch


def protected(path: str) -> bool:
    return path in PROTECTED_EXACT or path.startswith(PROTECTED_PREFIXES)


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def app_jwt() -> str:
    if not KEY_PATH.is_file():
        raise LoopError(f"missing implementer key at {KEY_PATH}")
    now = int(time.time())
    header = b64url(json.dumps({"alg": "RS256", "typ": "JWT"}, separators=(",", ":")).encode())
    payload = b64url(
        json.dumps(
            {"iat": now - 60, "exp": now + 540, "iss": APP_ID},
            separators=(",", ":"),
        ).encode()
    )
    signing_input = f"{header}.{payload}".encode()
    signature = subprocess.run(
        ["openssl", "dgst", "-sha256", "-sign", str(KEY_PATH), "-binary"],
        input=signing_input,
        capture_output=True,
        check=False,
    )
    if signature.returncode != 0:
        raise LoopError("could not sign the implementer token")
    return f"{header}.{payload}.{b64url(signature.stdout)}"


def github(method: str, url: str, token: str, body: dict | None = None) -> dict:
    data = None if body is None else json.dumps(body).encode()
    request = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "snapbug-loop",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            raw = response.read()
    except urllib.error.HTTPError as error:
        detail = error.read().decode(errors="replace")[:300]
        raise LoopError(f"GitHub {method} {url} failed: {error.code} {detail}") from error
    return json.loads(raw) if raw else {}


def installation_token(jwt: str) -> str:
    installation = github(
        "GET",
        f"https://api.github.com/repos/{REPO}/installation",
        jwt,
    )
    installation_id = installation.get("id")
    if not isinstance(installation_id, int):
        raise LoopError("implementer app is not installed on this repository")
    minted = github(
        "POST",
        f"https://api.github.com/app/installations/{installation_id}/access_tokens",
        jwt,
        {
            "repositories": [NAME],
            "permissions": {
                "contents": "write",
                "pull_requests": "write",
                "metadata": "read",
            },
        },
    )
    token = minted.get("token")
    if not isinstance(token, str) or not token:
        raise LoopError("GitHub did not return an installation token")
    return token


def cursor_key() -> str:
    key = os.environ.get("CURSOR_API_KEY", "").strip()
    if not key and CURSOR_KEY_PATH.is_file():
        key = CURSOR_KEY_PATH.read_text().strip()
    if not key:
        raise LoopError("CURSOR_API_KEY is missing")
    return key


def git(repo: Path, args: list[str], token: str | None = None, check: bool = True) -> str:
    command = ["git", "-C", str(repo)]
    if token:
        basic = base64.b64encode(f"x-access-token:{token}".encode()).decode()
        command[1:1] = ["-c", f"http.extraheader=AUTHORIZATION: basic {basic}"]
    result = subprocess.run(command + args, capture_output=True, text=True, check=False)
    if check and result.returncode != 0:
        message = (result.stderr or result.stdout).strip()
        raise LoopError(message.splitlines()[0][:300] if message else "git failed")
    return result.stdout.strip()


def allowed_branch(branch: str) -> bool:
    return bool(re.fullmatch(r"feat/P-\d+", branch) or re.fullmatch(r"chore/block-P-\d+", branch))


def ensure_clone(token: str) -> None:
    HOME_STATE.mkdir(parents=True, exist_ok=True)
    if not (CLONE / ".git").is_dir():
        if CLONE.exists():
            shutil.rmtree(CLONE)
        basic = base64.b64encode(f"x-access-token:{token}".encode()).decode()
        cloned = subprocess.run(
            [
                "git",
                "-c",
                f"http.extraheader=AUTHORIZATION: basic {basic}",
                "clone",
                "--branch",
                "master",
                f"https://github.com/{REPO}.git",
                str(CLONE),
            ],
            check=False,
            capture_output=True,
            text=True,
        )
        if cloned.returncode != 0:
            raise LoopError("could not clone the repository")
    git(CLONE, ["fetch", "--prune", "origin"], token)
    git(CLONE, ["config", "user.name", "neraant-snapbug-implementer[bot]"])
    git(
        CLONE,
        [
            "config",
            "user.email",
            "180272519+neraant-snapbug-implementer[bot]@users.noreply.github.com",
        ],
    )


def load_state() -> dict:
    path = HOME_STATE / "loop-state.json"
    if not path.is_file():
        return {"failures": {}}
    data = json.loads(path.read_text())
    if not isinstance(data, dict) or not isinstance(data.get("failures"), dict):
        return {"failures": {}}
    return data


def save_state(state: dict) -> None:
    HOME_STATE.mkdir(parents=True, exist_ok=True)
    (HOME_STATE / "loop-state.json").write_text(json.dumps(state, indent=2) + "\n")


def checkout_task(token: str, branch: str) -> str:
    if not allowed_branch(branch):
        raise LoopError(f"refusing to check out {branch}")
    git(CLONE, ["fetch", "--prune", "origin"], token)
    remote = git(CLONE, ["rev-parse", "--verify", "--quiet", f"origin/{branch}"], check=False)
    base = remote or git(CLONE, ["rev-parse", "origin/master"])
    git(CLONE, ["checkout", "--force", "-B", branch, base])
    return base


def worktree_status(base: str) -> list[str]:
    names = git(CLONE, ["diff", "--name-only", f"{base}...HEAD"], check=False)
    return [line for line in names.splitlines() if line]


def run_agent(task_id: str, branch: str, task_line: str) -> None:
    instructions = (CLONE / ".agents/agents/implementer.md").read_text()
    prompt = (
        instructions
        + "\n\n"
        + f"Task: {task_id}\n"
        + f"Branch: {branch}\n"
        + f"Status line: {task_line}\n"
        + "Implement this task only. Commit on the current branch. Do not push.\n"
    )
    env = os.environ.copy()
    env["CURSOR_API_KEY"] = cursor_key()
    env["GH_TOKEN"] = ""
    env["GITHUB_TOKEN"] = ""
    result = subprocess.run(
        [
            "agent",
            "-p",
            "--trust",
            "--model",
            MODEL,
            "--output-format",
            "json",
            "--",
            prompt,
        ],
        cwd=CLONE,
        env=env,
        check=False,
        timeout=30 * 60,
    )
    if result.returncode != 0:
        raise LoopError(f"agent exited {result.returncode}")


def push_branch(token: str, branch: str) -> None:
    if branch in FORBIDDEN_REFS or not allowed_branch(branch):
        raise LoopError(f"refusing to push {branch}")
    if git(CLONE, ["branch", "--show-current"]) != branch:
        raise LoopError(f"refusing to push while {branch} is not checked out")
    git(CLONE, ["push", "origin", f"HEAD:{branch}"], token)


def gh(token: str, args: list[str]) -> str:
    env = os.environ.copy()
    env["GH_TOKEN"] = token
    env["GITHUB_TOKEN"] = token
    env["GH_CONFIG_DIR"] = tempfile.mkdtemp(prefix="snapbug-gh-")
    try:
        result = subprocess.run(
            ["gh", *args],
            cwd=CLONE,
            env=env,
            capture_output=True,
            text=True,
            check=False,
        )
    finally:
        shutil.rmtree(env["GH_CONFIG_DIR"], ignore_errors=True)
    if result.returncode != 0:
        message = (result.stderr or result.stdout).strip()
        raise LoopError(message.splitlines()[0][:300] if message else "gh failed")
    return result.stdout.strip()


def ensure_pr(token: str, branch: str, task_id: str, task_line: str, title: str | None = None) -> str:
    existing = gh(
        token,
        [
            "pr",
            "list",
            "--repo",
            REPO,
            "--head",
            branch,
            "--base",
            "master",
            "--state",
            "open",
            "--json",
            "number",
        ],
    )
    found = json.loads(existing)
    if found:
        number = str(found[0]["number"])
    else:
        body = (
            "## Description\n\n"
            f"**Problem:** {task_line}\n\n"
            f"**Solution:** Implement {task_id} from docs/STATUS.md.\n\n"
            "## Related\n\n"
            f"{task_id}\n\n"
            "## How to test\n\n"
            "pnpm typecheck, pnpm lint, and pnpm test:unit. ci runs the same checks.\n\n"
            "## Screenshots\n\nN/A\n\n"
            "## Deploy impact\n\nNone\n\n"
            "## Review focus\n\n"
            "The change should implement only this task and leave P-08 and P-18 untouched.\n"
        )
        url = gh(
            token,
            [
                "pr",
                "create",
                "--repo",
                REPO,
                "--base",
                "master",
                "--head",
                branch,
                "--title",
                title or f"feat: {task_id}",
                "--body",
                body,
            ],
        )
        number = url.rstrip("/").split("/")[-1]
    gh(token, ["pr", "merge", number, "--repo", REPO, "--auto", "--squash"])
    return number


def pull_request(token: str, number: str) -> dict:
    return json.loads(
        gh(
            token,
            [
                "pr",
                "view",
                number,
                "--repo",
                REPO,
                "--json",
                "state,reviewDecision,statusCheckRollup,url",
            ],
        )
    )


def check_phase(pull: dict) -> str:
    if pull.get("state") == "MERGED":
        return "merged"
    by_name: dict[str, str] = {}
    for item in pull.get("statusCheckRollup") or []:
        name = item.get("name") or item.get("context")
        if name not in REQUIRED_CHECKS:
            continue
        conclusion = item.get("conclusion") or item.get("state") or ""
        by_name[name] = str(conclusion).upper()
    if any(by_name.get(name) in {"FAILURE", "CANCELLED", "TIMED_OUT", "ERROR"} for name in REQUIRED_CHECKS):
        return "failed"
    if all(by_name.get(name) == "SUCCESS" for name in REQUIRED_CHECKS):
        if pull.get("reviewDecision") == "APPROVED":
            return "ready"
        if pull.get("reviewDecision") == "CHANGES_REQUESTED":
            return "failed"
        return "pending"
    return "pending"


def bump(state: dict, task_id: str) -> int:
    count = int(state["failures"].get(task_id, 0)) + 1
    state["failures"][task_id] = count
    save_state(state)
    return count


def close_task_pr(token: str, branch: str) -> None:
    found = json.loads(
        gh(
            token,
            [
                "pr",
                "list",
                "--repo",
                REPO,
                "--head",
                branch,
                "--base",
                "master",
                "--state",
                "open",
                "--json",
                "number",
            ],
        )
    )
    if not found:
        return
    gh(
        token,
        [
            "pr",
            "close",
            str(found[0]["number"]),
            "--repo",
            REPO,
            "--comment",
            f"Blocked after {FAILURES_BEFORE_BLOCK} consecutive failures.",
        ],
    )


def mark_blocked(token: str, task_id: str, branch: str) -> None:
    close_task_pr(token, branch)
    block_branch = f"chore/block-{task_id}"
    checkout_task(token, block_branch)
    path = CLONE / "docs/STATUS.md"
    text = path.read_text()
    open_block = section(text, "Open")
    line = next(
        (
            raw
            for raw in open_block.splitlines(keepends=True)
            if raw.startswith(f"- {task_id} ")
        ),
        None,
    )
    if line is None:
        raise LoopError(f"{task_id} is not in the Open section")
    text = text.replace(line, "", 1)
    blocked = (
        f"- {task_id} blocked after {FAILURES_BEFORE_BLOCK} consecutive implementer failures. "
        "Only neraant can move it back to Open.\n"
    )
    if "## Blocked\n\nNone.\n" in text:
        text = text.replace("## Blocked\n\nNone.\n", f"## Blocked\n\n{blocked}", 1)
    else:
        text = text.replace("## Blocked\n", f"## Blocked\n\n{blocked}", 1)
    path.write_text(text)
    git(CLONE, ["add", "docs/STATUS.md"])
    git(CLONE, ["commit", "-m", f"chore: block {task_id} after repeated failures"])
    push_branch(token, block_branch)
    ensure_pr(token, block_branch, task_id, f"{task_id} is blocked", f"chore: block {task_id}")


def task_line(status: str, task_id: str) -> str:
    for raw in section(status, "Open").splitlines():
        if raw.startswith(f"- {task_id} "):
            return raw[2:].strip()
    return task_id


def write_handover(lines: list[str]) -> None:
    HOME_STATE.mkdir(parents=True, exist_ok=True)
    (HOME_STATE / "HANDOVER.md").write_text("# Handover\n\n" + "\n".join(lines) + "\n")


def wait_for(token: str, number: str) -> str:
    deadline = time.monotonic() + WAIT_SECONDS
    phase = "pending"
    while time.monotonic() < deadline:
        phase = check_phase(pull_request(token, number))
        if phase != "pending":
            return phase
        time.sleep(POLL_SECONDS)
    return "pending"


def one_task(token: str, state: dict, notes: list[str]) -> tuple[str, bool]:
    git(CLONE, ["fetch", "--prune", "origin"], token)
    git(CLONE, ["checkout", "--force", "--detach", "origin/master"])
    status = (CLONE / "docs/STATUS.md").read_text()
    task_id = select_task(status)
    if task_id is None:
        notes.append("No open task left.")
        return "stop", False
    branch = branch_for(task_id)
    line = task_line(status, task_id)
    if int(state["failures"].get(task_id, 0)) >= FAILURES_BEFORE_BLOCK:
        mark_blocked(token, task_id, branch)
        state["failures"][task_id] = 0
        save_state(state)
        notes.append(f"{task_id} marked blocked.")
        return "continue", False

    existing = json.loads(
        gh(
            token,
            [
                "pr",
                "list",
                "--repo",
                REPO,
                "--head",
                branch,
                "--base",
                "master",
                "--state",
                "open",
                "--json",
                "number",
            ],
        )
    )
    if existing:
        phase = wait_for(token, str(existing[0]["number"]))
        if phase == "merged":
            state["failures"][task_id] = 0
            save_state(state)
            notes.append(f"{task_id} merged.")
            return "continue", False
        if phase == "ready":
            notes.append(f"{task_id} is approved and waiting for GitHub to merge.")
            return "stop", False
        if phase == "pending":
            notes.append(f"{task_id} is still waiting on ci or agent-review.")
            return "stop", False
        count = bump(state, task_id)
        notes.append(f"{task_id} checks or review failed ({count}).")
        if count >= FAILURES_BEFORE_BLOCK:
            return "continue", False

    base = checkout_task(token, branch)
    before = git(CLONE, ["rev-parse", "HEAD"])
    try:
        run_agent(task_id, branch, line)
    except (LoopError, subprocess.TimeoutExpired) as error:
        count = bump(state, task_id)
        notes.append(f"{task_id} agent failed ({count}): {error}")
        return "continue", True
    if git(CLONE, ["branch", "--show-current"]) != branch or git(CLONE, ["rev-parse", "HEAD"]) == before:
        count = bump(state, task_id)
        notes.append(f"{task_id} produced no commit on {branch} ({count}).")
        return "continue", True
    blocked_paths = [path for path in worktree_status(base) if protected(path)]
    if blocked_paths:
        count = bump(state, task_id)
        notes.append(f"{task_id} touched a protected path ({count}): {blocked_paths[0]}")
        return "continue", True
    push_branch(token, branch)
    number = ensure_pr(token, branch, task_id, line)
    notes.append(f"{task_id} opened or updated pull request {number}.")
    phase = wait_for(token, number)
    if phase == "failed":
        count = bump(state, task_id)
        notes.append(f"{task_id} pull request failed review or checks ({count}).")
        return "continue", True
    if phase == "merged":
        state["failures"][task_id] = 0
        save_state(state)
        notes.append(f"{task_id} merged.")
        return "continue", True
    notes.append(f"{task_id} is waiting on checks or review.")
    return "stop", True


def self_check() -> None:
    sample = """## Open\n\n- P-01 first\n- P-08 listed by mistake\n- P-02 second\n\n## TBD\n\n- P-08 do not start\n\n## Blocked\n\n- P-02 already blocked\n"""
    if select_task(sample) != "P-01":
        raise SystemExit("select_task failed")
    if branch_for("P-01") != "feat/P-01":
        raise SystemExit("branch_for failed")
    refused = False
    try:
        branch_for("P-08")
    except LoopError:
        refused = True
    if (
        not refused
        or not protected(".github/workflows/ci.yml")
        or protected("docs/STATUS.md")
        or allowed_branch("master")
        or allowed_branch("staging")
        or not allowed_branch("chore/block-P-01")
    ):
        raise SystemExit("guard failed")
    print("self-check ok")


def main() -> None:
    if "--self-check" in sys.argv:
        self_check()
        return
    if MAX_AGENT_CALLS < 1:
        raise LoopError("SNAPBUG_MAX_ITERATIONS must be at least 1")
    notes = [f"Repository: {REPO}", f"Agent call cap: {MAX_AGENT_CALLS}", f"Model: {MODEL}"]
    token = installation_token(app_jwt())
    minted_at = time.monotonic()
    ensure_clone(token)
    state = load_state()
    calls = 0
    try:
        while calls < MAX_AGENT_CALLS:
            if time.monotonic() - minted_at > 50 * 60:
                token = installation_token(app_jwt())
                minted_at = time.monotonic()
            outcome, used_agent = one_task(token, state, notes)
            if used_agent:
                calls += 1
            if outcome == "stop":
                break
    finally:
        write_handover(notes)
    print("\n".join(notes))
    print(f"Handover: {HOME_STATE / 'HANDOVER.md'}")


if __name__ == "__main__":
    try:
        main()
    except LoopError as error:
        print(f"loop: {error}", file=sys.stderr)
        sys.exit(1)

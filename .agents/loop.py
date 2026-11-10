#!/usr/bin/env python3
"""Run the Snapbug implementer for at most 5 agent calls.

Secrets stay in the environment or under ~/.snapbug. This process mints the
implementer app token, pushes only feat/<task-id>, and opens the pull request.
The agent does not receive the private key, a GitHub token, or the user home.
"""

from __future__ import annotations

import base64
import json
import os
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

REPO = os.environ.get("SNAPBUG_REPO", "neraant/Snapbug")
OWNER, NAME = REPO.split("/", 1)
APP_ID = os.environ.get("IMPLEMENTER_APP_ID", "Iv23lixwtl5CaJOLcyAd")
KEY_PATH = Path(
    os.environ.get("IMPLEMENTER_PRIVATE_KEY_PATH", Path.home() / ".snapbug/implementer.pem")
)
CURSOR_KEY_PATH = Path(os.environ.get("CURSOR_KEY_PATH", Path.home() / ".snapbug/cursor.key"))
HOME_STATE = Path.home() / ".snapbug"
CLONE = HOME_STATE / "src"
MAX_AGENT_CALLS = 5
TOKEN_MAX_AGE = 45 * 60
FAILURES_BEFORE_BLOCK = 3
MODEL = "grok-4.7"
REQUIRED_CHECKS = ("ci", "agent-review")
TYPE_BADGES = {
    "chore": "C5DEF5",
    "ci": "5319E7",
    "docs": "0075CA",
    "feature": "0E8A16",
    "fix": "D73A4A",
    "perf": "F9A825",
    "refactor": "BFD4F2",
    "revert": "6E7781",
    "security": "B60205",
    "test": "FBCA04",
}
TBD = {"P-08", "P-18"}
FORBIDDEN_REFS = {"master", "staging", "production"}
PROTECTED_EXACT = {"docs/SPEC.md"}
PROTECTED_PREFIXES = (".github/", ".cursor/", ".agents/", "docs/decisions/")
TASK_LINE = re.compile(r"^- (P-\d+)\b", re.MULTILINE)
BULLET = re.compile(r"^- (P-\d+)\b")
ROW = re.compile(r"^\|\s*(P-\d+)\s*\|")
GIT_GUARD = ("-c", "core.hooksPath=/dev/null", "-c", "core.fsmonitor=")
DIFF_ARGS = ["diff", "--name-only", "--no-renames", "origin/master...HEAD"]
CLEAN_ARGS = ["clean", "-fd"]
SECRET_RE = re.compile(
    r"(github_pat_[A-Za-z0-9_]+|gh[pousr]_[A-Za-z0-9]+|"
    r"-----BEGIN [A-Z ]*PRIVATE KEY-----.*?-----END [A-Z ]*PRIVATE KEY-----)",
    re.S,
)
ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_PATH = ROOT / ".github" / "pull_request_template.md"
TEMPLATE_FIELDS = (
    ("<!-- Why this change is needed -->", "problem"),
    ("<!-- What changed, at a high level -->", "solution"),
    ("<!-- Task ID and the AC this PR closes, e.g. feat/T-12, AC-10 -->", "related"),
    (
        "<!-- Commands or steps. For AC-12 type criteria: what the reviewer should evaluate -->",
        "how_to_test",
    ),
    ("<!-- UI changes: before / after. Write \"N/A\" for backend-only changes. -->", "screenshots"),
    (
        "<!-- New or changed env vars, DB migrations, feature flag, breaking changes.\n"
        "Write \"None\" if empty. -->",
        "deploy",
    ),
    (
        "<!-- Risky or non-obvious parts the reviewer should look at closely.\n"
        "Write \"None\" if empty. -->",
        "review",
    ),
)


class LoopError(RuntimeError):
    pass


class TokenSource:
    def __init__(self, mint):
        self.mint = mint
        self.token = ""
        self.minted_at = 0.0

    def current(self, now: float | None = None) -> str:
        clock = time.monotonic() if now is None else now
        if needs_remint(self.minted_at, clock, bool(self.token)):
            self.token = self.mint()
            self.minted_at = clock
        return self.token


def needs_remint(minted_at: float, now: float, has_token: bool) -> bool:
    if not has_token:
        return True
    return now - minted_at >= TOKEN_MAX_AGE


def agent_call_cap(raw: str | None = None) -> int:
    if raw is None:
        raw = os.environ.get("SNAPBUG_MAX_ITERATIONS", "5")
    value = int(raw)
    if value < 1:
        raise LoopError("SNAPBUG_MAX_ITERATIONS must be at least 1")
    return min(value, MAX_AGENT_CALLS)


def normalized(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n")


def section_span(text: str, heading: str) -> str | None:
    body = normalized(text)
    marker = f"## {heading}\n"
    start = body.find(marker)
    if start == -1:
        if body.rstrip("\n").endswith(f"## {heading}"):
            return ""
        return None
    start += len(marker)
    end = body.find("\n## ", start)
    return body[start:] if end == -1 else body[start:end]


def section(text: str, heading: str) -> str:
    body = section_span(text, heading)
    if body is None and heading in {"Open", "Blocked"}:
        raise LoopError(f"missing ## {heading} section")
    return body or ""


def task_ids(block: str) -> list[str]:
    return [match.group(1) for match in TASK_LINE.finditer(block)]


def select_task(status: str, failures: dict | None = None) -> str | None:
    blocked = set(task_ids(section(status, "Blocked")))
    counts = failures or {}
    for task_id in task_ids(section(status, "Open")):
        if task_id in TBD or task_id in blocked:
            continue
        if int(counts.get(task_id, 0)) >= FAILURES_BEFORE_BLOCK:
            continue
        return task_id
    return None


def tasks_to_stop(status: str, failures: dict) -> list[str]:
    blocked = set(task_ids(section(status, "Blocked")))
    stopped = []
    for task_id in task_ids(section(status, "Open")):
        if task_id in TBD or task_id in blocked:
            continue
        if int(failures.get(task_id, 0)) >= FAILURES_BEFORE_BLOCK:
            stopped.append(task_id)
    return stopped


def counters_ready_to_clear(status: str, failures: dict) -> list[str]:
    blocked = set(task_ids(section(status, "Blocked")))
    return [task_id for task_id, count in failures.items() if task_id in blocked and int(count) != 0]


def branch_for(task_id: str) -> str:
    if not re.fullmatch(r"P-\d+", task_id) or task_id in TBD:
        raise LoopError(f"refusing task {task_id}")
    branch = f"feat/{task_id}"
    if branch in FORBIDDEN_REFS or not branch.startswith("feat/"):
        raise LoopError(f"refusing branch {branch}")
    return branch


def protected(path: str) -> bool:
    return path in PROTECTED_EXACT or path.startswith(PROTECTED_PREFIXES)


def allowed_branch(branch: str) -> bool:
    return bool(re.fullmatch(r"feat/P-\d+", branch))


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
        detail = redact(error.read().decode(errors="replace"), [token])[:300]
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


def redact(text: str, secrets: list[str]) -> str:
    cleaned = text
    for secret in secrets:
        if secret:
            cleaned = cleaned.replace(secret, "[redacted]")
    return SECRET_RE.sub("[redacted]", cleaned)


def git_command(repo: Path, args: list[str]) -> list[str]:
    return ["git", *GIT_GUARD, "-C", str(repo), *args]


def clone_command(dest: Path) -> list[str]:
    return [
        "git",
        *GIT_GUARD,
        "clone",
        "--branch",
        "master",
        f"https://github.com/{REPO}.git",
        str(dest),
    ]


def git_auth_env(base: dict[str, str], token: str | None) -> dict[str, str]:
    env = dict(base)
    if not token:
        return env
    basic = base64.b64encode(f"x-access-token:{token}".encode()).decode()
    env["GIT_CONFIG_COUNT"] = "1"
    env["GIT_CONFIG_KEY_0"] = "http.extraheader"
    env["GIT_CONFIG_VALUE_0"] = f"AUTHORIZATION: basic {basic}"
    return env


def resolve_token(token: str | TokenSource | None, now: float | None = None) -> str | None:
    if isinstance(token, TokenSource):
        return token.current(now)
    return token


def git_run(
    repo: Path,
    args: list[str],
    token: str | TokenSource | None = None,
) -> subprocess.CompletedProcess[str]:
    resolved = resolve_token(token)
    return subprocess.run(
        git_command(repo, args),
        capture_output=True,
        text=True,
        check=False,
        env=git_auth_env(os.environ.copy(), resolved),
    )


def git(
    repo: Path,
    args: list[str],
    token: str | TokenSource | None = None,
    check: bool = True,
) -> str:
    resolved = resolve_token(token)
    result = git_run(repo, args, resolved)
    if check and result.returncode != 0:
        secrets = [resolved] if resolved else []
        if resolved:
            secrets.append(base64.b64encode(f"x-access-token:{resolved}".encode()).decode())
        message = redact((result.stderr or result.stdout).strip(), secrets)
        raise LoopError(message.splitlines()[0][:300] if message else "git failed")
    return result.stdout.strip()


def ensure_clone(auth: TokenSource) -> None:
    HOME_STATE.mkdir(parents=True, exist_ok=True)
    if CLONE.exists():
        shutil.rmtree(CLONE)
    token = auth.current()
    cloned = subprocess.run(
        clone_command(CLONE),
        check=False,
        capture_output=True,
        text=True,
        env=git_auth_env(os.environ.copy(), token),
    )
    if cloned.returncode != 0:
        raise LoopError("could not clone the repository")
    git(CLONE, ["config", "user.name", "neraant-snapbug-implementer[bot]"])
    git(
        CLONE,
        [
            "config",
            "user.email",
            "180272519+neraant-snapbug-implementer[bot]@users.noreply.github.com",
        ],
    )
    git(CLONE, ["fetch", "--prune", "origin"], auth)


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


def record_failure(state: dict, task_id: str, counted: bool) -> tuple[int, bool]:
    current = int(state["failures"].get(task_id, 0))
    if counted:
        return current, True
    state["failures"][task_id] = current + 1
    return current + 1, True


def checkout_task(auth: TokenSource, branch: str) -> None:
    if not allowed_branch(branch):
        raise LoopError(f"refusing to check out {branch}")
    git(CLONE, ["fetch", "--prune", "origin"], auth)
    remote = git(CLONE, ["rev-parse", "--verify", "--quiet", f"origin/{branch}"], check=False)
    base = remote or git(CLONE, ["rev-parse", "origin/master"])
    git(CLONE, ["checkout", "--force", "-B", branch, base], auth)
    git(CLONE, CLEAN_ARGS, auth)


def changed_paths() -> list[str]:
    names = git(CLONE, DIFF_ARGS, check=False)
    return [line for line in names.splitlines() if line]


def task_entries(text: str) -> list[tuple[str, str]]:
    found = []
    for raw in normalized(text).splitlines():
        bullet = BULLET.match(raw)
        if bullet:
            found.append((bullet.group(1), raw))
            continue
        row = ROW.match(raw)
        if row:
            found.append((row.group(1), raw.strip()))
    return found


def newly_done(before_line: str, after_line: str) -> bool:
    return bool(re.search(r"\bdone\b", after_line, re.I)) and not re.search(
        r"\bdone\b", before_line, re.I
    )


def doc_problem(before: str, after: str, task_id: str) -> str | None:
    before_text = normalized(before)
    after_text = normalized(after)
    if before_text == after_text:
        return None
    for heading, reason in (
        ("TBD", "edits the TBD section"),
        ("Blocked", "edits the Blocked section"),
        ("Done", "marks a task done"),
    ):
        if section_span(before_text, heading) != section_span(after_text, heading):
            return reason
    before_map = {task: line for task, line in task_entries(before_text)}
    after_map = {task: line for task, line in task_entries(after_text)}
    for task in sorted(TBD):
        if before_map.get(task) != after_map.get(task):
            return "edits the TBD section"
    before_ids = [task for task, _ in task_entries(before_text)]
    after_ids = [task for task, _ in task_entries(after_text)]
    if [task for task in before_ids if task != task_id] != [task for task in after_ids if task != task_id]:
        removed = [task for task in before_ids if task not in after_map]
        if removed:
            return "marks a task done"
        return "moves a task other than the current one"
    for task, line in task_entries(before_text):
        if task == task_id:
            continue
        if after_map.get(task) != line:
            return "moves a task other than the current one"
    if task_id in before_map or task_id in after_map:
        if before_map.get(task_id) != after_map.get(task_id):
            if task_id not in after_map or task_id not in before_map:
                return "marks a task done"
            if newly_done(before_map[task_id], after_map[task_id]):
                return "marks a task done"
    return None


def docs_problem(task_id: str) -> str | None:
    for rel in ("docs/STATUS.md", "docs/PLAN.md"):
        before = git(CLONE, ["show", f"origin/master:{rel}"])
        path = CLONE / rel
        after = path.read_text() if path.is_file() else ""
        reason = doc_problem(before, after, task_id)
        if reason:
            return f"{rel} {reason}"
    return None


def choose_prompt(master: str | None, clone: str | None) -> str:
    if master is not None:
        return master
    if clone is not None:
        return clone
    raise LoopError("implementer prompt is missing")


def load_instructions() -> str:
    showed = git_run(CLONE, ["show", "origin/master:.agents/agents/implementer.md"])
    master = showed.stdout if showed.returncode == 0 else None
    path = CLONE / ".agents/agents/implementer.md"
    clone = path.read_text() if path.is_file() else None
    return choose_prompt(master, clone)


def agent_environment(parent: dict[str, str], api_key: str, home: str) -> dict[str, str]:
    return {
        "PATH": parent.get("PATH", ""),
        "HOME": home,
        "CURSOR_API_KEY": api_key,
        "LANG": parent.get("LANG", "C.UTF-8"),
        "TMPDIR": parent.get("TMPDIR", "/tmp"),
        "GH_TOKEN": "",
        "GITHUB_TOKEN": "",
    }


def kill_group(pid: int) -> None:
    try:
        os.killpg(pid, signal.SIGKILL)
    except ProcessLookupError:
        return


def save_agent_log(task_id: str, stdout: str, stderr: str, secrets: list[str]) -> Path:
    folder = HOME_STATE / "agent"
    folder.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())
    path = folder / f"{task_id}-{stamp}.log"
    path.write_text(redact(f"## stdout\n{stdout}\n## stderr\n{stderr}\n", secrets))
    return path


def run_agent(task_id: str, branch: str, task_line: str) -> None:
    home = Path(tempfile.mkdtemp(prefix="snapbug-agent-home-"))
    key = cursor_key()
    try:
        prompt = (
            load_instructions()
            + "\n\n"
            + f"Task: {task_id}\n"
            + f"Branch: {branch}\n"
            + f"Status line: {task_line}\n"
            + "Implement this task only. Commit on the current branch. Do not push.\n"
            + "Do not edit the TBD or Blocked sections. Do not mark a task done. "
            + "Do not move any task other than this one.\n"
        )
        proc = subprocess.Popen(
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
            env=agent_environment(os.environ.copy(), key, str(home)),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            start_new_session=True,
        )
        try:
            stdout, stderr = proc.communicate(timeout=30 * 60)
        except subprocess.TimeoutExpired:
            kill_group(proc.pid)
            stdout, stderr = proc.communicate()
            save_agent_log(task_id, stdout or "", stderr or "", [key])
            raise LoopError(f"agent timed out for {task_id}") from None
        save_agent_log(task_id, stdout or "", stderr or "", [key])
        if proc.returncode != 0:
            raise LoopError(f"agent exited {proc.returncode}")
    finally:
        shutil.rmtree(home, ignore_errors=True)


def push_branch(auth: TokenSource, branch: str) -> None:
    if branch in FORBIDDEN_REFS or branch.startswith("chore/block-") or not allowed_branch(branch):
        raise LoopError(f"refusing to push {branch}")
    if git(CLONE, ["branch", "--show-current"]) != branch:
        raise LoopError(f"refusing to push while {branch} is not checked out")
    git(CLONE, ["push", "origin", f"HEAD:{branch}"], auth)


def gh(auth: TokenSource, args: list[str]) -> str:
    token = auth.current()
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
        message = redact((result.stderr or result.stdout).strip(), [token])
        raise LoopError(message.splitlines()[0][:300] if message else "gh failed")
    return result.stdout.strip()


def acceptance_criteria(plan: str, task_id: str) -> list[str]:
    for raw in plan.splitlines():
        if not raw.startswith("|"):
            continue
        cells = [cell.strip() for cell in raw.strip().strip("|").split("|")]
        if cells and cells[0] == task_id:
            return re.findall(r"AC-\d+", cells[-1])
    return []


def type_badge(kind: str) -> str:
    color = TYPE_BADGES.get(kind)
    if color is None:
        raise LoopError(f"unknown change type {kind}")
    return f"![{kind}](https://img.shields.io/badge/{kind}-{color})"


def template_text() -> str:
    if not TEMPLATE_PATH.is_file():
        raise LoopError("pull request template is missing")
    return TEMPLATE_PATH.read_text()


def load_template() -> str:
    showed = git_run(CLONE, ["show", "origin/master:.github/pull_request_template.md"])
    if showed.returncode == 0 and showed.stdout.strip():
        return showed.stdout
    return template_text()


def pull_request_body(
    template: str,
    task_id: str,
    task_line: str,
    branch: str,
    plan: str,
    kind: str = "feature",
) -> str:
    criteria = acceptance_criteria(plan, task_id)
    values = {
        "problem": task_line,
        "solution": f"Implement {task_id} from docs/STATUS.md.",
        "related": ", ".join([branch, *criteria]),
        "how_to_test": "pnpm typecheck, pnpm lint, and pnpm test:unit. ci runs the same checks.",
        "screenshots": "N/A",
        "deploy": "None",
        "review": "The change should implement only this task and leave P-08 and P-18 untouched.",
    }
    filled = template
    for comment, key in TEMPLATE_FIELDS:
        if comment not in filled:
            raise LoopError("pull request template is missing a section")
        filled = filled.replace(comment, f"{comment}\n\n{values[key]}", 1)
    return f"{type_badge(kind)}\n\n{filled}"


def ensure_pr(auth: TokenSource, branch: str, task_id: str, task_line: str, title: str | None = None) -> str:
    existing = gh(
        auth,
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
        showed = git_run(CLONE, ["show", "origin/master:docs/PLAN.md"])
        plan = showed.stdout if showed.returncode == 0 else ""
        body = pull_request_body(load_template(), task_id, task_line, branch, plan)
        body_path = Path(tempfile.mkstemp(prefix="snapbug-pr-")[1])
        try:
            body_path.write_text(body)
            url = gh(
                auth,
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
                    "--label",
                    "feature",
                    "--body-file",
                    str(body_path),
                ],
            )
        finally:
            body_path.unlink(missing_ok=True)
        number = url.rstrip("/").split("/")[-1]
    gh(auth, ["pr", "merge", number, "--repo", REPO, "--auto", "--squash"])
    return number


def pull_request(auth: TokenSource, number: str) -> dict:
    return json.loads(
        gh(
            auth,
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


def clear_landed_blocks(state: dict, status: str) -> None:
    ready = counters_ready_to_clear(status, state["failures"])
    if not ready:
        return
    for task_id in ready:
        state["failures"][task_id] = 0
    save_state(state)


def task_line(status: str, task_id: str) -> str:
    for raw in section(status, "Open").splitlines():
        if raw.startswith(f"- {task_id} "):
            return raw[2:].strip()
    return task_id


def block_note(task_id: str) -> str:
    return (
        f"{task_id} blocked after {FAILURES_BEFORE_BLOCK} consecutive failures. "
        "The failure count stays. This task will not be retried until it is listed "
        "in the Blocked section on origin/master."
    )


def write_handover(lines: list[str]) -> None:
    HOME_STATE.mkdir(parents=True, exist_ok=True)
    (HOME_STATE / "HANDOVER.md").write_text("# Handover\n\n" + "\n".join(lines) + "\n")


def wait_for(auth: TokenSource, number: str) -> str:
    deadline = time.monotonic() + 20 * 60
    phase = "pending"
    while time.monotonic() < deadline:
        phase = check_phase(pull_request(auth, number))
        if phase != "pending":
            return phase
        time.sleep(30)
    return "pending"


def one_task(auth: TokenSource, state: dict, notes: list[str]) -> tuple[str, bool]:
    git(CLONE, ["fetch", "--prune", "origin"], auth)
    git(CLONE, ["checkout", "--force", "--detach", "origin/master"], auth)
    git(CLONE, CLEAN_ARGS, auth)
    status = (CLONE / "docs/STATUS.md").read_text()
    clear_landed_blocks(state, status)
    for task_id in tasks_to_stop(status, state["failures"]):
        note = block_note(task_id)
        if note not in notes:
            notes.append(note)
            write_handover(notes)
    task_id = select_task(status, state["failures"])
    if task_id is None:
        notes.append("No open task left.")
        return "stop", False
    branch = branch_for(task_id)
    line = task_line(status, task_id)
    counted = False
    used_agent = False

    def fail(message: str) -> tuple[str, bool]:
        nonlocal counted
        already = counted
        count, counted = record_failure(state, task_id, counted)
        if not already:
            save_state(state)
        notes.append(f"{message} ({count}).")
        return "continue", used_agent

    existing = json.loads(
        gh(
            auth,
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
        phase = wait_for(auth, str(existing[0]["number"]))
        if phase == "merged":
            notes.append(f"{task_id} merged.")
            return "continue", False
        if phase == "ready":
            notes.append(f"{task_id} is approved and waiting for GitHub to merge.")
            return "stop", False
        if phase == "pending":
            notes.append(f"{task_id} is still waiting on ci or agent-review.")
            return "stop", False
        notes.append(f"{task_id} checks or review failed. Starting another attempt.")

    checkout_task(auth, branch)
    before = git(CLONE, ["rev-parse", "HEAD"])
    try:
        run_agent(task_id, branch, line)
        used_agent = True
    except (LoopError, subprocess.TimeoutExpired) as error:
        used_agent = True
        return fail(f"{task_id} agent failed: {error}")
    if git(CLONE, ["branch", "--show-current"]) != branch or git(CLONE, ["rev-parse", "HEAD"]) == before:
        return fail(f"{task_id} produced no commit on {branch}")
    blocked_paths = [path for path in changed_paths() if protected(path)]
    if blocked_paths:
        return fail(f"{task_id} touched a protected path: {blocked_paths[0]}")
    reason = docs_problem(task_id)
    if reason:
        return fail(f"{task_id} {reason}")
    push_branch(auth, branch)
    number = ensure_pr(auth, branch, task_id, line)
    notes.append(f"{task_id} opened or updated pull request {number}.")
    phase = wait_for(auth, number)
    if phase == "failed":
        return fail(f"{task_id} pull request failed review or checks")
    if phase == "merged":
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
        or allowed_branch("production")
        or allowed_branch("chore/block-P-01")
        or not allowed_branch("feat/P-01")
    ):
        raise SystemExit("guard failed")
    for heading, text in (
        ("Blocked", "## Open\n\n- P-01 x\n"),
        ("Open", "## Blocked\n\nNone.\n"),
    ):
        try:
            section(text, heading)
        except LoopError:
            continue
        raise SystemExit(f"missing {heading}")
    open_status = "## Open\n\n- P-01 first\n- P-02 second\n\n## Blocked\n\nNone.\n"
    if select_task(open_status, {"P-01": 3}) != "P-02":
        raise SystemExit("failure skip failed")
    if select_task(open_status, {"P-01": 3, "P-02": 3}) is not None:
        raise SystemExit("failure skip failed")
    if tasks_to_stop(open_status, {"P-01": 3}) != ["P-01"]:
        raise SystemExit("stop list failed")
    blocked = "## Open\n\n- P-01 first\n\n## Blocked\n\n- P-01 stays blocked\n"
    if set(counters_ready_to_clear(blocked, {"P-01": 3, "P-02": 2})) != {"P-01"}:
        raise SystemExit("clear list failed")
    if tasks_to_stop(blocked, {"P-01": 3}):
        raise SystemExit("blocked task was retried")
    state = {"failures": {}}
    count, counted = record_failure(state, "P-01", False)
    count_again, counted = record_failure(state, "P-01", counted)
    if count != 1 or count_again != 1 or state["failures"]["P-01"] != 1:
        raise SystemExit("failure counted twice")
    if agent_call_cap("5") != 5 or agent_call_cap("99") != 5 or agent_call_cap("1") != 1:
        raise SystemExit("cap failed")
    try:
        agent_call_cap("0")
    except LoopError:
        pass
    else:
        raise SystemExit("cap failed")
    if needs_remint(0, TOKEN_MAX_AGE - 1, True) or not needs_remint(0, TOKEN_MAX_AGE, True):
        raise SystemExit("remint failed")
    minted = {"n": 0}

    def mint() -> str:
        minted["n"] += 1
        return f"t{minted['n']}"

    source = TokenSource(mint)
    first = source.current(now=0)
    second = source.current(now=TOKEN_MAX_AGE - 1)
    third = source.current(now=TOKEN_MAX_AGE)
    if first != second or third == first or minted["n"] != 2:
        raise SystemExit("remint failed")
    status = """## Done

- shipped

## Open

- P-01 first task
- P-02 second task

## TBD

- P-08 TBD. leave this

## Blocked

None.
"""
    if doc_problem(status, status, "P-01") is not None:
        raise SystemExit("doc identical")
    if doc_problem(status, status.replace("leave this", "start this"), "P-01") != "edits the TBD section":
        raise SystemExit("tbd guard")
    if doc_problem(status, status.replace("None.", "- P-02 moved"), "P-01") != "edits the Blocked section":
        raise SystemExit("blocked guard")
    if doc_problem(status, status.replace("- shipped", "- shipped\n- P-01 done now"), "P-01") != "marks a task done":
        raise SystemExit("done guard")
    if (
        doc_problem(status, status.replace("- P-02 second task", "- P-02 second task edited"), "P-01")
        != "moves a task other than the current one"
    ):
        raise SystemExit("move guard")
    if doc_problem(status, status.replace("- P-01 first task", "- P-01 first task, still open"), "P-01") is not None:
        raise SystemExit("current task edit refused")
    plan = "| P-01 | one | — | AC-23 |\n| P-08 | TBD. no | — | AC-28 |\n| P-02 | two | — | AC-22, AC-05 |\n"
    if acceptance_criteria(plan, "P-02") != ["AC-22", "AC-05"]:
        raise SystemExit("criteria failed")
    if doc_problem(plan, plan.replace("AC-28", "AC-99"), "P-01") != "edits the TBD section":
        raise SystemExit("plan tbd guard")
    token = "example-installation-token"
    command = git_command(Path("/tmp/snapbug"), ["push", "origin", "HEAD:feat/P-01"])
    if token in " ".join(command) or "extraheader" in " ".join(command):
        raise SystemExit("git token leaked into argv")
    if "core.hooksPath=/dev/null" not in command or "core.fsmonitor=" not in command:
        raise SystemExit("git guard flags missing")
    cloned = clone_command(Path("/tmp/snapbug-src"))
    if token in " ".join(cloned) or "extraheader" in " ".join(cloned):
        raise SystemExit("clone token leaked into argv")
    env = git_auth_env({}, token)
    if env.get("GIT_CONFIG_COUNT") != "1" or env.get("GIT_CONFIG_KEY_0") != "http.extraheader":
        raise SystemExit("git config env missing")
    encoded = env.get("GIT_CONFIG_VALUE_0", "").removeprefix("AUTHORIZATION: basic ")
    try:
        decoded = base64.b64decode(encoded).decode()
    except (ValueError, UnicodeDecodeError):
        decoded = ""
    if decoded != f"x-access-token:{token}":
        raise SystemExit("git config env missing")
    if DIFF_ARGS != ["diff", "--name-only", "--no-renames", "origin/master...HEAD"] or CLEAN_ARGS != ["clean", "-fd"]:
        raise SystemExit("git args failed")
    home = Path(tempfile.mkdtemp(prefix="snapbug-self-check-"))
    try:
        agent_env = agent_environment(
            {"PATH": "/bin", "HOME": str(Path.home()), "GH_TOKEN": "hidden", "SECRET": "hidden"},
            "cursor-key",
            str(home),
        )
        allowed = {"PATH", "HOME", "CURSOR_API_KEY", "LANG", "TMPDIR", "GH_TOKEN", "GITHUB_TOKEN"}
        if set(agent_env) != allowed or agent_env["HOME"] != str(home) or agent_env["GH_TOKEN"] != "":
            raise SystemExit("agent env failed")
        if "SECRET" in agent_env or "implementer.pem" in agent_env["HOME"] or list(home.iterdir()):
            raise SystemExit("agent env failed")
    finally:
        shutil.rmtree(home, ignore_errors=True)
    leaked = redact(f"see ghp_{'a' * 20} and hidden", ["hidden"])
    if "ghp_" in leaked or "hidden" in leaked:
        raise SystemExit("redact failed")
    if choose_prompt("from-master", "from-clone") != "from-master":
        raise SystemExit("prompt source failed")
    if choose_prompt(None, "from-clone") != "from-clone":
        raise SystemExit("prompt source failed")
    try:
        choose_prompt(None, None)
    except LoopError:
        pass
    else:
        raise SystemExit("prompt source failed")
    body = pull_request_body(template_text(), "P-01", "P-01 first task", "feat/P-01", plan)
    for heading in (
        "## Description",
        "## Related",
        "## How to test",
        "## Screenshots",
        "## Deploy impact",
        "## Review focus",
    ):
        if heading not in body:
            raise SystemExit("template heading missing")
    if "<!-- Why this change is needed -->" not in body or "P-01 first task" not in body:
        raise SystemExit("template fill failed")
    feature = type_badge("feature")
    if not body.startswith(feature) or body.count("img.shields.io") != 1:
        raise SystemExit("type badge failed")
    if "AC-23" not in body or "actions/workflows/ci.yml/badge.svg" in body:
        raise SystemExit("template fill failed")
    try:
        type_badge("nope")
    except LoopError:
        pass
    else:
        raise SystemExit("type badge failed")
    sleeper = subprocess.Popen(["sleep", "30"], start_new_session=True)
    kill_group(sleeper.pid)
    sleeper.wait(timeout=5)
    print("self-check ok")


def main() -> None:
    if "--self-check" in sys.argv:
        self_check()
        return
    cursor_key()
    limit = agent_call_cap()
    notes = [f"Repository: {REPO}", f"Agent call cap: {limit}", f"Model: {MODEL}"]
    auth = TokenSource(lambda: installation_token(app_jwt()))
    ensure_clone(auth)
    state = load_state()
    calls = 0
    try:
        while calls < limit:
            outcome, used_agent = one_task(auth, state, notes)
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

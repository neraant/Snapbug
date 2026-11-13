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
import threading
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
BASE = HOME_STATE / "repo"
WORKTREES = HOME_STATE / "worktrees"
LEGACY = HOME_STATE / "src"
TREE = BASE
MAX_AGENT_CALLS = 5
TOKEN_MAX_AGE = 45 * 60
FAILURES_BEFORE_BLOCK = 3
# Review rounds are separate from crash failures. A request-changes review is
# not a failure: it never touches the failure counter and never blocks the task.
# The cap only stops an endless review loop; the worktree is kept when it trips.
MAX_REVIEW_ROUNDS = 8
MODELS = {
    "low": "grok-4.7-low",
    "medium": "grok-4.7-medium",
    "high": "grok-4.7-high",
}
EFFORTS = ("low", "medium", "high")
# Agent liveness policy. The base budget is checked first. Past it, the agent
# keeps running while it still produced output within AGENT_STALL_LIMIT, up to
# AGENT_HARD_CAP in total. A silent agent past the base budget, or any agent at
# the hard cap, is killed as before.
AGENT_TIMEOUT = 60 * 60
AGENT_STALL_LIMIT = 10 * 60
AGENT_HARD_CAP = 3 * 60 * 60
AGENT_POLL = 5
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


class SetupError(LoopError):
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


def select_task(
    status: str, failures: dict | None = None, skip: set[str] | None = None
) -> str | None:
    blocked = set(task_ids(section(status, "Blocked")))
    ignored = skip or set()
    counts = failures or {}
    for task_id in task_ids(section(status, "Open")):
        if task_id in TBD or task_id in blocked or task_id in ignored:
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


# contents write is not enough to publish `.github/workflows`. GitHub rejects
# that push unless the installation token also has workflows write.
TOKEN_PERMISSIONS = {
    "contents": "write",
    "pull_requests": "write",
    "metadata": "read",
    "workflows": "write",
}


def installation_token(jwt: str) -> str:
    installation = github(
        "GET",
        f"https://api.github.com/repos/{REPO}/installation",
        jwt,
    )
    installation_id = installation.get("id")
    if not isinstance(installation_id, int):
        raise LoopError("implementer app is not installed on this repository")
    try:
        minted = github(
            "POST",
            f"https://api.github.com/app/installations/{installation_id}/access_tokens",
            jwt,
            {"repositories": [NAME], "permissions": TOKEN_PERMISSIONS},
        )
    except LoopError as error:
        if "not granted to this installation" in str(error):
            raise LoopError(
                "implementer installation is missing Workflows: Read and write. "
                "Grant it on the GitHub App and accept it for this repository"
            ) from error
        raise
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


def git_failure_line(text: str, limit: int = 300) -> str:
    """One log line with the git failure, including the remote rejection reason.

    `git push` prints `To https://…` before `! [rejected]` or `! [remote rejected]`.
    The first line is only the remote URL, so a log that keeps that line hides
    the hook or ruleset that actually declined the update.
    """
    lines = [line.strip() for line in normalized(text).splitlines() if line.strip()]
    useful = [
        line
        for line in lines
        if line.startswith(("fatal:", "error:", "remote:", "! [rejected]", "! [remote rejected]"))
        and line != "remote:"
    ]
    if not useful:
        useful = [line for line in lines if not line.startswith("To ")] or lines[:1]
    rejections = [line for line in useful if line.startswith("! [")]
    others = [line for line in useful if not line.startswith("! [")]
    message = " ".join([*rejections, *others])
    if len(message) <= limit:
        return message or "git failed"
    reason = " ".join(rejections)
    if reason and len(reason) <= limit:
        return reason
    if reason:
        return reason[-limit:]
    return message[:limit]


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
        raise LoopError(git_failure_line(message) if message else "git failed")
    return result.stdout.strip()


def tree() -> Path:
    return TREE


def use_tree(path: Path) -> None:
    global TREE
    TREE = path


def remove_tree(path: Path) -> None:
    last_error: OSError | None = None
    for _ in range(5):
        if not path.exists():
            return
        try:
            shutil.rmtree(path)
        except OSError as error:
            last_error = error
            time.sleep(0.2)
            continue
        if not path.exists():
            return
    raise LoopError(f"could not remove {path}") from last_error


def configure_identity(repo: Path) -> None:
    git(repo, ["config", "user.name", "neraant-snapbug-implementer[bot]"])
    git(
        repo,
        [
            "config",
            "user.email",
            "180272519+neraant-snapbug-implementer[bot]@users.noreply.github.com",
        ],
    )


def ensure_base(auth: TokenSource) -> None:
    HOME_STATE.mkdir(parents=True, exist_ok=True)
    if not (BASE / ".git").is_dir():
        if (LEGACY / ".git").is_dir() and not BASE.exists():
            LEGACY.rename(BASE)
        else:
            token = auth.current()
            cloned = subprocess.run(
                clone_command(BASE),
                check=False,
                capture_output=True,
                text=True,
                env=git_auth_env(os.environ.copy(), token),
            )
            if cloned.returncode != 0:
                raise LoopError("could not clone the repository")
    configure_identity(BASE)
    git(BASE, ["fetch", "--prune", "origin"], auth)
    use_tree(BASE)
    refresh_base()


def refresh_base() -> None:
    if git(BASE, ["status", "--porcelain"], check=False):
        raise LoopError("base repo has uncommitted files")
    git(BASE, ["checkout", "--detach", "origin/master"])


def worktree_for(task_id: str) -> Path:
    if not re.fullmatch(r"P-\d+", task_id) or task_id in TBD:
        raise LoopError(f"refusing worktree for {task_id}")
    return WORKTREES / task_id


def keep_worktree(dirty: bool, unpushed: bool) -> bool:
    return dirty or unpushed


def prepare_worktree(auth: TokenSource, task_id: str, branch: str) -> Path:
    if not allowed_branch(branch):
        raise LoopError(f"refusing to check out {branch}")
    path = worktree_for(task_id)
    git(BASE, ["fetch", "--prune", "origin"], auth)
    current = git(BASE, ["branch", "--show-current"], check=False)
    if current == branch:
        refresh_base()
    if path.exists():
        say(f"{task_id} reusing worktree {path}")
        return path
    WORKTREES.mkdir(parents=True, exist_ok=True)
    local = git(BASE, ["rev-parse", "--verify", "--quiet", branch], check=False)
    if local:
        git(BASE, ["worktree", "add", str(path), branch])
    else:
        remote = git(BASE, ["rev-parse", "--verify", "--quiet", f"origin/{branch}"], check=False)
        base = remote or git(BASE, ["rev-parse", "origin/master"])
        git(BASE, ["worktree", "add", "-b", branch, str(path), base])
    say(f"{task_id} worktree {path}")
    return path


def worktree_dirty(repo: Path) -> bool:
    return bool(git(repo, ["status", "--porcelain"], check=False))


def worktree_unpushed(repo: Path, branch: str) -> bool:
    # Compare with the pushed branch when it exists. Against master alone, a
    # pushed branch under review looks unpushed forever and the agent never reruns.
    remote = git(repo, ["rev-parse", "--verify", "--quiet", f"origin/{branch}"], check=False)
    base = f"origin/{branch}" if remote else "origin/master"
    count = git(repo, ["rev-list", "--count", f"{base}..HEAD"], check=False)
    return count not in {"", "0"}


def _item_time(item: dict) -> str:
    return str(item.get("submittedAt") or item.get("createdAt") or item.get("created_at") or "")


def _item_oid(item: dict) -> str:
    commit = item.get("commit")
    if isinstance(commit, dict) and commit.get("oid"):
        return str(commit["oid"])
    return str(item.get("commit_id") or "")


def _item_login(item: dict) -> str:
    author = item.get("author") if isinstance(item.get("author"), dict) else None
    user = item.get("user") if isinstance(item.get("user"), dict) else None
    person = author or user or {}
    return str(person.get("login") or "")


def _reviewer_comment(item: dict) -> str:
    if not isinstance(item, dict):
        return ""
    body = str(item.get("body") or "").strip()
    if not body or body.startswith("[vc]:"):
        return ""
    login = _item_login(item).lower()
    if login == "vercel":
        return ""
    if _item_oid(item) or "reviewer" in login:
        return body
    return ""


def review_feedback(pull: dict) -> str:
    """Changes requested on the current head, including a newer review comment.

    With no head oid, the latest CHANGES_REQUESTED body is used, as before.
    A comment on the current head is not dropped in favor of an older review.
    """
    notes: list[tuple[str, str, str]] = []
    for review in pull.get("reviews") or []:
        if not isinstance(review, dict) or review.get("state") != "CHANGES_REQUESTED":
            continue
        body = str(review.get("body") or "").strip()
        if body:
            notes.append((_item_time(review), _item_oid(review), body))
    for key in ("reviewComments", "comments"):
        for comment in pull.get(key) or []:
            body = _reviewer_comment(comment)
            if body and isinstance(comment, dict):
                notes.append((_item_time(comment), _item_oid(comment), body))
    if not notes:
        return ""
    head = str(pull.get("headRefOid") or "")
    on_head = [note for note in notes if head and note[1] == head]
    if head and on_head:
        on_head.sort(key=lambda note: note[0])
        return "\n\n".join(note[2] for note in on_head)[:4000]
    chosen = ""
    chosen_at = ""
    for review in pull.get("reviews") or []:
        if not isinstance(review, dict) or review.get("state") != "CHANGES_REQUESTED":
            continue
        submitted = _item_time(review)
        if chosen and submitted < chosen_at:
            continue
        chosen = str(review.get("body") or "").strip()
        chosen_at = submitted
    return chosen[:4000]


def keep_after_phase(phase: str) -> bool:
    """Release the worktree only once the task no longer needs the agent.

    Changes requested or red checks mean the same task and the same worktree
    continue. Anything else has the branch pushed and waiting on GitHub, so the
    worktree can go.
    """
    return phase in {"failed", "changes"}


def review_rounds(state: dict, task_id: str) -> int:
    rounds = state.get("reviews")
    return int(rounds.get(task_id, 0)) if isinstance(rounds, dict) else 0


def bump_review_round(state: dict, task_id: str) -> int:
    rounds = state.setdefault("reviews", {})
    rounds[task_id] = int(rounds.get(task_id, 0)) + 1
    save_state(state)
    return rounds[task_id]


def clear_review_rounds(state: dict, task_id: str) -> None:
    if isinstance(state.get("reviews"), dict) and state["reviews"].pop(task_id, None) is not None:
        save_state(state)


def commits_behind(branch: str) -> int:
    raw = git(tree(), ["rev-list", "--count", f"origin/{branch}..origin/master"], check=False)
    try:
        return int(raw.strip() or "0")
    except ValueError:
        return 0


def branch_needs_update(merge_state: str, behind: int = 0) -> bool:
    """BEHIND always needs master. BLOCKED needs it only when the branch really is behind."""
    if merge_state == "BEHIND":
        return True
    return merge_state == "BLOCKED" and behind > 0


def update_from_master(auth: TokenSource, task_id: str, branch: str) -> None:
    path = prepare_worktree(auth, task_id, branch)
    use_tree(path)
    if worktree_dirty(path):
        raise LoopError(f"{task_id} worktree is dirty")
    merged = git_run(path, ["merge", "--no-edit", "origin/master"], auth)
    if merged.returncode != 0:
        git(path, ["merge", "--abort"], check=False)
        raise LoopError(f"{task_id} could not merge master into {branch}")
    push_branch(auth, branch)
    say(f"{task_id} updated {branch} from master")
    release_worktree(task_id, False)


def release_worktree(task_id: str, keep: bool) -> None:
    remove_task_containers(task_id)
    path = worktree_for(task_id)
    if keep:
        if path.exists():
            say(f"{task_id} worktree kept at {path}")
        return
    if not path.exists():
        return
    git(BASE, ["worktree", "remove", "--force", str(path)])
    git(BASE, ["worktree", "prune"])
    say(f"{task_id} worktree removed")


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


def changed_paths() -> list[str]:
    names = git(tree(), DIFF_ARGS, check=False)
    return [line for line in names.splitlines() if line]


def touches_e2e(paths: list[str]) -> bool:
    return any(path.startswith("e2e/") for path in paths)


def missing_playwright_browser(output: str) -> bool:
    text = output.lower()
    return "executable doesn't exist" in text or "download new browsers" in text


def e2e_error_excerpt(output: str) -> str:
    """Useful Playwright lines plus the command tail, not the wrapper line alone."""
    lines = [line.strip() for line in output.splitlines() if line.strip()]
    if not lines:
        return "pnpm test:e2e failed"
    wrapper = ("elifecycle", "command failed with exit code")
    useful = [line for line in lines if not any(mark in line.lower() for mark in wrapper)]
    chosen = (useful or lines)[-10:]
    tail = lines[-1]
    if tail not in chosen:
        chosen.append(tail)
    return "\n".join(chosen)[:1500]


def resolve_e2e_attempt(
    failure: str | None, output: str, retry_failure: str | None, retried: bool
) -> tuple[str | None, bool]:
    """A missing-browser retry that then passes is recovered, not a task failure."""
    if retried and failure and missing_playwright_browser(output) and retry_failure is None:
        return None, True
    if retried:
        return retry_failure, False
    return failure, False


def e2e_outcome_counts(failure: str | None, recovered: bool, handed_to_agent: bool) -> bool:
    """Count a real e2e failure only after the implementer has been given that text.

    Install-then-retry success is not a failure. A blind retest is not a strike.
    """
    if recovered or not failure or not str(failure).strip():
        return False
    return handed_to_agent


def docs_outcome_counts(failure: str | None, handed_to_agent: bool) -> bool:
    """A docs guard failure counts only after the implementer has seen that reason."""
    if not failure or not str(failure).strip():
        return False
    return handed_to_agent


def resume_unpushed(
    dirty: bool,
    unpushed: bool,
    review: str,
    e2e_text: str,
    phase: str = "",
    docs_text: str = "",
) -> bool:
    """Skip the agent only when the commits are unpushed and nothing new is waiting."""
    if dirty or not unpushed:
        return False
    if phase == "changes" or review.strip() or e2e_text.strip() or docs_text.strip():
        return False
    return True


def saved_e2e_failure(state: dict, task_id: str) -> str:
    bucket = state.get("e2e")
    if not isinstance(bucket, dict):
        return ""
    return str(bucket.get(task_id) or "")


def save_e2e_failure(state: dict, task_id: str, text: str) -> None:
    bucket = state.setdefault("e2e", {})
    if not isinstance(bucket, dict):
        bucket = {}
        state["e2e"] = bucket
    bucket[task_id] = text[:4000]
    save_state(state)


def clear_e2e_failure(state: dict, task_id: str) -> None:
    bucket = state.get("e2e")
    if isinstance(bucket, dict) and bucket.pop(task_id, None) is not None:
        save_state(state)


def saved_docs_failure(state: dict, task_id: str) -> str:
    bucket = state.get("docs")
    if not isinstance(bucket, dict):
        return ""
    return str(bucket.get(task_id) or "")


def save_docs_failure(state: dict, task_id: str, text: str) -> None:
    bucket = state.setdefault("docs", {})
    if not isinstance(bucket, dict):
        bucket = {}
        state["docs"] = bucket
    bucket[task_id] = text[:4000]
    save_state(state)


def clear_docs_failure(state: dict, task_id: str) -> None:
    bucket = state.get("docs")
    if isinstance(bucket, dict) and bucket.pop(task_id, None) is not None:
        save_state(state)


def compose_project_for(task_id: str) -> str:
    """Compose names the project from the worktree directory, lowercased."""
    if not re.fullmatch(r"P-\d+", task_id) or task_id in TBD:
        raise LoopError(f"refusing container for {task_id}")
    return task_id.lower()


def container_remove_command(container_ids: list[str]) -> list[str] | None:
    """Remove those containers only. No volume flags, and nothing to do when empty."""
    ids = [item for item in container_ids if item]
    if not ids:
        return None
    return ["docker", "rm", "-f", *ids]


def remove_task_containers(task_id: str) -> None:
    """Remove the compose containers for this task. Other projects stay.

    `docker compose up` in the task worktree names the project after that
    directory (`P-03` → `p-03`, container `p-03-postgres-1`). A missing docker
    daemon or an empty list is a no-op. Volumes are left in place.
    """
    project = compose_project_for(task_id)
    listed = subprocess.run(
        [
            "docker",
            "ps",
            "-aq",
            "--filter",
            f"label=com.docker.compose.project={project}",
        ],
        capture_output=True,
        text=True,
        check=False,
    )
    if listed.returncode != 0:
        return
    ids = []
    for line in listed.stdout.splitlines():
        container_id = line.strip()
        if not container_id:
            continue
        inspected = subprocess.run(
            [
                "docker",
                "inspect",
                "--format",
                '{{index .Config.Labels "com.docker.compose.project"}}',
                container_id,
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        if inspected.returncode == 0 and inspected.stdout.strip() == project:
            ids.append(container_id)
    command = container_remove_command(ids)
    if command is None:
        return
    subprocess.run(command, capture_output=True, text=True, check=False)


HANDOFF_HEADINGS = ("done", "decision", "open", "last check")


def handoff_path(task_id: str) -> Path:
    """Journal for the next pass. It lives outside the repo, so git cannot push it."""
    if not re.fullmatch(r"P-\d+", task_id) or task_id in TBD:
        raise LoopError(f"refusing handoff for {task_id}")
    return HOME_STATE / "handoff" / f"{task_id}.md"


def handoff_outside_repo(path: Path, repo: Path | None = None) -> bool:
    root = (repo or ROOT).resolve()
    resolved = path.resolve()
    return resolved != root and root not in resolved.parents


def handoff_parts(text: str) -> dict[str, str]:
    return {heading: (section_span(text, heading) or "").strip() for heading in HANDOFF_HEADINGS}


def handoff_document(parts: dict[str, str]) -> str:
    chunks = []
    for heading in HANDOFF_HEADINGS:
        chunks.append(f"## {heading}\n\n{(parts.get(heading) or '').strip()}\n")
    return "\n".join(chunks)


def replace_last_check(text: str, check: str) -> str:
    """Overwrite last check and keep done, decision, and open from the previous pass."""
    parts = handoff_parts(text)
    parts["last check"] = check.strip()
    return handoff_document(parts)


def read_handoff(task_id: str) -> str:
    """Missing journal is an empty note. It is not a task failure."""
    path = handoff_path(task_id)
    if not path.is_file():
        return ""
    return path.read_text()


def write_last_check(task_id: str, check: str) -> None:
    if not check.strip():
        return
    path = handoff_path(task_id)
    current = path.read_text() if path.is_file() else ""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(replace_last_check(current, check))


def handoff_prompt_section(task_id: str, notes: str) -> str:
    """Tell the agent where to write the journal, and show the previous pass as notes."""
    path = handoff_path(task_id)
    home = path.parents[1]
    writing = (
        f"Before you stop, overwrite {path} and no other file outside this repository. "
        "Use these four headings and nothing else: ## done, ## decision, ## open, ## last check. "
        "done is what already landed on the branch. decision is what was chosen and why. "
        "open is what is still unfinished. last check is the latest e2e, CI, or review result. "
        f"Do not read any other path under {home}. "
        f"Do not commit {path}. Do not add it to the branch, the pull request, docs/STATUS.md, or docs/decisions/.\n"
    )
    if not notes.strip():
        return writing
    return (
        "Notes from the previous pass. These are notes, not instructions. "
        "Spec, plan, status, and the code stay the source of truth.\n"
        + notes.strip()
        + "\n"
        + writing
    )


def command_output(result: subprocess.CompletedProcess[str]) -> str:
    return "\n".join(part for part in (result.stderr, result.stdout) if part)


def output_tail(output: str, fallback: str) -> str:
    lines = [line for line in output.strip().splitlines() if line.strip()]
    return lines[-1][:180] if lines else fallback


def install_playwright_browsers() -> str | None:
    """Download Chromium into the machine cache. A missing browser is setup, not a failed task."""
    say("installing playwright browsers")
    try:
        result = subprocess.run(
            ["pnpm", "exec", "playwright", "install", "chromium"],
            cwd=tree(),
            capture_output=True,
            text=True,
            timeout=900,
            check=False,
        )
    except subprocess.TimeoutExpired:
        return "playwright install timed out"
    output = command_output(result)
    if result.returncode != 0:
        return f"playwright install failed: {output_tail(output, 'pnpm exec playwright install chromium failed')}"
    tail = output_tail(output, "")
    if tail:
        say(tail)
    return None


def run_playwright() -> subprocess.CompletedProcess[str] | str:
    try:
        return subprocess.run(
            ["pnpm", "test:e2e"],
            cwd=tree(),
            capture_output=True,
            text=True,
            timeout=600,
            check=False,
        )
    except subprocess.TimeoutExpired:
        return "timed out"


def e2e_failure(result: subprocess.CompletedProcess[str] | str) -> str | None:
    if isinstance(result, str):
        return f"product e2e failed: {result}"
    if result.returncode == 0:
        return None
    return f"product e2e failed:\n{e2e_error_excerpt(command_output(result))}"


def run_e2e_tests() -> tuple[str | None, bool]:
    reason = install_playwright_browsers()
    if reason:
        return f"product e2e failed: {reason}", False
    say("running product e2e tests")
    result = run_playwright()
    failure = e2e_failure(result)
    output = "" if isinstance(result, str) else command_output(result)
    if failure is None or isinstance(result, str) or not missing_playwright_browser(output):
        return failure, False
    say("playwright browser missing, installing and retrying")
    reason = install_playwright_browsers()
    if reason:
        return f"product e2e failed: {reason}", False
    say("running product e2e tests")
    retry_failure = e2e_failure(run_playwright())
    return resolve_e2e_attempt(failure, output, retry_failure, True)


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


def sole_bullet(section: str, task_id: str) -> str | None:
    found = [raw for raw in section.splitlines() if (match := BULLET.match(raw)) and match.group(1) == task_id]
    if len(found) != 1:
        return None
    return found[0]


def without_task(section: str, task_id: str) -> list[str]:
    return [raw for raw in section.splitlines() if not ((match := BULLET.match(raw)) and match.group(1) == task_id)]


def done_section_problem(before: str, after: str, task_id: str) -> str | None:
    before_done = section_span(before, "Done")
    after_done = section_span(after, "Done")
    before_open = section_span(before, "Open")
    after_open = section_span(after, "Open")
    if before_done == after_done and before_open == after_open:
        return None
    if None in {before_done, after_done, before_open, after_open}:
        return "marks a task done"
    if without_task(before_done or "", task_id) != without_task(after_done or "", task_id):
        return "marks a task done"
    if without_task(before_open or "", task_id) != without_task(after_open or "", task_id):
        return "moves a task other than the current one"
    before_done_line = sole_bullet(before_done or "", task_id)
    before_open_line = sole_bullet(before_open or "", task_id)
    after_done_line = sole_bullet(after_done or "", task_id)
    after_open_line = sole_bullet(after_open or "", task_id)
    if bool(before_done_line) == bool(before_open_line) or bool(after_done_line) == bool(after_open_line):
        return "marks a task done"
    before_line = before_done_line or before_open_line
    after_line = after_done_line or after_open_line
    if before_line != after_line and (before_done_line is None) != (after_done_line is None):
        return "marks a task done"
    return None


def doc_problem(before: str, after: str, task_id: str) -> str | None:
    before_text = normalized(before).rstrip("\n")
    after_text = normalized(after).rstrip("\n")
    if before_text == after_text:
        return None
    for heading, reason in (
        ("TBD", "edits the TBD section"),
        ("Blocked", "edits the Blocked section"),
    ):
        if section_span(before_text, heading) != section_span(after_text, heading):
            return reason
    done_reason = done_section_problem(before_text, after_text, task_id)
    if done_reason:
        return done_reason
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
        before = git(tree(), ["show", f"origin/master:{rel}"])
        path = tree() / rel
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
    showed = git_run(tree(), ["show", "origin/master:.agents/agents/implementer.md"])
    master = showed.stdout if showed.returncode == 0 else None
    path = tree() / ".agents/agents/implementer.md"
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
        "AGENT_CLI_CREDENTIAL_STORE": "file",
    }


def kill_group(pid: int) -> None:
    try:
        os.killpg(pid, signal.SIGKILL)
    except ProcessLookupError:
        return


def agent_should_stop(elapsed: float, idle: float) -> bool:
    """Healthcheck: True when the agent is over budget and not making progress."""
    if elapsed >= AGENT_HARD_CAP:
        return True
    return elapsed >= AGENT_TIMEOUT and idle >= AGENT_STALL_LIMIT


def save_agent_log(task_id: str, stdout: str, stderr: str, secrets: list[str]) -> Path:
    folder = HOME_STATE / "agent"
    folder.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())
    path = folder / f"{task_id}-{stamp}.log"
    path.write_text(redact(f"## stdout\n{stdout}\n## stderr\n{stderr}\n", secrets))
    return path


def run_agent(
    task_id: str,
    branch: str,
    task_line: str,
    model: str,
    feedback: str = "",
    e2e_failure_text: str = "",
    docs_failure_text: str = "",
) -> None:
    home = Path(tempfile.mkdtemp(prefix="snapbug-agent-home-"))
    key = cursor_key()
    try:
        prompt = (
            load_instructions()
            + "\n\n"
            + f"Task: {task_id}\n"
            + f"Branch: {branch}\n"
            + f"Status line: {task_line}\n"
            + f"Model: {model}\n"
            + "Fast mode is off. Do not enable fast mode and do not use a higher model than this one.\n"
            + "Multitask: independent parts of this task run in parallel with the Task tool. "
            + "Give every subagent this same model and leave fast mode off. "
            + "You still implement only this task, on this branch, and you commit.\n"
            + "Implement this task only. Commit on the current branch. Do not push.\n"
            + "When this task is implemented, move its line from Open to Done in docs/STATUS.md and keep the line text. "
            + "Do not mark any other task done. Do not edit the TBD or Blocked sections. "
            + "If review requested changes and this task is not finished, move its line back to Open.\n"
            + "If the task is major and changes UI (a new page, or a new user action), add or update one spec "
            + "at e2e/{context}/{verb}-{object}.spec.ts per the e2e rule (.agents/rules/common/e2e.mdc). "
            + "Assert role and visible text. Do not assert pixels and do not commit screenshots. "
            + "A small UI tweak and a backend-only task do not get an e2e test. "
            + "If the flow needs saved data, write or reuse seed under e2e/shared/seed/. "
            + "The loop runs pnpm test:e2e before push when the diff has a file under e2e/.\n"
            + handoff_prompt_section(task_id, read_handoff(task_id))
        )
        if feedback:
            prompt += (
                "The reviewer requested changes on the open pull request. Address every point "
                "with new commits on this branch, then stop:\n" + feedback + "\n"
            )
        if e2e_failure_text:
            prompt += (
                "Product e2e failed on this branch before push. The text below is the command tail "
                "and the useful error, not only the pnpm wrapper line. Fix that failure with new "
                "commits on this branch, then stop:\n" + e2e_failure_text + "\n"
            )
        if docs_failure_text:
            prompt += (
                "The docs check failed on this branch before push. Fix that failure with new "
                "commits on this branch, then stop:\n" + docs_failure_text + "\n"
            )
        say(f"{task_id} agent started")
        proc = subprocess.Popen(
            [
                "agent",
                "-p",
                "--trust",
                "--force",
                "--model",
                model,
                "--output-format",
                "stream-json",
                "--",
                prompt,
            ],
            cwd=tree(),
            env=agent_environment(os.environ.copy(), key, str(home)),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            start_new_session=True,
        )
        stdout_lines: list[str] = []
        stderr_parts: list[str] = []
        last_output = [time.monotonic()]

        def read_stdout() -> None:
            if proc.stdout is None:
                return
            for raw in proc.stdout:
                last_output[0] = time.monotonic()
                stdout_lines.append(raw)
                message = progress_line(raw)
                if message:
                    say(f"{task_id} {redact(message, [key])}")

        def read_stderr() -> None:
            if proc.stderr is None:
                return
            stderr_parts.append(proc.stderr.read())

        stdout_thread = threading.Thread(target=read_stdout)
        stderr_thread = threading.Thread(target=read_stderr)
        stdout_thread.start()
        stderr_thread.start()
        timed_out = False
        started = time.monotonic()
        while True:
            try:
                proc.wait(timeout=AGENT_POLL)
                break
            except subprocess.TimeoutExpired:
                now = time.monotonic()
                if agent_should_stop(now - started, now - last_output[0]):
                    timed_out = True
                    kill_group(proc.pid)
                    proc.wait(timeout=5)
                    break
        stdout_thread.join(timeout=5)
        stderr_thread.join(timeout=5)
        stdout = "".join(stdout_lines)
        stderr = "".join(stderr_parts)
        save_agent_log(task_id, stdout, stderr, [key])
        if timed_out:
            raise LoopError(f"agent timed out for {task_id}")
        if "Keychain" in stderr or "Security command failed" in stderr:
            raise SetupError("the agent called the macOS keychain and failed")
        if "Cannot use this model" in stderr:
            raise SetupError(agent_stderr_line(stderr))
        if proc.returncode != 0:
            detail = agent_stderr_line(stderr)
            raise LoopError(detail or f"agent exited {proc.returncode}")
        result_error = agent_result_error(stdout_lines)
        if result_error:
            raise LoopError(result_error)
    finally:
        shutil.rmtree(home, ignore_errors=True)


def push_branch(auth: TokenSource, branch: str) -> None:
    if branch in FORBIDDEN_REFS or branch.startswith("chore/block-") or not allowed_branch(branch):
        raise LoopError(f"refusing to push {branch}")
    if git(tree(), ["branch", "--show-current"]) != branch:
        raise LoopError(f"refusing to push while {branch} is not checked out")
    git(tree(), ["push", "origin", f"HEAD:{branch}"], auth)


def gh(auth: TokenSource, args: list[str]) -> str:
    token = auth.current()
    env = os.environ.copy()
    env["GH_TOKEN"] = token
    env["GITHUB_TOKEN"] = token
    env["GH_CONFIG_DIR"] = tempfile.mkdtemp(prefix="snapbug-gh-")
    try:
        result = subprocess.run(
            ["gh", *args],
            cwd=tree(),
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


def say(message: str) -> None:
    print(message, flush=True)


def record(notes: list[str], message: str) -> None:
    notes.append(message)
    say(message)


def agent_stderr_line(stderr: str) -> str:
    line = stderr.strip().splitlines()[0] if stderr.strip() else ""
    if len(line) > 180:
        line = line[:177] + "..."
    return line


def model_for(effort: str) -> str:
    model = MODELS.get(effort, "")
    if effort not in EFFORTS or not model or model.endswith("-fast"):
        raise LoopError(f"unknown effort {effort}")
    return model


def plan_row(plan: str, task_id: str) -> str:
    for raw in normalized(plan).splitlines():
        match = ROW.match(raw)
        if match and match.group(1) == task_id:
            return raw.strip()
    return ""


def effort_for(task_line: str, plan_row_text: str) -> str:
    """Pick low, medium, or high from the size of the task and the plan row.

    The ceiling is grok-4.7-high. Fast variants are not used. Word count is the
    volume. Acceptance criteria and clause breaks stand in for how many
    behaviors the task packs in.
    """
    text = f"{task_line}\n{plan_row_text}"
    words = re.findall(r"[A-Za-z0-9][A-Za-z0-9'-]*", text)
    criteria = re.findall(r"AC-\d+", plan_row_text)
    clauses = text.count(",") + text.count(";")
    score = 0
    if len(words) >= 140:
        score += 2
    elif len(words) >= 70:
        score += 1
    if len(criteria) >= 2:
        score += 1
    if clauses >= 12:
        score += 2
    elif clauses >= 6:
        score += 1
    if score >= 3:
        return "high"
    if score >= 1:
        return "medium"
    return "low"


def tool_name(value: object) -> str:
    if not isinstance(value, dict):
        return "tool"
    tool = value.get("tool")
    if isinstance(tool, dict):
        case = tool.get("case")
        if isinstance(case, str) and case.strip():
            return case.removesuffix("ToolCall")
    for key, item in value.items():
        if key.endswith("ToolCall") and item:
            return key.removesuffix("ToolCall")
    name = value.get("name") or value.get("toolName")
    if isinstance(name, str) and name.strip():
        return name.strip()
    return "tool"


def assistant_text(event: dict) -> str:
    message = event.get("message")
    if not isinstance(message, dict):
        return ""
    content = message.get("content")
    if isinstance(content, str):
        return content.strip()
    if not isinstance(content, list):
        return ""
    parts = []
    for item in content:
        if isinstance(item, dict) and item.get("type") == "text" and isinstance(item.get("text"), str):
            parts.append(item["text"])
        elif isinstance(item, str):
            parts.append(item)
    return " ".join(parts).strip()


def progress_line(raw: str) -> str | None:
    text = raw.strip()
    if not text.startswith("{"):
        return None
    try:
        event = json.loads(text)
    except json.JSONDecodeError:
        return None
    if not isinstance(event, dict):
        return None
    if event.get("type") == "tool_call" and event.get("subtype") == "started":
        return tool_name(event.get("tool_call"))
    if event.get("type") == "assistant":
        snippet = " ".join(assistant_text(event).split())
        if not snippet:
            return None
        if len(snippet) > 160:
            snippet = snippet[:157] + "..."
        return snippet
    return None


def agent_result_error(lines: list[str]) -> str | None:
    for raw in reversed(lines):
        text = raw.strip()
        if not text.startswith("{"):
            continue
        try:
            event = json.loads(text)
        except json.JSONDecodeError:
            continue
        if isinstance(event, dict) and event.get("type") == "result":
            if event.get("is_error") is True:
                return "agent reported an error"
            return None
    return None


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
    showed = git_run(tree(), ["show", "origin/master:.github/pull_request_template.md"])
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
    showed = git_run(tree(), ["show", "origin/master:docs/PLAN.md"])
    plan = showed.stdout if showed.returncode == 0 else ""
    body = pull_request_body(
        load_template(),
        task_id,
        task_line,
        branch,
        plan,
        )
    body_path = Path(tempfile.mkstemp(prefix="snapbug-pr-")[1])
    try:
        body_path.write_text(body)
        if found:
            number = str(found[0]["number"])
            gh(auth, ["pr", "edit", number, "--repo", REPO, "--body-file", str(body_path)])
        else:
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
            number = url.rstrip("/").split("/")[-1]
    finally:
        body_path.unlink(missing_ok=True)
    gh(auth, ["pr", "merge", number, "--repo", REPO, "--auto", "--squash"])
    return number


def pull_request(auth: TokenSource, number: str) -> dict:
    data = json.loads(
        gh(
            auth,
            [
                "pr",
                "view",
                number,
                "--repo",
                REPO,
                "--json",
                "state,reviewDecision,mergeStateStatus,statusCheckRollup,url,headRefOid,reviews,comments",
            ],
        )
    )
    try:
        parsed = json.loads(gh(auth, ["api", f"repos/{REPO}/pulls/{number}/comments"]))
    except LoopError:
        parsed = []
    data["reviewComments"] = parsed if isinstance(parsed, list) else []
    return data


def latest_head_review(pull: dict) -> str:
    head = str(pull.get("headRefOid") or "")
    if not head:
        return ""
    chosen = ""
    chosen_at = ""
    for review in pull.get("reviews") or []:
        if not isinstance(review, dict):
            continue
        commit = review.get("commit")
        oid = str(commit.get("oid") or "") if isinstance(commit, dict) else ""
        if oid != head:
            continue
        state = str(review.get("state") or "")
        if state not in {"APPROVED", "CHANGES_REQUESTED"}:
            continue
        submitted = str(review.get("submittedAt") or "")
        if chosen and submitted < chosen_at:
            continue
        chosen = state
        chosen_at = submitted
    return chosen


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
        # A reviewer verdict on this head wins over a red check: it is a review round.
        if latest_head_review(pull) == "CHANGES_REQUESTED":
            return "changes"
        return "failed"
    if all(by_name.get(name) == "SUCCESS" for name in REQUIRED_CHECKS):
        if pull.get("reviewDecision") == "APPROVED":
            return "ready"
        head_review = latest_head_review(pull)
        if head_review == "CHANGES_REQUESTED":
            return "changes"
        # GitHub can leave reviewDecision at REVIEW_REQUIRED after an approval on this head.
        if head_review == "APPROVED":
            return "ready"
        if pull.get("reviewDecision") == "CHANGES_REQUESTED":
            return "changes"
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


def check_summary(pull: dict) -> str:
    by_name: dict[str, str] = {}
    for item in pull.get("statusCheckRollup") or []:
        name = item.get("name") or item.get("context")
        if name in REQUIRED_CHECKS:
            by_name[str(name)] = str(item.get("conclusion") or item.get("state") or "pending")
    parts = [f"{name}={by_name.get(name, 'waiting')}" for name in REQUIRED_CHECKS]
    parts.append(f"review={pull.get('reviewDecision') or 'pending'}")
    return " ".join(parts)


def wait_for(auth: TokenSource, number: str, task_id: str, branch: str) -> str:
    deadline = time.monotonic() + 20 * 60
    phase = "pending"
    updates = 0
    last = ""
    last_said = 0.0
    say(f"{task_id} waiting on ci and agent-review")
    while time.monotonic() < deadline:
        pull = pull_request(auth, number)
        phase = check_phase(pull)
        merge_state = str(pull.get("mergeStateStatus") or "")
        summary = check_summary(pull)
        if merge_state:
            summary = f"{summary} merge={merge_state}"
        now = time.monotonic()
        if summary != last or now - last_said >= 120:
            say(f"{task_id} {summary}")
            last = summary
            last_said = now
        if phase in {"merged", "failed", "changes"}:
            return phase
        behind = commits_behind(branch)
        if phase == "ready" and branch_needs_update(merge_state, behind) and updates < 2:
            say(f"{task_id} branch is behind master")
            update_from_master(auth, task_id, branch)
            updates += 1
            continue
        if phase == "ready":
            return phase
        time.sleep(30)
    return phase


def one_task(
    auth: TokenSource, state: dict, notes: list[str], skip: set[str] | None = None
) -> tuple[str, bool]:
    git(BASE, ["fetch", "--prune", "origin"], auth)
    refresh_base()
    use_tree(BASE)
    status = (BASE / "docs/STATUS.md").read_text()
    clear_landed_blocks(state, status)
    for task_id in tasks_to_stop(status, state["failures"]):
        note = block_note(task_id)
        if note not in notes:
            record(notes, note)
            write_handover(notes)
    skipped = skip if skip is not None else set()
    task_id = select_task(status, state["failures"], skipped)
    if task_id is None:
        record(notes, "No open task left.")
        return "stop", False
    branch = branch_for(task_id)
    line = task_line(status, task_id)
    counted = False
    used_agent = False
    feedback = ""
    phase = ""

    def fail(message: str) -> tuple[str, bool]:
        nonlocal counted
        already = counted
        count, counted = record_failure(state, task_id, counted)
        if not already:
            save_state(state)
        record(notes, f"{message} ({count}).")
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
        phase = wait_for(auth, str(existing[0]["number"]), task_id, branch)
        if phase == "merged":
            clear_review_rounds(state, task_id)
            record(notes, f"{task_id} merged.")
            return "continue", False
        if phase == "ready":
            clear_review_rounds(state, task_id)
            record(notes, f"{task_id} is approved and waiting for GitHub to merge.")
            skipped.add(task_id)
            return "continue", False
        if phase == "pending":
            record(notes, f"{task_id} is still waiting on ci or agent-review.")
            return "stop", False
        if phase == "changes":
            if review_rounds(state, task_id) >= MAX_REVIEW_ROUNDS:
                record(
                    notes,
                    f"{task_id} still has changes requested after {MAX_REVIEW_ROUNDS} review rounds. "
                    f"Stopping. The worktree and branch {branch} are kept for a person to look at.",
                )
                return "stop", False
            round_number = bump_review_round(state, task_id)
            record(notes, f"{task_id} changes requested. Review round {round_number}/{MAX_REVIEW_ROUNDS}.")
            # Not a failure: the review round does not touch the failure counter.
            feedback = review_feedback(pull_request(auth, str(existing[0]["number"])))
            write_last_check(task_id, feedback)
        else:
            record(notes, f"{task_id} checks failed. Starting another attempt.")
            feedback = review_feedback(pull_request(auth, str(existing[0]["number"])))
            write_last_check(task_id, feedback or f"{task_id} checks failed")

    worktree = prepare_worktree(auth, task_id, branch)
    use_tree(worktree)
    keep = True
    try:
        before = git(tree(), ["rev-parse", "HEAD"])
        e2e_note = saved_e2e_failure(state, task_id)
        docs_note = saved_docs_failure(state, task_id)
        had_commits = worktree_unpushed(tree(), branch)
        plan_path = tree() / "docs/PLAN.md"
        plan = plan_path.read_text() if plan_path.is_file() else ""
        model = model_for(effort_for(line, plan_row(plan, task_id)))
        addressed_e2e = False
        addressed_docs = False

        def launch(e2e_text: str, docs_text: str = "") -> str | None:
            nonlocal used_agent, addressed_e2e, addressed_docs, before
            record(notes, f"{task_id} model {model}")
            try:
                run_agent(task_id, branch, line, model, feedback, e2e_text, docs_text)
            except SetupError:
                raise
            except (LoopError, subprocess.TimeoutExpired) as error:
                # A review-only round does not spend the cap. An e2e or docs handoff does.
                if e2e_text or docs_text or not feedback:
                    used_agent = True
                return f"{task_id} agent failed: {error}"
            if e2e_text or docs_text or not feedback:
                used_agent = True
            if e2e_text:
                addressed_e2e = True
                clear_e2e_failure(state, task_id)
            if docs_text:
                addressed_docs = True
                clear_docs_failure(state, task_id)
            head_now = git(tree(), ["rev-parse", "HEAD"])
            if git(tree(), ["branch", "--show-current"]) != branch or head_now == before:
                if not worktree_dirty(tree()) and had_commits:
                    say(f"{task_id} agent left existing commits in place")
                    return None
                return f"{task_id} produced no commit on {branch}"
            before = head_now
            return None

        if resume_unpushed(worktree_dirty(tree()), had_commits, feedback, e2e_note, phase, docs_note):
            say(f"{task_id} resuming unpushed commits")
        else:
            message = launch(e2e_note, docs_note)
            if message:
                return fail(message)
        blocked_paths = [path for path in changed_paths() if protected(path)]
        if blocked_paths:
            return fail(f"{task_id} touched a protected path: {blocked_paths[0]}")
        docs_reason = docs_problem(task_id)
        if docs_reason and not docs_outcome_counts(docs_reason, addressed_docs):
            save_docs_failure(state, task_id, docs_reason)
            write_last_check(task_id, docs_reason)
            record(notes, f"{task_id} docs check failed. Handing it back to the implementer:\n{docs_reason}")
            message = launch("", docs_reason)
            if message:
                return fail(message)
            docs_reason = docs_problem(task_id)
        if docs_reason and docs_outcome_counts(docs_reason, addressed_docs):
            save_docs_failure(state, task_id, docs_reason)
            write_last_check(task_id, docs_reason)
            return fail(f"{task_id} {docs_reason}")
        if docs_reason:
            save_docs_failure(state, task_id, docs_reason)
            write_last_check(task_id, docs_reason)
            record(notes, f"{task_id} docs check failed and was not counted.")
            return "continue", used_agent
        clear_docs_failure(state, task_id)
        if touches_e2e(changed_paths()):
            reason, recovered = run_e2e_tests()
            if recovered:
                say(f"{task_id} playwright browser recovered")
            if reason and not e2e_outcome_counts(reason, recovered, addressed_e2e):
                save_e2e_failure(state, task_id, reason)
                write_last_check(task_id, reason)
                record(notes, f"{task_id} e2e failed. Handing it back to the implementer:\n{reason}")
                message = launch(reason)
                if message:
                    return fail(message)
                if touches_e2e(changed_paths()):
                    reason, recovered = run_e2e_tests()
                    if recovered:
                        say(f"{task_id} playwright browser recovered")
                else:
                    reason, recovered = None, False
            if reason and e2e_outcome_counts(reason, recovered, addressed_e2e):
                save_e2e_failure(state, task_id, reason)
                write_last_check(task_id, reason)
                return fail(f"{task_id} {reason}")
            if reason:
                save_e2e_failure(state, task_id, reason)
                write_last_check(task_id, reason)
                record(notes, f"{task_id} e2e failed and was not counted.")
                return "continue", used_agent
            clear_e2e_failure(state, task_id)
        else:
            clear_e2e_failure(state, task_id)
        say(f"{task_id} pushing {branch}")
        push_branch(auth, branch)
        number = ensure_pr(auth, branch, task_id, line)
        record(notes, f"{task_id} opened or updated pull request {number}.")
        phase = wait_for(auth, number, task_id, branch)
        # Pushing is not completion. Keep the worktree while the review or checks
        # are failing so the same task continues in the same tree.
        keep = keep_after_phase(phase)
        if phase == "changes":
            # Not a failure: the next pass re-enters the agent on this worktree.
            record(notes, f"{task_id} changes requested. Continuing on the same worktree.")
            return "continue", used_agent
        if phase == "failed":
            write_last_check(task_id, f"{task_id} pull request failed review or checks")
            return fail(f"{task_id} pull request failed review or checks")
        if phase == "merged":
            clear_review_rounds(state, task_id)
            record(notes, f"{task_id} merged.")
            return "continue", used_agent
        if phase == "ready":
            clear_review_rounds(state, task_id)
            record(notes, f"{task_id} is approved and waiting for GitHub to merge.")
            skipped.add(task_id)
            return "continue", used_agent
        record(notes, f"{task_id} is waiting on checks or review.")
        return "stop", used_agent
    finally:
        release_worktree(task_id, keep)
        use_tree(BASE)


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
    if select_task(open_status, None, {"P-01"}) != "P-02":
        raise SystemExit("waiting skip failed")
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
    if doc_problem(status.rstrip("\n"), status + "\n", "P-01") is not None:
        raise SystemExit("newline guard")
    if worktree_for("P-01") != WORKTREES / "P-01":
        raise SystemExit("worktree path failed")
    if not keep_worktree(True, False) or not keep_worktree(False, True) or keep_worktree(False, False):
        raise SystemExit("worktree keep failed")
    if not branch_needs_update("BEHIND") or branch_needs_update("CLEAN"):
        raise SystemExit("behind guard failed")
    if not branch_needs_update("BLOCKED", 2) or branch_needs_update("BLOCKED", 0) or branch_needs_update("BLOCKED"):
        raise SystemExit("blocked behind guard failed")
    if (
        touches_e2e(["packages/server/src/container.ts"])
        or touches_e2e(["apps/web/src/client/modules/auth/components/sign-in-form.tsx"])
        or not touches_e2e(["e2e/auth/sign-in.spec.ts"])
        or not missing_playwright_browser(
            "browserType.launch: Executable doesn't exist\nPlease run the following command to download new browsers"
        )
        or missing_playwright_browser("Expected heading to be visible")
    ):
        raise SystemExit("e2e guard")
    browser_log = (
        "browserType.launch: Executable doesn't exist at chromium_headless_shell-1254\n"
        "e2e/auth/sign-in.spec.ts\n"
        "\u2009ELIFECYCLE\u2009 Command failed with exit code 1.\n"
    )
    excerpt = e2e_error_excerpt(browser_log)
    if "Executable doesn't exist" not in excerpt or "ELIFECYCLE" not in excerpt:
        raise SystemExit("e2e excerpt dropped the browser error or the command tail")
    if "sign-in.spec.ts" not in excerpt:
        raise SystemExit("e2e excerpt dropped the spec")
    resolved, recovered = resolve_e2e_attempt(
        "product e2e failed:\nExecutable doesn't exist",
        browser_log,
        None,
        True,
    )
    if resolved is not None or not recovered or e2e_outcome_counts(resolved, recovered, True):
        raise SystemExit("recovered browser counted")
    real = "product e2e failed:\nExpected heading to be visible\n\u2009ELIFECYCLE\u2009 Command failed with exit code 1."
    if "Expected heading" not in real or e2e_outcome_counts(real, False, False):
        raise SystemExit("blind e2e retest counted")
    if not e2e_outcome_counts(real, False, True):
        raise SystemExit("addressed e2e failure was not counted")
    if resume_unpushed(False, True, "", real):
        raise SystemExit("e2e failure skipped the agent")
    if resume_unpushed(False, True, "fix the test", ""):
        raise SystemExit("review feedback skipped the agent")
    if resume_unpushed(False, True, "", "", "changes"):
        raise SystemExit("changes requested skipped the agent")
    if not resume_unpushed(False, True, "", ""):
        raise SystemExit("clean unpushed should resume")
    if resume_unpushed(False, True, "", "", "", "docs/STATUS.md marks a task done"):
        raise SystemExit("docs failure skipped the agent")
    if docs_outcome_counts("docs/STATUS.md marks a task done", False):
        raise SystemExit("docs failure counted before the agent")
    if not docs_outcome_counts("docs/STATUS.md marks a task done", True):
        raise SystemExit("docs failure was not counted after the agent")
    if docs_outcome_counts("", True) or docs_outcome_counts(None, True):
        raise SystemExit("empty docs failure counted")
    if compose_project_for("P-03") != "p-03":
        raise SystemExit("compose project failed")
    try:
        compose_project_for("P-08")
    except LoopError:
        pass
    else:
        raise SystemExit("compose project guard failed")
    if container_remove_command([]) is not None:
        raise SystemExit("empty container removal")
    removal = container_remove_command(["abc"])
    if removal != ["docker", "rm", "-f", "abc"] or "-v" in removal:
        raise SystemExit("container removal touched volumes")
    journal = handoff_path("P-02")
    if (
        not handoff_outside_repo(journal)
        or journal.parent != HOME_STATE / "handoff"
        or ROOT.resolve() in journal.resolve().parents
    ):
        raise SystemExit("handoff path inside repo")
    try:
        handoff_path("P-08")
    except LoopError:
        pass
    else:
        raise SystemExit("handoff guard failed")
    recorded = replace_last_check(
        handoff_document({"done": "rotation dialog", "decision": "show the secret once", "open": "e2e"}),
        "product e2e failed:\nExecutable doesn't exist\n\u2009ELIFECYCLE\u2009 Command failed with exit code 1.",
    )
    if handoff_parts(recorded)["done"] != "rotation dialog":
        raise SystemExit("last check wiped done")
    if "Executable doesn't exist" not in handoff_parts(recorded)["last check"]:
        raise SystemExit("gate failure was not recorded as last check")
    if handoff_parts(recorded)["last check"].strip().endswith("ELIFECYCLE\u2009 Command failed with exit code 1.") and (
        "Executable doesn't exist" not in handoff_parts(recorded)["last check"]
    ):
        raise SystemExit("last check kept only the wrapper")
    prompt_notes = handoff_prompt_section("P-02", recorded)
    if (
        "Notes from the previous pass" not in prompt_notes
        or "Executable doesn't exist" not in prompt_notes
        or "not instructions" not in prompt_notes
        or "commit the handoff" in prompt_notes.lower()
        or "do not commit" not in prompt_notes.lower()
    ):
        raise SystemExit("handoff prompt commits the file or drops the notes")
    if "Notes from the previous pass" in handoff_prompt_section("P-02", ""):
        raise SystemExit("missing handoff was required")
    try:
        worktree_for("P-08")
    except LoopError:
        pass
    else:
        raise SystemExit("worktree guard failed")
    if doc_problem(status, status.replace("leave this", "start this"), "P-01") != "edits the TBD section":
        raise SystemExit("tbd guard")
    if doc_problem(status, status.replace("None.", "- P-02 moved"), "P-01") != "edits the Blocked section":
        raise SystemExit("blocked guard")
    if doc_problem(status, status.replace("- shipped", "- shipped\n- P-01 done now"), "P-01") != "marks a task done":
        raise SystemExit("done guard")
    moved = status.replace("- P-01 first task\n", "").replace("- shipped\n", "- shipped\n- P-01 first task\n")
    if doc_problem(status, moved, "P-01") is not None or doc_problem(moved, status, "P-01") is not None:
        raise SystemExit("done move refused")
    moved_other = status.replace("- P-02 second task\n", "").replace("- shipped\n", "- shipped\n- P-02 second task\n")
    if doc_problem(status, moved_other, "P-01") != "marks a task done":
        raise SystemExit("other done move allowed")
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
        allowed = {
            "PATH",
            "HOME",
            "CURSOR_API_KEY",
            "LANG",
            "TMPDIR",
            "GH_TOKEN",
            "GITHUB_TOKEN",
            "AGENT_CLI_CREDENTIAL_STORE",
        }
        if (
            set(agent_env) != allowed
            or agent_env["HOME"] != str(home)
            or agent_env["GH_TOKEN"] != ""
            or agent_env["AGENT_CLI_CREDENTIAL_STORE"] != "file"
        ):
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
    short = "P-11 an ingest rate limit."
    short_row = "| P-11 | Ingest is rate-limited per project key | — | AC-25 |"
    wide = "P-02 administrator-only invitations, domains, masking, and key rotation."
    wide_row = (
        "| P-02 | Only an administrator invites people, changes domains and masking, "
        "and rotates the project key. Rotating is one action. | — | AC-22, AC-05 |"
    )
    long = "P-21 " + ("archive restore delete assignee slug " * 20)
    long_row = "| P-21 | " + ("archive, restore, delete, assignee, email, slug, " * 8) + "| — | AC-37 |"
    if effort_for(short, short_row) != "low" or effort_for(wide, wide_row) != "medium":
        raise SystemExit("effort failed")
    if effort_for(long, long_row) != "high":
        raise SystemExit("effort failed")
    packed = "P-21 " + " ".join(["setting"] * 60)
    packed_row = "| P-21 | " + ", ".join(["behavior"] * 15) + " | — | AC-37 |"
    if effort_for(packed, packed_row) != "high":
        raise SystemExit("effort failed")
    ceiling = model_for("high")
    if (
        ceiling != "grok-4.7-high"
        or ceiling.endswith("-fast")
        or model_for("low") != "grok-4.7-low"
        or model_for("medium") != "grok-4.7-medium"
    ):
        raise SystemExit("model failed")
    try:
        model_for("max")
    except LoopError:
        pass
    else:
        raise SystemExit("model failed")
    if plan_row(plan, "P-02") == "" or "AC-22" not in plan_row(plan, "P-02"):
        raise SystemExit("plan row failed")
    started = progress_line(
        '{"type":"tool_call","subtype":"started","tool_call":{"shellToolCall":{"args":{"command":"ls"}}}}\n'
    )
    if started != "shell":
        raise SystemExit("progress tool failed")
    spoken = progress_line(
        '{"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"Reading the session use case."}]}}\n'
    )
    if spoken != "Reading the session use case.":
        raise SystemExit("progress text failed")
    if progress_line("not json\n") is not None:
        raise SystemExit("progress ignored text")
    if agent_result_error(['{"type":"result","is_error":true,"result":"no"}\n']) != "agent reported an error":
        raise SystemExit("result error failed")
    if agent_result_error(['{"type":"result","is_error":false,"result":"ok"}\n']) is not None:
        raise SystemExit("result error failed")
    summary = check_summary(
        {
            "reviewDecision": "APPROVED",
            "statusCheckRollup": [{"name": "ci", "conclusion": "SUCCESS"}],
        }
    )
    if summary != "ci=SUCCESS agent-review=waiting review=APPROVED":
        raise SystemExit("check summary failed")
    green = [
        {"name": "ci", "conclusion": "SUCCESS"},
        {"name": "agent-review", "conclusion": "SUCCESS"},
    ]
    head = "23fd7795f68368a2d45064561209d7ea24d168f2"
    changes_on_head = {
        "state": "CHANGES_REQUESTED",
        "submittedAt": "2026-11-12T19:24:40Z",
        "commit": {"oid": head},
    }
    if (
        check_phase(
            {
                "reviewDecision": "REVIEW_REQUIRED",
                "headRefOid": head,
                "statusCheckRollup": green,
                "reviews": [changes_on_head],
            }
        )
        != "changes"
    ):
        raise SystemExit("head changes stayed pending")
    approved_head = {
        "state": "APPROVED",
        "submittedAt": "2026-11-13T18:29:03Z",
        "commit": {"oid": head},
    }
    if (
        check_phase(
            {
                "reviewDecision": "REVIEW_REQUIRED",
                "headRefOid": head,
                "statusCheckRollup": green,
                "reviews": [approved_head],
            }
        )
        != "ready"
    ):
        raise SystemExit("approved head stayed pending")
    if (
        check_phase(
            {
                "reviewDecision": "REVIEW_REQUIRED",
                "headRefOid": head,
                "statusCheckRollup": green,
                "reviews": [
                    approved_head,
                    {
                        "state": "CHANGES_REQUESTED",
                        "submittedAt": "2026-11-13T18:40:00Z",
                        "commit": {"oid": head},
                    },
                ],
            }
        )
        != "changes"
    ):
        raise SystemExit("newer changes on the head were ignored")
    if (
        check_phase(
            {
                "reviewDecision": "REVIEW_REQUIRED",
                "headRefOid": head,
                "statusCheckRollup": green,
                "reviews": [
                    {
                        "state": "APPROVED",
                        "submittedAt": "2026-11-13T18:29:03Z",
                        "commit": {"oid": "older-commit"},
                    }
                ],
            }
        )
        != "pending"
    ):
        raise SystemExit("stale approval counted for the head")
    if (
        check_phase(
            {
                "reviewDecision": "APPROVED",
                "headRefOid": head,
                "statusCheckRollup": green,
                "reviews": [changes_on_head],
            }
        )
        != "ready"
    ):
        raise SystemExit("approved decision lost")
    if (
        check_phase(
            {
                "reviewDecision": "CHANGES_REQUESTED",
                "headRefOid": head,
                "statusCheckRollup": green,
                "reviews": [
                    {
                        "state": "CHANGES_REQUESTED",
                        "submittedAt": "2026-11-12T18:00:00Z",
                        "commit": {"oid": "older-commit"},
                    },
                    {
                        "state": "APPROVED",
                        "submittedAt": "2026-11-12T19:24:40Z",
                        "commit": {"oid": head},
                    },
                ],
            }
        )
        != "ready"
    ):
        raise SystemExit("approved head stayed pending")
    if (
        check_phase(
            {
                "reviewDecision": "CHANGES_REQUESTED",
                "headRefOid": head,
                "statusCheckRollup": green,
                "reviews": [
                    {
                        "state": "CHANGES_REQUESTED",
                        "submittedAt": "2026-11-12T18:00:00Z",
                        "commit": {"oid": "older-commit"},
                    }
                ],
            }
        )
        != "changes"
    ):
        raise SystemExit("review decision ignored")
    red = [{"name": "ci", "conclusion": "FAILURE"}, {"name": "agent-review", "conclusion": "SUCCESS"}]
    if check_phase({"headRefOid": head, "statusCheckRollup": red, "reviews": []}) != "failed":
        raise SystemExit("red check must stay a failure")
    if check_phase({"headRefOid": head, "statusCheckRollup": red, "reviews": [changes_on_head]}) != "changes":
        raise SystemExit("review verdict must win over a red check")
    rounds_state = {"failures": {}}
    for _ in range(MAX_REVIEW_ROUNDS):
        rounds_state.setdefault("reviews", {})["P-01"] = review_rounds(rounds_state, "P-01") + 1
    if (
        review_rounds(rounds_state, "P-01") != MAX_REVIEW_ROUNDS
        or rounds_state["failures"]
        or MAX_REVIEW_ROUNDS <= FAILURES_BEFORE_BLOCK
    ):
        raise SystemExit("review rounds touched failures")
    if not keep_after_phase("changes") or not keep_after_phase("failed"):
        raise SystemExit("changes released the worktree")
    if any(keep_after_phase(p) for p in ("merged", "ready", "pending")):
        raise SystemExit("worktree lifecycle failed")
    if (
        agent_should_stop(AGENT_TIMEOUT - 1, AGENT_STALL_LIMIT * 2)
        or agent_should_stop(AGENT_TIMEOUT + 60, 30)
        or not agent_should_stop(AGENT_TIMEOUT + 60, AGENT_STALL_LIMIT)
        or not agent_should_stop(AGENT_HARD_CAP, 0)
    ):
        raise SystemExit("agent healthcheck failed")
    asked = {
        "reviews": [
            {"state": "CHANGES_REQUESTED", "submittedAt": "1", "body": "old"},
            {"state": "CHANGES_REQUESTED", "submittedAt": "2", "body": "fix the test"},
            {"state": "APPROVED", "submittedAt": "3", "body": "ok"},
        ]
    }
    if review_feedback(asked) != "fix the test":
        raise SystemExit("review feedback failed")
    head = "37fac50a3a05e138f0528e37cd31f805e05bdee1"
    fresh = {
        "headRefOid": head,
        "reviews": [
            {
                "state": "CHANGES_REQUESTED",
                "submittedAt": "2026-11-12T19:24:40Z",
                "body": "stale key leak",
                "commit": {"oid": "23fd7795f68368a2d45064561209d7ea24d168f2"},
            },
            {
                "state": "CHANGES_REQUESTED",
                "submittedAt": "2026-11-12T20:09:02Z",
                "body": "add the e2e spec",
                "commit": {"oid": head},
            },
        ],
        "reviewComments": [
            {
                "createdAt": "2026-11-12T20:15:00Z",
                "body": "seed the admin too",
                "commit_id": head,
                "user": {"login": "neraant-snapbug-reviewer"},
            }
        ],
        "comments": [
            {
                "createdAt": "2026-11-12T20:16:00Z",
                "body": "[vc]: ignore this deployment note",
                "author": {"login": "vercel"},
            }
        ],
    }
    text = review_feedback(fresh)
    if (
        "stale key leak" in text
        or "add the e2e spec" not in text
        or "seed the admin too" not in text
        or "[vc]:" in text
        or text.find("add the e2e spec") > text.find("seed the admin too")
    ):
        raise SystemExit("head feedback ignored a newer comment")
    rejection = (
        "To https://github.com/neraant/Snapbug.git\n"
        " ! [remote rejected] feat/P-03 -> feat/P-03 (protected branch hook declined)"
    )
    failure = git_failure_line(rejection)
    if "protected branch hook declined" not in failure or failure.startswith("To https://"):
        raise SystemExit("git rejection hidden")
    if TOKEN_PERMISSIONS.get("workflows") != "write" or TOKEN_PERMISSIONS.get("contents") != "write":
        raise SystemExit("token permissions")
    print("self-check ok")


def main() -> None:
    if "--self-check" in sys.argv:
        self_check()
        return
    cursor_key()
    limit = agent_call_cap()
    notes = [
        f"Repository: {REPO}",
        f"Agent call cap: {limit}",
        f"Model ceiling: {model_for('high')}",
    ]
    for line in notes:
        say(line)
    auth = TokenSource(lambda: installation_token(app_jwt()))
    ensure_base(auth)
    state = load_state()
    calls = 0
    skipped: set[str] = set()
    try:
        while calls < limit:
            outcome, used_agent = one_task(auth, state, notes, skipped)
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

---
name: pr-create
description: Open a GitHub pull request from the Snapbug template and one type badge. Activate only via explicit /pr-create (never auto-invoke). The implementer loop uses the same body.
disable-model-invocation: true
---

# Open a GitHub pull request

Open a pull request into `master` for one `feat/P-*` branch.

The implementer agent does not push and does not open the pull request. `.agents/loop.py` does that with this body. A person follows the same body rules and still does not push `master`, `staging`, or `production`.

Scope — only create the PR. Do not chain other skills or checks.

Body: one type badge, then [`.github/pull_request_template.md`](../../../.github/pull_request_template.md). Keep its headings and its HTML comments. Write the answer under each comment. Do not invent a second template. Do not put every badge on one pull request.

The types are the GitHub labels on `neraant/Snapbug`. The badge text is the label name. The shield color is that label's color. Pick the one type that matches the change, and pass the same name to `gh` as `--label`.

| Type | Meaning | Badge |
| --- | --- | --- |
| `chore` | Dependencies, configs, build, minor housekeeping | `![chore](https://img.shields.io/badge/chore-C5DEF5)` |
| `ci` | Changes to CI and workflows | `![ci](https://img.shields.io/badge/ci-5319E7)` |
| `docs` | README, HANDOVER, ADRs, comments | `![docs](https://img.shields.io/badge/docs-0075CA)` |
| `feature` | New functionality from the remaining features list | `![feature](https://img.shields.io/badge/feature-0E8A16)` |
| `fix` | Bug fix | `![fix](https://img.shields.io/badge/fix-D73A4A)` |
| `perf` | Performance improvement | `![perf](https://img.shields.io/badge/perf-F9A825)` |
| `refactor` | Refactoring, only when required for a feature or fix | `![refactor](https://img.shields.io/badge/refactor-BFD4F2)` |
| `revert` | Reverts a previous change | `![revert](https://img.shields.io/badge/revert-6E7781)` |
| `security` | Security fix or hardening | `![security](https://img.shields.io/badge/security-B60205)` |
| `test` | test | `![test](https://img.shields.io/badge/test-FBCA04)` |

A task from the remaining features list uses `feature`. The loop does that for every product task.

Section answers:

| Section | What to write |
| --- | --- |
| Problem | The task line from `docs/STATUS.md`. |
| Solution | One line: this change implements that task. |
| Related | `feat/P-*` and the AC ids from the plan row. |
| How to test | `pnpm typecheck`, `pnpm lint`, and `pnpm test:unit`. `ci` runs the same checks. |
| Screenshots | `N/A` unless the diff changes UI. |
| Deploy impact | `None` unless env, migrations, flags, or breaking changes are real. |
| Review focus | What is risky. Say that P-08 and P-18 stay untouched. |

## Variables

| Variable | Default | Notes |
| --- | --- | --- |
| `BASE` | `master` | Never `staging` or `production`. Never infer the base from `origin/HEAD`. |
| `HEAD` | current `feat/P-*` branch | Refuse `master`, `staging`, `production`, and `chore/block-*`. |
| `TITLE` | `feat: P-*` | A short summary of the task is fine. Do not invent a product task id. |
| `TYPE` | `feature` for a product task | Exactly one label from the table above. |
| `DRAFT` | `false` | The loop turns on squash auto-merge after the PR exists. |

## Tooling

Use `gh` for GitHub. Pass the installation token or user auth through the environment, never as a git `-c` argument. Write the body to a temp file and pass `--body-file`. Do not inline the body.

```bash
gh pr create --repo neraant/Snapbug --base master --head "$HEAD" --title "$TITLE" --label "$TYPE" --body-file "$BODY_FILE"
```

The loop then enables squash auto-merge. A person does that only when they mean to.

## Flow

1. Read `.github/pull_request_template.md` and the task row in `docs/PLAN.md`.
2. Choose one type. Put its badge on the first line, then fill the template without dropping comments or headings.
3. Stop if a pull request for this head branch is already open, and return its URL.
4. Push only `HEAD:feat/P-*`. Never force-push. Never push `master`, `staging`, or `production`.
5. Create the pull request with that body and that one label.
6. Reply with the PR URL and nothing else.

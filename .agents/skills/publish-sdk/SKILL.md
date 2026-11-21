---
name: publish-sdk
description: Release the Snapbug widget SDK (`@neraant/snapbug`, `packages/sdk`) to npm. Bumps the version, runs every gate, opens the release PR, then publishes and tags after it is merged. Activate only via explicit /publish-sdk (never auto-invoke).
disable-model-invocation: true
---

# Publish the SDK to npm

Package: `@neraant/snapbug` in `packages/sdk`. All mechanical work is in one script:

```bash
.agents/skills/publish-sdk/scripts/release.sh <check | bump <patch|minor|major|X.Y.Z> | publish [--dry-run]>
```

| Command             | What it does                                                                                                                                                          | Changes anything?                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `check`             | typecheck, lint, unit tests, build, packs the tarball and inspects it, imports the packed ESM and CJS files in Node, checks the version is not on npm                 | Only rebuilds `dist`                                               |
| `bump <x>`          | `npm version <x> --no-git-tag-version` in `packages/sdk`                                                                                                              | Edits `packages/sdk/package.json`                                  |
| `publish --dry-run` | everything `publish` does up to `pnpm publish --dry-run`, git problems become warnings                                                                                | Nothing is uploaded, no tag                                        |
| `publish`           | requires `master` == `origin/master`, clean tree, npm login; runs all gates, `pnpm publish --access public`, checks the registry, creates and pushes tag `sdk-vX.Y.Z` | Publishes. **Irreversible** (npm does not allow reusing a version) |

`pnpm publish` applies `publishConfig` (the repo's `exports` point to `src/` for development; the published package points to `dist/`). Never use `npm publish` here and never edit `exports`.

## Rules

- Never push `master`, `staging`, or `production`. The version bump goes through a pull request. Only the tag is pushed directly.
- Never publish without the person confirming the exact version in this chat. A dry run is always fine.
- Never pass `--force`, never skip gates, never publish from a branch other than `master`.
- Never put an npm token in a command line or in the repo. Auth comes from `npm login` or `~/.npmrc`. If `npm whoami` fails, stop and ask the person to log in (2FA prompts must be answered by them).
- If a command fails, stop and report the failure. Do not work around it.

## Flow

### 1. Decide the version

1. Find what changed since the last SDK release: `git log --oneline sdk-v<last>..HEAD -- packages/sdk` (if no tag exists yet, use `git log --oneline -- packages/sdk`). Check that the SDK was actually touched; if not, stop and say so.
2. Choose the bump by semver for the public API (`snapbug.init`, `identify`, options, the global `Snapbug` build): breaking change → `major` (while `0.x`: `minor`), new option or feature → `minor`, fix only → `patch`.
3. Ask the person to confirm the version (for example `0.1.0 → 0.1.1`). Wait for the answer.

### 2. Check, without changes

```bash
.agents/skills/publish-sdk/scripts/release.sh check
```

Read the warnings. A warning about a missing `LICENSE` file means `packages/sdk/LICENSE` has to be added (the package says MIT); tell the person, do not invent a license holder. A `check` failing with "already on npm" is expected before the bump.

### 3. Release branch and PR

```bash
git switch master && git pull --ff-only
git switch -c chore/sdk-release-<X.Y.Z>
.agents/skills/publish-sdk/scripts/release.sh bump <X.Y.Z>
.agents/skills/publish-sdk/scripts/release.sh check      # must pass with the new version
git add packages/sdk/package.json
git commit -m "chore: release @neraant/snapbug <X.Y.Z>"
git push -u origin chore/sdk-release-<X.Y.Z>
```

Open the PR into `master` with `gh`, label `chore`, the body from `.github/pull_request_template.md` (Problem: release `@neraant/snapbug` X.Y.Z; Solution: version bump; How to test: `release.sh check`; Deploy impact: publishes to npm after merge). The `pr-create` skill is for `feat/P-*` branches, so do not use it here. Stop and tell the person to merge it. Do not enable auto-merge.

### 4. Publish after the merge

When the person says the PR is merged:

```bash
git switch master && git pull --ff-only
.agents/skills/publish-sdk/scripts/release.sh publish --dry-run   # last look, must show no warnings except LICENSE
```

Show the dry-run summary (version, file list, size) and ask for the final "publish" confirmation. Then:

```bash
.agents/skills/publish-sdk/scripts/release.sh publish
```

If npm asks for a one-time password, the person types it in the terminal.

### 5. Report

Reply with: the published version, the registry URL `https://www.npmjs.com/package/@neraant/snapbug`, the tag `sdk-vX.Y.Z`, and any warnings. Mention that the CDN build is at `https://unpkg.com/@neraant/snapbug@X.Y.Z/dist/snapbug.global.js`.

## If something goes wrong

- **Publish failed before upload** (auth, network, 2FA): nothing changed on npm. Fix the cause and rerun `publish`.
- **Published but the tag failed**: create it by hand: `git tag -a sdk-vX.Y.Z -m "Release @neraant/snapbug X.Y.Z" && git push origin sdk-vX.Y.Z`.
- **A bad version is live**: do not unpublish. Fix forward with a new patch release; if it must be hidden, `npm deprecate @neraant/snapbug@X.Y.Z "<reason>"` after the person confirms.

#!/usr/bin/env bash
# Release helper for @neraant/snapbug (packages/sdk).
# Usage:
#   release.sh check                      all gates, no version change, no publish
#   release.sh bump <patch|minor|major|X.Y.Z>   bump packages/sdk/package.json only
#   release.sh publish [--dry-run]        gates + git checks + npm publish + tag
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
SDK="$ROOT/packages/sdk"
PKG="@neraant/snapbug"
# Outside packages/sdk on purpose: inside it, Node self-resolves the package name to src/.
TMP="$ROOT/.release-tmp"
WARNINGS=()

say()  { printf '\n==> %s\n' "$*"; }
ok()   { printf '  ok    %s\n' "$*"; }
warn() { printf '  WARN  %s\n' "$*"; WARNINGS+=("$*"); }
die()  { printf '  FAIL  %s\n' "$*" >&2; exit 1; }

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

version() { node -p "require('$SDK/package.json').version"; }

registry_has() { # returns 0 published, 1 not published, 2 unknown (network)
  local out
  if out=$(npm view "$PKG@$1" version 2>&1); then return 0; fi
  if grep -q "E404" <<<"$out"; then return 1; fi
  return 2
}

gates() {
  cd "$ROOT"
  say "Quality gates"
  pnpm --filter "$PKG" typecheck >/dev/null && ok "typecheck"
  pnpm --filter "$PKG" lint >/dev/null && ok "lint"
  pnpm --filter "$PKG" test:unit >/dev/null && ok "unit tests"

  say "Build"
  pnpm --filter "$PKG" build >/dev/null
  for f in index.js index.cjs index.d.ts snapbug.global.js; do
    [ -s "$SDK/dist/$f" ] || die "dist/$f is missing or empty"
  done
  ok "dist has index.js, index.cjs, index.d.ts, snapbug.global.js"

  say "Package contents"
  rm -rf "$TMP"; mkdir -p "$TMP/pack" "$TMP/node_modules/@neraant"
  (cd "$SDK" && pnpm pack --pack-destination "$TMP/pack" >/dev/null)
  local tgz; tgz=$(ls "$TMP"/pack/*.tgz)
  tar -xzf "$tgz" -C "$TMP/pack"
  mv "$TMP/pack/package" "$TMP/node_modules/@neraant/snapbug"
  local P="$TMP/node_modules/@neraant/snapbug"
  # Runtime deps are resolved from the SDK install, as a consumer would get them.
  for d in "$SDK"/node_modules/*; do
    n=$(basename "$d"); [ "$n" = "@workspace" ] && continue
    [ -e "$TMP/node_modules/$n" ] || ln -s "$d" "$TMP/node_modules/$n"
  done

  node - "$P" <<'JS' || die "published package.json is wrong (see above)"
const fs = require("fs");
const root = process.argv[2];
const pkg = JSON.parse(fs.readFileSync(`${root}/package.json`, "utf8"));
const errors = [];
const text = JSON.stringify(pkg);
if (text.includes("workspace:")) errors.push("a workspace: dependency leaked into the tarball");
if (text.includes("./src/")) errors.push("package.json still points to ./src (publishConfig was not applied)");
for (const field of ["main", "module", "types"]) {
  if (!pkg[field]) errors.push(`missing "${field}"`);
  else if (!fs.existsSync(`${root}/${pkg[field]}`)) errors.push(`"${field}" -> ${pkg[field]} does not exist`);
}
const entry = pkg.exports?.["."];
if (!entry?.import || !entry?.require || !entry?.types) errors.push('exports["."] needs import, require, types');
for (const target of Object.values(entry ?? {})) {
  if (typeof target === "string" && !fs.existsSync(`${root}/${target}`)) errors.push(`exports target ${target} does not exist`);
}
if (pkg.unpkg && !fs.existsSync(`${root}/${pkg.unpkg}`)) errors.push(`unpkg ${pkg.unpkg} does not exist`);
for (const dep of Object.keys(pkg.dependencies ?? {})) {
  if (dep.startsWith("@workspace/")) errors.push(`runtime dependency ${dep} must be bundled, not listed`);
}
if (errors.length) { for (const e of errors) console.error("  - " + e); process.exit(1); }
JS
  ok "package.json: main/module/types/exports/unpkg resolve, no workspace: leak"

  if [ -e "$P/src" ]; then die "src/ is in the tarball"; fi
  ok "no src/ in tarball"
  [ -f "$P/README.md" ] || die "README.md is not in the tarball"
  ok "README.md included"
  [ -f "$P/LICENSE" ] || warn "LICENSE is not in the tarball (package.json says MIT; add packages/sdk/LICENSE)"

  say "Import smoke test (from the packed tarball)"
  if (cd "$TMP" && node --input-type=module -e "const m = await import('@neraant/snapbug'); if (!m.snapbug) throw new Error('no snapbug export'); console.log('  ok    esm import, exports:', Object.keys(m).join(', '))") 2>"$TMP/esm.err"; then :; else warn "ESM import failed in Node: $(grep -m1 -E "Error|Cannot" "$TMP/esm.err") (the widget targets the browser; check it is only a missing DOM global)"; fi
  if (cd "$TMP" && node -e "const m = require('@neraant/snapbug'); if (!m.snapbug) throw new Error('no snapbug export'); console.log('  ok    cjs require')") 2>"$TMP/cjs.err"; then :; else warn "CJS require failed in Node: $(grep -m1 -E "Error|Cannot" "$TMP/cjs.err")"; fi

  say "Version"
  local v; v=$(version)
  ok "packages/sdk version is $v"
  local rc=0; registry_has "$v" || rc=$?
  case $rc in
    0) die "$PKG@$v is already on npm. Run: release.sh bump <patch|minor|major>" ;;
    1) ok "$PKG@$v is not on npm yet" ;;
    *) warn "could not reach the npm registry; version uniqueness not verified" ;;
  esac
}

summary() {
  if [ ${#WARNINGS[@]} -gt 0 ]; then
    printf '\nWarnings (%d):\n' "${#WARNINGS[@]}"
    for w in "${WARNINGS[@]}"; do printf '  - %s\n' "$w"; done
  fi
}

cmd="${1:-}"; shift || true
case "$cmd" in
  check)
    gates; summary; say "check passed (nothing was changed or published)"
    ;;
  bump)
    arg="${1:-}"; [ -n "$arg" ] || die "usage: release.sh bump <patch|minor|major|X.Y.Z>"
    cd "$SDK"
    old=$(version)
    npm version "$arg" --no-git-tag-version >/dev/null
    new=$(version)
    [ "$old" != "$new" ] || die "version did not change"
    printf '%s -> %s\n' "$old" "$new"
    ;;
  publish)
    dry=false; [ "${1:-}" = "--dry-run" ] && dry=true
    cd "$ROOT"
    say "Git state"
    branch=$(git branch --show-current)
    [ "$branch" = "master" ] || { $dry && warn "not on master ($branch); a real publish requires master" || die "publish only from master (on $branch)"; }
    if [ -n "$(git status --porcelain)" ]; then
      $dry && warn "working tree is not clean; a real publish requires a clean tree" || die "working tree is not clean"
    else ok "working tree clean"; fi
    git fetch origin master --quiet 2>/dev/null || warn "git fetch failed"
    if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/master 2>/dev/null || echo none)" ]; then
      $dry && warn "HEAD is not origin/master" || die "HEAD is not origin/master; merge the release PR and pull first"
    else ok "HEAD == origin/master"; fi

    gates
    v=$(version); tag="sdk-v$v"
    git rev-parse -q --verify "refs/tags/$tag" >/dev/null && { $dry && warn "tag $tag already exists" || die "tag $tag already exists"; }

    if $dry; then
      say "pnpm publish --dry-run (nothing is uploaded)"
      (cd "$SDK" && pnpm publish --dry-run --no-git-checks --access public 2>&1 | tail -20)
      summary; say "dry run finished: nothing was published, no tag was created"
      exit 0
    fi

    say "npm auth"
    npm whoami >/dev/null 2>&1 || die "not logged in to npm. Run: npm login (or set NPM_TOKEN in ~/.npmrc)"
    ok "logged in as $(npm whoami)"

    say "Publishing $PKG@$v"
    (cd "$SDK" && pnpm publish --no-git-checks --access public)
    ok "published $PKG@$v"

    say "Verifying on the registry"
    for i in 1 2 3 4 5; do registry_has "$v" && break; sleep 3; done
    registry_has "$v" && ok "$PKG@$v is visible on npm" || warn "not visible on npm yet; check manually"

    say "Tagging"
    git tag -a "$tag" -m "Release $PKG@$v"
    git push origin "$tag"
    ok "pushed tag $tag"
    summary
    ;;
  *)
    sed -n 2,7p "${BASH_SOURCE[0]}"; exit 2 ;;
esac

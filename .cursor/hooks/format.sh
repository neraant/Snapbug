#!/usr/bin/env bash
# Formats the file the agent just edited. Import order comes from ESLint
# (simple-import-sort); Prettier handles the rest. Stdout stays valid hook JSON.

input=$(cat)

export PATH="/usr/local/bin:/opt/homebrew/bin:${PATH:-/usr/bin:/bin}"

if ! command -v node >/dev/null 2>&1; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    # shellcheck disable=SC1091
    . "$NVM_DIR/nvm.sh"
  fi
fi

finish() {
  printf '%s\n' '{}'
  exit 0
}

if ! command -v node >/dev/null 2>&1 || ! command -v pnpm >/dev/null 2>&1; then
  finish
fi

file=$(printf '%s' "$input" | node -e '
let raw = "";
process.stdin.on("data", (chunk) => {
  raw += chunk;
});
process.stdin.on("end", () => {
  try {
    const payload = JSON.parse(raw);
    const path = payload.file_path || payload.path || payload.filePath || "";
    process.stdout.write(String(path));
  } catch {
    process.stdout.write("");
  }
});
')

if [[ -z "$file" || ! -f "$file" ]]; then
  finish
fi

case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.mts | *.cts) ;;
  *) finish ;;
esac

root=$(pwd)
dir=$(dirname "$file")
eslint_dir=""

while true; do
  if [[ -f "$dir/eslint.config.js" ]]; then
    eslint_dir="$dir"
    break
  fi
  if [[ "$dir" == "$root" || "$dir" == "/" ]]; then
    break
  fi
  dir=$(dirname "$dir")
done

# Skip unused-import removal. The hook runs after each edit, including ones
# where an import is written before the code that uses it.
if [[ -n "$eslint_dir" ]]; then
  (cd "$eslint_dir" && pnpm exec eslint --fix --rule 'unused-imports/no-unused-imports: off' "$file") >/dev/null 2>&1 || true
fi

(cd "$root" && pnpm exec prettier --write "$file") >/dev/null 2>&1 || true

finish

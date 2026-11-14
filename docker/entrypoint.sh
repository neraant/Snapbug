#!/bin/sh
set -eu

pnpm --filter @workspace/database db:migrate

exec pnpm --filter @workspace/web start

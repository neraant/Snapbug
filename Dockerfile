FROM node:22-bookworm-slim

RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/server/package.json packages/server/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/validation/package.json packages/validation/package.json
COPY packages/design-system/package.json packages/design-system/package.json
COPY packages/analytics/package.json packages/analytics/package.json
COPY packages/sdk/package.json packages/sdk/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @workspace/web build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "--filter", "@workspace/web", "start"]

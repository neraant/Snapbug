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

# `next build` imports the server container, which parses these immediately.
ARG DATABASE_URL=postgres://postgres:postgres@postgres:5432/snapbug
ARG AUTH_SECRET=dev-auth-secret-change-me
ARG RESEND_API_KEY=re_local_placeholder
ARG EMAIL_FROM=noreply@snapbug.com
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000

ENV DATABASE_URL=$DATABASE_URL \
    AUTH_SECRET=$AUTH_SECRET \
    RESEND_API_KEY=$RESEND_API_KEY \
    EMAIL_FROM=$EMAIL_FROM \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NODE_ENV=production

RUN pnpm --filter @workspace/web build

EXPOSE 3000

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

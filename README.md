# Snapbug

pnpm + Turborepo with Next.js apps and a shared design system.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4 + shadcn in `packages/design-system`
- pnpm workspaces + Turborepo

## Structure

```text
apps/
  customer/                    # Next.js customer app  →  http://localhost:3000
  admin/                       # Next.js admin app     →  http://localhost:3001
packages/
  design-system/          # UI, theme, forms (shadcn)
  eslint-config/          # shared ESLint
  typescript-config/      # shared tsconfig
```

- `apps/` — runnable products (add `apps/admin` the same way as `web`)
- `packages/` — shared libraries, not deployed on their own

Inside the design system and from apps use `@workspace/design-system/...` (package `exports`).

## Setup

```bash
pnpm install
pnpm dev
```

App: http://localhost:3000
Admin: http://localhost:3001

Install and scripts always run from this repo root.

```bash
# dependency for one package
pnpm add react-hook-form --filter @workspace/design-system
pnpm add lucide-react --filter web
```

## Scripts

| Command                 | What         |
| ----------------------- | ------------ |
| `pnpm dev`              | all apps     |
| `pnpm --filter web dev` | only web     |
| `pnpm build`            | all packages |
| `pnpm lint`             | ESLint       |
| `pnpm format`           | Prettier     |
| `pnpm typecheck`        | TypeScript   |

Add a shadcn component from `packages/design-system` (`components.json` lives there), not from `apps/web`.

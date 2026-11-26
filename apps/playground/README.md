# @workspace/playground

A standalone test stand: a signup form with the `@neraant/snapbug@0.2.0` SDK installed from npm (not the workspace version). The widget sends reports to a real Snapbug instance, so they are saved as tickets in its database. The form contains intentional bugs.

## Structure

Built like `apps/web`: Next.js 16 (App Router), React 19, Tailwind 4, `@workspace/design-system`, `react-hook-form` with `zod`.

```text
src/
  app/                       # layout, page, api/signup/route.ts
  client/modules/            # signup, sdk, shared
  shared/                    # public env schema, signup schema and constants (client and route)
```

## Run

1. Start Snapbug (`pnpm --filter @workspace/web dev`, http://localhost:3000).
2. `pnpm --filter @workspace/playground dev` and open http://localhost:3001.
3. Paste a project API key into the playground, or open the playground from Snapbug SDK setup (`/sdk`). The key stays in this browser (`localStorage`). If the project’s allowed domains list is not empty, add the playground host (`localhost:3001`) before sending a report.
4. Copy `.env.local` from `.env.example` only when Snapbug is not at `http://localhost:3000`.

## Environment variables

| Variable                   | Default                                       |
| -------------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_SNAPBUG_HOST` | `http://localhost:3000`, the Snapbug instance |

The project API key is not an environment variable. Pass it in the page, or open `http://localhost:3001/#apiKey=...`. The playground reads that fragment in the browser, stores the key, and removes the hash from the address bar.

## Backend

One route, `POST /api/signup`. It validates the body with `signupInputSchema` (shared with the form), keeps users in memory, and returns `201 { user }`, `422 { error: "validation_failed", fields }`, or `200 { error: "email_taken" }`. There is no database.

## Planted bugs

These bugs are intentional, for testing the Snapbug widget. Do not fix them.

1. A valid email with `+` or a subdomain (`a+b@mail.example.com`) is rejected.
2. A submit error is swallowed: a name longer than 80 characters gets a `422`, which is logged to the console, and success is still shown.
3. The "About you" textarea loses focus and the caret while typing.
4. The Markdown preview differs from the saved text.
5. Off-by-one in the password length check: exactly 8 characters is rejected.
6. A double click on "Create account" creates duplicate users.
7. The API answers `200` with an error in the body when the email is taken.
8. The date of birth shifts one day back.

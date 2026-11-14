# Snapbug — status

Draft as of 9 November 2026. Checked against the code and the unit tests, not against a stand run.

Do not start tasks marked TBD: an implementer agent must not take them.

## Done

- A pnpm and Turborepo monorepo, one app `apps/web`, the server in `packages/server`, schemas in `packages/database`, DTOs in `packages/validation`, the widget in `packages/sdk`.
- Registration, password check, bcrypt hash: `packages/server/src/modules/auth`. Tests `sign-up.test.ts`, `verify-credentials.test.ts`. Auth.js sessions: `apps/web/src/app/api/auth/[...nextauth]/route.ts`.
- Onboarding creates the organization and the project: `complete-onboarding.use-case.ts`, test `complete-onboarding.test.ts`. Several organizations and the switcher already exist.
- A member's access to a subset of the organization's projects already exists (`project_accesses`).
- Invitation and acceptance: `packages/server/src/modules/invitation`, tests `send-invitation.test.ts`, `accept-invitation.test.ts`. Mail goes through Resend. An invitation expires after 7 days, and an expired one is not accepted.
- Roles `admin` and `member`. Only an administrator can change a role and remove a member: `membership.router.ts`, tests `update-membership-role.test.ts`, `remove-membership.test.ts`.
- An administrator creates and renames a project and sets the color at create. Widget domains and privacy live in `widget_settings`. Origin check: `create-bug-report.test.ts`.
- The project key is created on first read. A revoked key does not resolve: `find-project-by-key.test.ts`.
- Ticket ingest with screenshot, replay, logs, and User-Agent parsing: `create-bug-report.use-case.ts`, test `create-bug-report.test.ts`.
- SDK: button, Alt+S, console, network, rrweb for 30 s, gzip, a `modern-screenshot` screenshot, annotations. Tests in `packages/sdk/src/**/*.test.ts`. The widget always shows the optional email field.
- Overview, kanban with columns New, In progress, Fixed, and Closed, in-browser filters, a card with screenshot, logs, environment, and rrweb-player, and changes of status, severity, and assignee. An SDK page with the snippet and the ingest status. Screens in `apps/web/src/app/(app)`.
- Isolation of someone else's ticket and project in the ticket procedures: `find-bug-reports.test.ts`, `find-one.use-case.test.ts`, `find-screenshot.use-case.test.ts`, `find-replay.use-case.test.ts`.
- A Vercel Blob adapter exists. Without `BLOB_READ_WRITE_TOKEN` nothing is written to Blob.
- Password reset, analytics (`packages/analytics`), and the widget theme are already in the code and stay in the product.
- A playground screen exists (`apps/web/src/app/(app)/playground`) and stays in the product.
- Audit of some changes to a project, a key, a ticket, and project access: `packages/server/src/shared/audit`.
- Postgres in `docker-compose.yaml`. Drizzle migrations in `packages/database/src/migration`. Seed of text tickets: `packages/database/src/seed`.
- Retention is one organization column, `reports_retention_days`. There is no project-level retention.
- P-01 a session must not return the password hash or a membership in another organization.
- P-02 administrator-only invitations, domains, masking, and key rotation. Rotation issues a new key, stops the previous key immediately, and shows the new secret once.
- P-03 MCP through a normal client and a user token. A project key is not accepted. Tools are `list_tickets`, `get_ticket`, `get_screenshot`, and `update_ticket`. The secret is shown once and can be revoked.
- P-04 comments, and the `add_comment` tool. No replay tool.
- P-06 organization settings on a screen: name and the one retention period.
- P-09 ticket files in Vercel Blob; `docker compose` starts the app and Postgres.

## Open

- P-07 the activity log for every application-object change: who, when, which object, and what changed.
- P-10 screenshot and replay files in the seed, stored in Blob.
- P-11 an ingest rate limit.
- P-12 a hashed invitation token.
- P-13 passwords always masked.
- P-14 reproduction steps on the form.
- P-15 an end-to-end run.
- P-16 interface language: English and Russian only, with a switch in settings.
- P-17 Playground must not create tickets in the main ticket list or write primary ticket files or other production records. Before writing code, choose an approach — isolated data, a separate project, or an equivalent — then implement it.
- P-19 global search for tickets and projects, limited to the member's project access.
- P-20 acceptance of the terms on registration.
- P-21 project archive and restore, delete, default assignee, store IP, collect visitor email, color, and slug.
- P-22 invitation resend, revoke, and copy link. Expiry after 7 days already rejects acceptance.
- P-23 require 2FA, one invite email domain, GDPR mode, and delete workspace. Administrator only.
- P-24 error responses that return the real status, including 400, 401, 403, 404, 500, and any other real code. The error screen always shows 500.

## TBD

Do not start tasks marked TBD: an implementer agent must not take them.

- P-08 TBD. Cleanup by the organization retention period, including the screenshot and the replay. Not in the current implementation scope. An implementer must not start this task.
- P-18 TBD. A Jira connection is in the product. The detailed behavior is not specified. An implementer must not start this task.

Retired id; do not reuse: P-05.

## Waiting for an answer

None.

## Blocked

None.

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
- P-09 ticket files in Vercel Blob.
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
- P-07 the activity log for every application-object change: who, when, which object, and what changed.
- P-27 the activity log table matches the rest of the app and the design system.
- P-10 screenshot and replay files in the seed, stored in Blob.
- P-11 an ingest rate limit.
- P-12 a hashed invitation token.
- P-13 passwords always masked.
- P-14 reproduction steps on the form.
- P-16 interface language: English and Russian only, with a switch in settings.
- P-15 an end-to-end run.
- P-17 Playground is a sample customer page with the real widget. Submit stays on the page and shows the captured screenshot, replay, environment, and logs. Nothing is written to the database or to Blob.
- P-19 global search for tickets and projects, limited to the member's project access.
- P-20 acceptance of the terms on registration.
- P-21 project archive and restore, delete, default assignee, store IP, collect visitor email, color, and slug.
- P-22 invitation resend, revoke, and copy link. Expiry after 7 days already rejects acceptance.
- P-25 ticket comments sit at the bottom of the card, read like a Jira thread, and the author can edit or delete their own comment.
- P-26 an MCP user token has a name. The list shows that name, when it was created, and revoke. The secret is shown once.
- P-28 the settings screen matches the rest of the app and the design system. Language copy appears once; English / Russian is a two-option switch that saves on change (no Save). Organization name and retention keep Save.
- P-29 playground sample is a mock customer checkout; after submit the capture uses the ticket-card layout (description, screenshot, replay, diagnostics, environment sidebar). No comments or ticket properties. Submit still writes nothing.
- P-30 Actions with real consequences ask for confirmation through one shared `ConfirmDialog`: revoke token, remove member, role change, revoke invitation, rotate key, archive, delete project (typed name), delete comment. Harmless actions do not ask. Brief with the expected UI/UX: `docs/tasks/P-30.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-31 The one-time secret dialog (new MCP token, rotated project key) is a polished shared dialog: warning, masked field with reveal and copy, usage snippet, Done. Brief with the expected UI/UX: `docs/tasks/P-31.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-32 The activity page loads on scroll (cursor pagination, no Load more), shows a minimal table (when, actor, event sentence, object type), and a click on a row opens a detail sidebar with summary and before/after changes, kept in the URL. Brief with the expected UI/UX: `docs/tasks/P-32.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-33 The Team page has two tabs, Members and Invitations. The pending-invitations table lives only on the Invitations tab. The tab is kept in the URL. Brief with the expected UI/UX: `docs/tasks/P-33.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-34 Invitation flow is reworked around a public page `/invite/[token]` that handles a new user, an existing user, a signed-in user, a wrong account, an existing member, and an expired or revoked invitation, with no dead ends. Brief with the expected UI/UX: `docs/tasks/P-34.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-35 Project settings sheet has a scrolling body, a pinned Save footer, and the Danger zone at the bottom of the body as a quiet bordered block with Archive/Restore and Delete rows. Brief with the expected UI/UX: `docs/tasks/P-35.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-36 Project card is rebuilt: avatar, name, slug, ticket stats, member stack, one click target, and an archived state shown as a card-top strip with de-emphasis instead of a badge by the title. Brief with the expected UI/UX: `docs/tasks/P-36.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-37 Settings are split into tabs (Profile, Organization, Access tokens), each built from one shared settings-section layout with identical padding and no mixed cards. Brief with the expected UI/UX: `docs/tasks/P-37.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-38 Ticket comments read like Jira: avatar, author, relative time, rendered body, icon actions for the author only, inline edit, a collapsing composer at the bottom, delete asks for confirmation. Brief with the expected UI/UX: `docs/tasks/P-38.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-39 Playground is a guided two-pane page: a browser-framed sample checkout and a result panel with tabs; empty state, steps, reset; still writes nothing. Brief with the expected UI/UX: `docs/tasks/P-39.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-40 Global search in the header is a fixed-size trigger with a shortcut hint that opens a centered command dialog with grouped, icon-rich results, a fixed result height, and keyboard navigation, with no layout jumps. Brief with the expected UI/UX: `docs/tasks/P-40.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-41 MCP exposes a deliberate catalog of tools chosen from the contracts by explicit include and exclude criteria, kept in one typed catalog file with LLM-ready descriptions, replacing the fixed five tools. Brief with the expected UI/UX: `docs/tasks/P-41.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-42 The MCP page shows the tools in a readable way: tabs Tools, Connect, Tokens; tool cards with read/write badges; a detail sheet with inputs and an example prompt; ready client configs. Brief with the expected UI/UX: `docs/tasks/P-42.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-43 An MCP token carries scopes (and optionally a project subset) chosen at creation with presets; a tool call needs both the scope and the owner's right. Brief with the expected UI/UX: `docs/tasks/P-43.md`. Read it first; shared rules are in `docs/tasks/README.md`.

## Open

- P-24 error responses that return the real status, including 400, 401, 403, 404, 500, and any other real code. The error screen always shows 500.
- P-44 Settings gain personal preferences: profile (name, password, time zone) and an Appearance tab (theme, accent, density, date format, motion, landing page, sidebar) with a live preview, saved on change. Brief with the expected UI/UX: `docs/tasks/P-44.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-45 Notifications part 1: an in-app notification model with defined types and recipient rules, written in the same transaction as the event, with list, unread count, mark read, and archive endpoints. Brief with the expected UI/UX: `docs/tasks/P-45.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-46 Notifications part 2: a bell with an unread badge in the header, a popover with Unread and All tabs, infinite scroll, per-item read state, and a full inbox page. Brief with the expected UI/UX: `docs/tasks/P-46.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-47 Notifications part 3: a Settings tab with per-type in-app and email switches, muted projects, an email digest option, and email delivery; security notifications are always on. Brief with the expected UI/UX: `docs/tasks/P-47.md`. Read it first; shared rules are in `docs/tasks/README.md`.
- P-48 Refactor: unit tests stay only for application use-cases; tests of utils, services, adapters, wiring, and anything in `apps/web` and `packages/design-system` are removed, with business rules moved into the owning use-case test. Brief: `docs/tasks/P-48.md`. Read it first; shared rules are in `docs/tasks/README.md`.

## TBD

Do not start tasks marked TBD: an implementer agent must not take them.

- P-08 TBD. Cleanup by the organization retention period, including the screenshot and the replay. Not in the current implementation scope. An implementer must not start this task.
- P-18 TBD. A Jira connection is in the product. The detailed behavior is not specified. An implementer must not start this task.
- P-23 TBD. Require 2FA, one invite email domain, GDPR mode, and delete workspace. Parked; an implementer must not start this task.

Retired id; do not reuse: P-05.

## Waiting for an answer

None.

## Blocked

None.

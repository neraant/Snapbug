# Task briefs (P-30 … P-53)

A brief is the detailed result description for one task in `docs/STATUS.md`. The STATUS line names the file: `docs/tasks/P-NN.md`. **Read the brief before you write code.** The brief says what the user sees and how it behaves. The brief wins over the one-line PLAN row when they differ in UI detail. A brief does not override `docs/SPEC.md` or `docs/decisions/`.

Briefs are UI/UX first. Where logic is needed (P-34) the brief says so explicitly.

## Execution order

Shared building blocks come first; later tasks reuse them.

1. P-30 confirmation dialogs (shared `ConfirmDialog`)
2. P-31 one-time secret dialog (shared `SecretRevealDialog`)
3. P-32 activity log
4. P-33 team tabs
5. P-34 invitation rework
6. P-35 project settings sheet
7. P-36 project card
8. P-37 settings page
9. P-38 ticket comments
10. P-39 playground
11. P-40 global search
12. P-41 MCP tool catalog
13. P-42 MCP page with tools
14. P-43 MCP token scopes
15. P-44 settings: profile and appearance
16. P-45 notifications: backend
17. P-46 notifications: bell and inbox
18. P-47 notifications: preferences and email
19. P-48 refactor: unit tests only for use-cases (independent, may run first or last)
20. P-49 settings simplification and theme fix (after P-44, P-47)
21. P-50 ticket assignee, comments, token dialog
22. P-51 sidebar order, one table style, notification item (after P-49)
23. P-52 remove the retention setting (independent)
24. P-53 e2e coverage (last, after P-49 to P-51)

## Reference products

The target is the feel of **PostHog** and **Sentry** (data-dense tables, side panels, restrained chrome) and **Jira** (ticket thread). Do not copy their look. Copy the patterns:

| Pattern                                                                                | Reference                                         |
| -------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Table with minimal columns; click a row to open a detail side panel                    | Sentry Issues / Audit Log, PostHog Activity       |
| Infinite list that loads on scroll with an end-of-list marker                          | PostHog Activity log, Sentry Issues               |
| Settings split into tabs / left section nav, one card-less section per topic           | PostHog Project settings, Sentry Settings         |
| Danger zone at the bottom, separated, with typed confirmation for irreversible actions | Sentry project settings (Remove Project), PostHog |
| Secret shown once in a dialog with copy button and a warning                           | Sentry Auth Tokens, GitHub tokens                 |
| Comment thread with avatar, author, relative time, hover actions, inline editing       | Jira issue comments                               |

## Rules for every UI task

- Use only `@workspace/design-system` components (`components/ui`, `components/layout`, `components/forms`). Need a primitive that is missing (for example `Tabs`, `AlertDialog`)? Add it to `packages/design-system/src/components/ui/` in the same style (look at `dialog.tsx`, `sheet.tsx`, `segmented-control.tsx`), do not hand-roll it inside `apps/web`.
- No new visual language: existing tokens, spacing scale, `Typography` variants, `Badge`, `Card`, `Sheet`, `Table`. No hard-coded colors, no arbitrary pixel values when a token exists.
- One spacing rhythm per screen. Sections use the same horizontal padding, the same gap between blocks, the same header pattern (title + muted description, actions on the right).
- Every list/table has all four states: loading (`Skeleton`, no layout jump), empty (icon or `Mascot`, one sentence, one action if there is one), error (message + Retry), and filled.
- Every new string goes through the module `texts.const.ts` in **English and Russian** (P-16). No hard-coded text in components.
- Icon-only buttons have `aria-label` and a `Tooltip`. Destructive buttons use the `destructive` variant. Disabled/pending buttons show a spinner.
- Keyboard: Esc closes dialogs and sheets, focus is trapped inside, focus returns to the trigger. Rows that open a panel are focusable and open on Enter.
- Responsive: usable at 1280 px and 768 px; sheets become full width under 640 px.
- Toasts: one success toast after a mutation that has no other visible feedback. Errors are shown inline near the action and as a toast only when there is no inline place.
- Light and dark themes both checked.
- Tests: follow `.agents/rules/common/e2e.mdc`. A task that adds a user action or a page gets one e2e spec asserting role and visible text. No pixel or screenshot assertions.

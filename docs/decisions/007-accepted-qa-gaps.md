# ADR-007: Keep the accepted QA gaps

## Status

Accepted

## Date

2026-11-26

## Context

P-54 fixes the QA defects that have a clear expected behavior. Five of them are product choices, not bugs: sign-up already tells the person the email is taken (D-11), SDK Setup is empty for “All projects” (D-13), project API keys live on `/sdk` (D-14), the actor is not notified for their own UI actions (D-15), and the widget snippet uses `host: 'https://your-app.com'` (D-28).

## Options Considered

### Option A: Change each one now

- Pros: the screens look more complete
- Cons: D-11 cannot be both private and immediately session-creating; a shared sign-up response would block a new user or leak the account through the redirect. D-13 would invent a second project picker. D-14 would restore a settings tab that P-49 removed. D-15 would notify people for actions they just performed. D-28 would put the Snapbug ingestion host in a field that means the customer app origin.

### Option B: Keep the current behavior and write it down

- Pros: later work does not reopen these as defects
- Cons: the empty SDK state and the placeholder host still need the copy that is already on the page

## Decision

Keep the current behavior.

1. Sign-up still says the email is already taken. Sign-up creates a session immediately, so a shared response cannot hide the account without also blocking a new user.
2. SDK Setup stays empty until a project is selected. Keys belong to one project. A selected project, by slug or id, still shows setup (D-19).
3. Project API keys stay on `/sdk`. Settings does not grow a keys tab.
4. The actor is not notified for their own UI actions. Tickets created through ingest still notify.
5. The snippet `host` stays the customer-app placeholder `https://your-app.com`. It is not the Snapbug ingestion host.

## Consequences

P-54 does not change these five flows. A later task that wants a different behavior replaces this decision first.

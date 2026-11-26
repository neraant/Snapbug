# E2E seed

Helpers that write saved records a spec needs (tickets, projects, members). Add one only when a flow needs data; specs call the helper and do not import `packages/database` directly.

- `seed-database.ts` loads the shared demo data (Acme, admin, alice, bob, projects, tickets). Re-seeding restores seed user passwords and seed ticket status.
- `seed-unread-notification.ts` adds one unread notification for the signed-in admin.
- `seed-access.ts` adds the records the unhappy-path specs need after `seedDatabase()`: another organization and its ticket, a long ticket description, a pending and an expired reset token, a read-only MCP token, a revoked MCP token, and an allow-list on the marketing project widget. It also answers small lookups (`resetTokenExists`, `readTicket`, `countTicketsByTitle`, `countInvitations`) so a spec can check the database without importing it. The command prints one JSON object on the last stdout line.

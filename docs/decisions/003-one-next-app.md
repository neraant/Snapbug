# ADR-003: One Next.js app

## Status

Accepted from the repository tree. There is one app, `apps/web`. The README does not match the tree.

## Date

2026-11-09

## Context

The dashboard, oRPC, OpenAPI, and MCP live next to the session.

## Options

- One `apps/web`: pages, `/api/rpc`, `/api/[[...rest]]`, `/api/mcp`, `/api/auth`.

## Decision

One app, `apps/web`. The administrator role is the `(admin)` route group and `adminMiddleware`. MCP is `POST /api/mcp` inside this app. Shared UI is `packages/design-system`.

## Consequences

The README does not match the tree: one app, `apps/web`. Cleanup by retention period is a product gap (P-08). Ticket files are stored in Vercel Blob (P-09).

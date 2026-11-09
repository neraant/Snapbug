# ADR-001: Vertical slices on the server

## Status

Accepted. Recorded from the code and `.agents/rules/backend/overview.mdc`, not as a new decision.

## Date

2026-11-09

## Context

Server scenarios live in `packages/server`. One context's behavior must change in one place, and SQL must not be pulled into the transport.

## Options

- Horizontal layers `controllers/`, `services/`, `repositories/` across the whole server.
- A vertical slice `modules/{context}/` with the chain contract → router → container → use-case.

## Decision

One slice per context. An endpoint is `application/{verb}.use-case.ts`, the same verb in the contract and the router, wired in `src/container.ts`. The router only calls `container.{context}.{verb}.execute`. Policy errors are an `AppError` in the use-case. Invariants with no I/O belong to the entity. Hashing and calculations belong to the service. Writing and reading its own aggregate is one repository. `AuditLogService` writes a state-change audit from the service, in the same transaction.

## Consequences

A new endpoint touches the contract, the router, the container, and the use-case. Lower layers do not import oRPC. Zod comes from `@workspace/validation`.

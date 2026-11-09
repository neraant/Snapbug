# ADR-002: Singular names

## Status

Accepted. The rule is `.agents/rules/common/naming.mdc`.

## Date

2026-11-09

## Context

Names drift easily in a monorepo: a folder `users`, a class `UserRepository`, a file `users.repository.ts`.

## Options

- Plural for folders and for table modules.
- Singular for folders, files, and symbols; plural only for the SQL table and for local arrays.

## Decision

A module folder is a bounded context (`identity`, `auth`). A file is named after the aggregate plus a suffix: `.router.ts`, `.contract.ts`, `.use-case.ts`, `.repository.ts`, `.service.ts`, `.entity.ts`, `.port.ts`, `.adapter.ts`. The file name matches the export. The Drizzle export is `userTable`; SQL is `pgTable("users")`. The router registry is `router.auth`.

App aliases: `@/*` points at the app `src/`. Packages are only `@workspace/{package}`. Do not introduce `@/design-system` or `@server`. Do not rename Next files (`page`, `layout`, `route`, `auth.ts`).

## Consequences

App examples in the naming rule must point at the single app `apps/web`.

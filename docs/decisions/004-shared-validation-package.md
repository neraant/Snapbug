# ADR-004: Shared schemas in packages/validation

## Status

Accepted. The rules are backend/shared and frontend/schema.

## Date

2026-11-09

## Context

The SDK and the client share one type contract. Zod must not be duplicated.

## Options

- The `@workspace/validation` package: DTOs by context under `modules/{context}/dto`, shared fields in `src/shared`.

## Decision

Schemas and inferred types live in `@workspace/validation`. The oRPC contract in `packages/server` imports them and does not declare its own input or output. A client module imports the same schema. A screen form that does not exist on the server stays in that module. A field such as email is defined once and relaxed at the call site with `.optional()` or `.nullable()`.

## Consequences

A new path under `src/shared` needs an entry in the package `exports`.

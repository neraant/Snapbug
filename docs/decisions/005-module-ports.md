# ADR-005: Another module is reached only through a port

## Status

Accepted. `.agents/rules/backend/overview.mdc` and `port-adapter.mdc`.

## Date

2026-11-09

## Context

A ticket needs the project, the key, and the membership. Importing another module's repository couples the contexts and breaks the transaction boundary.

## Options

- A shared database layer, where any use-case reads any table.
- A port on the consumer and an adapter on the owner of the aggregate. The adapter calls its own use-case and returns that use-case's DTO.

## Decision

One aggregate has one repository. Data owned by another module arrives through a port. A use-case depends on the port type, not on the adapter. The adapter has no logic of its own. `withTx` is declared on the port when the call runs inside a transaction. Wiring lives in `container.ts`: one repository per aggregate, and the adapter is passed where a port is expected.

## Consequences

A consumer does not import another module's `*.entity.ts` or repository. A dependency between contexts is a port and a method, not SQL against another module's table.

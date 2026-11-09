# ADR-006: Client modules do not import one another

## Status

Accepted. `.agents/rules/frontend/overview.mdc`.

## Date

2026-11-09

## Context

Dashboard screens share the sidebar, queries, and cards. Importing components across features quickly creates cycles.

## Options

- One shared `components/` folder for the whole app.
- A module at `apps/web/src/client/modules/{context}/`. A page in `app/` composes modules. A module does not import a component from another module.

## Decision

`app/` holds only Next route files. UI, hooks, and constants live in the module. Queries live in `client/shared/queries` and go through oRPC. Copy lives in `consts`. An API field is not copied locally: the schema comes from `@workspace/validation`. Visual primitives come from `@workspace/design-system`, not from raw HTML and not from colors defined in the module. `"use client"` appears once: on the client page, or on the module entry file when the page is a server component.

A link inside a project keeps that project area's search params. The active menu item is decided from the pathname.

## Consequences

A piece shared by two screens is either duplicated as a small component or lifted into the design system. A page exports only `Page`.

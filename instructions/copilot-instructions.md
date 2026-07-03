# Copilot Instructions

You are working on ForgeMind.

This repository follows Clean Architecture.

## Golden Rules

Business logic must never depend on React.

Business logic must never depend on an AI provider.

Everything must use TypeScript strict mode.

Never use any.

Never expose raw FoE Helper JSON outside parser package.

Every package must have unit tests.

Every feature must compile.

Never add TODO implementations.

Never generate placeholder code.

---

## Architecture

React

↓

Application Layer

↓

Domain Layer

↓

Infrastructure

Dependencies point inward.

---

## AI

The LLM performs optimization.

The application orchestrates the workflow.

The application never contains optimization heuristics except validation.

---

## Validation

AI output must always be validated before visualization.

Validation includes

- JSON
- Schema
- Building overlap
- Bounds
- Connectivity
- Duplicate IDs

---

## Knowledge

Knowledge is stored as Markdown.

Never use a database.

Knowledge is selected dynamically.

---

## Renderer

React Konva

Never React Flow.

The renderer visualizes.

The renderer never contains business logic.

---

## Packages

Packages must be independent.

No circular dependencies.

---

## Commit Strategy

One feature per commit.

Every commit must compile.

Every commit must pass tests.
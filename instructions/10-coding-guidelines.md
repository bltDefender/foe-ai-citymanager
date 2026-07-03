# Coding Guidelines

## General

Production-quality code only.

No TODOs.

No placeholder implementations.

No generated dead code.

---

## TypeScript

Strict Mode

No any

Prefer readonly

Prefer discriminated unions

Use branded types where appropriate

---

## Architecture

React only inside UI.

Business logic never imports React.

Core owns all domain models.

Infrastructure depends on Core.

---

## State

Use Zustand.

Avoid unnecessary global state.

---

## Components

Small

Reusable

Single Responsibility

Pure when possible

---

## Styling

Mantine Components

Minimal custom CSS

No inline styles unless dynamic

---

## Testing

Every package has tests.

Parser tests

Analyzer tests

Validator tests

Renderer tests

Prompt Builder tests

---

## Naming

PascalCase

Components

camelCase

Variables

UPPER_CASE

Constants

---

## Imports

Absolute imports.

No circular dependencies.

---

## Logging

Structured logging.

No console.log.

---

## Errors

Typed errors.

Recover whenever possible.

Provide actionable error messages.

---

## Documentation

Public APIs documented.

Architecture decisions recorded.

Meaningful commit messages.
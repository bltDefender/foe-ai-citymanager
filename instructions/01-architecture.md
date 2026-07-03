# Architecture

## Philosophy

ForgeMind is an orchestration platform.

It is not an optimizer.

The optimizer is the AI.

---

## Layers

Presentation

↓

Application

↓

Domain

↓

Infrastructure

---

## Packages

apps/web

packages/core

packages/parser

packages/analyzer

packages/prompt-builder

packages/knowledge

packages/llm

packages/validator

packages/renderer

packages/project

packages/ui

packages/plugins

---

## Workflow

Import

↓

Parse

↓

Analyze

↓

Build Prompt

↓

Send to AI

↓

Validate

↓

Visualize

↓

Apply

---

## Plugins

Every external dependency is a plugin.

Examples

LLM Provider

Knowledge Provider

Export Provider

Import Provider

Heatmap Provider

Statistics Provider

Future MCP Provider

---

## Core

The core package owns

City

Building

Road

Statistics

Metadata

Nothing else may redefine these models.
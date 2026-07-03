# ForgeMind

> AI-powered analysis and optimization studio for Forge of Empires.

ForgeMind is an open-source desktop web application that imports FoE Helper city exports, analyzes city layouts, builds AI prompts, validates AI responses and visualizes optimization proposals.

The project intentionally separates the domain model, visualization and AI providers.

---

## Vision

ForgeMind is not another city planner.

ForgeMind is an AI-assisted engineering environment for Forge of Empires.

It should help players answer questions like:

- How can I reduce roads?
- Which buildings should I remove?
- How can I prepare for the next event?
- Which Great Building should I level next?
- What happens if I replace this building?
- Can I fit the new event building without expanding?

---

## Architecture

FoE Helper Export
↓
Parser
↓
Canonical City Model
↓
Analyzer
↓
Knowledge Builder
↓
Prompt Builder
↓
LLM Provider
↓
Validator
↓
Renderer

---

## Supported AI Providers

- OpenAI
- Anthropic
- Gemini
- OpenRouter
- Ollama
- LM Studio
- OpenAI Compatible APIs

---

## Main Goals

- provider independent
- modular
- plugin based
- production ready
- offline except AI calls
- fully typed
- open source quality

---

## Current Status

Sprint 1-4

- Project setup
- Parser
- Renderer
- Analyzer

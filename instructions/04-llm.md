# AI Architecture

## Philosophy

The AI is the optimizer.

ForgeMind is the orchestration platform.

Business logic prepares context.

The AI generates recommendations.

ForgeMind validates them.

---

# Workflow

City

↓

Analyzer

↓

Knowledge

↓

Prompt Builder

↓

LLM

↓

Validator

↓

Renderer

---

# Provider Abstraction

Every AI provider implements

ILLMProvider

Methods

connect()

listModels()

send()

stream()

cancel()

estimateTokens()

---

# Supported Providers

OpenAI

Anthropic

Gemini

OpenRouter

Ollama

LM Studio

OpenAI Compatible APIs

---

# Prompt Sections

System Prompt

Knowledge

Prompt Template

City

Analysis

Goals

Expected Response Schema

Conversation History

---

# Prompt Templates

Balanced

Attack

Forge Points

Space Saving

Goods

Experimental

Custom

---

# Response

AI shall always return JSON.

Never markdown.

Never natural language.

---

# Validation

Every response shall be validated.

Validation includes

Schema

Bounds

Overlap

Connectivity

Unknown IDs

Unknown Buildings

---

# Explainability

Every recommendation shall include

Reason

Priority

Confidence

Impact

Dependencies

---

# Conversation

Every optimization belongs to a conversation.

History shall be stored.

History is included in future prompts.

---

# Prompt Preview

The user shall always be able to inspect

System Prompt

Knowledge

Prompt

Expected Tokens

Expected Cost

---

# Multi Agent (Future)

Planner

Analyst

Reviewer

Validator

Reporter

Not implemented yet.

Architecture shall support it.
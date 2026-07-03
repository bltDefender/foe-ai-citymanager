# Plugin System

## Philosophy

Everything external is a plugin.

Core contains no provider-specific code.

---

# Plugin Types

LLM Provider

Knowledge Provider

Import Provider

Export Provider

Renderer Extension

Statistics Provider

Prompt Provider

Validator

Theme

---

# Lifecycle

Load

Initialize

Register

Activate

Deactivate

Unload

---

# Interfaces

Every plugin

has metadata

has version

declares capabilities

supports dependency injection

---

# Discovery

Plugins are discovered automatically.

Support

Local

NPM

Git Repository (future)

---

# Security

Plugins execute in isolated context where possible.

Plugins may request permissions.

Examples

Filesystem

Network

Clipboard

---

# Versioning

Semantic Versioning

Compatibility Check

Dependency Validation

---

# Future

Marketplace

Plugin Signing

Automatic Updates

Sandboxing
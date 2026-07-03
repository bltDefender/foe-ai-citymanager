# Requirements

## Functional Requirements

### Import

The application imports FoE Helper exports.

Supported versions shall be detected automatically.

---

### Parser

Convert FoE Helper export into a canonical model.

Never expose raw JSON.

---

### Renderer

Visualize

- Buildings
- Roads
- Empty tiles
- Heatmaps
- Selections
- Tooltips

---

### Analyzer

Calculate

- Road %
- Occupied %
- Empty %
- Largest rectangle
- Fragmentation
- Building density
- Road graph
- Connected components

---

### AI

The user selects

- Provider
- Model
- Prompt Template
- Knowledge Sources

The application builds the prompt.

---

### Validation

Validate every AI response.

Reject invalid layouts.

---

### Reports

Generate

Analysis

Optimization

Comparison

Summary

---

### Export

PNG

SVG

PDF

JSON

Prompt Package

Project File

---

### Settings

Support

Provider

Endpoint

API Key

Model

Profiles

Knowledge

Rendering

Developer

---

### History

Store

Prompt

Response

Validation

Timestamp

Provider

Model

Statistics

---

### Comparison

Support comparing multiple AI runs.

---

### Prompt Preview

Display generated prompt.

Display token estimate.

Allow copy.

---

### Response Viewer

Display

JSON

Markdown

Raw

Validation

Buttons

Copy

Download

Apply

Validate Again

---

## Non Functional Requirements

Strict TypeScript

Production Ready

Testable

Responsive

Offline First

Plugin Based

Provider Independent

Open Source Quality
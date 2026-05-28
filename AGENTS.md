## Project Context

This project is a local-first Markdown editor for Windows with a minimalist three-pane interface.

Core layout:

```text
| File List | Editor | Preview |
````

The MVP focuses on:

* Local Markdown file management
* Markdown editing and preview
* Minimal note-linking foundation
* Light and dark themes
* Clean and extensible architecture

This project is not intended to replicate all Obsidian features during the MVP phase.

Detailed requirements and specifications are documented separately:

```text
README.md
docs/PRD.md
docs/MVP_SPEC.md
docs/ARCHITECTURE.md
docs/DATA_MODEL.md
docs/STYLE_GUIDE.md
docs/TESTING.md
docs/CURRENT_STATUS.md
docs/TASK.md
```

---

# Primary Rules

## 1. Build Only Within MVP Scope

Always prioritize the MVP.

Do not implement features outside the current MVP scope unless explicitly requested.

Examples of out-of-scope features:

* Google Drive synchronization
* Plugin system
* Graph visualization
* Collaboration
* AI assistant features
* Mobile support
* Rich-text editor
* Complex backlink analytics

Before implementing a feature, verify whether it belongs to the MVP specification.

---

## 2. Avoid Overengineering

Prefer simple and maintainable solutions.

Avoid introducing unnecessary complexity such as:

* premature abstractions
* event buses
* plugin registries
* complex state machines
* unnecessary databases
* custom parsing engines
* speculative optimizations

The MVP should remain understandable and easy to modify.

---

## 3. Preserve Architecture Boundaries

UI components must not directly own storage logic.

Use clear separation between:

```text
UI
Application Services
Storage Layer
```

Local storage is the only required storage implementation for the MVP.

However, the architecture should allow future storage providers without major rewrites.

Do not hard-code file-system assumptions throughout the application.

---

## 4. Preserve User Data

Treat local Markdown files as the source of truth.

Be conservative with file operations.

Avoid:

* accidental overwrites
* destructive renaming
* silent deletion
* unsafe automatic migrations

When implementing deletion behavior, require explicit confirmation where appropriate.

---

# Task Execution Rules

## Before Starting Work

Read the following documents when relevant:

```text
README.md
docs/MVP_SPEC.md
docs/ARCHITECTURE.md
docs/DATA_MODEL.md
docs/STYLE_GUIDE.md
```

Do not assume undocumented behavior.

Read and write all Markdown project documents as UTF-8. In PowerShell, use
`Get-Content -Encoding UTF8` when reading documents to avoid mojibake.

---

## During Implementation

Prefer:

* small commits
* isolated changes
* explicit behavior
* readable code
* incremental improvements

Avoid:

* modifying unrelated files
* large mixed refactors
* hidden side effects
* changing existing behavior unnecessarily

---

## Definition of Done

Before marking a task complete:

1. Confirm the work stays within the MVP scope or was explicitly requested.
2. Run the relevant static checks:
   * `npm run typecheck`
   * `npm test`
   * `npm run build`
3. For renderer-only behavior, verify with `npm run dev:renderer` only when the
   behavior does not depend on Electron APIs.
4. For file operations, native menus, preload IPC, fullscreen behavior, or disk
   persistence, verify manually with `npm run dev`.
5. Run the Electron manual smoke checklist in `docs/TESTING.md` when the change
   affects workspace, file, editor, preview, theme, link, tag, menu, or
   fullscreen behavior.
6. Update relevant documentation when behavior, scope, architecture, data shape,
   UI convention, or testing guidance changes.

Passing typecheck, tests, and build is not sufficient for Electron-only
behavior. Any behavior that depends on the desktop shell must be verified in the
Electron app.

---

## When Making Structural Changes

Before major architectural modifications:

1. explain the reasoning
2. identify affected layers
3. preserve MVP constraints
4. avoid introducing speculative systems

Large rewrites should be avoided unless necessary.

---

# Documentation Rules

Documentation must remain synchronized with implementation.

Update relevant documents when behavior or structure changes.

Examples:

| Change               | Update                                      |
| -------------------- | ------------------------------------------- |
| feature scope        | `docs/MVP_SPEC.md`                          |
| architecture         | `docs/ARCHITECTURE.md`                      |
| data structure       | `docs/DATA_MODEL.md`                        |
| UI conventions       | `docs/STYLE_GUIDE.md`                       |
| testing strategy     | `docs/TESTING.md`                           |
| active task/status   | `docs/TASK.md`, `docs/CURRENT_STATUS.md`    |
| reproduced QA issue  | `docs/qa/QA_LOG.md`                         |
| regression coverage  | `docs/qa/REGRESSION_CASES.md`               |
| completed phase plan | `docs/roadmap/`                             |
| future sync planning | `docs/sync/`                                |


Do not allow implementation and documentation to diverge.

---

# Code Guidelines

## General

* Prefer TypeScript.
* Prefer explicit types for public interfaces.
* Keep components focused and small.
* Separate UI state from storage state.
* Prefer composition over deeply coupled components.

---

## Naming

Use descriptive and domain-oriented names.

Preferred examples:

```text
Document
Workspace
DocumentLink
StorageProvider
DocumentService
LocalFileStorage
```

Avoid vague naming such as:

```text
Manager
Helper
Thing
Data
Util
```

unless the abstraction is genuinely generic.

---

# Git Guidelines

Create meaningful commits.

Recommended commit types:

```text
feat:
fix:
refactor:
docs:
style:
```

Avoid large commits combining unrelated work.

---

# Non-Goals

The MVP is intended to validate:

* local Markdown editing
* three-pane workflow
* local file management
* extensible storage structure
* lightweight knowledge-linking foundation

The goal is not to reproduce the full feature set of Obsidian.

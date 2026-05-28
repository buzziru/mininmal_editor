# Documentation Restructuring Task

Review the current project documentation structure and reorganize it for long-term AI-assisted development and maintenance.

The project has completed the MVP and post-MVP QA stabilization phase. Future work may include additional QA hardening and possible Google Drive synchronization.

The goal of this task is to improve document clarity, reduce obsolete context accumulation, and separate active work from historical/archive material.

---

# Objectives

Reorganize the documentation system into:

* active operational documents
* stable reference documents
* archived phase documents
* QA tracking documents
* future sync-related documents

The restructuring should improve:

* AI session handoff quality
* long-term maintainability
* context isolation
* future feature planning
* reduction of obsolete implementation context

---

# Current Principles

Preserve the existing architectural and documentation philosophy:

* local-first
* MVP-first
* simple and maintainable structure
* explicit scope boundaries
* predictable documentation hierarchy

Do not introduce unnecessary process complexity.

---

# Required Changes

## 1. Keep Active Operational Documents Minimal

The following documents should remain the primary active-entry documents:

```text
AGENTS.md
docs/TASK.md
docs/CURRENT_STATUS.md
```

### TASK.md

Refactor `docs/TASK.md` so it represents only the currently active development phase.

It should no longer act as an append-only historical implementation log.

Completed phases should be archived separately.

### CURRENT_STATUS.md

Keep `docs/CURRENT_STATUS.md` as a concise project handoff/status document.

It should contain:

* current implementation baseline
* verification baseline
* known active issues
* next recommended work
* current active phase

Avoid turning it into a long historical changelog.

---

## 2. Introduce Archive / Roadmap Structure

Create a structure similar to:

```text
docs/
├── roadmap/
│   ├── PHASE_1_MVP.md
│   ├── PHASE_2_QA.md
│   └── PHASE_3_GOOGLE_DRIVE_SYNC.md
```

Purpose:

* preserve completed implementation plans
* separate historical phases from active work
* improve AI context quality

Move completed MVP implementation planning details from `TASK.md` into archived roadmap documents where appropriate.

Do not lose implementation history.

---

## 3. Introduce QA Documentation Area

Create a QA-focused documentation structure:

```text
docs/qa/
├── QA_LOG.md
├── REGRESSION_CASES.md
```

Purpose:

* record reproduced issues
* track regression cases
* isolate QA findings from active implementation planning

`CURRENT_STATUS.md` should only summarize active or unresolved QA concerns.

Detailed QA tracking should live in `docs/qa/`.

---

## 4. Prepare Future Sync Documentation Boundary

Create a future-facing sync documentation area:

```text
docs/sync/
├── GOOGLE_DRIVE_ARCHITECTURE.md
├── AUTH_FLOW.md
├── SYNC_EDGE_CASES.md
```

Do not implement sync behavior.

Only establish documentation boundaries and placeholder structure for future work.

The structure should reinforce that sync is:

* post-MVP
* architecturally separate
* potentially complex
* not yet implemented

---

## 5. Update Documentation References

Review and update references across:

```text
README.md
AGENTS.md
CURRENT_STATUS.md
TASK.md
```

Ensure document references remain accurate after restructuring.

---

# Constraints

Do NOT:

* rewrite unrelated implementation details
* change MVP scope
* introduce speculative architecture
* add workflow bureaucracy
* add cloud implementation details
* modify application source code unless required for documentation references

Focus only on documentation structure and clarity.

---

# Deliverables

1. Updated documentation hierarchy
2. Refactored active documents
3. Archived roadmap/phase documents
4. QA documentation structure
5. Sync documentation placeholders
6. Updated internal document references

---

# Verification

Before completion:

* verify all Markdown references are valid
* preserve UTF-8 encoding
* ensure no documentation contradictions are introduced
* confirm the active/current project state remains accurate

Summarize:

* what was moved
* what remains active
* what was archived
* what future boundaries were introduced

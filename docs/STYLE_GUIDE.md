# Style Guide

---

# 1. Purpose

이 문서는 프로젝트의 코드 스타일, UI 스타일, 컴포넌트 구조, 네이밍 규칙 등을 정의한다.

목표는 다음과 같다.

- 일관된 코드 스타일 유지
- 일관된 UI 경험 유지
- 유지보수성 향상
- AI 기반 구현 품질 안정화
- 예측 가능한 프로젝트 구조 유지

---

# 2. General Principles

프로젝트는 다음 원칙을 우선한다.

- simplicity
- readability
- consistency
- maintainability
- predictability

복잡한 스타일이나 과도한 추상화보다:

```text
명확하고 읽기 쉬운 구조

```

를 우선한다.

---

# 3. UI Philosophy

UI는 다음 방향을 따른다.

- minimalist
- calm
- low visual noise
- readable
- spacious
- predictable

---

# 4. Layout Principles

기본 레이아웃:

```text
| Activity Bar | File Side Panel | Editor | Preview |

```

The activity bar stays visible on the far left and contains icon buttons for
workspace views. The Explorer button toggles the file side panel open or closed.
The file side panel width and the editor/preview split may be adjusted with
vertical resize handles. When the file side panel is closed, the editor and
preview panes expand to use the available workspace width.

---

## Layout Goals

- 명확한 영역 분리
- 낮은 시각적 피로감
- 안정적인 레이아웃
- 과도한 애니메이션 지양

---

## Avoid

다음 요소는 MVP 단계에서 지양한다.

- flashy effects
- excessive shadows
- unnecessary gradients
- floating UI overload
- excessive motion

---

# 5. Typography

---

## Principles

- 높은 가독성 우선
- 균형 잡힌 spacing
- 과도한 폰트 다양성 지양

---

## Recommendations

- system fonts 우선
- 명확한 line-height
- 적절한 padding 유지

---

## Avoid

- 지나치게 작은 텍스트
- 과도한 font weight 변화
- decorative typography

---

# 6. Color System

초기 단계에서는 단순한 색상 체계를 유지한다.

---

## Required Themes

```text
Light Theme
Dark Theme

```

---

## Principles

- 명확한 대비
- 눈의 피로 최소화
- 일관된 색상 의미

---

## Avoid

- 과도한 accent color
- rainbow palette
- high saturation overload

---

# 7. Spacing

Spacing은 일관성을 유지해야 한다.

---

## Principles

- predictable spacing
- 충분한 breathing room
- compact but readable layout

---

## Avoid

- overcrowded UI
- inconsistent padding
- irregular margins

---

# 8. Component Design

컴포넌트는 가능한 작고 명확해야 한다.

---

## Principles

- single responsibility
- composability
- predictable props
- minimal side effects

---

## Recommended Structure

```text
components/
├── layout/
├── editor/
├── preview/
├── sidebar/
└── common/

```

---

## Avoid

- giant components
- deeply nested logic
- unrelated responsibilities

---

# 9. State Management Style

MVP 단계에서는 단순한 상태 관리를 우선한다.

---

## Prefer

- local state
- explicit props
- predictable flows

---

## Avoid

- unnecessary global state
- hidden state mutations
- event-driven complexity

---

# 10. File Naming

---

## Component Files

PascalCase 사용:

```text
EditorPane.tsx
FileSidebar.tsx
PreviewPane.tsx

```

---

## Utility Files

camelCase 사용:

```text
parseLinks.ts
extractTags.ts

```

---

## Style Files

명확한 이름 사용:

```text
editor.css
sidebar.css
theme.css

```

---

# 11. Naming Conventions

---

## Components

PascalCase:

```text
DocumentEditor
ThemeToggle
WorkspaceView

```

---

## Variables

camelCase:

```ts
currentDocument
selectedWorkspace
parsedTags

```

---

## Constants

UPPER_SNAKE_CASE:

```ts
MAX_FILE_SIZE
DEFAULT_THEME

```

---

## Types and Interfaces

PascalCase:

```ts
Document
DocumentMetadata
StorageProvider

```

---

# 12. TypeScript Guidelines

---

## Prefer Explicit Types

공개 인터페이스에는 명시적 타입 사용.

예:

```ts
function parseTags(content: string): Tag[] {
  ...
}

```

---

## Avoid Excessive Any

지양:

```ts
any

```

---

## Prefer Interfaces for Models

예:

```ts
interface Document {
  path: string;
  content: string;
}

```

---

# 13. Function Design

---

## Principles

- small functions
- explicit inputs
- predictable outputs
- low side effects

---

## Prefer

```ts
extractTags(content)
parseDocumentLinks(content)

```

---

## Avoid

- giant utility functions
- hidden mutations
- mixed responsibilities

---

# 14. Service Layer Style

비즈니스 로직은 services에 위치한다.

---

## Example

```text
services/
├── DocumentService.ts
├── WorkspaceService.ts
├── LinkService.ts
└── ThemeService.ts

```

---

## Responsibilities

서비스는:

- business logic
- parsing
- orchestration

을 담당한다.

---

## Must Not

서비스는 직접 UI 렌더링을 수행하지 않는다.

---

# 15. Storage Layer Style

Storage Layer는 파일 시스템 접근을 담당한다.

---

## Example

```text
storage/
├── StorageProvider.ts
└── LocalFileStorage.ts

```

---

## Principles

- storage abstraction 유지
- UI와 분리
- predictable file operations

---

# 16. Error Handling Style

오류는 명확하게 처리한다.

---

## Prefer

- explicit error messages
- recoverable behavior
- defensive checks

---

## Avoid

- silent failures
- swallowed exceptions
- ambiguous error states

---

# 17. Markdown Parsing Style

Markdown 파싱은 단순하게 유지한다.

---

## MVP Scope

현재 단계에서는:

- tags
- internal links
- title extraction

중심으로 구현한다.

---

## Avoid

- custom markdown engine
- overly complex parsing
- speculative syntax extensions

---

# 18. CSS / Styling Direction

---

## Principles

- modular styles
- predictable structure
- reusable tokens

---

## Prefer

- CSS Modules
- Tailwind (optional)
- token-based spacing

---

## Avoid

- deeply coupled styles
- global style chaos
- random inline styling

---

# 19. Animation Philosophy

MVP 단계에서는 최소 수준의 애니메이션만 사용한다.

---

## Prefer

- subtle transitions
- low distraction
- fast interactions

---

## Avoid

- heavy motion
- animated layout shifts
- unnecessary transitions

---

# 20. Accessibility Direction

기본 접근성을 고려한다.

---

## Goals

- readable contrast
- keyboard accessibility
- predictable focus behavior

---

# 21. Documentation Style

문서는:

- 명확한 제목
- 일관된 구조
- 예측 가능한 용어

를 유지한다.

---

## Prefer

- concise explanations
- explicit scope
- layered documentation

---

# 22. AI Collaboration Principles

AI 기반 구현 시 다음 원칙을 유지한다.

---

## Prefer

- small changes
- scoped modifications
- explicit reasoning
- maintainable code

---

## Avoid

- unrelated rewrites
- speculative abstractions
- large uncontrolled generation

---

# 23. Deferred Style Concerns

현재 단계에서는 다음 사항을 깊게 다루지 않는다.

- advanced design systems
- plugin UI guidelines
- animation systems
- responsive mobile design
- multi-platform styling

---

# 24. Style Guide Success Criteria

다음 조건을 만족하면 스타일 가이드가 성공적으로 적용된 것으로 판단한다.

- UI가 일관된 인상을 유지한다.
- 코드 구조가 예측 가능하다.
- 컴포넌트 책임이 명확하다.
- 네이밍이 일관된다.
- AI 생성 코드 품질이 안정적이다.
- 유지보수 난이도가 낮다.

# Architecture Document

---

# 1. Purpose

이 문서는 애플리케이션의 기술 구조와 시스템 설계 원칙을 정의한다.

목표는 다음과 같다.

- 단순하고 유지보수 가능한 구조
- 명확한 레이어 분리
- 로컬 파일 기반 안정성
- 향후 기능 확장 가능성 확보
- MVP 범위 내 복잡도 관리

이 문서는 구현 세부 코드보다:

```text
구조적 방향성과 책임 분리

```

를 정의하는 데 목적이 있다.

---

# 2. Architecture Goals

핵심 아키텍처 목표:

- Local-first architecture
- UI와 저장소 로직 분리
- 단순한 상태 흐름
- 명확한 책임 분리
- 확장 가능한 저장 구조
- 낮은 결합도

---

# 3. High-Level Architecture

전체 구조:

```text
┌──────────────────────┐
│        UI Layer       │
└──────────────────────┘
            ↓
┌──────────────────────┐
│  Application Layer    │
└──────────────────────┘
            ↓
┌──────────────────────┐
│    Storage Layer      │
└──────────────────────┘
            ↓
┌──────────────────────┐
│   Local File System   │
└──────────────────────┘

```

---

# 4. Layer Responsibilities

---

# 4.1 UI Layer

UI Layer는 사용자 인터페이스를 담당한다.

예:

- File Explorer
- Markdown Editor
- Preview Pane
- Theme Toggle
- Layout Components

---

## Responsibilities

- 사용자 입력 처리
- 화면 렌더링
- UI 상태 표시
- 이벤트 전달

---

## Must Not

UI Layer는 직접:

- 파일 시스템 접근
- 저장 로직 처리
- 데이터 영속성 처리

를 수행하지 않는다.

---

# 4.2 Application Layer

Application Layer는 비즈니스 로직을 담당한다.

예:

- document open
- document save
- link parsing
- tag extraction
- workspace management

---

## Responsibilities

- UI 요청 처리
- 데이터 흐름 관리
- Storage Layer 호출
- 문서 상태 관리

---

## Examples

예상 서비스:

```text
DocumentService
WorkspaceService
LinkService
TagService
ThemeService

```

---

# 4.3 Storage Layer

Storage Layer는 데이터 저장 방식을 추상화한다.

MVP에서는:

```text
LocalFileStorage

```

만 구현한다.

---

## Responsibilities

- 파일 읽기
- 파일 저장
- 파일 삭제
- 파일 목록 조회
- 디렉토리 탐색

---

## Goals

향후 다음 구현이 가능해야 한다.

```text
GoogleDriveStorage
CloudStorage

```

---

# 5. Storage Abstraction

Storage Layer는 인터페이스 기반으로 구현한다.

예시:

```ts
interface StorageProvider {
  listDocuments(): Promise<DocumentMetadata[]>;
  readDocument(path: string): Promise<Document>;
  writeDocument(document: Document): Promise<void>;
  deleteDocument(path: string): Promise<void>;
}

```

---

## MVP Implementation

현재 MVP에서는:

```text
LocalFileStorage

```

만 구현한다.

---

## Deferred

다음 기능은 이후 단계에서 고려한다.

- sync engine
- conflict resolution
- offline queue
- remote caching

---

# 6. Data Flow

예시 흐름:

```text
User Input
    ↓
UI Component
    ↓
Application Service
    ↓
Storage Provider
    ↓
Local File System

```

---

# 7. Workspace Structure

기본 워크스페이스 구조:

```text
workspace/
├── notes.md
├── projects.md
├── ideas/
│   └── startup.md
└── research/
    └── papers.md

```

---

## Principles

- 일반 Markdown 파일 유지
- 일반 폴더 구조 유지
- 사용자 접근 가능 구조 유지

---

# 8. File Model

문서는 일반 `.md` 파일로 저장한다.

예:

```text
daily-notes.md

```

문서 내부:

```markdown
# Title

Some content

#tag

[[Another Document]]

```

---

# 9. Internal Links

링크 형식:

```markdown
[[Document Name]]

```

---

## MVP Behavior

MVP 단계에서는:

- 링크 감지
- 링크 대상 탐색
- 문서 이동

까지만 지원한다.

---

## Deferred

이후 고려:

- backlink indexing
- graph visualization
- semantic links

---

# 10. Tag System

태그 형식:

```markdown
#tag

```

---

## MVP Behavior

- 태그 파싱
- 태그 식별

만 지원한다.

---

## Deferred

이후 고려:

- tag search
- tag pages
- tag graph

---

# 11. State Management

MVP 단계에서는 단순한 상태 관리를 우선한다.

---

## Principles

- local component state 우선
- 최소 수준의 global state
- predictable data flow

---

## Avoid

MVP 단계에서는:

- overly complex stores
- event-driven architecture
- distributed state systems

를 지양한다.

---

# 12. Theme Architecture

초기 지원:

```text
Light Theme
Dark Theme

```

---

## Theme Goals

- 단순한 토큰 기반 스타일
- 일관된 색상 구조
- 낮은 시각적 피로감

---

## Deferred

- custom themes
- theme marketplace
- advanced theming

---

# 13. Suggested Folder Structure

예상 프로젝트 구조:

```text
src/
├── app/
├── components/
├── features/
├── services/
├── storage/
├── models/
├── hooks/
├── utils/
├── styles/
└── types/

```

---

# 14. Recommended Technology Direction

예상 기술 방향:

```text
TypeScript
React
Vite
Electron or Tauri

```

---

## UI

예상 방향:

```text
React
CSS Modules or Tailwind

```

---

## Markdown Rendering

가능 후보:

```text
react-markdown
markdown-it
remark

```

최종 선택은 구현 단계에서 결정한다.

---

# 15. Error Handling Principles

오류는 사용자 데이터를 손상시키지 않는 방향으로 처리한다.

---

## Important Cases

- file read failure
- invalid path
- permission issues
- missing document
- save failure

---

## Goals

- 명확한 오류 메시지
- silent failure 방지
- 데이터 손실 방지

---

# 16. Performance Philosophy

MVP 단계에서는:

```text
복잡한 최적화보다 단순성과 안정성

```

을 우선한다.

---

## Avoid Premature Optimization

초기 단계에서는:

- virtualization
- caching layers
- complex indexing

등을 과도하게 도입하지 않는다.

---

# 17. Security Philosophy

MVP는 로컬 애플리케이션이다.

초기 단계에서는:

- local-only operation
- no remote execution
- no external code loading

원칙을 따른다.

---

# 18. Explicitly Deferred Systems

현재 단계에서는 구현하지 않는다.

```text
Sync Engine
Plugin Architecture
Graph Engine
Database Layer
Collaboration System
Cloud Authentication
AI Features

```

---

# 19. Architectural Priorities

현재 프로젝트의 우선순위:

1. 안정적인 로컬 파일 처리
2. 단순한 구조
3. 유지보수 가능성
4. 확장 가능성
5. 낮은 복잡도
6. 예측 가능한 동작

---

# 20. Architecture Success Criteria

다음 조건을 만족하면 현재 단계 아키텍처가 성공적이라고 판단한다.

- UI와 저장소 로직이 분리되어 있다.
- Local-first 구조가 유지된다.
- 문서 저장 구조가 단순하다.
- 이후 StorageProvider 확장이 가능하다.
- 기능 추가 시 구조 붕괴가 발생하지 않는다.
- MVP 범위 내 복잡도가 관리된다.

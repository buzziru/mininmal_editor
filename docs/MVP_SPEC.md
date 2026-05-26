# MVP Specification

---

# 1. Purpose

이 문서는 현재 단계에서 구현할 MVP(Minimum Viable Product)의 범위를 정의한다.

목표는:

```text
작지만 안정적으로 동작하는 로컬 Markdown 에디터

```

를 구축하는 것이다.

이 문서는 기능 범위를 제한하고, 과도한 구현을 방지하기 위한 기준 문서로 사용한다.

---

# 2. MVP Goals

현재 MVP의 핵심 목표:

- 로컬 Markdown 워크플로우 검증
- 안정적인 파일 기반 문서 관리
- 3분할 인터페이스 구축
- Markdown 편집 및 미리보기
- 최소 수준의 문서 연결 기능
- 향후 확장을 고려한 구조 확보

---

# 3. MVP Scope

MVP에서 반드시 구현해야 하는 기능들이다.

---

# 3.1 Workspace Management

## Required

- 로컬 폴더 선택
- 워크스페이스 열기
- 현재 워크스페이스 유지

---

## Out of Scope

- 다중 워크스페이스 관리
- 클라우드 워크스페이스
- 원격 파일 시스템

---

# 3.2 File Explorer

## Required

좌측 사이드바에서:

- Markdown 파일 목록 표시
- 폴더 구조 탐색
- 파일 선택
- 새 Markdown 파일 생성
- 파일 이름 변경
- 파일 삭제

지원.

---

## Constraints

지원 대상:

```text
.md

```

파일만 우선 고려한다.

---

## Out of Scope

- 이미지 관리
- 첨부파일 관리
- 드래그 앤 드롭 정렬
- 고급 파일 정렬 옵션
- 파일 즐겨찾기

---

# 3.3 Markdown Editor

## Required

중앙 에디터 영역에서:

- Markdown 텍스트 편집
- 일반 텍스트 입력
- 커서 이동
- 기본 키보드 입력
- 스크롤
- 자동 저장 또는 저장 기능

지원.

---

## Required Markdown Syntax

최소 지원 문법:

```markdown
# Heading

**Bold**

*Italic*

- List

`inline code`

```code block```

[Link](url)

```

---

## Out of Scope

- Rich text editor
- WYSIWYG editing
- Collaborative editing
- Vim mode
- AI writing assistant
- Multi-cursor editing

---

# 3.4 Markdown Preview

## Required

우측 영역에서:

- Markdown 렌더링
- 실시간 또는 준실시간 업데이트
- 스크롤 가능 미리보기

지원.

---

## Required Rendering

지원 범위:

- headings
- paragraphs
- bold
- italic
- lists
- inline code
- code blocks
- links

---

## Out of Scope

- Mermaid
- LaTeX
- Diagram rendering
- Embedded web content
- Custom Markdown plugins

---

# 3.5 Theme System

## Required

- Light theme
- Dark theme
- 테마 전환 기능

지원.

---

## Constraints

초기 단계에서는:

```text
2개의 기본 테마만 지원

```

한다.

---

## Out of Scope

- 사용자 커스텀 테마
- 테마 마켓플레이스
- 고급 색상 설정

---

# 3.6 Internal Links

## Required

다음 형식의 문서 링크 감지:

```markdown
[[Document Name]]

```

---

## Required Behavior

- 링크 텍스트 감지
- 링크 대상 탐색 가능
- 존재하는 문서로 이동 가능

---

## Out of Scope

- 자동 링크 추천
- 그래프 시각화
- 고급 백링크 분석
- 링크 자동 생성

---

# 3.7 Tag Support

## Required

다음 형식의 태그 감지:

```markdown
#tag

```

---

## Required Behavior

- 태그 파싱
- 문서 내 태그 식별

---

## Out of Scope

- 태그 검색 시스템
- 태그 페이지
- 태그 그래프
- 태그 자동완성

---

# 3.8 File Persistence

## Required

문서는 일반 Markdown 파일로 저장되어야 한다.

예:

```text
workspace/
├── notes.md
├── projects.md
└── ideas/
    └── startup.md

```

---

## Constraints

- 데이터베이스 사용 금지
- 독점 포맷 사용 금지
- 일반 텍스트 기반 유지

---

# 4. Non-Goals

다음 기능은 MVP 구현 대상이 아니다.

---

## Cloud Features

- Google Drive sync
- Dropbox sync
- OneDrive sync
- Real-time synchronization

---

## Advanced Knowledge Management

- Backlink panel
- Graph visualization
- Semantic search
- AI note recommendation

---

## Editor Extensions

- Plugin system
- Custom commands
- Macro system
- Extension marketplace

---

## User System

- Authentication
- Multi-user support
- Cloud accounts
- Shared workspaces

---

## Advanced UI Features

- Floating panels
- Multi-window editing
- Complex docking
- Layout customization

---

# 5. Technical Constraints

현재 MVP 단계에서는 다음 원칙을 따른다.

---

## Simplicity First

복잡한 구조보다 단순한 구조를 우선한다.

---

## Local-First

로컬 파일 시스템을 source of truth로 사용한다.

---

## Architecture Separation

다음 레이어를 분리한다.

```text
UI
Application Services
Storage Layer

```

---

## Future Extensibility

MVP는 단순해야 하지만, 이후 다음 기능 확장이 가능해야 한다.

예:

```text
LocalFileStorage
GoogleDriveStorage

```

---

# 6. Success Criteria

다음 조건을 만족하면 MVP가 성공적으로 구현된 것으로 간주한다.

- 워크스페이스를 열 수 있다.
- Markdown 파일을 생성할 수 있다.
- Markdown 파일을 수정할 수 있다.
- Markdown 파일을 저장할 수 있다.
- Markdown 미리보기가 안정적으로 동작한다.
- 다크/라이트 테마가 정상 동작한다.
- 문서 링크를 탐색할 수 있다.
- 구조적으로 이후 확장이 가능하다.

---

# 7. Explicitly Deferred Features

다음 기능들은 의도적으로 이후 단계로 연기한다.

```text
Graph View
Backlinks
Sync Engine
Plugin System
Advanced Search
AI Features
Database Layer
Mobile App
Collaboration

```

현재 단계에서는 구현하지 않는다.

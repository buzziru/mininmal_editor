# Product Requirements Document

---

# 1. Product Overview

이 프로젝트는 로컬 Markdown 파일 기반의 Windows 데스크톱 에디터이다.

사용자는 일반 `.md` 파일을 기반으로 문서를 작성, 수정, 탐색하며 문서 간 연결과 태그를 활용해 개인 지식 관리(PKM) 환경을 구성할 수 있어야 한다.

이 애플리케이션은 복잡한 기능보다 다음 경험을 우선한다.

- 빠른 문서 접근
- 낮은 시각적 피로감
- 단순한 문서 관리
- 로컬 파일 기반의 안정성
- Markdown 중심 워크플로우
- 확장 가능한 구조

우선 목표는:

> 안정적이고 확장 가능한 로컬 Markdown 에디터

를 구축하는 것이다.

---

# 2. Product Goals

핵심 목표는 다음과 같다.

## 2.1 Local-First Workflow

사용자의 문서는 로컬 파일 시스템에 저장되어야 한다.

애플리케이션은 사용자의 데이터를 독점하거나 폐쇄적인 포맷으로 저장하지 않는다.

모든 문서는 일반 `.md` 파일 형태를 유지해야 한다.

---

## 2.2 Minimal Writing Experience

인터페이스는 최대한 단순해야 한다.

사용자는:

- 파일 탐색
- 문서 작성
- 미리보기
- 문서 연결

에 집중할 수 있어야 한다.

과도한 UI 요소나 시각적 노이즈는 지양한다.

---

## 2.3 Extensible Architecture

초기 MVP는 단순해야 하지만, 이후 다음 기능 확장이 가능해야 한다.

예상 확장 방향:

- Google Drive 동기화
- 백링크
- 그래프 뷰
- 고급 검색
- 플러그인 시스템
- 다중 워크스페이스

단, MVP 단계에서는 이러한 기능을 직접 구현하지 않는다.

---

## 2.4 Predictable File Ownership

사용자는 자신의 문서를 애플리케이션 외부에서도 자유롭게 다룰 수 있어야 한다.

예:

- IDE로 열기
- Obsidian으로 열기
- Git으로 버전 관리
- Dropbox/Google Drive와 직접 연동

애플리케이션은 사용자의 파일 접근을 제한하지 않는다.

---

# 3. Target Users

## Primary Users

다음 사용자들을 주요 대상으로 한다.

- Markdown 기반 노트 사용자
- 개발자
- 연구자
- 개인 지식 관리(PKM) 사용자
- 문서 중심 워크플로우 사용자
- 로컬 파일 기반 워크플로우를 선호하는 사용자

---

## User Characteristics

대상 사용자는 일반적으로 다음 특성을 가진다.

- Markdown 사용 경험이 있음
- 단순한 텍스트 기반 워크플로우를 선호함
- 클라우드 종속성을 최소화하고 싶어함
- 문서 구조화를 중요하게 생각함
- 키보드 중심 작업에 익숙함

---

# 4. Core User Experience

사용자는 애플리케이션을 실행한 뒤:

1. 로컬 워크스페이스 폴더를 연다.
2. 좌측에서 Markdown 파일을 탐색한다.
3. 중앙 에디터에서 문서를 수정한다.
4. 우측에서 렌더링 결과를 확인한다.
5. 문서 간 링크를 생성한다.
6. 태그를 사용해 문서를 분류한다.

핵심 경험은:

```text
빠르고 단순한 Markdown 기반 문서 작성 및 연결

```

이다.

---

# 5. Core Interface

기본 인터페이스 구조:

```text
┌──────────────────┬────────────────────────────┬────────────────────────────┐
│ 파일 목록          │ Markdown 편집기             │ 미리보기                    │
└──────────────────┴────────────────────────────┴────────────────────────────┘

```

---

## 5.1 Left Sidebar

좌측 영역은:

- Markdown 파일 목록
- 폴더 구조
- 파일 탐색

기능을 담당한다.

---

## 5.2 Editor Pane

중앙 영역은:

- Markdown 편집
- 문서 작성
- 링크 작성

을 담당한다.

---

## 5.3 Preview Pane

우측 영역은:

- Markdown 렌더링
- 스타일 적용 결과
- 문서 시각화

를 담당한다.

---

# 6. Functional Requirements

## Required for MVP

### File Management

- Markdown 파일 열기
- Markdown 파일 생성
- Markdown 파일 저장
- Markdown 파일 이름 변경
- Markdown 파일 삭제

---

### Markdown Editing

- 일반 Markdown 작성
- 기본 문법 지원
- 실시간 저장 또는 자동 저장

---

### Markdown Preview

다음 문법 렌더링 지원:

- headings
- paragraphs
- lists
- code blocks
- inline code
- bold
- italic
- links

---

### Theme Support

- Light theme
- Dark theme

---

### Internal Linking

문서 간 링크 지원:

```markdown
[[Document Name]]

```

---

### Tag Support

태그 문법 지원:

```markdown
#tag

```

---

# 7. Non-Goals (MVP Exclusions)

다음 기능은 MVP 범위에 포함하지 않는다.

- 실시간 협업
- 사용자 계정
- 모바일 지원
- AI 기능
- 플러그인 시스템
- 그래프 시각화
- 데이터베이스 기반 저장
- Rich-text/WYSIWYG 편집
- 복잡한 동기화 시스템

---

# 8. Technical Direction

애플리케이션은 Windows 데스크톱 환경을 우선 지원한다.

예상 기술 방향:

```text
TypeScript
React
Electron 또는 Tauri

```

세부 기술 설계는:

```text
docs/ARCHITECTURE.md

```

에서 관리한다.

---

# 9. Design Philosophy

이 프로젝트는 다음 철학을 중요하게 고려한다.

- Local-first
- Plain text
- Simplicity
- Readability
- Extensibility
- User ownership
- Minimal visual noise

---

# 10. Success Criteria

MVP 성공 기준:

- 사용자가 로컬 Markdown 워크스페이스를 열 수 있다.
- 문서를 생성/수정/저장할 수 있다.
- 문서를 안정적으로 관리할 수 있다.
- Markdown 미리보기가 정상 동작한다.
- 다크/라이트 테마가 안정적으로 동작한다.
- 문서 링크 구조의 기초가 동작한다.
- 구조적으로 이후 기능 확장이 가능하다.

---

# 11. Future Expansion Possibilities

MVP 이후 고려 가능한 기능:

- Google Drive synchronization
- Backlinks
- Graph visualization
- Full-text search
- Plugin architecture
- Multi-workspace support
- Keyboard shortcut customization
- File history
- Markdown extensions

이 기능들은 MVP 안정화 이후 단계적으로 검토한다.
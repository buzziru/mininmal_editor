# Data Model Document

---

# 1. Purpose

이 문서는 애플리케이션에서 사용하는 핵심 데이터 구조를 정의한다.

목표는 다음과 같다.

- 단순한 데이터 구조 유지
- Markdown 기반 워크플로우 유지
- Local-first 구조 유지
- 향후 확장 가능성 확보
- 문서/태그/링크 구조 명확화

MVP 단계에서는 복잡한 데이터베이스 구조보다:

```text
파일 기반 모델

```

을 우선한다.

---

# 2. Data Model Philosophy

이 프로젝트는 다음 원칙을 따른다.

- Markdown 파일이 source of truth
- 데이터베이스 의존 최소화
- plain text 기반 유지
- 명시적 구조 선호
- 파일 시스템 중심 모델 유지

애플리케이션 내부 상태는 Markdown 파일에서 파생되는 구조로 취급한다.

---

# 3. Core Entities

현재 MVP 핵심 엔티티:

```text
Workspace
Document
DocumentMetadata
Tag
DocumentLink
Theme

```

---

# 4. Workspace

Workspace는 사용자가 선택한 루트 폴더를 의미한다.

---

## Example

```text
workspace/
├── notes.md
├── projects.md
└── research/
    └── papers.md

```

---

## Structure

예상 모델:

```ts
interface Workspace {
  rootPath: string;
}

```

---

## Responsibilities

Workspace는:

- 루트 경로 관리
- 문서 탐색 기준 제공
- 파일 시스템 범위 정의

를 담당한다.

---

# 5. Document

Document는 하나의 Markdown 파일을 의미한다.

---

## Example File

```markdown
# Daily Notes

Today I learned something.

#learning

[[Research Notes]]

```

---

## Structure

예상 모델:

```ts
interface Document {
  path: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

```

---

## Fields


| Field     | Description     |
| --------- | --------------- |
| path      | 파일 시스템 경로       |
| title     | 문서 제목           |
| content   | Markdown 원문     |
| createdAt | 생성 시각(optional) |
| updatedAt | 수정 시각(optional) |


---

## Principles

- Markdown 원문 보존
- content를 source of truth로 사용
- title은 파일명 또는 heading 기반 가능

---

# 6. Document Metadata

DocumentMetadata는 문서 목록 표시용 경량 데이터이다.

파일 목록, 검색, 탐색 등에 사용한다.

---

## Structure

```ts
interface DocumentMetadata {
  path: string;
  title: string;
  updatedAt?: Date;
}

```

---

## Purpose

Document 전체 내용을 매번 로드하지 않고:

- sidebar rendering
- document list
- navigation

에 활용한다.

---

# 7. Document Title

문서 제목은 다음 우선순위를 따른다.

---

## Priority

1. 첫 번째 H1 heading
2. 파일명
3. fallback title

---

## Example

```markdown
# My Note

```

→ title:

```text
My Note

```

---

# 8. Tag Model

Tag는 Markdown 문서 내부의:

```markdown
#tag

```

형식을 의미한다.

---

## Structure

```ts
interface Tag {
  name: string;
}

```

---

## Examples

```markdown
#research
#project
#daily-note

```

---

## MVP Behavior

MVP 단계에서는:

- 태그 추출
- 태그 식별

까지만 지원한다.

---

## Deferred

현재 단계에서는:

- tag hierarchy
- tag graph
- tag search index

를 구현하지 않는다.

---

# 9. DocumentLink

DocumentLink는 문서 간 연결을 의미한다.

형식:

```markdown
[[Document Name]]

```

---

## Structure

```ts
interface DocumentLink {
  sourcePath: string;
  targetName: string;
}

```

---

## Fields


| Field      | Description |
| ---------- | ----------- |
| sourcePath | 링크를 포함하는 문서 |
| targetName | 링크 대상 이름    |


---

## Examples

```markdown
[[Research]]
[[Daily Notes]]

```

---

# 10. Link Resolution

링크는 다음 기준으로 탐색한다.

---

## Resolution Strategy

우선 MVP에서는:

```text
문서 제목 기반 탐색

```

을 우선 사용한다.

---

## Example

```markdown
[[Research]]

```

→ 다음 후보 탐색:

```text
Research.md
research.md

```

---

## Constraints

MVP 단계에서는:

- fuzzy matching
- alias system
- multi-target resolution

등을 구현하지 않는다.

---

# 11. Theme Model

지원 테마:

```text
light
dark

```

---

## Structure

```ts
type Theme = "light" | "dark";

```

---

## MVP Constraints

현재 단계에서는:

- 사용자 커스텀 테마
- 테마 플러그인
- 동적 테마 시스템

을 지원하지 않는다.

---

# 12. File System Model

모든 문서는 실제 파일 시스템에 저장된다.

---

## Supported File Type

```text
.md

```

---

## Directory Structure

중첩 폴더 허용:

```text
workspace/
├── notes/
├── research/
└── ideas/

```

---

# 13. Parsing Model

문서 파싱은 다음 정보를 추출한다.

---

## Extracted Data

- title
- tags
- document links

---

## Example

입력:

```markdown
# Research Notes

#ai

[[Transformer]]

```

출력:

```text
title:
  Research Notes

tags:
  ai

links:
  Transformer

```

---

# 14. Persistence Model

저장 원칙:

- Markdown 원문 그대로 저장
- 애플리케이션 메타데이터 최소화
- 파일 내용 직접 수정 최소화

---

## Avoid

현재 단계에서는:

- hidden metadata blocks
- binary formats
- proprietary serialization

을 사용하지 않는다.

---

# 15. Optional Future Metadata

향후 고려 가능:

```ts
interface DocumentMetadata {
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
  links?: string[];
}

```

---

## Deferred

다음 구조는 현재 MVP 범위 밖이다.

- graph index
- backlink cache
- semantic embeddings
- document ranking
- sync metadata

---

# 16. Search Model

현재 MVP에서는 고급 검색 시스템을 구현하지 않는다.

향후 고려 가능:

- title search
- content search
- tag search
- backlink search

---

# 17. Data Integrity Principles

데이터 모델은 다음 원칙을 따른다.

---

## Principles

- 사용자 파일 우선
- 데이터 손실 최소화
- 명시적 구조 유지
- 예측 가능한 저장 방식
- 일반 Markdown 호환성 유지

---

# 18. Compatibility Goals

다음 환경과의 호환성을 유지하는 방향을 우선한다.

- VSCode
- Obsidian
- Git
- 일반 텍스트 에디터

---

# 19. Explicitly Deferred Data Systems

현재 단계에서는 구현하지 않는다.

```text
Relational Database
Embedded Database
Graph Database
Cloud Metadata
Sync Metadata
Embedding Store
Semantic Index

```

---

# 20. Data Model Success Criteria

다음 조건을 만족하면 MVP 데이터 모델이 성공적이라고 판단한다.

- Markdown 파일이 source of truth로 유지된다.
- 문서 구조가 단순하다.
- 태그와 링크를 안정적으로 파싱할 수 있다.
- 문서 탐색이 가능하다.
- 구조적으로 이후 확장이 가능하다.
- 데이터베이스 의존 없이 동작 가능하다.
# Minimal Markdown Editor

로컬 파일 기반의 미니멀 Markdown 에디터 프로젝트입니다.

이 프로젝트는 옵시디언(Obsidian)과 유사한 형태의 3분할 인터페이스를 기반으로 하지만, 초기 단계에서는 복잡한 기능보다 안정적이고 단순한 Markdown 편집 경험에 집중합니다.

---

# 프로젝트 목표

이 프로젝트의 목표는 다음과 같습니다.

- 로컬 Markdown 파일 기반 워크플로우
- 단순하고 안정적인 문서 관리
- 미니멀한 UI/UX
- 확장 가능한 구조
- 장기적으로 개인 지식 관리(PKM) 도구로 발전 가능한 기반 구축

초기 MVP 단계에서는 기능 확장보다 구조적 안정성과 유지보수성을 우선합니다.

---

# 핵심 기능

현재 MVP 목표 범위:

- 로컬 Markdown 워크스페이스
- Markdown 파일 생성 / 수정 / 삭제
- 좌측 파일 목록
- 중앙 Markdown 편집기
- 우측 실시간 미리보기
- 라이트 / 다크 테마
- 기본 태그 지원 (`#tag`)
- 문서 링크 지원 (`[[Document]]`)

---

# 인터페이스 구조

```text
┌──────────────────┬────────────────────────────┬────────────────────────────┐
│ 파일 목록          │ Markdown 편집기             │ 미리보기                    │
│                  │                            │                            │
│ notes.md         │ # 제목                      │ 렌더링된 Markdown            │
│ projects.md      │                            │                            │
│ ideas.md         │ 문서 내용...                │                            │
└──────────────────┴────────────────────────────┴────────────────────────────┘
````

---

# 설계 원칙

이 프로젝트는 다음 원칙을 중요하게 고려합니다.

* Local-first
* Plain Markdown
* 단순한 구조
* 낮은 시각적 피로감
* 유지보수 가능한 구조
* 확장 가능성 고려
* 사용자 파일 소유권 보장

모든 문서는 일반 `.md` 파일 형태로 로컬 파일 시스템에 저장됩니다.

사용자는 애플리케이션 외부에서도 자유롭게 파일을 열고 수정할 수 있어야 합니다.

---

# 향후 확장 방향

MVP 이후 고려 가능한 기능:

* Google Drive 동기화
* 백링크(backlink)
* 문서 그래프
* 고급 검색
* 플러그인 시스템
* 다중 워크스페이스
* 단축키 커스터마이징

단, 현재 단계에서는 위 기능들을 구현 대상에 포함하지 않습니다.

---

# 문서 구조

프로젝트 문서:

```text
docs/
├── PRD.md
├── MVP_SPEC.md
├── ARCHITECTURE.md
├── DATA_MODEL.md
├── STYLE_GUIDE.md
├── TESTING.md
├── CURRENT_STATUS.md
├── TASK.md
├── roadmap/
│   ├── PHASE_1_MVP.md
│   ├── PHASE_2_QA.md
│   └── PHASE_3_GOOGLE_DRIVE_SYNC.md
├── qa/
│   ├── QA_LOG.md
│   └── REGRESSION_CASES.md
└── sync/
    ├── GOOGLE_DRIVE_ARCHITECTURE.md
    ├── AUTH_FLOW.md
    └── SYNC_EDGE_CASES.md
```

프로젝트 루트 문서:

```text
AGENTS.md
README.md
```

---

# 현재 개발 단계

현재 상태:

```text
MVP and post-MVP QA stabilization complete
```

현재 상태와 다음 작업은 `docs/CURRENT_STATUS.md`와 `docs/TASK.md`를
참고하세요. 완료된 단계별 계획은 `docs/roadmap/`, QA 추적은
`docs/qa/`, 향후 Google Drive 동기화 계획 경계는 `docs/sync/`에서
관리합니다.

현재는 다음 기준을 유지하면서 구체적으로 재현된 이슈에 한해
targeted hardening을 진행합니다.

* 프로젝트 구조
* 저장 구조
* UI 레이아웃
* Markdown 워크플로우
* 문서 체계
* 아키텍처 분리

---

# 기술 방향

현재 예상 기술 스택:

```text
TypeScript
React
Electron 또는 Tauri
```

세부 기술 설계는 아래 문서에서 관리합니다.

```text
docs/ARCHITECTURE.md
```

---

# 시작하기

개발 중 전체 데스크톱 앱을 실행하려면:

```text
npm run dev
```

이 명령은 Vite 개발 서버를 시작한 뒤 Electron 창을 열어 로컬 파일 열기,
편집, 저장 기능까지 확인할 수 있게 합니다.

렌더러 UI만 브라우저에서 확인하려면:

```text
npm run dev:renderer
```

브라우저 단독 실행에서는 Electron preload API가 없으므로 로컬 파일 열기,
편집, 저장 기능은 동작하지 않습니다.

---

# License

TBD

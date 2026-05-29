# Minimal Markdown Editor

로컬 파일 기반의 미니멀 Markdown 데스크톱 에디터입니다. 이 프로젝트는 Obsidian과 유사한 3분할 작업 흐름을 제공하되, MVP 단계에서는 복잡한 지식 관리 기능보다 **안정적인 로컬 Markdown 편집**, **명확한 파일 관리**, **단순한 아키텍처**에 집중합니다.

```text
| File List | Editor | Preview |
```

---

## 현재 작업 상황

현재 상태는 **Maintenance and targeted hardening** 단계입니다.

MVP와 post-MVP QA stabilization 단계는 완료되었습니다. 현재는 새 기능을 확장하기보다, 구체적으로 재현된 이슈에 한해 안정화 작업을 진행합니다.

구현된 주요 흐름:

- Electron 데스크톱 앱 실행
- 로컬 워크스페이스 폴더 열기
- 개별 `.md` 파일 열기
- 워크스페이스 내 Markdown 파일 목록 표시
- Markdown 파일 생성, 이름 변경, 삭제, 읽기, 저장
- 선택한 문서 편집 및 명시적 저장
- `Ctrl+S` / `Cmd+S` 메뉴 저장
- 우측 Markdown 미리보기
- 기본 `[[Document]]` 내부 링크 파싱 및 이동
- 기본 `#tag` 태그 추출 및 표시
- 라이트 / 다크 테마 전환 및 저장
- 기본 Edit 메뉴 동작 복원: undo, redo, cut, copy, paste, select all
- 좌측 activity bar와 토글 가능한 파일 패널
- 파일 패널, 편집기, 미리보기 패널 폭 조정
- fullscreen 상태에서 `Esc`로 일반 화면 복귀

현재 초점:

- 발견된 QA 이슈 중심의 안정화
- Electron preload / IPC 기반 파일 작업 검증
- 서비스와 저장소 경계 유지
- MVP 범위를 넘는 기능 추가 방지

자세한 최신 상태와 남은 작업은 [docs/CURRENT_STATUS.md](docs/CURRENT_STATUS.md)와 [docs/TASK.md](docs/TASK.md)를 기준으로 확인합니다.

---

## 프로젝트 목표

이 프로젝트의 목표는 다음과 같습니다.

- 로컬 Markdown 파일 기반 워크플로우
- 단순하고 안정적인 문서 관리
- 미니멀한 3분할 UI/UX
- 명확한 UI / Application Service / Storage Layer 분리
- 향후 확장 가능한 구조
- 장기적으로 개인 지식 관리(PKM) 도구로 발전 가능한 기반 구축

현재 단계에서는 기능 확장보다 구조적 안정성과 유지보수성을 우선합니다.

---

## MVP 기능 범위

현재 MVP 범위에 포함되는 기능:

- 로컬 Markdown 워크스페이스
- Markdown 파일 생성 / 수정 / 이름 변경 / 삭제
- 좌측 파일 목록
- 토글 가능한 파일 사이드 패널
- 마우스 드래그로 조정 가능한 파일 패널 폭
- 마우스 드래그로 조정 가능한 편집기 / 미리보기 폭
- 좌측 activity bar의 탐색기 버튼
- 중앙 Markdown 편집기
- 우측 실시간 Markdown 미리보기
- 라이트 / 다크 테마
- 기본 태그 지원 (`#tag`)
- 기본 문서 링크 지원 (`[[Document]]`)
- 안전한 파일 경로 처리
- 삭제 전 명시적 확인
- 저장되지 않은 변경사항을 버리기 전 확인

현재 MVP 범위에 포함하지 않는 기능:

- Google Drive 또는 클라우드 동기화
- 플러그인 시스템
- 그래프 시각화
- 협업 기능
- AI assistant 기능
- 모바일 지원
- 리치 텍스트 / WYSIWYG 편집기
- 복잡한 백링크 분석
- 데이터베이스 또는 검색 인덱스

---

## 인터페이스 구조

```text
┌────┬──────────────────┬────────────────────────────┬────────────────────────────┐
│ ⧉  │ 파일 사이드 패널   │ Markdown 편집기             │ 미리보기                    │
│    │ (토글 가능)       │                            │                            │
│    │ notes.md         │ # 제목                      │ 렌더링된 Markdown            │
│    │ projects.md      │                            │                            │
│    │ ideas.md         │ 문서 내용...                │                            │
└────┴──────────────────┴────────────────────────────┴────────────────────────────┘
```

좌측 파일 목록은 워크스페이스의 `.md` 파일만 대상으로 합니다. 중앙 편집기는 Markdown 원문을 편집하고, 우측 미리보기는 현재 편집 중인 내용을 렌더링합니다.

---

## 설계 원칙

이 프로젝트는 다음 원칙을 중요하게 고려합니다.

- Local-first
- Plain Markdown
- 사용자 파일 소유권 보장
- 단순한 구조
- 낮은 시각적 피로감
- 유지보수 가능한 구조
- MVP 범위 내 확장 가능성 고려

모든 문서는 일반 `.md` 파일 형태로 로컬 파일 시스템에 저장됩니다. 사용자는 애플리케이션 외부에서도 자유롭게 파일을 열고 수정할 수 있어야 합니다.

---

## 아키텍처 개요

레이어 책임은 다음처럼 분리합니다.

```text
UI Layer
  ↓
Application Services
  ↓
Storage Layer
  ↓
Local File System
```

주요 구현 위치:

```text
src/components/        UI 컴포넌트
src/services/          문서, 워크스페이스, 링크, 태그, 테마 서비스
src/storage/           저장소 인터페이스와 로컬 파일 저장소
src/models/            도메인 타입
electron/              Electron main / preload IPC 경계
```

UI 컴포넌트는 파일 시스템을 직접 다루지 않고, Electron preload API와 서비스 계층을 통해 필요한 작업을 요청합니다.

---

## 기술 스택

현재 사용 중인 주요 기술:

```text
TypeScript
React
Vite
Electron
Vitest
Playwright
react-markdown
```

Electron은 데스크톱 셸과 로컬 파일 접근을 담당합니다. Vite는 렌더러 개발 서버와 빌드를 담당합니다.

---

## 시작하기

의존성 설치:

```bash
npm install
```

Electron 데스크톱 앱 실행:

```bash
npm run dev
```

이 명령은 Vite 개발 서버를 시작한 뒤 Electron 창을 열어 로컬 파일 열기, 편집, 저장 기능까지 확인할 수 있게 합니다.

렌더러 UI만 브라우저에서 확인:

```bash
npm run dev:renderer
```

브라우저 단독 실행에서는 Electron preload API가 없으므로 로컬 파일 열기, 편집, 저장 기능은 동작하지 않습니다.

---

## 검증 명령

일반적으로 변경 후 다음 명령을 사용합니다.

```bash
npm run typecheck
npm test
npm run build
```

추가로 E2E 테스트가 필요할 때는 다음 명령을 사용합니다.

```bash
npm run test:e2e
```

Electron preload API, native menu, 파일 다이얼로그, fullscreen, 디스크 저장 동작은 `npm run dev`로 Electron 앱에서 직접 검증해야 합니다.

---

## 주요 npm scripts

| 명령                     | 용도                        |
| ---------------------- | ------------------------- |
| `npm run dev`          | Vite 개발 서버와 Electron 앱 실행 |
| `npm run dev:renderer` | 브라우저에서 렌더러 UI만 실행         |
| `npm run desktop`      | Electron 앱 실행             |
| `npm run typecheck`    | TypeScript 타입 검사          |
| `npm test`             | Vitest 기반 단위 테스트 실행       |
| `npm run build`        | 타입 검사 후 프로덕션 빌드           |
| `npm run test:e2e`     | Playwright E2E 테스트 실행     |

---

## 문서 구조

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

문서와 구현이 달라지지 않도록 기능, 구조, 테스트 전략이 바뀌면 관련 문서를 함께 갱신합니다.

---

## 향후 확장 방향

MVP 이후 고려 가능한 기능:

- Google Drive 동기화
- 백링크(backlink)
- 문서 그래프
- 고급 검색
- 플러그인 시스템
- 다중 워크스페이스
- 단축키 커스터마이징

단, 현재 단계에서는 위 기능들을 구현 대상에 포함하지 않습니다.

---

## License

TBD

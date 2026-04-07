## 전략 문서 (개발 전 반드시 숙지)
- **전략 진단 리포트**: `data/STRATEGY_ANALYSIS.md`
- **PM 공통 지침**: 맥미니 루트 `pm.md`
- **gstack 빌더 철학**: 맥미니 루트 `gstack.md` — Boil the Lake, Search Before Building, 스프린트 프로세스
- **개발 프로세스**: Think → Plan → Build → Review → Test → Ship → Reflect
- **핵심 규칙**: 테스트 동시 작성, 새 패턴 도입 전 검색, 압축률 기반 추정

### 전략 핵심 요약
- Next.js 아키텍처 교육 가이드 — 비개발자 대상 웹앱 개념 학습
- 다크 테마 글래스모피즘 UI 설계
- 인터랙티브 실습 기능(코드 샌드박스) 추가로 교육 가치 극대화

---

# My Next Guide

## 프로젝트 개요
Next.js 아키텍처 학습/가이드 프로젝트. 가이드 데이터를 시각적으로 표시하는 싱글 페이지 앱.
비개발자도 이해할 수 있도록 웹 애플리케이션의 구조와 동작 원리를 설명한다.

## 기술 스택
- Framework: Next.js 16
- Language: TypeScript
- Styling: Tailwind CSS (유틸리티 클래스 기반, CSS 변수 최소)
- Icons: Lucide React
- Package Manager: bun (권장) / npm

## 프로젝트 구조
```
my-next-guide/
├── app/
│   ├── globals.css      ← 다크 테마 CSS 변수 (Slate-950 배경)
│   ├── layout.tsx        ← 루트 레이아웃
│   └── page.tsx          ← 메인 페이지 (정적 데이터)
└── tailwind.config.ts    ← Tailwind 설정 (커스텀 그라데이션)
```

## 디자인 특징
- 다크 모드 전용 (Slate-950 배경 #020617)
- 한국 전통색 모던 해석: 적(red-500), 황(orange/yellow-500), 청(blue-500)
- 글래스모피즘 카드 (backdrop-blur-md)
- 그라데이션 텍스트 (red → orange → yellow)
- 상세 내용은 DESIGN_GUIDE.md 참조

## 개발 규칙

### 코드 스타일
- 시맨틱 라인 브레이크: UI 텍스트는 의미 단위로 줄바꿈
- 한글 우선 원칙: 모든 UI 텍스트와 주석은 한국어
- TypeScript strict mode 사용
- 컴포넌트: 함수형 컴포넌트, 인라인 정의 (파일 상단에 Badge, GlassCard 등)

### 디자인 준수
- 반응형 브레이크포인트: 640, 768, 1024, 1280px
- 다크 테마 전용: 라이트 모드 미지원
- Tailwind CSS 유틸리티 클래스 사용 (CSS Modules 미사용)
- 접근성: WCAG 2.1 AA 기준
- 상세 규칙은 DESIGN_GUIDE.md 참조

### Git 규칙
- 커밋 메시지: 한글 (feat:, fix:, refactor:, chore: 접두사)
- 브랜치: main → feature/기능명
- PR 필수 (셀프 리뷰 가능)

### 배포
- 대상 서버: NCP (server.vibers.co.kr)
- Docker 컨테이너 기반 배포 예정
- CI/CD: GitHub Actions

## 주요 명령어
```bash
bun install        # 의존성 설치
bun dev            # 개발 서버
bun run build      # 빌드
bun test           # 테스트
```

## AI Recipe 이미지 API

이 프로젝트는 **AI Recipe 중앙 이미지 서비스**를 사용합니다.

### 사용 가능한 함수

```typescript
import { searchStockImage, generateAIImage } from '@/lib/ai-recipe-client';
```

### Stock Image 검색
```typescript
const image = await searchStockImage('web development architecture diagram', {
  orientation: 'landscape',
  size: 'medium',
});
// → { url, provider, alt, photographer, ... }
```

### AI 이미지 생성
```typescript
const image = await generateAIImage('educational illustration showing web app architecture, clean infographic style', {
  size: 'large',
  provider: 'auto',
});
// → { url, prompt, provider }
```

### 주요 용도
- 가이드 일러스트
- 아키텍처 다이어그램 보조
- 개념 설명 시각 자료

### 주의사항
- Server Action이나 API Route에서만 사용 (API 키 보호)
- Rate Limit: 1000회/일
- AI Recipe 서버 실행 필요: http://localhost:3300

## 상위 브랜드
- 회사: 계발자들 (Vibers)
- 도메인: vibers.co.kr
- 서버: server.vibers.co.kr


## 세션로그 기록 (필수)
- 모든 개발 대화의 주요 내용을 `session-logs/` 폴더에 기록할 것
- 파일명: `YYYY-MM-DD_한글제목.md` / 내용: 한글
- 세션 종료 시, 마일스톤 달성 시, **컨텍스트 압축 전**에 반드시 저장
- 상세 포맷은 상위 CLAUDE.md 참조

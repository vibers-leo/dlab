# My Next Guide — 디자인 가이드

> 상위 브랜드: 계발자들 (Vibers)

## 프로젝트 디자인 컨셉

Next.js 아키텍처 학습 가이드. 다크 모드 전용 인터페이스로, 코딩/기술 문서의 몰입감을 극대화한다.
한국 전통 오방색에서 영감받은 강조 컬러(적색, 황색, 청색)를 현대적으로 재해석하여 사용한다.

## 타이포그래피

- 기본 폰트: 시스템 sans-serif (`font-sans`)
- 본문 사이즈: 16px (text-base)
- 제목 사이즈: 48px~80px (text-5xl ~ text-7xl)
- 소제목: 24px~36px (text-3xl ~ text-4xl)
- 폰트 굵기: bold (700) ~ black (900) 제목, medium (500) 본문
- 행간: relaxed (1.625)
- 자간: tracking-tight (제목)

## 컬러 시스템

### 배경 (다크 전용)
- 기본 배경: `#020617` (Slate-950, CSS 변수: `--background-start-rgb: 2, 6, 23`)
- 카드 배경: `#0F172A` (Slate-900, opacity 60%)
- 카드 호버: `#1E293B` (Slate-800, opacity 80%)
- 전경(텍스트): `#FFFFFF` (CSS 변수: `--foreground-rgb: 255, 255, 255`)

### 주요 컬러 (한국 전통색 현대 해석)
- 적색 (Primary Accent): `red-500` (#EF4444) — 핵심 강조, CTA, 선택 표시
- 황색 (Secondary Accent): `orange-500` (#F97316) ~ `yellow-500` (#EAB308) — 그라데이션 중간, 코드블록 창 장식
- 청색 (Info): `blue-500` (#3B82F6) ~ `blue-400` (#60A5FA) — 정보 표시, 사용자 아이콘, 배경 앰비언스

### 보조 컬러
- 녹색 (Success): `emerald-500` (#10B981) ~ `emerald-400` (#34D399) — 네트워크/성공 상태
- 자주색 (Feature): `purple-500` (#A855F7) ~ `purple-400` (#C084FC) — 특별 기능 표시
- 슬레이트: `slate-300` (#CBD5E1) 본문, `slate-400` (#94A3B8) 부제, `slate-500` (#64748B) 보조 텍스트

### 그라데이션
- 히어로 텍스트: `bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500`
- 섹션 번호: `bg-gradient-to-r from-red-500 to-orange-500`
- 선택 영역: `selection:bg-red-500 selection:text-white`

### 배경 앰비언스
- 좌상단: `blue-900/10` 블러 원형
- 우하단: `red-900/10` 블러 원형
- 노이즈 오버레이: `opacity-20 mix-blend-overlay`

## 레이아웃

- 최대 너비: 1280px (`max-w-7xl`)
- 히어로 최대 너비: 1024px (`max-w-5xl`)
- 기본 패딩: `px-4` (모바일) / `px-6` (sm) / `px-8` (lg)
- 섹션 상단 여백: `pt-32` (히어로), `mt-16` (섹션 제목)
- 하단 여백: `pb-32` (메인)
- 카드 패딩: `p-6` (기본), `p-10` (대형 카드)

## 반응형 브레이크포인트

- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## 컴포넌트 규칙

### 카드 (GlassCard)
- 배경: `bg-[#0F172A]/60 backdrop-blur-md`
- 테두리: `border border-white/5`
- 라운드: `rounded-3xl`
- 호버: `hover:scale-[1.01] hover:bg-[#1E293B]/80 hover:border-red-500/30`
- 그림자: `hover:shadow-2xl hover:shadow-red-900/20`

### 배지 (Badge)
- 형태: `rounded-full text-xs font-medium border`
- 색상별: 투명 배경 + 10% 불투명도 + 20% 테두리
- 예: `bg-red-500/10 text-red-400 border-red-500/20`

### 코드 블록 (CodeBlock)
- 배경: `bg-[#020617]`
- 테두리: `border border-slate-800`
- 그림자: `shadow-xl`
- 폰트: `font-mono text-xs`
- 상단바: 빨강/노랑/초록 점 3개 (맥 스타일)

### 섹션 헤더 (SectionHeader)
- 번호: 그라데이션 텍스트 (red → orange), `text-3xl md:text-4xl font-black`
- 제목: `text-3xl md:text-4xl font-bold text-white tracking-tight`

### 아이콘
- 크기: 20px (기본) / 32px (히어로 아이콘)
- 히어로 아이콘 컨테이너: `w-20 h-20 rounded-full` + 글로우 효과

## 애니메이션

- 전환: `transition-all duration-300`
- 호버 스케일: `hover:scale-[1.01]`
- 펄스: `animate-ping` (상태 표시등)
- 펄스 아이콘: `animate-pulse` (화살표)
- 색상 전환: `transition-colors`

## 접근성

- 최소 대비: 4.5:1 (일반 텍스트), 3:1 (큰 텍스트)
- 선택 영역 하이라이트: `selection:bg-red-500 selection:text-white`
- 키보드 내비게이션 지원
- 노이즈 텍스처: `pointer-events-none` (상호작용 방해 방지)

'use client';

import { useEffect, useRef, useState } from 'react';

const SECTIONS = ['hero', 'identity', 'history', 'numbers', 'services', 'collab', 'process', 'news', 'flow', 'contact'];

const NEWS = [
  { date: '2026.04', tag: '협업', title: '계발자들 어드민킷 v1 출시', desc: 'vibers.co.kr 통합 어드민 시스템 공개' },
  { date: '2026.03', tag: '런칭', title: '바이브폴리오 오픈베타', desc: '포트폴리오 빌더 SaaS vibefolio.net 시작' },
  { date: '2026.03', tag: '협업', title: '세모폰 랜딩 공개', desc: '중고폰 거래 플랫폼 semophone.co.kr 오픈' },
  { date: '2026.02', tag: '기획', title: '부산 봄꽃 전시회 홈페이지', desc: '2026 지역 행사 공식 디지털 창구 제작' },
  { date: '2025.12', tag: '런칭', title: '팬이지 야화·올루올루 사이트', desc: 'B2B 브랜드 사이트 연속 런칭' },
  { date: '2025.10', tag: '개발', title: '누수체크 서비스 개발 착수', desc: 'IoT 연동 누수 탐지 플랫폼 nusucheck.com' },
];

const COLLAB_CARDS = [
  {
    partner: '계발자들',
    tag: '× Vibers',
    tagColor: 'bg-green-50 text-green-700',
    borderColor: 'border-green-200',
    desc: '전문 계발자 협업 서비스를 함께 만들었습니다. AI 활용, 앱 개발 역량을 갖춘 계발자들과 디랩의 기획·실행력이 만났습니다.',
    output: '협업 플랫폼 · 어드민킷 · 다수 프로젝트',
    detail: '계발자들(Vibers)은 IT 전문가 네트워크를 기반으로 기업의 기술 파트너 역할을 합니다. 디랩은 초기 기획 단계부터 함께하며 사이트 구조 설계, 관리자 시스템 개발, 다수의 고객사 프로젝트를 공동 수행했습니다. 현재도 신규 서비스 개발 및 운영에 지속 협력 중입니다.',
    highlights: ['vibers.co.kr 사이트 설계·개발', '통합 어드민 시스템(Admin Kit)', '고객사 5개 이상 공동 프로젝트'],
  },
  {
    partner: '디어스',
    tag: '× D.US',
    tagColor: 'bg-blue-50 text-blue-700',
    borderColor: 'border-blue-200',
    desc: '소상공인을 위한 홈페이지 제작을 쉽게 하는 서비스를 만들었습니다. 에이전시 플랫폼의 기술 구조를 디랩이 함께 설계했습니다.',
    output: '에이전시 플랫폼 · 템플릿 마켓 · 멀티 테넌시',
    detail: '디어스(D.US)는 소상공인 전문 홈페이지 에이전시 SaaS 플랫폼입니다. 디랩은 초기 브랜드 포지셔닝과 서비스 설계에 참여하여 멀티 테넌시 아키텍처, 에이전시 계층 구조, 템플릿 마켓플레이스를 함께 구상했습니다.',
    highlights: ['에이전시 플랫폼 아키텍처 설계', '템플릿 마켓 기획', '서브도메인 자동 발급 시스템'],
  },
  {
    partner: '팬이지',
    tag: '× FanEasy',
    tagColor: 'bg-purple-50 text-purple-700',
    borderColor: 'border-purple-200',
    desc: '인플루언서와 팬을 연결하는 페이지 빌더. 다양한 브랜드 사이트의 기획과 운영에 함께 참여했습니다.',
    output: '브랜드 사이트 다수 · 올루올루 · 야화 · 비즈온',
    detail: '팬이지(FanEasy)는 브랜드와 고객을 연결하는 페이지 빌더 플랫폼입니다. 디랩은 올루올루, 야화, 비즈온 등 10개 이상의 브랜드 사이트 기획과 콘텐츠 구조 설계에 참여했습니다. 각 브랜드의 성격에 맞는 디지털 공간 기획을 전담했습니다.',
    highlights: ['올루올루 브랜드 사이트', '야화 랜딩 페이지 기획', '10개 이상 브랜드 디지털 공간 설계'],
  },
  {
    partner: '새로운 협업',
    tag: '+ Open',
    tagColor: 'bg-gray-50 text-gray-500',
    borderColor: 'border-dashed border-gray-200',
    desc: '세상을 이롭게 하는 목적이 같다면, 어떤 파트너와도 함께합니다. 먼저 이야기해보세요.',
    output: '기획 · 개발 · 운영 모든 영역',
    detail: '같이 가치 만들어요. 디랩은 규모나 분야보다 방향이 맞는 파트너를 찾습니다. 좋은 아이디어가 있고 세상에 내보내고 싶다면, 그것으로 충분한 이유가 됩니다.',
    highlights: ['기획 단계부터 함께', '개발·운영 파트너십', '장기 협력 우선'],
    isOpen: true,
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [selectedCollabIdx, setSelectedCollabIdx] = useState(0);
  const [showStackModal, setShowStackModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setCurrent(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="snap-container h-screen overflow-y-scroll"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {/* 우측 도트 네비 */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {SECTIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              current === i
                ? 'w-3 h-3 bg-blue-400 scale-110'
                : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </nav>

      {/* ── Slide 1: Hero ── */}
      <section
        ref={(el) => { sectionRefs.current[0] = el; }}
        className="relative flex flex-col h-dvh overflow-hidden"
        style={{ scrollSnapAlign: 'start', backgroundColor: '#051226' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute top-[-5rem] right-[-5rem] w-96 h-96 rounded-full border border-blue-400/20 pointer-events-none" />
        <div className="absolute top-[-3rem] right-[-3rem] w-64 h-64 rounded-full border border-blue-400/10 pointer-events-none" />
        <div className="absolute top-8 right-8 w-32 h-32 rounded-full border border-blue-400/15 pointer-events-none" />
        <div className="absolute bottom-20 left-[-4rem] w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="absolute top-8 left-10 text-lg font-extrabold" style={{ letterSpacing: '-0.02em' }}>
          <span style={{ color: '#60A5FA' }}>:</span>
          <span className="text-white">DLAB</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
          <span className="border border-blue-400/50 text-blue-100 px-4 py-1 rounded-full text-sm tracking-widest mb-6">
            "세상과 연결되는 방법을 연구합니다"
          </span>
          <h1 className="text-7xl sm:text-8xl font-extrabold text-white leading-tight mb-2">
            세상을 이롭게,
          </h1>
          <h2 className="text-7xl sm:text-8xl font-extrabold leading-tight mb-8" style={{ color: '#60A5FA' }}>
            함께 만듭니다.
          </h2>
          <p className="text-blue-200/70 text-lg mb-12">
            기획 · 연구 · 구현 · 협력 — 가치 있는 것들을 끝까지
          </p>
          <div className="flex gap-4">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo(9); }}
              className="px-8 py-3.5 bg-blue-500 text-white font-semibold rounded-full text-sm tracking-wide hover:bg-blue-400 transition-colors"
            >
              함께 시작하기
            </a>
            <button
              onClick={() => scrollTo(4)}
              className="px-8 py-3.5 border border-blue-400/50 text-blue-200 font-semibold rounded-full text-sm tracking-wide hover:bg-blue-500/10 transition-colors"
            >
              작업물 보기
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 right-10 text-sm tracking-widest text-blue-400/50">
          ↓ scroll
        </div>
      </section>

      {/* ── Slide 2: Identity ── */}
      <section
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="relative flex flex-col h-dvh items-center justify-center px-10 overflow-hidden"
        style={{ scrollSnapAlign: 'start', backgroundColor: '#0B2447' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#1565C0' }} />
        <span
          className="absolute left-8 top-1/2 -translate-y-1/2 font-extrabold select-none leading-none pointer-events-none"
          style={{ fontSize: '20rem', color: 'rgba(21,101,192,0.15)' }}
        >
          02
        </span>

        <div className="relative z-10 max-w-5xl w-full">
          <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-16">
            디랩이 믿는 것들
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { title: '기획 (Planning)', desc: '아이디어에 구조를 만드는 일', dot: 'bg-blue-500' },
              { title: '설득 (Persuasion)', desc: '가치를 언어와 형태로 전달하는 일', dot: 'bg-blue-400' },
              { title: '구현 (Making)', desc: '상상을 현실로 옮기는 일', dot: 'bg-cyan-400' },
              { title: '연결 (Connection)', desc: '사람과 사람, 공간과 이야기를 잇는 일', dot: 'bg-sky-400' },
            ].map((item) => (
              <div key={item.title}>
                <div className={`w-10 h-10 rounded-full ${item.dot} mb-4`} />
                <h3 className="font-bold text-xl mb-3 text-white">{item.title}</h3>
                <p className="text-blue-200/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-16 text-blue-300/50 text-sm tracking-widest">
            좋은 아이디어는 혼자 완성되지 않습니다.
          </p>
        </div>
      </section>

      {/* ── Slide 3: History ── */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="relative flex h-dvh items-center overflow-hidden"
        style={{ scrollSnapAlign: 'start', backgroundColor: '#0B2447' }}
      >
        <div className="absolute right-[-8rem] top-1/2 w-96 h-96 rounded-full border border-blue-500/10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-8 w-full">
          <span className="text-blue-400 text-sm tracking-widest">OUR JOURNEY</span>
          <h2 className="text-5xl font-extrabold text-white mt-3 mb-12">
            디자인에서 시작해,<br />
            <span className="text-blue-400">세상으로 넓혀왔습니다.</span>
          </h2>

          <div className="flex gap-0 relative">
            <div className="absolute top-6 left-0 right-0 h-px bg-blue-500/30" />

            {[
              { year: '2013', title: '디자인디', desc: '브랜딩, 인쇄물, UI 디자인 외주로 시작', color: 'bg-blue-700' },
              { year: '2018', title: '전시 기획', desc: '공간과 이야기를 연결하는 전시 기획으로 확장', color: 'bg-blue-500' },
              { year: '2022', title: '축제·행사 대행', desc: '지역 축제, 기업 행사의 디지털 창구 제작', color: 'bg-blue-400' },
              { year: '2023', title: ':DLAB', desc: 'AI와 개발 역량을 더해 더 많이, 더 빠르게', color: 'bg-cyan-400' },
            ].map((item, i) => (
              <div key={i} className="flex-1 relative pt-14 pr-8">
                <div className={`absolute top-4 left-0 w-4 h-4 rounded-full ${item.color} -translate-y-1/2 z-10`} />
                <span className="text-blue-300/60 text-xs font-mono">{item.year}</span>
                <h3 className="text-white font-bold text-lg mt-1">{item.title}</h3>
                <p className="text-blue-200/60 text-sm mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-blue-200/50 text-sm mt-12">
            그리고 지금, AI와 개발 역량까지 — 더 많이 만들고, 더 많이 함께합니다.
          </p>
        </div>
      </section>

      {/* ── Slide 4: Numbers ── */}
      <section
        ref={(el) => { sectionRefs.current[3] = el; }}
        className="relative flex h-dvh items-center overflow-hidden"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: '#0B2447', clipPath: 'polygon(0 0, 55% 0, 35% 100%, 0 100%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: '#F0F6FF', clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 35% 100%)' }}
        />

        <div className="relative z-10 max-w-5xl w-full mx-auto px-10 grid grid-cols-1 sm:grid-cols-2 gap-16 items-center">
          {/* 좌측 */}
          <div>
            <h2 className="text-6xl sm:text-7xl font-extrabold text-white leading-tight">
              같이
            </h2>
            <h2 className="text-6xl sm:text-7xl font-extrabold leading-tight mb-4" style={{ color: '#60A5FA' }}>
              가치 만들어요
            </h2>
            <p className="text-blue-200/50 text-sm">2013년부터 쌓아온 숫자들</p>
          </div>

          {/* 우측 — 원형 숫자 (더 크게, 오른쪽으로) */}
          <div className="flex flex-col gap-5 items-end pr-4">
            {[
              { num: '47+', label: '함께한 프로젝트', desc: '완료된 프로젝트 수' },
              { num: '12', label: '공공기관 협력', desc: '지자체·공공기관 협업' },
              { num: '8', label: '세상에 나온 서비스', desc: '올루올루 · 야화 · 세모폰 · 누수체크 외' },
            ].map((item) => (
              <div
                key={item.num}
                className="w-52 h-52 rounded-full border-2 flex flex-col items-center justify-center shrink-0"
                style={{ borderColor: '#93C5FD' }}
              >
                <span className="text-6xl font-black" style={{ color: '#1565C0' }}>{item.num}</span>
                <span className="text-sm font-bold mt-1 text-center px-4 leading-snug" style={{ color: '#0B2447' }}>{item.label}</span>
                <span className="text-xs mt-1 text-center px-6 leading-snug" style={{ color: '#42A5F5' }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slide 5: Services ── */}
      <section
        ref={(el) => { sectionRefs.current[4] = el; }}
        className="flex h-dvh items-center px-10 bg-white border-t-4 border-blue-500"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 items-start">
          <div className="pt-4">
            <h2 className="text-6xl sm:text-7xl font-extrabold" style={{ color: '#0B2447' }}>일의 범주</h2>
            <p className="mt-4 text-sm" style={{ color: '#42A5F5' }}>디랩이 함께하는 네 가지 방식</p>
          </div>

          <div className="flex flex-col divide-y divide-gray-100">
            {[
              { num: '01', name: '디지털 공간 기획', desc: '행사·전시·캠페인의 온라인 거점을 만듭니다', icon: '🎪' },
              { num: '02', name: '설득하는 콘텐츠', desc: '제안서, 브랜드 스토리, 발표 자료를 웹으로', icon: '📋' },
              { num: '03', name: '서비스 개발', desc: '앱과 웹, 처음부터 끝까지 함께 만듭니다', icon: '📱', stack: true },
              { num: '04', name: '지속 가능한 운영', desc: '만들고 끝이 아닌, 오래 함께하는 파트너십', icon: '🤝' },
            ].map((item) => (
              <div
                key={item.num}
                className="py-6 flex gap-5 items-start cursor-default pl-2 transition-all duration-200 hover:border-l-4 hover:border-l-blue-500"
              >
                <div
                  className="shrink-0 flex items-center justify-center text-lg"
                  style={{
                    width: '48px', height: '48px',
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    background: 'linear-gradient(135deg, #1565C0, #42A5F5)'
                  }}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-blue-400">{item.num}</span>
                    <h3 className="font-bold text-lg" style={{ color: '#0B2447' }}>{item.name}</h3>
                    {'stack' in item && (
                      <button
                        onClick={() => setShowStackModal(true)}
                        className="text-xs text-blue-400 border border-blue-200 px-2 py-0.5 hover:bg-blue-50 transition-colors"
                      >
                        기술 스택 보기
                      </button>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slide 6: Collab ── */}
      <section
        ref={(el) => { sectionRefs.current[5] = el; }}
        className="flex h-dvh items-center px-10 bg-white"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div className="max-w-5xl mx-auto px-8 w-full">
          <span className="text-blue-500 text-sm tracking-widest">COLLABORATION</span>
          <h2 className="text-5xl font-extrabold text-gray-900 mt-3 mb-3">
            함께 만든 것들
          </h2>
          <p className="text-gray-400 mb-10">
            디랩은 좋은 파트너와 함께할 때 더 큰 일을 합니다. 카드를 눌러 자세히 보세요.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {COLLAB_CARDS.map((item, i) => (
              <button
                key={i}
                onClick={() => { setSelectedCollabIdx(i); setShowCollabModal(true); }}
                className={`border ${item.borderColor} rounded p-6 text-left hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.tagColor}`}>{item.tag}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.partner}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{item.desc}</p>
                <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">{item.output}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slide 7: Process ── */}
      <section
        ref={(el) => { sectionRefs.current[6] = el; }}
        className="relative flex h-dvh items-center px-10 overflow-hidden"
        style={{ scrollSnapAlign: 'start', backgroundColor: '#0B2447' }}
      >
        <div
          className="absolute top-[-4rem] left-[-4rem] w-64 h-64 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(21,101,192,0.2)', filter: 'blur(60px)' }}
        />

        <div className="relative z-10 max-w-5xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-6xl sm:text-7xl font-extrabold text-white leading-tight">
              우리가<br />일하는<br />방식
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-blue-300/80">
              모든 프로젝트는 이 5단계를<br />거쳐 완성됩니다
            </p>
          </div>

          <div className="relative flex flex-col gap-7 pl-8 border-l-2" style={{ borderColor: '#1565C0' }}>
            {[
              { step: '01', title: '발견', desc: '함께 문제를 정의합니다' },
              { step: '02', title: '제안', desc: '방향과 방법을 함께 그립니다' },
              { step: '03', title: '협업', desc: '만들면서 계속 이야기합니다' },
              { step: '04', title: '완성', desc: '세상에 내보냅니다' },
              { step: '05', title: '이어가기', desc: '끝이 아닌 시작 — 계속 함께 만들어갑니다' },
            ].map((item) => (
              <div key={item.step} className="relative flex items-center gap-5">
                <div className="absolute -left-[2.35rem] w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-300" />
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-bold text-sm w-6 text-blue-400">{item.step}</span>
                  <div>
                    <span className="text-white font-semibold">{item.title}</span>
                    <span className="text-sm ml-3 text-blue-300/80">{item.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slide 8: News ── */}
      <section
        ref={(el) => { sectionRefs.current[7] = el; }}
        className="flex h-dvh items-center overflow-hidden"
        style={{ scrollSnapAlign: 'start', backgroundColor: '#051226' }}
      >
        <div className="max-w-5xl mx-auto px-8 w-full">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-blue-400 text-sm tracking-widest">LATEST</span>
              <h2 className="text-5xl font-extrabold text-white mt-2">최신 소식</h2>
            </div>
            <a href="/works" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
              전체 보기 →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NEWS.map((item, i) => (
              <div key={i} className="border border-blue-900/50 rounded-xl p-5 hover:border-blue-500/50 hover:bg-blue-950/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full font-medium">
                    {item.tag}
                  </span>
                  <span className="text-xs text-blue-400/50 font-mono">{item.date}</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1.5 leading-snug">{item.title}</h3>
                <p className="text-blue-200/40 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slide 9: 협업 절차 ── */}
      <section
        ref={(el) => { sectionRefs.current[8] = el; }}
        className="flex h-dvh items-center px-10"
        style={{ scrollSnapAlign: 'start', backgroundColor: '#F0F6FF' }}
      >
        <div className="max-w-4xl w-full mx-auto">
          <span className="text-blue-500 text-sm tracking-widest">HOW WE WORK TOGETHER</span>
          <h2 className="text-5xl sm:text-6xl font-extrabold mt-3 mb-4" style={{ color: '#0B2447' }}>
            함께하는 방법
          </h2>
          <p className="text-gray-500 mb-14">가격표보다 대화가 먼저입니다. 프로젝트의 크기와 가격은 함께 만들어갑니다.</p>

          {/* 플로우 스텝 */}
          <div className="relative">
            {/* 연결선 */}
            <div className="absolute top-8 left-8 right-8 h-0.5 hidden sm:block" style={{ backgroundColor: '#BFDBFE' }} />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
              {[
                {
                  num: '01',
                  title: '협업 문의',
                  desc: '어떤 일을 함께하고 싶은지 가볍게 이야기해주세요. 형식 없이 편하게.',
                  icon: '💬',
                  accent: '#3B82F6',
                },
                {
                  num: '02',
                  title: '제안',
                  desc: '방향, 범위, 일정을 정리한 제안서를 드립니다. 가격도 이때 함께.',
                  icon: '📄',
                  accent: '#1D4ED8',
                },
                {
                  num: '03',
                  title: '협업',
                  desc: '만들면서 계속 이야기합니다. 완성까지 함께 있습니다.',
                  icon: '🔨',
                  accent: '#1E40AF',
                },
                {
                  num: '04',
                  title: '지속 가능한 유지관리',
                  desc: '런칭 후에도 끝이 아닙니다. 오래 함께하는 파트너십.',
                  icon: '🌱',
                  accent: '#0B2447',
                },
              ].map((item) => (
                <div key={item.num} className="flex flex-col items-start sm:items-center sm:text-center">
                  {/* 아이콘 원 */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 shrink-0"
                    style={{ backgroundColor: item.accent }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold mb-1" style={{ color: item.accent }}>{item.num}</span>
                  <h3 className="font-extrabold text-base mb-2" style={{ color: '#0B2447' }}>{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={() => scrollTo(9)}
              className="px-10 py-4 bg-[#0B2447] text-white font-bold text-sm rounded-full hover:bg-[#1565C0] transition-colors"
            >
              같이 가치 만들어요 →
            </button>
          </div>
        </div>
      </section>

      {/* ── Slide 10: Contact ── */}
      <section
        ref={(el) => { sectionRefs.current[9] = el; }}
        id="contact"
        className="relative flex flex-col h-dvh overflow-hidden"
        style={{ scrollSnapAlign: 'start', background: 'linear-gradient(135deg, #051226 0%, #0B2447 50%, #1565C0 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute bottom-[-8rem] right-[-8rem] w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute bottom-[-5rem] right-[-5rem] w-64 h-64 rounded-full border border-white/[0.07] pointer-events-none" />

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white mb-4 leading-tight">
            같이 만들어요.
          </h2>
          <p className="text-lg mb-10 text-blue-300/80">좋은 아이디어가 있다면, 그것으로 충분합니다.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-blue-500 text-white font-bold text-sm tracking-wide rounded-full hover:bg-blue-400 transition-colors"
            >
              이야기 시작하기
            </button>
            <a
              href="mailto:hello@designdlab.co.kr"
              className="px-8 py-4 border border-white/30 text-white font-semibold text-sm rounded-full hover:bg-white/10 transition-colors"
            >
              메일 보내기
            </a>
          </div>
        </div>

        <footer className="relative z-10 border-t border-white/10 py-6 px-10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-sm font-extrabold text-white/40" style={{ letterSpacing: '-0.02em' }}>
            <span className="text-blue-400/60">:</span>DLAB · 계발자들 협력사
          </span>
          <span className="text-sm text-blue-300/40">디랩은 혼자 만들지 않습니다.</span>
          <span className="text-sm text-white/20">© {new Date().getFullYear()} 디랩. All rights reserved.</span>
        </footer>
      </section>

      {/* ── 협업 카드 모달 (2열 마스터-디테일) ── */}
      {showCollabModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCollabModal(false); }}
        >
          <div className="bg-white w-full max-w-4xl mx-4 flex overflow-hidden" style={{ height: '560px' }}>
            {/* 좌측 목록 */}
            <div className="w-56 shrink-0 border-r border-gray-100 flex flex-col">
              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-xs font-bold tracking-widest text-gray-400">COLLABORATION</p>
              </div>
              {COLLAB_CARDS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCollabIdx(i)}
                  className={`px-6 py-4 text-left border-b border-gray-50 transition-colors ${
                    selectedCollabIdx === i
                      ? 'bg-[#0B2447] text-white'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <p className={`text-xs font-bold mb-0.5 ${selectedCollabIdx === i ? 'text-blue-300' : 'text-gray-400'}`}>
                    {item.tag}
                  </p>
                  <p className={`text-sm font-semibold ${selectedCollabIdx === i ? 'text-white' : 'text-gray-800'}`}>
                    {item.partner}
                  </p>
                </button>
              ))}
            </div>

            {/* 우측 상세 */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* 상단 헤더 */}
              <div className="flex items-start justify-between px-10 py-7 border-b border-gray-100">
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 ${COLLAB_CARDS[selectedCollabIdx].tagColor}`}>
                    {COLLAB_CARDS[selectedCollabIdx].tag}
                  </span>
                  <h3 className="text-2xl font-extrabold text-gray-900 mt-2">
                    {COLLAB_CARDS[selectedCollabIdx].partner}
                  </h3>
                </div>
                <button
                  onClick={() => setShowCollabModal(false)}
                  className="text-gray-300 hover:text-gray-600 text-3xl leading-none transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* 본문 */}
              <div className="px-10 py-8 flex-1">
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  {COLLAB_CARDS[selectedCollabIdx].detail}
                </p>

                <p className="text-xs font-bold text-gray-300 tracking-widest mb-4">함께한 것들</p>
                <ul className="space-y-3">
                  {COLLAB_CARDS[selectedCollabIdx].highlights.map((h) => (
                    <li key={h} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 하단 */}
              {COLLAB_CARDS[selectedCollabIdx].isOpen && (
                <div className="px-10 py-6 border-t border-gray-100">
                  <button
                    onClick={() => { setShowCollabModal(false); setShowModal(true); }}
                    className="px-6 py-2.5 bg-[#0B2447] text-white font-bold text-sm hover:bg-[#1565C0] transition-colors"
                  >
                    함께 이야기하기 →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 기술 스택 모달 ── */}
      {showStackModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowStackModal(false); }}
        >
          <div className="bg-white w-full max-w-5xl mx-4 overflow-hidden" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            {/* 헤더 */}
            <div className="flex items-start justify-between px-10 py-7 border-b border-gray-100" style={{ backgroundColor: '#0B2447' }}>
              <div>
                <p className="text-xs font-bold tracking-widest text-blue-300 mb-2">TECHNOLOGY</p>
                <h3 className="text-2xl font-extrabold text-white">검증된 최신 기술로 만듭니다</h3>
                <p className="text-blue-300/70 text-sm mt-1">빠르고, 안정적이고, 오래 쓸 수 있는 서비스</p>
              </div>
              <button
                onClick={() => setShowStackModal(false)}
                className="text-blue-300/60 hover:text-white text-3xl leading-none transition-colors shrink-0"
              >✕</button>
            </div>

            {/* 본문 */}
            <div className="px-10 py-8">
              <p className="text-gray-600 text-sm leading-relaxed mb-10">
                디랩이 사용하는 기술은 넷플릭스, 에어비앤비, 깃허브 같은 전 세계 서비스들이 실제로 쓰고 있는 도구입니다.
                검증된 기술을 쓴다는 건 — 처음부터 잘 만들어진 길을 걷는 것과 같습니다.
                시간이 지나도 고장나지 않고, 필요할 때 빠르게 고칠 수 있습니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {[
                  { icon: '⚡', title: '열리는 속도가 빠릅니다', desc: '첫 화면을 서버에서 미리 준비해서 보내줍니다. 느린 인터넷 환경에서도 기다리는 시간이 짧습니다.' },
                  { icon: '🔍', title: '검색에 잘 잡힙니다', desc: 'Google, 네이버가 페이지 내용을 바로 읽을 수 있어서 검색 결과 상위에 노출되기 유리합니다.' },
                  { icon: '🛡️', title: '안정적으로 운영됩니다', desc: '20년 이상 수백만 서비스가 사용하며 다듬어진 기술입니다. 예상치 못한 오류가 적습니다.' },
                  { icon: '🚀', title: '빠르게 만들 수 있습니다', desc: '새로운 기능을 추가하거나 수정할 때 기존 구조를 건드리지 않고 붙일 수 있어 개발 속도가 빠릅니다.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-7">
                <p className="text-xs font-bold tracking-widest text-gray-300 mb-3">디랩이 쓰는 기술</p>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'Ruby on Rails', 'React', 'TypeScript', 'Firebase', 'Vercel', 'PostgreSQL'].map((t) => (
                    <span key={t} className="text-xs px-3 py-1 bg-gray-50 text-gray-600 border border-gray-100 font-medium">{t}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                  기술 이름이 낯설어도 괜찮습니다. 중요한 건 어떤 기술이냐가 아니라, 그것으로 무엇을 만들 수 있느냐니까요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 문의 모달 ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >×</button>

            <h3 className="text-2xl font-extrabold text-gray-900 mb-1">이야기 시작하기</h3>
            <p className="text-gray-400 text-sm mb-6">디랩 팀이 직접 답변드립니다.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                window.open(`mailto:hello@designdlab.co.kr?subject=[협업 문의] ${data.get('name')}&body=${data.get('message')}`, '_blank');
                setShowModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">이름 / 소속</label>
                <input name="name" required placeholder="홍길동 / 디랩"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">연락처</label>
                <input name="contact" placeholder="이메일 또는 연락처"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">어떤 일을 함께하고 싶으신가요?</label>
                <textarea name="message" required rows={4} placeholder="프로젝트나 아이디어를 간단히 알려주세요."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none" />
              </div>
              <button type="submit"
                className="w-full bg-[#0B2447] text-white font-bold py-3.5 rounded-xl hover:bg-[#1565C0] transition-colors text-sm">
                메일로 보내기
              </button>
            </form>

            <div className="mt-4 text-center">
              <a href="https://open.kakao.com" target="_blank" rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-yellow-600 transition-colors">
                카카오로 바로 연락하기 →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

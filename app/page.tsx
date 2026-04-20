'use client';

import { useEffect, useRef, useState } from 'react';

const SECTIONS = ['hero', 'identity', 'history', 'numbers', 'services', 'collab', 'process', 'news', 'pricing', 'contact'];

const NEWS = [
  { date: '2026.04', tag: '협업', title: '계발자들 어드민킷 v1 출시', desc: 'vibers.co.kr 통합 어드민 시스템 공개' },
  { date: '2026.03', tag: '런칭', title: '바이브폴리오 오픈베타', desc: '포트폴리오 빌더 SaaS vibefolio.net 시작' },
  { date: '2026.03', tag: '협업', title: '세모폰 랜딩 공개', desc: '중고폰 거래 플랫폼 semophone.co.kr 오픈' },
  { date: '2026.02', tag: '기획', title: '부산 봄꽃 전시회 홈페이지', desc: '2026 지역 행사 공식 디지털 창구 제작' },
  { date: '2025.12', tag: '런칭', title: '팬이지 야화·올루올루 사이트', desc: 'B2B 브랜드 사이트 연속 런칭' },
  { date: '2025.10', tag: '개발', title: '누수체크 서비스 개발 착수', desc: 'IoT 연동 누수 탐지 플랫폼 nusucheck.com' },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);
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
      style={{ scrollSnapType: undefined }}
      data-snap="true"
    >
      {/* 우측 도트 네비 */}
      <nav className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-3">
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
        style={{ backgroundColor: '#051226' }}
      >
        {/* 도트 그리드 배경 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

        {/* 우상단 원형 장식 */}
        <div className="absolute top-[-5rem] right-[-5rem] w-96 h-96 rounded-full border border-blue-400/20 pointer-events-none" />
        <div className="absolute top-[-3rem] right-[-3rem] w-64 h-64 rounded-full border border-blue-400/10 pointer-events-none" />
        <div className="absolute top-8 right-8 w-32 h-32 rounded-full border border-blue-400/15 pointer-events-none" />

        {/* 좌하단 블루 블러 원 */}
        <div className="absolute bottom-20 left-[-4rem] w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        {/* 로고 */}
        <div className="absolute top-6 left-4 sm:top-8 sm:left-10 text-lg font-extrabold" style={{ letterSpacing: '-0.02em' }}>
          <span style={{ color: '#60A5FA' }}>:</span>
          <span className="text-white">DLAB</span>
        </div>

        {/* 중앙 콘텐츠 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
          <span className="border border-blue-400/50 text-blue-100 px-4 py-1 rounded-full text-sm tracking-widest mb-6">
            "세상과 연결되는 방법을 연구합니다"
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-white leading-tight mb-2">
            세상을 이롭게,
          </h1>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-extrabold leading-tight mb-8" style={{ color: '#60A5FA' }}>
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

        {/* 스크롤 힌트 */}
        <div className="hidden sm:block absolute bottom-8 right-10 text-sm tracking-widest text-blue-400/50">
          ↓ scroll
        </div>
      </section>

      {/* ── Slide 2: Identity ── */}
      <section
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="relative flex flex-col h-dvh items-center justify-center px-4 sm:px-10 overflow-hidden"
        style={{ backgroundColor: '#0B2447' }}
      >
        {/* 좌측 세로 라인 */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#1565C0' }} />

        {/* 배경 숫자 */}
        <span
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 font-extrabold select-none leading-none pointer-events-none"
          style={{ fontSize: 'clamp(8rem, 25vw, 20rem)', color: 'rgba(21,101,192,0.15)' }}
        >
          02
        </span>

        <div className="relative z-10 max-w-5xl w-full">
          <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-4">
            :D for Design / Drawing / Dreaming
          </h2>
          <p className="text-blue-300/70 text-lg mb-12">
            디자인을 도구로 가치있는 일을 하는 사람이 되자 —<br />
            이로운 일을 비즈니스로 만드는 디자인 회사
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { title: 'Design', desc: '문제를 해결하는 시각 언어를 만드는 일', dot: 'bg-blue-500' },
              { title: 'Drawing', desc: '아이디어를 형태로 끌어내는 일', dot: 'bg-blue-400' },
              { title: 'Dreaming', desc: '더 나은 세상을 상상하고 실현하는 일', dot: 'bg-sky-400' },
              { title: 'Doing', desc: '상상을 현실로 옮기는 실행의 일', dot: 'bg-cyan-400' },
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
        style={{ backgroundColor: '#0B2447' }}
      >
        {/* 배경 장식 원 */}
        <div className="absolute right-[-8rem] top-1/2 w-96 h-96 rounded-full border border-blue-500/10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-8 w-full">
          {/* 상단 태그 */}
          <span className="text-blue-400 text-sm tracking-widest">OUR JOURNEY</span>
          <h2 className="text-5xl font-extrabold text-white mt-3 mb-12">
            디자인에서 시작해,<br />
            <span className="text-blue-400">이로운 비즈니스로 넓혀왔습니다.</span>
          </h2>

          {/* 타임라인 */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-0 relative">
            {/* 연결선 (데스크톱만) */}
            <div className="hidden sm:block absolute top-6 left-0 right-0 h-px bg-blue-500/30" />

            {[
              { year: '2012', title: '청년창업', desc: '디자인으로 세상과 연결되는 방법을 찾기 시작', color: 'bg-blue-600' },
              { year: '2016', title: '사회적기업 인증', desc: '이로운 일을 비즈니스로 만들다 — 사회적기업 공식 인증', color: 'bg-blue-500' },
              { year: '2022', title: '주식회사 디랩', desc: '전시·행사 기획과 디지털 창구 제작으로 피봇', color: 'bg-blue-400' },
              { year: '2025', title: 'AI 피봇', desc: 'AI와 개발 역량을 더해 바이브코딩 서비스 생태계 구축', color: 'bg-cyan-400' },
            ].map((item, i) => (
              <div key={i} className="flex-1 relative pt-0 sm:pt-14 pr-0 sm:pr-8 pl-6 sm:pl-0 border-l-2 sm:border-l-0 border-blue-500/30">
                {/* 도트 */}
                <div className={`absolute top-1 sm:top-4 -left-[9px] sm:left-0 w-4 h-4 rounded-full ${item.color} sm:-translate-y-1/2 z-10`} />
                <span className="text-blue-300/60 text-xs font-mono">{item.year}</span>
                <h3 className="text-white font-bold text-lg mt-1">{item.title}</h3>
                <p className="text-blue-200/60 text-sm mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 하단 */}
          <p className="text-blue-200/50 text-sm mt-12">
            세상을 이롭게, 가치있는 일을 함께 — AI와 개발 역량으로 더 많이 만들고, 더 많이 함께합니다.
          </p>
        </div>
      </section>

      {/* ── Slide 4: Numbers (대각선 분할) ── */}
      <section
        ref={(el) => { sectionRefs.current[3] = el; }}
        className="relative flex h-dvh items-center overflow-hidden"
        style={{}}
      >
        {/* 대각선 배경 분할 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: '#0B2447', clipPath: 'polygon(0 0, 60% 0, 40% 100%, 0 100%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: '#F0F6FF', clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 40% 100%)' }}
        />

        <div className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-10 grid grid-cols-1 sm:grid-cols-2 gap-16 items-center">
          {/* 좌측 */}
          <div>
            <h2 className="text-6xl sm:text-7xl font-extrabold text-white leading-tight">
              같이
            </h2>
            <h2 className="text-6xl sm:text-7xl font-extrabold leading-tight" style={{ color: '#60A5FA' }}>
              만든 것들
            </h2>
          </div>

          {/* 우측 — 원형 숫자 */}
          <div className="flex flex-col gap-6 items-center sm:items-start">
            {[
              { num: '47+', label: '함께한 프로젝트', desc: '완료한 프로젝트 수' },
              { num: '12', label: '공공·기관 협력', desc: '공공기관 협업 경험' },
              { num: '8', label: '세상에 나온 서비스', desc: 'iOS·Android 출시' },
            ].map((item) => (
              <div
                key={item.num}
                className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border-2 flex flex-col items-center justify-center shrink-0"
                style={{ borderColor: '#93C5FD' }}
              >
                <span className="text-3xl sm:text-5xl font-black" style={{ color: '#1565C0' }}>{item.num}</span>
                <span className="text-xs sm:text-sm font-semibold mt-1" style={{ color: '#0B2447' }}>{item.label}</span>
                <span className="text-[10px] sm:text-xs mt-0.5" style={{ color: '#42A5F5' }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slide 5: Services ── */}
      <section
        ref={(el) => { sectionRefs.current[4] = el; }}
        className="flex h-dvh items-center px-4 sm:px-10 bg-white border-t-4 border-blue-500"
        style={{}}
      >
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 items-start">
          {/* 좌측 타이틀 */}
          <div className="pt-4">
            <h2 className="text-6xl sm:text-7xl font-extrabold" style={{ color: '#0B2447' }}>일의 범주</h2>
            <p className="mt-4 text-sm" style={{ color: '#42A5F5' }}>디랩이 함께하는 네 가지 방식</p>
          </div>

          {/* 우측 서비스 목록 */}
          <div className="flex flex-col divide-y divide-gray-100">
            {[
              { num: '01', name: '디지털 공간 기획', desc: '행사·전시·캠페인의 온라인 거점을 만듭니다', icon: '🎪' },
              { num: '02', name: '설득하는 콘텐츠', desc: '제안서, 브랜드 스토리, 발표 자료를 웹으로', icon: '📋' },
              { num: '03', name: '서비스 개발', desc: '앱과 웹, 처음부터 끝까지 함께 만듭니다', icon: '📱' },
              { num: '04', name: '지속 가능한 운영', desc: '만들고 끝이 아닌, 오래 함께하는 파트너십', icon: '🤝' },
            ].map((item) => (
              <div
                key={item.num}
                className="py-6 flex gap-5 items-start cursor-default pl-2 transition-all duration-200 hover:border-l-4 hover:border-l-blue-500"
              >
                {/* 육각형 아이콘 */}
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
        className="flex h-dvh items-center px-4 sm:px-10 bg-white"
        style={{}}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-8 w-full">
          <span className="text-blue-500 text-sm tracking-widest">COLLABORATION</span>
          <h2 className="text-5xl font-extrabold text-gray-900 mt-3 mb-3">
            함께 만든 것들
          </h2>
          <p className="text-gray-400 mb-12">
            디랩은 좋은 파트너와 함께할 때 더 큰 일을 합니다.
          </p>

          {/* 협업 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                partner: '계발자들',
                tag: '× Vibers',
                tagColor: 'bg-green-50 text-green-700',
                desc: '전문 계발자 협업 서비스를 함께 만들었습니다. AI 활용, 앱 개발 역량을 갖춘 계발자들과 디랩의 기획·실행력이 만났습니다.',
                output: '협업 플랫폼 · 어드민킷 · 다수 프로젝트',
                url: 'https://vibers.co.kr',
                borderColor: 'border-green-200',
              },
              {
                partner: '디어스',
                tag: '× D.US',
                tagColor: 'bg-blue-50 text-blue-700',
                desc: '소상공인을 위한 홈페이지 제작을 쉽게 하는 서비스를 만들었습니다. 에이전시 플랫폼의 기술 구조를 디랩이 함께 설계했습니다.',
                output: '에이전시 플랫폼 · 템플릿 마켓 · 멀티 테넌시',
                url: 'https://designd.co.kr',
                borderColor: 'border-blue-200',
              },
              {
                partner: '팬이지',
                tag: '× FanEasy',
                tagColor: 'bg-purple-50 text-purple-700',
                desc: '인플루언서와 팬을 연결하는 페이지 빌더. 다양한 브랜드 사이트의 기획과 운영에 함께 참여했습니다.',
                output: '브랜드 사이트 다수 · 올루올루 · 야화 · 비즈온',
                url: 'https://faneasy.kr',
                borderColor: 'border-purple-200',
              },
              {
                partner: '새로운 협업',
                tag: '+ Open',
                tagColor: 'bg-gray-50 text-gray-500',
                desc: '세상을 이롭게 하는 목적이 같다면, 어떤 파트너와도 함께합니다. 먼저 이야기해보세요.',
                output: '기획 · 개발 · 운영 모든 영역',
                url: null,
                borderColor: 'border-dashed border-gray-200',
              },
            ].map((item, i) => (
              <div key={i} className={`border ${item.borderColor} rounded-2xl p-6 hover:-translate-y-0.5 transition-transform`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.tagColor}`}>{item.tag}</span>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-blue-500 transition-colors">
                      방문하기 →
                    </a>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.partner}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{item.desc}</p>
                <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">{item.output}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slide 7: Process ── */}
      <section
        ref={(el) => { sectionRefs.current[6] = el; }}
        className="relative flex h-dvh items-center px-4 sm:px-10 overflow-hidden"
        style={{ backgroundColor: '#0B2447' }}
      >
        {/* 블루 블러 장식 */}
        <div
          className="absolute top-[-4rem] left-[-4rem] w-64 h-64 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(21,101,192,0.2)', filter: 'blur(60px)' }}
        />

        <div className="relative z-10 max-w-5xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 items-center">
          {/* 좌측 */}
          <div>
            <h2 className="text-6xl sm:text-7xl font-extrabold text-white leading-tight">
              우리의<br />방식
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-blue-300/80">
              모든 프로젝트는 이 5단계를<br />거쳐 완성됩니다
            </p>
          </div>

          {/* 우측 타임라인 */}
          <div className="relative flex flex-col gap-7 pl-8 border-l-2" style={{ borderColor: '#1565C0' }}>
            {[
              { step: '01', title: '발견', desc: '함께 문제를 정의합니다', time: '1~2일' },
              { step: '02', title: '제안', desc: '방향과 방법을 함께 그립니다', time: '2~3일' },
              { step: '03', title: '제작', desc: '만들면서 계속 이야기합니다', time: '2~6주' },
              { step: '04', title: '조율', desc: '피드백을 통해 완성에 가까워집니다', time: '3~5일' },
              { step: '05', title: '완성', desc: '세상에 내보내고, 계속 돌봅니다', time: '1~2일' },
            ].map((item) => (
              <div key={item.step} className="relative flex items-center gap-5">
                {/* 타임라인 도트 */}
                <div className="absolute -left-[2.35rem] w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-300" />
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-bold text-sm w-6 text-blue-400">{item.step}</span>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-0">
                    <div>
                      <span className="text-white font-semibold">{item.title}</span>
                      <span className="text-xs sm:text-sm ml-2 sm:ml-3 text-blue-300/80">{item.desc}</span>
                    </div>
                    <span className="text-xs text-blue-600">{item.time}</span>
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
        style={{ backgroundColor: '#051226' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-8 w-full">
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
            {NEWS.map((item) => (
              <div key={item.title} className="border border-blue-900/50 rounded-xl p-5 hover:border-blue-500/50 hover:bg-blue-950/30 transition-all">
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

      {/* ── Slide 9: Pricing ── */}
      <section
        ref={(el) => { sectionRefs.current[8] = el; }}
        className="flex h-dvh items-center px-4 sm:px-10"
        style={{ backgroundColor: '#F0F6FF' }}
      >
        <div className="max-w-4xl w-full mx-auto">
          <h2 className="text-5xl sm:text-6xl font-extrabold text-center mb-16" style={{ color: '#0B2447' }}>
            함께하는 방법
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 플랜 1 */}
            <div className="bg-white border-2 border-blue-200 p-6 sm:p-10 rounded-xl">
              <p className="text-2xl font-black mb-4 text-blue-400">프로젝트로 의뢰하기</p>
              <p className="text-sm mb-8 text-gray-400">한 번의 프로젝트로 디랩을 경험해보세요</p>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  '요구사항 살펴보기 및 제안서 제공',
                  '디자인 + 개발 원스톱',
                  '런칭 후 1개월 무상 수정',
                  '소스코드 및 운영 권한 이관',
                  '관리자 교육 포함',
                ].map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="font-bold text-blue-500">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => scrollTo(9)}
                className="mt-8 w-full py-3 rounded-full font-semibold text-sm transition-colors border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                문의하기
              </button>
            </div>

            {/* 플랜 2 — 하이라이트 */}
            <div className="relative p-6 sm:p-10 rounded-xl overflow-hidden" style={{ backgroundColor: '#0B2447' }}>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-blue-500">
                BEST
              </div>
              <p className="text-2xl font-black mb-4 text-blue-300">협업으로 함께 만들고 나누기</p>
              <p className="text-sm mb-8 text-blue-400">매달 함께 성장하는 파트너</p>
              <ul className="space-y-3 text-sm text-blue-100">
                {[
                  '연간 프로젝트 우선 배정',
                  '월별 유지보수 및 기능 추가',
                  '긴급 대응 (48시간 이내)',
                  '연간 전략 미팅 2회',
                  '신규 서비스 기획 컨설팅',
                ].map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="text-white font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => scrollTo(9)}
                className="mt-8 w-full py-3 bg-blue-500 text-white rounded-full font-semibold text-sm hover:bg-blue-400 transition-colors"
              >
                파트너 계약 시작하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Slide 10: Contact ── */}
      <section
        ref={(el) => { sectionRefs.current[9] = el; }}
        id="contact"
        className="relative flex flex-col h-dvh overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #051226 0%, #0B2447 50%, #1565C0 100%)' }}
      >
        {/* 도트 그리드 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

        {/* 우하단 원형 장식 */}
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

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 py-6 px-4 sm:px-10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-sm font-extrabold text-white/40" style={{ letterSpacing: '-0.02em' }}>
            <span className="text-blue-400/60">:</span>DLAB · 계발자들 협력사
          </span>
          <div className="flex gap-4 text-sm text-blue-300/40">
            <a href="/works" className="hover:text-blue-300/70 transition-colors">포트폴리오</a>
            <a href="/templates" className="hover:text-blue-300/70 transition-colors">템플릿</a>
            <a href="/guide" className="hover:text-blue-300/70 transition-colors">빌드가이드</a>
            <a href="/privacy" className="hover:text-blue-300/70 transition-colors">개인정보</a>
          </div>
          <span className="text-sm text-white/20">© {new Date().getFullYear()} 디랩. All rights reserved.</span>
        </footer>
      </section>

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

            {submitResult === 'success' ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">&#10003;</div>
                <p className="text-lg font-bold text-gray-900 mb-2">문의가 접수되었어요!</p>
                <p className="text-sm text-gray-400 mb-6">빠른 시일 내에 연락드릴게요.</p>
                <button
                  onClick={() => { setShowModal(false); setSubmitResult(null); }}
                  className="px-6 py-2.5 bg-[#0B2447] text-white font-bold rounded-xl text-sm hover:bg-[#1565C0] transition-colors"
                >
                  닫기
                </button>
              </div>
            ) : (
              <>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSubmitting(true);
                    setSubmitResult(null);
                    const data = new FormData(e.currentTarget);
                    try {
                      const res = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: data.get('name'),
                          contact: data.get('contact'),
                          message: data.get('message'),
                        }),
                      });
                      if (res.ok) {
                        setSubmitResult('success');
                      } else {
                        setSubmitResult('error');
                      }
                    } catch {
                      setSubmitResult('error');
                    } finally {
                      setSubmitting(false);
                    }
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
                  {submitResult === 'error' && (
                    <p className="text-xs text-red-500">오류가 발생했어요. 다시 시도해주세요.</p>
                  )}
                  <button type="submit" disabled={submitting}
                    className="w-full bg-[#0B2447] text-white font-bold py-3.5 rounded-xl hover:bg-[#1565C0] transition-colors text-sm disabled:opacity-50">
                    {submitting ? '보내는 중...' : '문의 보내기'}
                  </button>
                </form>

                <p className="mt-4 text-center text-xs text-gray-400">
                  또는 <a href="mailto:hello@designdlab.co.kr" className="underline hover:text-gray-600 transition-colors">hello@designdlab.co.kr</a>로 직접 메일 보내기
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

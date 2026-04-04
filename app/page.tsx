'use client';

import { useEffect, useRef, useState } from 'react';

const SECTIONS = ['hero', 'identity', 'numbers', 'services', 'process', 'pricing', 'contact'];

export default function Home() {
  const [current, setCurrent] = useState(0);
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
        <div className="absolute top-8 left-10 text-lg font-extrabold" style={{ letterSpacing: '-0.02em' }}>
          <span style={{ color: '#60A5FA' }}>:</span>
          <span className="text-white">DLAB</span>
        </div>

        {/* 중앙 콘텐츠 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
          <span className="border border-blue-400/50 text-blue-100 px-4 py-1 rounded-full text-sm tracking-widest mb-6">
            소셜벤처 · Social Venture
          </span>
          <h1 className="text-7xl sm:text-8xl font-extrabold text-white leading-tight mb-2">
            세상을 이롭게,
          </h1>
          <h2 className="text-7xl sm:text-8xl font-extrabold leading-tight mb-8" style={{ color: '#60A5FA' }}>
            디랩이 만듭니다.
          </h2>
          <p className="text-blue-200/70 text-lg mb-12">
            축제 · 전시 · 제안서 · 앱
          </p>
          <div className="flex gap-4">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo(6); }}
              className="px-8 py-3.5 bg-blue-500 text-white font-semibold rounded-full text-sm tracking-wide hover:bg-blue-400 transition-colors"
            >
              프로젝트 상담하기
            </a>
            <button
              onClick={() => scrollTo(3)}
              className="px-8 py-3.5 border border-blue-400/50 text-blue-200 font-semibold rounded-full text-sm tracking-wide hover:bg-blue-500/10 transition-colors"
            >
              작업물 보기
            </button>
          </div>
        </div>

        {/* 스크롤 힌트 */}
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
        {/* 좌측 세로 라인 */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#1565C0' }} />

        {/* 배경 숫자 */}
        <span
          className="absolute left-8 top-1/2 -translate-y-1/2 font-extrabold select-none leading-none pointer-events-none"
          style={{ fontSize: '20rem', color: 'rgba(21,101,192,0.15)' }}
        >
          02
        </span>

        <div className="relative z-10 max-w-5xl w-full">
          <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-16">
            디랩은 무엇을 하나요?
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { title: '이벤트·축제', desc: '지자체·기업 행사의 공식 디지털 창구를 제작합니다', dot: 'bg-blue-500' },
              { title: '입찰·제안서', desc: '경쟁 입찰에서 차별화되는 웹 제안서를 만듭니다', dot: 'bg-blue-400' },
              { title: '전시·갤러리', desc: '오프라인 전시를 온라인으로 확장합니다', dot: 'bg-sky-400' },
              { title: '앱·웹 개발', desc: '기획부터 출시까지 한 팀이 책임집니다', dot: 'bg-cyan-400' },
            ].map((item) => (
              <div key={item.title}>
                <div className={`w-10 h-10 rounded-full ${item.dot} mb-4`} />
                <h3 className="font-bold text-xl mb-3 text-white">{item.title}</h3>
                <p className="text-blue-200/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-16 text-blue-300/50 text-sm tracking-widest">
            사회적 가치를 담은 프로젝트를 기획하고 만듭니다.
          </p>
        </div>
      </section>

      {/* ── Slide 3: Numbers (대각선 분할) ── */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="relative flex h-dvh items-center overflow-hidden"
        style={{ scrollSnapAlign: 'start' }}
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

        <div className="relative z-10 max-w-5xl w-full mx-auto px-10 grid grid-cols-1 sm:grid-cols-2 gap-16 items-center">
          {/* 좌측 */}
          <div>
            <h2 className="text-6xl sm:text-7xl font-extrabold text-white leading-tight">
              실행으로
            </h2>
            <h2 className="text-6xl sm:text-7xl font-extrabold leading-tight" style={{ color: '#60A5FA' }}>
              증명합니다
            </h2>
          </div>

          {/* 우측 — 원형 숫자 */}
          <div className="flex flex-col gap-6 items-center sm:items-start">
            {[
              { num: '47+', label: 'Projects', desc: '완료한 프로젝트 수' },
              { num: '12', label: '지자체·기관', desc: '공공기관 협업 경험' },
              { num: '8', label: '앱 런칭', desc: 'iOS·Android 출시' },
            ].map((item) => (
              <div
                key={item.num}
                className="w-44 h-44 rounded-full border-2 flex flex-col items-center justify-center shrink-0"
                style={{ borderColor: '#93C5FD' }}
              >
                <span className="text-5xl font-black" style={{ color: '#1565C0' }}>{item.num}</span>
                <span className="text-sm font-semibold mt-1" style={{ color: '#0B2447' }}>{item.label}</span>
                <span className="text-xs mt-0.5" style={{ color: '#42A5F5' }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slide 4: Services ── */}
      <section
        ref={(el) => { sectionRefs.current[3] = el; }}
        className="flex h-dvh items-center px-10 bg-white border-t-4 border-blue-500"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 items-start">
          {/* 좌측 타이틀 */}
          <div className="pt-4">
            <h2 className="text-6xl sm:text-7xl font-extrabold" style={{ color: '#0B2447' }}>Services</h2>
            <p className="mt-4 text-sm" style={{ color: '#42A5F5' }}>디랩이 제공하는 4가지 핵심 서비스</p>
          </div>

          {/* 우측 서비스 목록 */}
          <div className="flex flex-col divide-y divide-gray-100">
            {[
              { num: '01', name: '이벤트·축제 홈페이지', desc: '참가 신청, 일정, 지도까지 — 2~4주 내 런칭', icon: '🎪' },
              { num: '02', name: '입찰 제안서 웹화', desc: '열람 통계, 모바일 최적화로 심사위원 임팩트 극대화', icon: '📋' },
              { num: '03', name: '전시·갤러리 디지털화', desc: '작품 아카이브, 도슨트 연동, 디지털 팸플릿', icon: '🖼️' },
              { num: '04', name: '앱·웹 서비스 개발', desc: 'iOS/Android/웹 풀스택, 스토어 출시까지 책임', icon: '📱' },
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

      {/* ── Slide 5: Process ── */}
      <section
        ref={(el) => { sectionRefs.current[4] = el; }}
        className="relative flex h-dvh items-center px-10 overflow-hidden"
        style={{ scrollSnapAlign: 'start', backgroundColor: '#0B2447' }}
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
              { step: '01', title: '발굴', desc: '프로젝트 목표와 제약 파악', time: '1~2일' },
              { step: '02', title: '제안', desc: '범위·일정·비용 제안서 전달', time: '2~3일' },
              { step: '03', title: '제작', desc: '디자인·개발 병렬 진행', time: '2~6주' },
              { step: '04', title: '검수', desc: '클라이언트 피드백 반영', time: '3~5일' },
              { step: '05', title: '완성', desc: '배포·이관·운영 교육', time: '1~2일' },
            ].map((item) => (
              <div key={item.step} className="relative flex items-center gap-5">
                {/* 타임라인 도트 */}
                <div className="absolute -left-[2.35rem] w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-300" />
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-bold text-sm w-6 text-blue-400">{item.step}</span>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-white font-semibold">{item.title}</span>
                      <span className="text-sm ml-3 text-blue-300/80">{item.desc}</span>
                    </div>
                    <span className="text-xs text-blue-600">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slide 6: Pricing ── */}
      <section
        ref={(el) => { sectionRefs.current[5] = el; }}
        className="flex h-dvh items-center px-10"
        style={{ scrollSnapAlign: 'start', backgroundColor: '#F0F6FF' }}
      >
        <div className="max-w-4xl w-full mx-auto">
          <h2 className="text-5xl sm:text-6xl font-extrabold text-center mb-16" style={{ color: '#0B2447' }}>
            함께하는 방법
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 플랜 1 */}
            <div className="bg-white border-2 border-blue-200 p-10 rounded-xl">
              <p className="text-sm tracking-widest mb-4 text-blue-400">프로젝트 의뢰</p>
              <p className="text-5xl font-extrabold mb-1" style={{ color: '#0B2447' }}>500만원~</p>
              <p className="text-sm mb-8 text-gray-400">프로젝트 단위</p>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  '요구사항 분석 및 제안서 제공',
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
                onClick={() => scrollTo(6)}
                className="mt-8 w-full py-3 rounded-full font-semibold text-sm transition-colors border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                문의하기
              </button>
            </div>

            {/* 플랜 2 — 하이라이트 */}
            <div className="relative p-10 rounded-xl overflow-hidden" style={{ backgroundColor: '#0B2447' }}>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-blue-500">
                BEST
              </div>
              <p className="text-sm tracking-widest mb-4 text-blue-300">연간 파트너</p>
              <p className="text-5xl font-extrabold text-white mb-1">월 200만원~</p>
              <p className="text-sm mb-8 text-blue-400">12개월 단위</p>
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
                onClick={() => scrollTo(6)}
                className="mt-8 w-full py-3 bg-blue-500 text-white rounded-full font-semibold text-sm hover:bg-blue-400 transition-colors"
              >
                파트너 계약 시작하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Slide 7: Contact ── */}
      <section
        ref={(el) => { sectionRefs.current[6] = el; }}
        id="contact"
        className="relative flex flex-col h-dvh overflow-hidden"
        style={{ scrollSnapAlign: 'start', background: 'linear-gradient(135deg, #051226 0%, #0B2447 50%, #1565C0 100%)' }}
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
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white mb-8 leading-tight">
            같이 만들어요.
          </h2>
          <p className="text-lg mb-10 text-blue-300">hello@designdlab.co.kr</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://open.kakao.com/o/dlab"
              className="px-8 py-4 bg-blue-500 text-white font-bold text-sm tracking-wide rounded-full hover:bg-blue-400 transition-colors"
            >
              카카오로 상담하기
            </a>
            <a
              href="mailto:hello@designdlab.co.kr"
              className="px-8 py-4 border border-white/30 text-white font-semibold text-sm rounded-full hover:bg-white/10 transition-colors"
            >
              이메일 문의
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 py-6 px-10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-sm font-extrabold text-white/40" style={{ letterSpacing: '-0.02em' }}>
            <span className="text-blue-400/60">:</span>DLAB · 계발자들 협력사
          </span>
          <span className="text-sm text-white/20">© {new Date().getFullYear()} 디랩. All rights reserved.</span>
        </footer>
      </section>
    </div>
  );
}

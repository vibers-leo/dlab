'use client';

import { useEffect, useRef, useState } from 'react';

const SECTIONS = ['hero', 'identity', 'numbers', 'services', 'process', 'pricing', 'contact'];
const darkSlides = [0, 1, 4, 6];

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

  const isDark = darkSlides.includes(current);

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
                ? `w-2.5 h-2.5 scale-125 ${isDark ? 'bg-white' : 'bg-black'}`
                : `w-2 h-2 ${isDark ? 'bg-white/40' : 'bg-gray-400'}`
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </nav>

      {/* ── Slide 1: Hero ── */}
      <section
        ref={(el) => { sectionRefs.current[0] = el; }}
        className="relative flex flex-col h-dvh"
        style={{ scrollSnapAlign: 'start', background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #5b21b6 100%)' }}
      >
        {/* 로고 */}
        <div className="absolute top-8 left-10 text-white font-bold text-lg tracking-tight">
          D.Lab
        </div>

        {/* 중앙 콘텐츠 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <span className="bg-white/10 border border-white/20 px-4 py-1 rounded-full text-white text-sm tracking-widest mb-6">
            소셜벤처 · Social Venture
          </span>
          <h1 className="text-7xl sm:text-8xl font-extrabold text-white leading-tight mb-2">
            세상을 이롭게,
          </h1>
          <h2 className="text-7xl sm:text-8xl font-extrabold text-violet-300 leading-tight mb-8">
            디랩이 만듭니다.
          </h2>
          <p className="text-white/70 text-lg mb-12">
            축제 · 전시 · 제안서 · 앱 — 사회적 가치를 담은 프로젝트
          </p>
          <div className="flex gap-4">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo(6); }}
              className="px-8 py-3.5 bg-white text-indigo-950 font-semibold rounded-none text-sm tracking-wide hover:bg-white/90 transition-colors"
            >
              프로젝트 상담 →
            </a>
            <button
              onClick={() => scrollTo(3)}
              className="px-8 py-3.5 border border-white/50 text-white font-semibold text-sm tracking-wide hover:bg-white/10 transition-colors"
            >
              작업물 보기
            </button>
          </div>
        </div>

        {/* 스크롤 힌트 */}
        <div className="absolute bottom-8 right-10 text-white/50 text-sm tracking-widest">
          ↓ scroll
        </div>
      </section>

      {/* ── Slide 2: Identity ── */}
      <section
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="relative flex flex-col h-dvh items-center justify-center px-10 overflow-hidden"
        style={{ scrollSnapAlign: 'start', backgroundColor: '#0A0A0A' }}
      >
        {/* 배경 숫자 */}
        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[20rem] font-extrabold text-white/5 select-none leading-none pointer-events-none">
          02
        </span>

        <div className="relative z-10 max-w-5xl w-full">
          <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-16">
            디랩은 무엇을 하나요?
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { title: '이벤트·축제', desc: '지자체·기업 행사의 공식 디지털 창구를 제작합니다', color: 'text-indigo-400' },
              { title: '입찰·제안서', desc: '경쟁 입찰에서 차별화되는 웹 제안서를 만듭니다', color: 'text-violet-400' },
              { title: '전시·갤러리', desc: '오프라인 전시를 온라인으로 확장합니다', color: 'text-amber-400' },
              { title: '앱·웹 개발', desc: '기획부터 출시까지 한 팀이 책임집니다', color: 'text-emerald-400' },
            ].map((item) => (
              <div key={item.title}>
                <h3 className={`font-bold text-xl mb-3 ${item.color}`}>{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-16 text-gray-600 text-sm tracking-widest">
            사회적 가치를 담은 프로젝트를 기획하고 만듭니다.
          </p>
        </div>
      </section>

      {/* ── Slide 3: Numbers ── */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="flex h-dvh items-center px-10"
        style={{ scrollSnapAlign: 'start', backgroundColor: '#F5F5F0' }}
      >
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 items-center">
          {/* 숫자들 */}
          <div className="flex flex-col gap-10">
            {[
              { num: '47+', label: 'Projects', desc: '완료한 프로젝트 수', gradient: 'bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent' },
              { num: '12', label: '지자체·기관', desc: '공공기관 협업 경험', gradient: 'bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent' },
              { num: '8', label: '앱 런칭', desc: 'iOS·Android 출시', gradient: 'bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent' },
            ].map((item) => (
              <div key={item.num} className="flex items-baseline gap-4">
                <span className={`text-6xl sm:text-7xl font-extrabold ${item.gradient}`}>{item.num}</span>
                <div>
                  <p className="text-black font-semibold">{item.label}</p>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 우측 타이틀 */}
          <div>
            <h2 className="text-5xl sm:text-6xl font-extrabold text-black leading-tight">
              실행으로<br />증명합니다
            </h2>
            <div className="w-12 h-1 bg-black mt-6" />
          </div>
        </div>
      </section>

      {/* ── Slide 4: Services ── */}
      <section
        ref={(el) => { sectionRefs.current[3] = el; }}
        className="flex h-dvh items-center px-10 bg-white"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 items-start">
          {/* 좌측 타이틀 */}
          <div className="pt-4">
            <h2 className="text-6xl sm:text-7xl font-extrabold text-black">Services</h2>
            <p className="text-gray-400 mt-4 text-sm">디랩이 제공하는 4가지 핵심 서비스</p>
          </div>

          {/* 우측 서비스 목록 */}
          <div className="flex flex-col divide-y divide-gray-100">
            {[
              { num: '01', name: '이벤트·축제 홈페이지', desc: '참가 신청, 일정, 지도까지 — 2~4주 내 런칭', textColor: 'text-indigo-600', borderColor: 'hover:border-l-4 hover:border-l-indigo-600' },
              { num: '02', name: '입찰 제안서 웹화', desc: '열람 통계, 모바일 최적화로 심사위원 임팩트 극대화', textColor: 'text-violet-600', borderColor: 'hover:border-l-4 hover:border-l-violet-600' },
              { num: '03', name: '전시·갤러리 디지털화', desc: '작품 아카이브, 도슨트 연동, 디지털 팸플릿', textColor: 'text-amber-600', borderColor: 'hover:border-l-4 hover:border-l-amber-600' },
              { num: '04', name: '앱·웹 서비스 개발', desc: 'iOS/Android/웹 풀스택, 스토어 출시까지 책임', textColor: 'text-emerald-600', borderColor: 'hover:border-l-4 hover:border-l-emerald-600' },
            ].map((item) => (
              <div key={item.num} className={`py-6 flex gap-6 items-start group cursor-default pl-2 transition-all duration-200 ${item.borderColor}`}>
                <span className={`font-bold text-sm mt-1 ${item.textColor}`}>{item.num}</span>
                <div>
                  <h3 className={`font-bold text-lg transition-colors ${item.textColor}`}>{item.name}</h3>
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
        className="flex h-dvh items-center px-10"
        style={{ scrollSnapAlign: 'start', backgroundColor: '#1E1B4B' }}
      >
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 items-center">
          {/* 좌측 */}
          <div>
            <h2 className="text-6xl sm:text-7xl font-extrabold text-white leading-tight">
              우리의<br />방식
            </h2>
            <p className="text-indigo-300 mt-4 text-sm leading-relaxed">
              모든 프로젝트는 이 5단계를<br />거쳐 완성됩니다
            </p>
          </div>

          {/* 우측 타임라인 */}
          <div className="flex flex-col gap-6">
            {[
              { step: '01', title: '발굴', desc: '프로젝트 목표와 제약 파악', time: '1~2일', dotColor: 'bg-indigo-400', gradientText: 'bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent' },
              { step: '02', title: '제안', desc: '범위·일정·비용 제안서 전달', time: '2~3일', dotColor: 'bg-violet-400', gradientText: 'bg-gradient-to-r from-violet-400 to-violet-300 bg-clip-text text-transparent' },
              { step: '03', title: '제작', desc: '디자인·개발 병렬 진행', time: '2~6주', dotColor: 'bg-purple-400', gradientText: 'bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent' },
              { step: '04', title: '검수', desc: '클라이언트 피드백 반영', time: '3~5일', dotColor: 'bg-fuchsia-400', gradientText: 'bg-gradient-to-r from-fuchsia-400 to-fuchsia-300 bg-clip-text text-transparent' },
              { step: '05', title: '완성', desc: '배포·이관·운영 교육', time: '1~2일', dotColor: 'bg-pink-400', gradientText: 'bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-5">
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
                  <span className={`font-bold text-sm ${item.gradientText}`}>{item.step}</span>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span className="text-white font-semibold">{item.title}</span>
                    <span className="text-indigo-400 text-sm ml-3">{item.desc}</span>
                  </div>
                  <span className="text-indigo-500 text-xs">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slide 6: Pricing ── */}
      <section
        ref={(el) => { sectionRefs.current[5] = el; }}
        className="flex h-dvh items-center px-10 bg-white"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div className="max-w-4xl w-full mx-auto">
          <h2 className="text-5xl sm:text-6xl font-extrabold text-black text-center mb-16">
            함께하는 방법
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 플랜 1 */}
            <div className="border border-indigo-200 p-10">
              <p className="text-gray-500 text-sm tracking-widest mb-4">프로젝트 의뢰</p>
              <p className="text-5xl font-extrabold text-black mb-1">500만원~</p>
              <p className="text-gray-400 text-sm mb-8">프로젝트 단위</p>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  '요구사항 분석 및 제안서 제공',
                  '디자인 + 개발 원스톱',
                  '런칭 후 1개월 무상 수정',
                  '소스코드 및 운영 권한 이관',
                  '관리자 교육 포함',
                ].map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="text-indigo-600 font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => scrollTo(6)}
                className="mt-8 w-full py-3 border border-indigo-600 text-indigo-600 font-semibold text-sm hover:bg-indigo-600 hover:text-white transition-colors"
              >
                문의하기
              </button>
            </div>

            {/* 플랜 2 */}
            <div className="bg-indigo-950 p-10">
              <p className="text-indigo-300 text-sm tracking-widest mb-4">연간 파트너</p>
              <p className="text-5xl font-extrabold text-white mb-1">월 200만원~</p>
              <p className="text-indigo-400 text-sm mb-8">12개월 단위</p>
              <ul className="space-y-3 text-sm text-indigo-200">
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
                className="mt-8 w-full py-3 bg-white text-indigo-950 font-semibold text-sm hover:bg-indigo-100 transition-colors"
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
        className="relative flex flex-col h-dvh"
        style={{ scrollSnapAlign: 'start', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}
      >
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white mb-8 leading-tight">
            같이 만들어요.
          </h2>
          <p className="text-white/50 text-lg mb-10">hello@designdlab.co.kr</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://open.kakao.com/o/dlab"
              className="px-8 py-4 bg-yellow-400 text-black font-bold text-sm tracking-wide hover:bg-yellow-300 transition-colors"
            >
              카카오로 상담하기
            </a>
            <a
              href="mailto:hello@designdlab.co.kr"
              className="px-8 py-4 border border-white/30 text-white font-semibold text-sm hover:border-white transition-colors"
            >
              이메일 문의
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 py-6 px-10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-white/30 text-sm">D.Lab · 계발자들 협력사 · vibers.co.kr</span>
          <span className="text-white/20 text-sm">© {new Date().getFullYear()} 디랩. All rights reserved.</span>
        </footer>
      </section>
    </div>
  );
}

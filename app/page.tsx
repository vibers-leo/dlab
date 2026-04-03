export default function Home() {
  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif" }}>
      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {/* 배경 장식 원 */}
        <div className="absolute top-[-10rem] right-[-8rem] w-[36rem] h-[36rem] rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-8rem] left-[-6rem] w-[28rem] h-[28rem] rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl w-full text-center">
          {/* 뱃지 */}
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-violet-200 text-sm font-semibold tracking-wide">
            풀스택 개발 에이전시 · 디랩
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            아이디어를<br className="hidden sm:block" /> 현실로
          </h1>
          <p className="text-xl sm:text-2xl text-violet-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            디랩은 기획부터 배포까지 함께하는<br />
            풀스택 개발 파트너입니다
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <a
              href="mailto:hello@vibers.co.kr"
              className="px-8 py-4 bg-white text-indigo-950 rounded-xl font-bold text-lg transition-all duration-200 hover:bg-violet-100 hover:scale-105 shadow-lg"
            >
              프로젝트 시작하기
            </a>
            <a
              href="#services"
              className="px-8 py-4 border-2 border-white/40 text-white rounded-xl font-bold text-lg transition-all duration-200 hover:bg-white/10 hover:border-white hover:scale-105"
            >
              포트폴리오 보기
            </a>
          </div>

          {/* 기술 스택 뱃지 */}
          <div className="flex flex-wrap justify-center gap-3">
            {["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "AWS"].map((tech) => (
              <span
                key={tech}
                className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Problem (페인포인트) ──────────────────────────── */}
      <section className="bg-amber-50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase mb-3 block">
              혹시 이런 경험 있으신가요?
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              개발 외주, 이런 문제<br />겪어보셨죠?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "😤",
                title: "개발사를 믿을 수 없어요",
                desc: "소통이 단절되고 일정은 계속 지연됩니다. 진행 상황을 알 수가 없어요.",
                color: "border-t-red-400",
              },
              {
                icon: "💸",
                title: "비용이 너무 비싸요",
                desc: "견적이 불투명하고 추가 비용이 계속 발생합니다. 예산 예측이 불가능해요.",
                color: "border-t-amber-400",
              },
              {
                icon: "🔧",
                title: "유지보수가 어려워요",
                desc: "납품 후 방치되거나 담당자가 바뀌어 운영에 어려움을 겪습니다.",
                color: "border-t-orange-400",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`bg-white rounded-2xl p-8 shadow-md border-t-4 ${item.color} hover:shadow-xl transition-shadow duration-200`}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Solution / 서비스 ─────────────────────────────── */}
      <section id="services" className="bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-indigo-600 font-semibold text-sm tracking-widest uppercase mb-3 block">
              서비스
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              디랩이 해결해 드립니다
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: "🌐",
                title: "웹 서비스 개발",
                desc: "랜딩 페이지부터 SaaS까지. Next.js 기반 고성능 웹 서비스를 제작합니다.",
                accent: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
                tag: "text-indigo-600",
              },
              {
                icon: "📱",
                title: "앱 개발",
                desc: "iOS / Android 크로스플랫폼 앱. React Native로 빠르게, 네이티브처럼.",
                accent: "bg-violet-50 border-violet-200 hover:bg-violet-100",
                tag: "text-violet-600",
              },
              {
                icon: "🛒",
                title: "커머스",
                desc: "쇼핑몰, 예약 시스템, 결제 연동. 매출로 직결되는 커머스를 만듭니다.",
                accent: "bg-amber-50 border-amber-200 hover:bg-amber-100",
                tag: "text-amber-600",
              },
              {
                icon: "🔧",
                title: "유지보수 & 운영",
                desc: "런칭 후가 진짜 시작입니다. 지속적인 개선과 안정적인 운영을 지원합니다.",
                accent: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
                tag: "text-emerald-600",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border p-8 transition-all duration-200 cursor-default ${item.accent}`}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className={`text-xl font-bold mb-3 ${item.tag}`}>{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Process (진행 방식) ───────────────────────────── */}
      <section className="bg-slate-900 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-slate-400 font-semibold text-sm tracking-widest uppercase mb-3 block">
              진행 방식
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
              5단계로 완성됩니다
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-4">
            {[
              { step: "01", title: "상담", desc: "요구사항 파악 & 방향 설정" },
              { step: "02", title: "기획", desc: "와이어프레임 & 기능 명세" },
              { step: "03", title: "디자인", desc: "UI/UX 설계 & 시안 확정" },
              { step: "04", title: "개발", desc: "프론트 + 백엔드 구현" },
              { step: "05", title: "런칭", desc: "배포 & 인수인계 완료" },
            ].map((item, idx) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                {/* 연결선 (마지막 제외) */}
                {idx < 4 && (
                  <div className="hidden sm:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-slate-700" />
                )}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-4 relative z-10">
                  <span className="text-white font-extrabold text-lg">{item.step}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Pricing ───────────────────────────────────────── */}
      <section className="bg-violet-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-violet-600 font-semibold text-sm tracking-widest uppercase mb-3 block">
              가격
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              투명한 요금제
            </h2>
            <p className="text-gray-500 mt-4 text-lg">숨겨진 비용 없이 명확하게 안내드립니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 스프린트 */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-violet-100 hover:shadow-xl transition-shadow duration-200">
              <div className="mb-6">
                <span className="text-violet-600 font-semibold text-sm uppercase tracking-wide">스프린트</span>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">300만원~</span>
                </div>
                <p className="text-gray-500 mt-1 text-sm">단기 집중 개발 · 프로젝트 단위</p>
              </div>
              <ul className="space-y-3">
                {[
                  "요구사항 분석 & 기획 포함",
                  "UI/UX 디자인 포함",
                  "프론트 + 백엔드 풀스택 개발",
                  "배포 & 도메인 연결",
                  "런칭 후 1개월 무상 수정",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-gray-700">
                    <span className="text-violet-500 font-bold mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:hello@vibers.co.kr"
                className="mt-8 block text-center px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors duration-200"
              >
                문의하기
              </a>
            </div>

            {/* 파트너십 */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 shadow-xl text-white hover:shadow-2xl transition-shadow duration-200 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                추천
              </div>
              <div className="mb-6">
                <span className="text-violet-200 font-semibold text-sm uppercase tracking-wide">파트너십</span>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-extrabold">월 80만원~</span>
                </div>
                <p className="text-violet-200 mt-1 text-sm">지속 운영 파트너 · 월 단위</p>
              </div>
              <ul className="space-y-3">
                {[
                  "스프린트 플랜 모든 기능 포함",
                  "월 기능 추가 & 개선 무제한",
                  "24시간 이내 긴급 버그 대응",
                  "서버 모니터링 & 성능 최적화",
                  "전담 개발자 슬랙 채널 연결",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-violet-100">
                    <span className="text-white font-bold mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:hello@vibers.co.kr"
                className="mt-8 block text-center px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-violet-50 transition-colors duration-200"
              >
                파트너십 시작하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CTA + Footer ──────────────────────────────────── */}
      <section className="bg-indigo-950 py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            지금 바로<br />시작해보세요
          </h2>
          <p className="text-indigo-300 text-xl mb-10 leading-relaxed">
            아이디어가 있다면 디랩과 함께 빠르게 실현해드립니다.<br />
            무료 상담부터 시작해 보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@vibers.co.kr"
              className="px-8 py-4 bg-white text-indigo-950 rounded-xl font-bold text-lg hover:bg-violet-100 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              이메일로 문의하기
            </a>
            <a
              href="https://open.kakao.com/o/dlab"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white hover:scale-105 transition-all duration-200"
            >
              카카오 오픈채팅
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 border-t border-white/10 py-8 px-6 text-center text-indigo-400 text-sm">
        <p className="font-semibold text-white/70 mb-1">디랩 · 계발자들 · vibers.co.kr</p>
        <p>© {new Date().getFullYear()} 디랩. All rights reserved.</p>
      </footer>
    </main>
  );
}

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
            축제 · 입찰 · 앱 · 웹 개발 에이전시
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            기획하고, 만들고,<br />완성합니다
          </h1>
          <p className="text-xl sm:text-2xl text-violet-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            축제·전시·제안·앱 — 디랩은 아이디어가<br />
            현장에서 빛나도록 끝까지 함께합니다
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <a
              href="#contact"
              className="px-8 py-4 bg-white text-indigo-950 rounded-xl font-bold text-lg transition-all duration-200 hover:bg-violet-100 hover:scale-105 shadow-lg"
            >
              프로젝트 상담하기
            </a>
            <a
              href="/works"
              className="px-8 py-4 border-2 border-white/40 text-white rounded-xl font-bold text-lg transition-all duration-200 hover:bg-white/10 hover:border-white hover:scale-105"
            >
              작업물 보기
            </a>
          </div>

          {/* 기술 스택 뱃지 */}
          <div className="flex flex-wrap justify-center gap-3">
            {["Next.js", "React Native", "Rails", "Figma", "AWS", "Adobe"].map((tech) => (
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
              이런 고민,<br />디랩이 해결합니다
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎪",
                title: "행사는 있는데 홈페이지가 없어요",
                desc: "축제·전시 일정은 잡혔는데 디지털 창구가 없어 홍보가 막막합니다.",
                color: "border-t-red-400",
              },
              {
                icon: "📋",
                title: "제안서를 PDF로 내면 기억에 안 남아요",
                desc: "경쟁 입찰에서 차별화가 안 됩니다. 웹 제안서는 열람 추적까지 됩니다.",
                color: "border-t-amber-400",
              },
              {
                icon: "📱",
                title: "앱 개발, 어디서 시작해야 할지 모르겠어요",
                desc: "기획부터 디자인·개발·출시까지 한 팀에서 끝낼 수 있습니다.",
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
                icon: "🎪",
                title: "이벤트·축제 사이트",
                desc: "지자체·기업 행사의 공식 디지털 창구. 참가 신청, 일정, 지도, 갤러리까지 2~4주 내 런칭.",
                accent: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
                tag: "text-indigo-600",
              },
              {
                icon: "📋",
                title: "입찰 제안서 웹화",
                desc: "PDF 제안서를 인터랙티브 웹으로. 열람 통계, 모바일 최적화, 심사위원 임팩트 극대화.",
                accent: "bg-violet-50 border-violet-200 hover:bg-violet-100",
                tag: "text-violet-600",
              },
              {
                icon: "🖼",
                title: "전시·갤러리 기획",
                desc: "오프라인 전시의 온라인 확장. 작품 아카이브, 도슨트 연동, 디지털 팸플릿 제작.",
                accent: "bg-amber-50 border-amber-200 hover:bg-amber-100",
                tag: "text-amber-600",
              },
              {
                icon: "📱",
                title: "앱·웹 서비스 개발",
                desc: "iOS/Android/웹 풀스택. 기획 단계부터 스토어 출시까지 한 팀이 책임집니다.",
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
              { step: "01", title: "발굴", desc: "프로젝트 목표와 제약 파악", sub: "1~2일" },
              { step: "02", title: "제안", desc: "범위·일정·비용 제안서 전달", sub: "2~3일" },
              { step: "03", title: "제작", desc: "디자인·개발 병렬 진행", sub: "2~6주" },
              { step: "04", title: "검수", desc: "클라이언트 피드백 반영", sub: "3~5일" },
              { step: "05", title: "완성", desc: "배포·이관·운영 교육", sub: "1~2일" },
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
                {item.sub && (
                  <span className="mt-1 text-xs text-indigo-400 font-semibold">{item.sub}</span>
                )}
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
            {/* 프로젝트 의뢰 */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-violet-100 hover:shadow-xl transition-shadow duration-200">
              <div className="mb-6">
                <span className="text-violet-600 font-semibold text-sm uppercase tracking-wide">프로젝트 의뢰</span>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">500만원~</span>
                </div>
                <p className="text-gray-500 mt-1 text-sm">프로젝트 단위</p>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">축제 사이트, 입찰 제안서, 전시 사이트, 앱 개발 등 단건 프로젝트</p>
              </div>
              <ul className="space-y-3">
                {[
                  "요구사항 분석 및 제안서 제공",
                  "디자인 + 개발 원스톱",
                  "런칭 후 1개월 무상 수정",
                  "소스코드 및 운영 권한 이관",
                  "관리자 교육 포함",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-gray-700">
                    <span className="text-violet-500 font-bold mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-8 block text-center px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors duration-200"
              >
                문의하기
              </a>
            </div>

            {/* 연간 파트너 계약 */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 shadow-xl text-white hover:shadow-2xl transition-shadow duration-200 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                추천
              </div>
              <div className="mb-6">
                <span className="text-violet-200 font-semibold text-sm uppercase tracking-wide">연간 파트너 계약</span>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-extrabold">월 200만원~</span>
                </div>
                <p className="text-violet-200 mt-1 text-sm">12개월 단위</p>
                <p className="text-violet-100 mt-2 text-sm leading-relaxed">지속적인 디지털 운영 파트너. 행사마다 의뢰하지 않아도 됩니다.</p>
              </div>
              <ul className="space-y-3">
                {[
                  "연간 프로젝트 우선 배정",
                  "월별 유지보수 및 기능 추가",
                  "긴급 대응 (48시간 이내)",
                  "연간 전략 미팅 2회",
                  "신규 서비스 기획 컨설팅 포함",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-violet-100">
                    <span className="text-white font-bold mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-8 block text-center px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-violet-50 transition-colors duration-200"
              >
                파트너 계약 시작하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CTA + Footer ──────────────────────────────────── */}
      <section id="contact" className="bg-indigo-950 py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            다음 프로젝트,<br />디랩과 함께하세요
          </h2>
          <p className="text-indigo-300 text-xl mb-10 leading-relaxed">
            축제, 전시, 제안서, 앱 — 어떤 프로젝트든<br />
            먼저 이야기해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="px-8 py-4 bg-white text-indigo-950 rounded-xl font-bold text-lg hover:bg-violet-100 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              카카오로 상담하기
            </a>
            <a
              href="mailto:hello@designdlab.co.kr"
              className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white hover:scale-105 transition-all duration-200"
            >
              이메일 문의
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 border-t border-white/10 py-8 px-6 text-center text-indigo-400 text-sm">
        <p className="font-semibold text-white/70 mb-1">
          D.Lab (디랩) | hello@designdlab.co.kr | designdlab.co.kr
        </p>
        <p className="text-indigo-500 mb-2">
          계발자들(vibers.co.kr) 협력사 · 팬이지(faneasy.kr) 협력사
        </p>
        <p>© {new Date().getFullYear()} 디랩. All rights reserved.</p>
      </footer>
    </main>
  );
}

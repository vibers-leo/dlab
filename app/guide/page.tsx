import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '디랩 빌드 가이드 | 디랩',
  description: '디랩이 Rails + Next.js로 웹앱을 만드는 방법, AI 비서 바이버스챗, NCP 인프라, 한국 AI 활용 전략을 소개합니다.',
};

const sections = [
  {
    id: 'stack',
    badge: '01 테크 스택',
    title: 'Rails + Next.js\n왜 이 조합인가?',
    color: '#6366f1',
    content: [
      {
        heading: '백엔드: Ruby on Rails',
        body: 'Rails는 "설정보다 관습(CoC)"을 따르는 풀스택 프레임워크입니다. 모델·라우터·DB 마이그레이션을 수 분 만에 세팅할 수 있어, 스타트업 초기 MVP 구축 속도가 압도적입니다. Active Record ORM, Devise 인증, Action Mailer 이메일 발송이 기본 내장되어 있어 별도 라이브러리를 조합하는 수고가 없습니다.',
      },
      {
        heading: '프론트엔드: Next.js',
        body: 'React 기반의 Next.js는 SSR·SSG·ISR을 자유롭게 선택할 수 있어 SEO와 성능을 동시에 잡습니다. App Router를 통한 서버 컴포넌트, Turbopack 빌드, Vercel Edge 배포까지 최신 프론트엔드 표준을 리드합니다. Tailwind CSS와의 조합으로 디자인 시스템 없이도 일관된 UI를 빠르게 만들 수 있습니다.',
      },
      {
        heading: '두 프레임워크가 함께하는 이유',
        body: 'Rails가 API 서버로 복잡한 비즈니스 로직·데이터 처리를 담당하고, Next.js가 사용자 화면을 렌더링합니다. 역할이 명확히 분리되어 팀이 각 영역을 독립적으로 개발·배포할 수 있습니다. 디랩은 이 조합으로 평균 3주 안에 MVP를 론칭합니다.',
      },
    ],
    tags: ['Ruby on Rails', 'Next.js 16', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
  },
  {
    id: 'vibers-chat',
    badge: '02 AI 비서',
    title: '바이버스챗\n디랩의 AI 어시스턴트',
    color: '#10b981',
    content: [
      {
        heading: '바이버스챗이란?',
        body: '바이버스챗은 디랩이 직접 개발한 AI 채팅 앱입니다. Expo React Native로 제작되어 iOS·Android 모두에서 작동하며, Claude·Groq·OpenAI 등 여러 AI 모델을 SSE 스트리밍으로 실시간 응답합니다. 별도 서버 비용 없이 완전 무료로 운영됩니다.',
      },
      {
        heading: '핵심 기술: ZeroClaw',
        body: 'ZeroClaw는 Rust로 작성된 디랩의 자체 AI 게이트웨이입니다. 14MB ARM64 바이너리로 MacOS(Vibers PC)에서 실행되며, 여러 AI 제공자를 단일 WebSocket 인터페이스로 통합합니다. 응답 캐싱, 모델 폴백, 실시간 스트리밍을 처리합니다.',
      },
      {
        heading: '음성 인터페이스 (STT/TTS)',
        body: '기기 내장 STT로 음성 입력을 처리하고, Microsoft Edge TTS API로 한국어 자연스러운 음성을 합성합니다. 모두 무료 API를 활용해 인프라 비용 제로를 실현했습니다. 바이버스챗은 디랩의 AI 기술력을 실제 제품으로 증명하는 쇼케이스입니다.',
      },
    ],
    tags: ['Expo React Native', 'ZeroClaw (Rust)', 'Claude API', 'Edge TTS', 'WebSocket SSE'],
  },
  {
    id: 'ncp',
    badge: '03 인프라',
    title: 'NCP\n안전한 국내 클라우드',
    color: '#f59e0b',
    content: [
      {
        heading: '네이버클라우드플랫폼을 선택한 이유',
        body: '국내 고객사 데이터는 국내 데이터센터에 보관하는 것이 법적 안전성과 레이턴시 모두에서 유리합니다. NCP는 ISMS-P 인증을 받은 국내 최대 클라우드 플랫폼으로, 고객 정보 보호 측면에서 디랩이 신뢰하는 인프라입니다.',
      },
      {
        heading: 'Docker + GitHub Actions 자동 배포',
        body: '디랩은 GitHub Actions로 코드를 푸시하면 자동으로 Docker 이미지를 빌드하고 NCP 서버(wero)에 배포합니다. docker compose up -d --wait 명령으로 헬스체크를 통과한 컨테이너만 트래픽을 받아 다운타임 제로를 보장합니다.',
      },
      {
        heading: 'Nginx Proxy Manager + Cloudflare',
        body: 'Cloudflare가 DDoS 방어와 글로벌 CDN을 담당하고, NCP Nginx Proxy Manager가 도메인별 SSL 종료와 컨테이너 라우팅을 처리합니다. 여러 서비스를 단일 서버에서 서브도메인으로 분리해 운영비를 최적화합니다.',
      },
    ],
    tags: ['NCP (Naver Cloud)', 'Docker', 'GitHub Actions', 'Nginx Proxy Manager', 'Cloudflare'],
  },
  {
    id: 'ai-infra',
    badge: '04 AI/AX 인프라',
    title: '한국 AI 모델 활용\n디랩의 AI 전략',
    color: '#ec4899',
    content: [
      {
        heading: '한국어 특화 AI 모델',
        body: 'CLOVA X(HyperCLOVA X), EXAONE, Solar 등 한국 AI 기업의 모델을 적극 활용합니다. 한국어 이해도와 문화적 맥락이 필요한 서비스에서 글로벌 모델 대비 체감 품질이 높습니다. 디랩은 프로젝트 특성에 따라 Claude·GPT-4·HyperCLOVA X를 혼합 사용합니다.',
      },
      {
        heading: 'AI 기능 통합 (AX: AI Experience)',
        body: '단순 챗봇을 넘어 실제 비즈니스 프로세스에 AI를 통합하는 것이 디랩의 AX 전략입니다. 문의 자동 분류, 콘텐츠 자동 생성, 이미지 AI 분석, 음성 인터페이스 등 고객 워크플로우에 AI를 자연스럽게 녹입니다.',
      },
      {
        heading: '실제 적용 프로젝트',
        body: '누수체크(IoT + AI 이상감지), 세모폰(AI 기기 시세 예측), 바이브폴리오(AI 포트폴리오 자동 생성) 등 디랩 포트폴리오 전반에 AI 기술이 적용되어 있습니다. 클라이언트 프로젝트에 AI 기능 추가를 원한다면 디랩과 상담해보세요.',
      },
    ],
    tags: ['HyperCLOVA X', 'EXAONE', 'Claude Sonnet', 'GPT-4o', 'AI RAG', 'IoT + AI'],
  },
];

export default function GuidePage() {
  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: 'rgba(5,18,38,0.85)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-extrabold" style={{ letterSpacing: '-0.02em' }}>
            <span style={{ color: '#60A5FA' }}>:</span>
            <span className="text-white">DLAB</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/works" className="text-sm text-white/50 hover:text-white/80 transition-colors">포트폴리오</Link>
            <Link href="/templates" className="text-sm text-white/50 hover:text-white/80 transition-colors">템플릿</Link>
            <a href="https://dlab.vibers.co.kr/#contact" className="text-sm px-4 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-400 transition-colors">문의하기</a>
          </nav>
        </div>
      </header>

      {/* 히어로 */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[150px] opacity-15 pointer-events-none" style={{ background: 'conic-gradient(from 180deg, #6366f1, #10b981, #f59e0b, #ec4899, #6366f1)' }} />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-bold border" style={{ backgroundColor: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
            디랩 빌드 가이드
          </span>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 leading-tight">
            우리가 만드는 방법
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Rails + Next.js 풀스택 아키텍처부터<br />
            AI 비서, 국내 클라우드, 한국 AI 모델 활용까지.<br />
            디랩의 기술 스택을 공개합니다.
          </p>
        </div>
      </section>

      {/* 섹션 목차 */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="p-4 rounded-xl border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all group"
            >
              <span className="text-xs font-bold mb-2 block" style={{ color: s.color }}>{s.badge}</span>
              <p className="text-white/70 text-sm font-semibold group-hover:text-white transition-colors leading-snug">{s.title.replace('\n', ' ')}</p>
            </a>
          ))}
        </div>
      </section>

      {/* 섹션들 */}
      <div className="max-w-5xl mx-auto px-6 space-y-24 pb-24">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-20">
            {/* 섹션 헤더 */}
            <div className="flex items-start gap-6 mb-10">
              <div className="flex-shrink-0 w-1 self-stretch rounded-full" style={{ backgroundColor: section.color }} />
              <div>
                <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: section.color }}>
                  {section.badge}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight whitespace-pre-line">
                  {section.title}
                </h2>
              </div>
            </div>

            {/* 콘텐츠 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {section.content.map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-white/8 bg-white/3"
                  style={{ background: `linear-gradient(135deg, ${section.color}08 0%, transparent 100%)` }}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center mb-4 text-xs font-black text-white" style={{ backgroundColor: section.color + '40' }}>
                    {i + 1}
                  </div>
                  <h3 className="text-base font-bold text-white mb-3">{item.heading}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2">
              {section.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-bold"
                  style={{ backgroundColor: section.color + '15', color: section.color }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <section className="border-t border-white/10 py-20 px-6 text-center">
        <p className="text-white/40 text-sm mb-3">이 기술 스택으로 프로젝트를 만들고 싶다면</p>
        <h2 className="text-3xl font-extrabold text-white mb-8">디랩과 함께 만들어요.</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://dlab.vibers.co.kr/#contact"
            className="inline-block px-8 py-4 bg-blue-500 text-white font-bold text-sm tracking-wide rounded-full hover:bg-blue-400 transition-colors"
          >
            프로젝트 문의하기
          </a>
          <Link
            href="/works"
            className="inline-block px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-wide rounded-full hover:border-white/40 hover:bg-white/5 transition-all"
          >
            포트폴리오 보기
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-white/10 py-6 px-10 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span className="text-sm font-extrabold text-white/40" style={{ letterSpacing: '-0.02em' }}>
          <span className="text-blue-400/60">:</span>DLAB
        </span>
        <div className="flex gap-6 text-xs text-white/30">
          <Link href="/privacy" className="hover:text-white/60 transition-colors">개인정보처리방침</Link>
          <Link href="/terms" className="hover:text-white/60 transition-colors">이용약관</Link>
        </div>
        <span className="text-sm text-white/20">&copy; {new Date().getFullYear()} 디랩. All rights reserved.</span>
      </footer>
    </main>
  );
}

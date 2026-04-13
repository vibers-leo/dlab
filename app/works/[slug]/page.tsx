import Link from 'next/link';
import { notFound } from 'next/navigation';
import { works } from '../data';

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = works.find((w) => w.slug === slug);
  if (!work) return {};
  return {
    title: `${work.title} | 디랩 포트폴리오`,
    description: work.desc,
  };
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = works.find((w) => w.slug === slug);
  if (!work) notFound();

  const idx = works.findIndex((w) => w.slug === slug);
  const prev = works[idx - 1];
  const next = works[idx + 1];

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: 'rgba(5,18,38,0.85)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-extrabold" style={{ letterSpacing: '-0.02em' }}>
            <span style={{ color: '#60A5FA' }}>:</span>
            <span className="text-white">DLAB</span>
          </Link>
          <Link href="/works" className="text-sm text-white/50 hover:text-white/80 transition-colors">
            ← 포트폴리오
          </Link>
        </div>
      </header>

      {/* 히어로 */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        {/* 배경 컬러 글로우 */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[120px] opacity-20 pointer-events-none"
          style={{ backgroundColor: work.color }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: work.color + '25', color: work.color }}
            >
              {work.category}
            </span>
            <span className="text-white/30 text-sm">{work.year}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
            {work.title}
          </h1>
          <p className="text-xl text-white/60 max-w-2xl leading-relaxed">
            {work.desc}
          </p>
        </div>
      </section>

      {/* 구분선 */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-white/10" />
      </div>

      {/* 본문 */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 메인 설명 */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-bold text-white/30 tracking-widest uppercase mb-4">프로젝트 소개</h2>
            <p className="text-white/70 text-lg leading-relaxed">
              {work.fullDesc}
            </p>
          </div>

          {/* 사이드 정보 */}
          <div className="space-y-8">
            {/* 핵심 작업 */}
            <div>
              <h2 className="text-sm font-bold text-white/30 tracking-widest uppercase mb-4">핵심 작업</h2>
              <ul className="space-y-3">
                {work.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: work.color }} />
                    <span className="text-white/60 text-sm leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 기술 태그 */}
            <div>
              <h2 className="text-sm font-bold text-white/30 tracking-widest uppercase mb-4">기술 스택</h2>
              <div className="flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-white/5 text-white/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 사이트 링크 */}
            {work.url && (
              <div>
                <h2 className="text-sm font-bold text-white/30 tracking-widest uppercase mb-4">사이트</h2>
                <a
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
                >
                  사이트 방문 →
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 이전/다음 */}
      <section className="border-t border-white/10 max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between gap-4">
          {prev ? (
            <Link
              href={`/works/${prev.slug}`}
              className="group flex-1 p-5 rounded-2xl border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all"
            >
              <p className="text-xs text-white/30 mb-2">← 이전 프로젝트</p>
              <p className="text-white font-bold group-hover:text-blue-400 transition-colors">{prev.title}</p>
            </Link>
          ) : <div className="flex-1" />}

          {next ? (
            <Link
              href={`/works/${next.slug}`}
              className="group flex-1 p-5 rounded-2xl border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all text-right"
            >
              <p className="text-xs text-white/30 mb-2">다음 프로젝트 →</p>
              <p className="text-white font-bold group-hover:text-blue-400 transition-colors">{next.title}</p>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="border-t border-white/10 py-20 px-6 text-center">
        <p className="text-white/40 text-sm mb-3">비슷한 프로젝트를 원하신다면</p>
        <h2 className="text-3xl font-extrabold text-white mb-8">디랩과 함께 만들어요.</h2>
        <a
          href="https://dlab.vibers.co.kr/#contact"
          className="inline-block px-8 py-4 bg-blue-500 text-white font-bold text-sm tracking-wide rounded-full hover:bg-blue-400 transition-colors"
        >
          프로젝트 문의하기
        </a>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-white/10 py-6 px-10 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span className="text-sm font-extrabold text-white/40" style={{ letterSpacing: '-0.02em' }}>
          <span className="text-blue-400/60">:</span>DLAB
        </span>
        <span className="text-sm text-white/20">&copy; {new Date().getFullYear()} 디랩. All rights reserved.</span>
      </footer>
    </main>
  );
}

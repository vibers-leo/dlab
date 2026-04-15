'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Slide = {
  slide_no: number; title: string; type: string;
  heading?: string; bullets?: string[]; note?: string;
};
type Proposal = {
  id: number; title: string; rfp_no: string; status: string;
  rfp_raw: Record<string, string>;
  ai_draft: {
    executive_summary: string;
    slides: Slide[];
    sections: Record<string, string>;
    evaluation_mapping: Array<{ criterion: string; score: string; our_response: string }>;
  };
  entity_ids: number[];
  created_at: string;
};

const SECTION_LABELS: Record<string, string> = {
  understanding: '사업 이해', strategy: '수행 전략',
  organization: '추진 체계', schedule: '수행 일정',
  outcome: '기대 효과', company: '회사 소개',
};

export default function ProposalDetailPage() {
  const { id } = useParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [view, setView] = useState<'overview' | 'slides' | 'sections'>('overview');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch(`/api/collab/proposals/${id}`).then(r => r.json()).then(setProposal);
  }, [id]);

  const printSlides = () => {
    window.print();
  };

  if (!proposal) return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#051226' }}>
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const slides = proposal.ai_draft?.slides || [];
  const sections = proposal.ai_draft?.sections || {};
  const evalMap = proposal.ai_draft?.evaluation_mapping || [];
  const slide = slides[currentSlide];

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 print:hidden" style={{ backgroundColor: 'rgba(5,18,38,0.85)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/collab" className="text-white/40 hover:text-white/60">Collab Hub</Link>
            <span className="text-white/20">/</span>
            <Link href="/collab/proposals" className="text-white/40 hover:text-white/60">제안서</Link>
            <span className="text-white/20">/</span>
            <span className="text-white font-bold truncate max-w-xs">{proposal.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('overview')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${view === 'overview' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'}`}>개요</button>
            <button onClick={() => setView('slides')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${view === 'slides' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'}`}>슬라이드</button>
            <button onClick={() => setView('sections')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${view === 'sections' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'}`}>본문</button>
            <button onClick={printSlides} className="px-4 py-1.5 text-xs font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors">PDF 출력</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 print:p-0">

        {/* 개요 탭 */}
        {view === 'overview' && (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/3">
              <h1 className="text-2xl font-extrabold text-white mb-4">{proposal.title}</h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {proposal.rfp_raw?.org && <div><span className="text-white/30">발주기관 </span><span className="text-white">{proposal.rfp_raw.org}</span></div>}
                {proposal.rfp_raw?.budget && <div><span className="text-white/30">예산 </span><span className="text-white">{proposal.rfp_raw.budget}</span></div>}
                {proposal.rfp_raw?.deadline && <div><span className="text-white/30">마감 </span><span className="text-white">{proposal.rfp_raw.deadline}</span></div>}
                {proposal.rfp_no && <div><span className="text-white/30">공고번호 </span><span className="text-white font-mono text-xs">{proposal.rfp_no}</span></div>}
                <div><span className="text-white/30">슬라이드 </span><span className="text-white">{slides.length}장</span></div>
                <div><span className="text-white/30">생성일 </span><span className="text-white">{proposal.created_at?.slice(0, 10)}</span></div>
              </div>
            </div>

            {/* 요약 */}
            {proposal.ai_draft?.executive_summary && (
              <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/8">
                <p className="text-xs text-blue-400 font-bold mb-3 tracking-widest uppercase">Executive Summary</p>
                <p className="text-white/80 leading-relaxed">{proposal.ai_draft.executive_summary}</p>
              </div>
            )}

            {/* 평가항목 매핑 */}
            {evalMap.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">평가 항목 대응 전략</h2>
                <div className="space-y-2">
                  {evalMap.map((e, i) => (
                    <div key={i} className="p-4 rounded-xl border border-white/8 bg-white/3">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-white">{e.criterion}</span>
                        {e.score && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">{e.score}</span>}
                      </div>
                      <p className="text-white/50 text-xs leading-relaxed">{e.our_response}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setView('slides')} className="flex-1 py-3 text-sm font-bold border border-white/15 text-white/70 rounded-xl hover:border-white/30 transition-colors">슬라이드 보기 →</button>
              <button onClick={() => setView('sections')} className="flex-1 py-3 text-sm font-bold border border-white/15 text-white/70 rounded-xl hover:border-white/30 transition-colors">본문 전체 →</button>
            </div>
          </div>
        )}

        {/* 슬라이드 뷰어 */}
        {view === 'slides' && slides.length > 0 && (
          <div>
            {/* 슬라이드 캔버스 */}
            <div className="aspect-video bg-white rounded-2xl overflow-hidden mb-4 shadow-2xl print:rounded-none print:shadow-none print:mb-0"
              style={{ background: 'linear-gradient(135deg, #0B2447 0%, #1a365d 100%)' }}
            >
              <div className="h-full flex flex-col p-12">
                {slide?.type === 'cover' ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="text-blue-300 text-sm font-bold tracking-widest mb-4 uppercase">{proposal.rfp_raw?.org || 'PROPOSAL'}</div>
                    <h1 className="text-4xl font-black text-white leading-tight mb-4">{slide.title}</h1>
                    {slide.heading && <p className="text-blue-200/70 text-lg">{slide.heading}</p>}
                    <div className="mt-8 text-blue-400/50 text-sm">{proposal.rfp_raw?.deadline}</div>
                  </div>
                ) : (
                  <>
                    <div className="border-b border-white/10 pb-4 mb-6">
                      <div className="text-blue-300/60 text-xs font-bold tracking-widest mb-1">{String(slide?.slide_no).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</div>
                      <h2 className="text-2xl font-black text-white">{slide?.title}</h2>
                      {slide?.heading && <p className="text-blue-200/60 text-sm mt-1">{slide.heading}</p>}
                    </div>
                    <div className="flex-1 space-y-3">
                      {slide?.bullets?.map((b, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                          <p className="text-white/80 text-base leading-relaxed">{b}</p>
                        </div>
                      ))}
                    </div>
                    {slide?.note && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-white/30 text-xs">{slide.note}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 슬라이드 컨트롤 */}
            <div className="flex items-center justify-between mb-4 print:hidden">
              <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0}
                className="px-5 py-2 text-sm font-bold border border-white/15 text-white/60 rounded-xl hover:border-white/30 transition-colors disabled:opacity-30"
              >← 이전</button>
              <span className="text-sm text-white/40">{currentSlide + 1} / {slides.length}</span>
              <button onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))} disabled={currentSlide === slides.length - 1}
                className="px-5 py-2 text-sm font-bold border border-white/15 text-white/60 rounded-xl hover:border-white/30 transition-colors disabled:opacity-30"
              >다음 →</button>
            </div>

            {/* 슬라이드 썸네일 네비 */}
            <div className="flex gap-2 overflow-x-auto pb-2 print:hidden">
              {slides.map((s, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  className="flex-shrink-0 w-24 h-14 rounded-lg border text-xs font-bold transition-all overflow-hidden"
                  style={i === currentSlide ? { borderColor: '#3B82F6', backgroundColor: '#3B82F620', color: '#3B82F6' } : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}
                >
                  <div className="p-2 text-left line-clamp-2">{s.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 본문 섹션 */}
        {view === 'sections' && (
          <div className="space-y-6">
            {Object.entries(sections).map(([key, content]) => (
              <div key={key} className="p-6 rounded-2xl border border-white/8 bg-white/3">
                <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">{SECTION_LABELS[key] || key}</h2>
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 인쇄 스타일 */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </main>
  );
}

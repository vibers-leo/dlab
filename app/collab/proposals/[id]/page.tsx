'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Slide = { slide_no: number; title: string; type: string; heading?: string; bullets?: string[]; note?: string };
type Proposal = {
  id: number; title: string; rfp_no: string; status: string;
  rfp_raw: Record<string, string>;
  ai_draft: { executive_summary: string; slides: Slide[]; sections: Record<string, string>; evaluation_mapping: Array<{ criterion: string; score: string; our_response: string }> };
  entity_ids: number[]; created_at: string;
};
type Comment = { id: number; section_key: string; author_name: string; content: string; created_at: string; entity_name: string; entity_color: string };
type Assignment = { section_key: string; entity_id: number; entity_name: string; entity_color: string; status: string };
type Entity = { id: number; name: string; color: string };

const SECTION_LABELS: Record<string, string> = {
  understanding: '사업 이해', strategy: '수행 전략',
  organization: '추진 체계', schedule: '수행 일정',
  outcome: '기대 효과', company: '회사 소개',
};
const ASSIGN_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: '대기', color: '#6B7280' },
  in_progress: { label: '작성중', color: '#F59E0B' },
  done: { label: '완료', color: '#10B981' },
};
const PROPOSAL_STATUS: Record<string, { label: string; color: string; next: string }> = {
  draft: { label: '초안', color: '#6B7280', next: 'review' },
  review: { label: '검토중', color: '#F59E0B', next: 'final' },
  final: { label: '완성', color: '#10B981', next: 'submitted' },
  submitted: { label: '제출완료', color: '#6366F1', next: '' },
};

export default function ProposalDetailPage() {
  const { id } = useParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [view, setView] = useState<'overview' | 'slides' | 'sections' | 'collab'>('overview');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [newComment, setNewComment] = useState({ author_name: '', content: '', section_key: '' });
  const [posting, setPosting] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const fetchAll = useCallback(async () => {
    const [p, c, a, e] = await Promise.all([
      fetch(`/api/collab/proposals/${id}`).then(r => r.json()),
      fetch(`/api/collab/proposals/${id}/comments`).then(r => r.json()),
      fetch(`/api/collab/proposals/${id}/sections`).then(r => r.json()),
      fetch('/api/collab/entities').then(r => r.json()),
    ]);
    setProposal(p); setComments(c); setAssignments(a); setEntities(e);
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const advanceStatus = async () => {
    if (!proposal) return;
    const next = PROPOSAL_STATUS[proposal.status]?.next;
    if (!next) return;
    await fetch(`/api/collab/proposals/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) });
    setProposal({ ...proposal, status: next });
  };

  const assignSection = async (section_key: string, entity_id: number, status = 'pending') => {
    await fetch(`/api/collab/proposals/${id}/sections`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section_key, entity_id, status }) });
    fetchAll();
  };

  const postComment = async () => {
    if (!newComment.content || !newComment.author_name) return;
    setPosting(true);
    await fetch(`/api/collab/proposals/${id}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newComment) });
    setNewComment({ ...newComment, content: '' });
    setPosting(false);
    fetchAll();
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
  const st = PROPOSAL_STATUS[proposal.status] || PROPOSAL_STATUS.draft;

  const sectionComments = (key: string) => comments.filter(c => c.section_key === key);
  const sectionAssignment = (key: string) => assignments.find(a => a.section_key === key);

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 print:hidden" style={{ backgroundColor: 'rgba(5,18,38,0.85)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-white truncate max-w-xs mr-auto">{proposal.title}</span>
          <div className="flex items-center gap-2">
            {/* 상태 배지 + 진행 버튼 */}
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: st.color + '20', color: st.color }}>{st.label}</span>
            {st.next && (
              <button onClick={advanceStatus} className="px-3 py-1.5 text-xs font-bold border border-white/15 text-white/60 rounded-lg hover:border-white/30 hover:text-white transition-all">
                {PROPOSAL_STATUS[st.next]?.label}으로 →
              </button>
            )}
            {[['overview','개요'], ['slides','슬라이드'], ['sections','본문'], ['collab','협업']].map(([v, l]) => (
              <button key={v} onClick={() => setView(v as typeof view)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${view === v ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                {v === 'collab' && comments.length > 0 ? `${l} (${comments.length})` : l}
              </button>
            ))}
            <button onClick={() => window.print()} className="px-4 py-1.5 text-xs font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors">PDF</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 print:p-0">

        {/* ── 개요 ── */}
        {view === 'overview' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/3">
              <h1 className="text-2xl font-extrabold text-white mb-4">{proposal.title}</h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                {[
                  ['발주기관', proposal.rfp_raw?.org],
                  ['예산', proposal.rfp_raw?.budget],
                  ['마감', proposal.rfp_raw?.deadline],
                  ['슬라이드', `${slides.length}장`],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k}><p className="text-white/30 text-xs mb-0.5">{k}</p><p className="text-white font-semibold">{v}</p></div>
                ))}
              </div>
            </div>
            {proposal.ai_draft?.executive_summary && (
              <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/8">
                <p className="text-xs text-blue-400 font-bold mb-3 tracking-widest uppercase">Executive Summary</p>
                <p className="text-white/80 leading-relaxed">{proposal.ai_draft.executive_summary}</p>
              </div>
            )}
            {evalMap.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">평가 항목 대응 전략</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {evalMap.map((e, i) => (
                    <div key={i} className="p-4 rounded-xl border border-white/8 bg-white/3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-white">{e.criterion}</span>
                        {e.score && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">{e.score}</span>}
                      </div>
                      <p className="text-white/50 text-xs leading-relaxed">{e.our_response}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 슬라이드 ── */}
        {view === 'slides' && slides.length > 0 && (
          <div>
            <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-2xl" style={{ background: 'linear-gradient(135deg, #0B2447 0%, #1a365d 100%)' }}>
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
                      <div className="text-blue-300/60 text-xs font-bold tracking-widest mb-1">{String(slide?.slide_no).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}</div>
                      <h2 className="text-2xl font-black text-white">{slide?.title}</h2>
                      {slide?.heading && <p className="text-blue-200/60 text-sm mt-1">{slide.heading}</p>}
                    </div>
                    <div className="flex-1 space-y-3 overflow-hidden">
                      {slide?.bullets?.map((b, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                          <p className="text-white/80 text-base leading-relaxed">{b}</p>
                        </div>
                      ))}
                    </div>
                    {slide?.note && <p className="mt-4 pt-4 border-t border-white/10 text-white/25 text-xs">{slide.note}</p>}
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setCurrentSlide(Math.max(0, currentSlide-1))} disabled={currentSlide===0} className="px-5 py-2 text-sm font-bold border border-white/15 text-white/60 rounded-xl hover:border-white/30 transition-colors disabled:opacity-30">← 이전</button>
              <span className="text-sm text-white/40">{currentSlide+1} / {slides.length}</span>
              <button onClick={() => setCurrentSlide(Math.min(slides.length-1, currentSlide+1))} disabled={currentSlide===slides.length-1} className="px-5 py-2 text-sm font-bold border border-white/15 text-white/60 rounded-xl hover:border-white/30 transition-colors disabled:opacity-30">다음 →</button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {slides.map((s, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  className="flex-shrink-0 w-24 h-14 rounded-lg border text-xs transition-all p-2 text-left line-clamp-2"
                  style={i===currentSlide ? { borderColor:'#3B82F6', backgroundColor:'#3B82F620', color:'#3B82F6' } : { borderColor:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.3)' }}
                >{s.title}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── 본문 + 섹션 담당자 ── */}
        {view === 'sections' && (
          <div className="space-y-4">
            {Object.entries(sections).map(([key, content]) => {
              const assign = sectionAssignment(key);
              const aStatus = ASSIGN_STATUS[assign?.status || 'pending'];
              const secComments = sectionComments(key);
              const isActive = activeSection === key;
              return (
                <div key={key} className="rounded-2xl border border-white/8 overflow-hidden">
                  {/* 섹션 헤더 */}
                  <div className="flex items-center justify-between p-4 bg-white/3 border-b border-white/8">
                    <div className="flex items-center gap-3">
                      <h2 className="text-sm font-bold text-white">{SECTION_LABELS[key] || key}</h2>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: aStatus.color+'20', color: aStatus.color }}>{aStatus.label}</span>
                      {secComments.length > 0 && <span className="text-xs text-white/30">댓글 {secComments.length}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* 담당자 배정 */}
                      <select
                        value={assign?.entity_id || ''}
                        onChange={e => assignSection(key, parseInt(e.target.value))}
                        className="text-xs bg-white/8 border border-white/12 rounded-lg px-2 py-1 text-white/60 outline-none focus:border-blue-500"
                      >
                        <option value="">담당자 배정</option>
                        {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                      </select>
                      {assign && (
                        <select value={assign.status} onChange={e => assignSection(key, assign.entity_id, e.target.value)}
                          className="text-xs bg-white/8 border border-white/12 rounded-lg px-2 py-1 text-white/60 outline-none focus:border-blue-500"
                        >
                          {Object.entries(ASSIGN_STATUS).map(([v, {label}]) => <option key={v} value={v}>{label}</option>)}
                        </select>
                      )}
                      <button onClick={() => setActiveSection(isActive ? '' : key)} className="text-xs text-blue-400 hover:text-blue-300">
                        {isActive ? '닫기' : '댓글'}
                      </button>
                    </div>
                  </div>

                  {/* 본문 */}
                  <div className="p-6">
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{content}</p>
                  </div>

                  {/* 댓글 패널 */}
                  {isActive && (
                    <div className="border-t border-white/8 p-4 bg-white/2 space-y-3">
                      {secComments.map(c => (
                        <div key={c.id} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black" style={{ backgroundColor: (c.entity_color||'#3B82F6')+'25', color: c.entity_color||'#3B82F6' }}>
                            {c.author_name.slice(0,1)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-bold text-white">{c.author_name}</span>
                              {c.entity_name && <span className="text-xs text-white/30">{c.entity_name}</span>}
                              <span className="text-xs text-white/20">{c.created_at?.slice(0,16).replace('T',' ')}</span>
                            </div>
                            <p className="text-white/60 text-sm">{c.content}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2 pt-1">
                        <input value={newComment.author_name} onChange={e => setNewComment({...newComment, author_name: e.target.value})}
                          placeholder="이름" className="w-24 bg-white/8 border border-white/12 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 placeholder:text-white/20"
                        />
                        <input value={newComment.content} onChange={e => setNewComment({...newComment, content: e.target.value, section_key: key})}
                          placeholder="댓글 입력..." onKeyDown={e => e.key==='Enter' && postComment()}
                          className="flex-1 bg-white/8 border border-white/12 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 placeholder:text-white/20"
                        />
                        <button onClick={postComment} disabled={posting} className="px-4 py-2 text-xs font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors disabled:opacity-40">등록</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── 협업 탭 ── */}
        {view === 'collab' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 섹션 진행 현황 */}
            <div className="lg:col-span-1">
              <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">섹션 진행 현황</h2>
              <div className="space-y-2">
                {Object.keys(sections).map(key => {
                  const assign = sectionAssignment(key);
                  const aStatus = ASSIGN_STATUS[assign?.status || 'pending'];
                  return (
                    <div key={key} className="p-3 rounded-xl border border-white/8 bg-white/3 flex items-center justify-between">
                      <span className="text-sm text-white/70">{SECTION_LABELS[key]}</span>
                      <div className="flex items-center gap-2">
                        {assign?.entity_name && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: assign.entity_color+'20', color: assign.entity_color }}>{assign.entity_name}</span>}
                        <span className="text-xs" style={{ color: aStatus.color }}>{aStatus.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 전체 댓글 */}
            <div className="lg:col-span-2">
              <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">전체 댓글 ({comments.length})</h2>
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-white/25 text-sm py-8 text-center">아직 댓글이 없습니다</p>
                ) : comments.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-white/8 bg-white/3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-white">{c.author_name}</span>
                      {c.entity_name && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: (c.entity_color||'#3B82F6')+'20', color: c.entity_color||'#3B82F6' }}>{c.entity_name}</span>}
                      {c.section_key && <span className="text-xs text-white/30">{SECTION_LABELS[c.section_key] || c.section_key}</span>}
                      <span className="text-xs text-white/20 ml-auto">{c.created_at?.slice(0,16).replace('T',' ')}</span>
                    </div>
                    <p className="text-white/60 text-sm">{c.content}</p>
                  </div>
                ))}
              </div>
              {/* 새 댓글 */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/3 space-y-3">
                <h3 className="text-xs font-bold text-white/40">새 댓글</h3>
                <div className="flex gap-2">
                  <input value={newComment.author_name} onChange={e => setNewComment({...newComment, author_name: e.target.value})}
                    placeholder="이름" className="w-32 bg-white/8 border border-white/12 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/20"
                  />
                  <select value={newComment.section_key} onChange={e => setNewComment({...newComment, section_key: e.target.value})}
                    className="flex-1 bg-white/8 border border-white/12 rounded-lg px-3 py-2 text-sm text-white/60 outline-none focus:border-blue-500"
                  >
                    <option value="">전체 댓글</option>
                    {Object.entries(SECTION_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <textarea value={newComment.content} onChange={e => setNewComment({...newComment, content: e.target.value})}
                  placeholder="의견을 작성하세요..." rows={3}
                  className="w-full bg-white/8 border border-white/12 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/20 resize-none"
                />
                <button onClick={postComment} disabled={posting || !newComment.content || !newComment.author_name}
                  className="w-full py-2.5 text-sm font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors disabled:opacity-40"
                >{posting ? '등록 중...' : '댓글 등록'}</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`@media print { body { background: white !important; } }`}</style>
    </main>
  );
}

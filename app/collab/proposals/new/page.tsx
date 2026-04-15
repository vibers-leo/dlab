'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Entity = { id: number; name: string; color: string; type: string };

type RFPData = {
  title: string; org: string; budget: string; deadline: string;
  description: string; requirements: string; evaluation: string;
};

const STEP_LABELS = ['RFP 입력', '참여사 선택', 'AI 생성', '저장'];

export default function NewProposalPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [rfpNo, setRfpNo] = useState('');
  const [rfpSource, setRfpSource] = useState<'koneps' | 'manual'>('manual');
  const [rfp, setRfp] = useState<RFPData>({
    title: '', org: '', budget: '', deadline: '',
    description: '', requirements: '', evaluation: '',
  });
  const [selectedEntities, setSelectedEntities] = useState<number[]>([]);
  const [projectType, setProjectType] = useState('');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/collab/entities').then(r => r.json()).then(setEntities);
  }, []);

  const fetchRFP = async () => {
    if (!rfpNo.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/collab/rfp/parse', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfp_no: rfpNo }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error); return; }
      setRfp({ ...rfp, ...json.data });
    } catch {
      setError('API 연결 실패');
    } finally { setLoading(false); }
  };

  const generateDraft = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/collab/proposals/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfp, entity_ids: selectedEntities, project_type: projectType }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error); return; }
      setDraft(json.draft);
      setStep(3);
    } catch {
      setError('AI 생성 실패');
    } finally { setLoading(false); }
  };

  const save = async () => {
    setLoading(true);
    const res = await fetch('/api/collab/proposals', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: rfp.title || '제안서 초안',
        rfp_no: rfpNo || null,
        rfp_raw: rfp,
        entity_ids: selectedEntities,
        ai_draft: draft,
      }),
    });
    const saved = await res.json();
    router.push(`/collab/proposals/${saved.id}`);
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs text-white/40 block mb-1.5">{children}</label>
  );
  const Input = ({ value, onChange, placeholder, type = 'text' }: {
    value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
  }) => (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors placeholder:text-white/20"
    />
  );
  const Textarea = ({ value, onChange, placeholder, rows = 3 }: {
    value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
  }) => (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors placeholder:text-white/20 resize-none"
    />
  );

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: 'rgba(5,18,38,0.85)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/collab" className="text-white/40 hover:text-white/60">Collab Hub</Link>
            <span className="text-white/20">/</span>
            <Link href="/collab/proposals" className="text-white/40 hover:text-white/60">제안서</Link>
            <span className="text-white/20">/</span>
            <span className="text-white font-bold">새 제안서</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* 스텝 인디케이터 */}
        <div className="flex items-center gap-2 mb-10">
          {STEP_LABELS.map((lbl, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                i < step ? 'bg-blue-500 text-white' :
                i === step ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400' :
                'bg-white/8 text-white/25'
              }`}>{i < step ? '✓' : i + 1}</div>
              <span className={`text-xs font-bold ${i === step ? 'text-white' : 'text-white/30'}`}>{lbl}</span>
              {i < STEP_LABELS.length - 1 && <div className="w-8 h-px bg-white/15 mx-1" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
        )}

        {/* Step 0: RFP 입력 */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-white mb-6">RFP 정보 입력</h2>

            {/* 소스 선택 */}
            <div className="flex gap-2 mb-4">
              {[['koneps', '나라장터 공고번호'], ['manual', '직접 입력']].map(([val, lbl]) => (
                <button key={val} type="button" onClick={() => setRfpSource(val as 'koneps' | 'manual')}
                  className="px-4 py-2 text-xs font-bold rounded-lg border transition-all"
                  style={rfpSource === val
                    ? { backgroundColor: '#3B82F620', borderColor: '#3B82F6', color: '#3B82F6' }
                    : { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }
                  }
                >{lbl}</button>
              ))}
            </div>

            {rfpSource === 'koneps' && (
              <div className="flex gap-2">
                <input value={rfpNo} onChange={e => setRfpNo(e.target.value)}
                  placeholder="공고번호 입력 (예: 20261234567)"
                  className="flex-1 bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors placeholder:text-white/20"
                />
                <button onClick={fetchRFP} disabled={loading}
                  className="px-5 py-3 text-xs font-bold bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors disabled:opacity-40"
                >{loading ? '조회중...' : '불러오기'}</button>
              </div>
            )}

            <div><Label>사업명 *</Label><Input value={rfp.title} onChange={v => setRfp({ ...rfp, title: v })} placeholder="2026 지역 축제 행사 운영 및 관리 용역" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>발주기관</Label><Input value={rfp.org} onChange={v => setRfp({ ...rfp, org: v })} placeholder="부산광역시" /></div>
              <div><Label>예산</Label><Input value={rfp.budget} onChange={v => setRfp({ ...rfp, budget: v })} placeholder="150,000,000원" /></div>
              <div><Label>제출 마감</Label><Input type="date" value={rfp.deadline} onChange={v => setRfp({ ...rfp, deadline: v })} /></div>
              <div><Label>사업 유형</Label>
                <select value={projectType} onChange={e => setProjectType(e.target.value)}
                  className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="">선택</option>
                  {['문화행사/축제', '체육행사', '교육/연수', '홍보/마케팅', 'IT/시스템', '컨설팅', '기타'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div><Label>사업 개요</Label><Textarea value={rfp.description} onChange={v => setRfp({ ...rfp, description: v })} placeholder="사업의 목적과 배경, 주요 내용을 입력하세요" rows={4} /></div>
            <div><Label>주요 요구사항</Label><Textarea value={rfp.requirements} onChange={v => setRfp({ ...rfp, requirements: v })} placeholder="인력 조건, 수행 방법, 납품 기준 등" rows={3} /></div>
            <div><Label>평가 기준 (알고 있다면)</Label><Textarea value={rfp.evaluation} onChange={v => setRfp({ ...rfp, evaluation: v })} placeholder="예) 수행 계획 30점, 업체 실적 20점, 가격 50점" rows={3} /></div>

            <button onClick={() => setStep(1)} disabled={!rfp.title}
              className="w-full py-4 text-sm font-bold bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors disabled:opacity-40"
            >다음: 참여사 선택 →</button>
          </div>
        )}

        {/* Step 1: 참여 엔티티 선택 */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-white mb-2">참여 기관 선택</h2>
            <p className="text-white/40 text-sm mb-6">제안서에 참여하는 기관을 선택하세요. 각 기관의 강점이 AI에 반영됩니다.</p>

            <div className="space-y-2">
              {entities.map(e => {
                const selected = selectedEntities.includes(e.id);
                return (
                  <button key={e.id} type="button" onClick={() => setSelectedEntities(
                    selected ? selectedEntities.filter(id => id !== e.id) : [...selectedEntities, e.id]
                  )}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left"
                    style={selected
                      ? { backgroundColor: e.color + '15', borderColor: e.color + '60' }
                      : { backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }
                    }
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{ backgroundColor: e.color + '25', color: e.color }}>
                      {e.name.slice(0, 1)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-bold">{e.name}</p>
                      <p className="text-white/30 text-xs">{e.type === 'internal' ? '내부 엔티티' : '협력사'}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all`}
                      style={selected ? { backgroundColor: e.color, borderColor: e.color } : { borderColor: 'rgba(255,255,255,0.2)' }}
                    >
                      {selected && <span className="text-white text-xs">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(0)} className="flex-1 py-3 text-sm font-bold text-white/50 border border-white/12 rounded-xl hover:border-white/25 transition-colors">← 이전</button>
              <button onClick={() => setStep(2)} disabled={selectedEntities.length === 0}
                className="flex-1 py-3 text-sm font-bold bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors disabled:opacity-40"
              >다음: AI 생성 →</button>
            </div>
          </div>
        )}

        {/* Step 2: AI 생성 */}
        {step === 2 && (
          <div className="text-center py-10 space-y-6">
            <h2 className="text-xl font-extrabold text-white">AI 제안서 생성</h2>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/3 text-left space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">사업명</span>
                <span className="text-white font-semibold">{rfp.title}</span>
              </div>
              {rfp.org && <div className="flex justify-between text-sm">
                <span className="text-white/40">발주기관</span>
                <span className="text-white">{rfp.org}</span>
              </div>}
              <div className="flex justify-between text-sm">
                <span className="text-white/40">참여 기관</span>
                <span className="text-white">{entities.filter(e => selectedEntities.includes(e.id)).map(e => e.name).join(', ')}</span>
              </div>
            </div>

            {loading ? (
              <div className="py-12">
                <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/50 text-sm">Claude AI가 제안서를 작성 중입니다...</p>
                <p className="text-white/25 text-xs mt-1">평균 15~30초 소요</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-4 text-sm font-bold text-white/50 border border-white/12 rounded-xl hover:border-white/25 transition-colors">← 이전</button>
                <button onClick={generateDraft}
                  className="flex-2 flex-grow py-4 text-sm font-bold rounded-xl transition-colors"
                  style={{ backgroundColor: '#6366F1', color: 'white' }}
                >
                  ✨ AI 제안서 생성하기
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: 저장 */}
        {step === 3 && draft && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-white">생성 완료</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold">✓ AI 초안 완성</span>
            </div>

            {(draft.executive_summary as string) && (
              <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/8">
                <p className="text-xs text-blue-400 font-bold mb-2">사업 이해 요약</p>
                <p className="text-white/80 text-sm leading-relaxed">{draft.executive_summary as string}</p>
              </div>
            )}

            {Array.isArray(draft.slides) && (
              <div>
                <p className="text-xs text-white/40 mb-3">슬라이드 구성 ({(draft.slides as unknown[]).length}장)</p>
                <div className="space-y-2">
                  {(draft.slides as Array<{ slide_no: number; title: string; bullets?: string[] }>).slice(0, 5).map((s) => (
                    <div key={s.slide_no} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                      <span className="text-xs font-black text-white/20 w-5 flex-shrink-0 mt-0.5">{s.slide_no}</span>
                      <div>
                        <p className="text-white text-sm font-semibold">{s.title}</p>
                        {s.bullets?.[0] && <p className="text-white/40 text-xs mt-0.5">{s.bullets[0]}</p>}
                      </div>
                    </div>
                  ))}
                  {(draft.slides as unknown[]).length > 5 && (
                    <p className="text-xs text-white/25 text-center">+{(draft.slides as unknown[]).length - 5}장 더...</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => { setDraft(null); setStep(2); }}
                className="flex-1 py-3 text-sm font-bold text-white/50 border border-white/12 rounded-xl hover:border-white/25 transition-colors">
                다시 생성
              </button>
              <button onClick={save} disabled={loading}
                className="flex-1 py-3 text-sm font-bold bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors disabled:opacity-40"
              >{loading ? '저장 중...' : '저장 & 슬라이드 보기 →'}</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

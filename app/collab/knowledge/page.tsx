'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Doc = { id: number; entity_id: number; entity_name: string; entity_color: string; title: string; category: string; content: string; year: number; result: string; created_at: string };
type Entity = { id: number; name: string; color: string };

const CATEGORIES = [
  { value: 'proposal', label: '제안서', icon: '📄' },
  { value: 'rfp', label: 'RFP/공고서', icon: '📋' },
  { value: 'report', label: '결과보고서', icon: '📊' },
  { value: 'template', label: '공통 양식', icon: '📝' },
  { value: 'reference', label: '참고 자료', icon: '📚' },
];
const RESULTS = ['선정', '탈락', '진행중', '참고용'];

export default function KnowledgePage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [filterEntity, setFilterEntity] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ entity_id: '', title: '', category: 'proposal', content: '', year: String(new Date().getFullYear()), result: '' });
  const [saving, setSaving] = useState(false);

  const fetchDocs = async () => {
    const url = filterEntity ? `/api/collab/knowledge?entity_id=${filterEntity}` : '/api/collab/knowledge';
    const data = await fetch(url).then(r => r.json());
    setDocs(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetch('/api/collab/entities').then(r => r.json()).then(setEntities);
  }, []);

  useEffect(() => { fetchDocs(); }, [filterEntity]);

  const save = async () => {
    if (!form.entity_id || !form.title) return;
    setSaving(true);
    await fetch('/api/collab/knowledge', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, entity_id: parseInt(form.entity_id), year: form.year ? parseInt(form.year) : null }),
    });
    setForm({ entity_id: '', title: '', category: 'proposal', content: '', year: String(new Date().getFullYear()), result: '' });
    setShowForm(false);
    setSaving(false);
    fetchDocs();
  };

  const deleteDoc = async (id: number) => {
    await fetch(`/api/collab/knowledge?id=${id}`, { method: 'DELETE' });
    fetchDocs();
  };

  const filtered = filterCat ? docs.filter(d => d.category === filterCat) : docs;

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-2 flex items-center justify-between">
        <h1 className="text-sm font-bold text-white/40 tracking-widest uppercase">지식베이스</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 text-xs font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors">
          + 문서 추가
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 설명 */}
        <div className="p-5 rounded-2xl border border-indigo-500/25 bg-indigo-500/8 mb-8">
          <p className="text-sm text-indigo-300 font-bold mb-1">🧠 AI 학습 지식베이스</p>
          <p className="text-xs text-white/50 leading-relaxed">여기에 등록된 문서가 AI 제안서 생성 시 RAG 소스로 활용됩니다. 과거 제안서, RFP 공고서, 결과보고서를 등록하면 AI가 우리만의 스타일과 강점을 학습합니다.</p>
        </div>

        {/* 등록 폼 */}
        {showForm && (
          <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5 mb-6 space-y-4">
            <h2 className="text-sm font-bold text-white">새 문서 등록</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 block mb-1.5">엔티티 *</label>
                <select value={form.entity_id} onChange={e => setForm({...form, entity_id: e.target.value})}
                  className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="">선택</option>
                  {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5">카테고리</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-white/40 block mb-1.5">제목 *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="2025 부산 봄꽃 페스티벌 운영 제안서"
                  className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/20"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5">연도</label>
                <input type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})}
                  className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5">결과</label>
                <select value={form.result} onChange={e => setForm({...form, result: e.target.value})}
                  className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="">선택</option>
                  {RESULTS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-white/40 block mb-1.5">내용 (AI 학습에 활용됨)</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                  rows={6} placeholder="제안서 핵심 내용, 전략, 수행 방법, 강점 등을 입력하세요. 이 내용이 AI 제안서 생성 시 참고됩니다."
                  className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/20 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 text-sm font-bold text-white/50 border border-white/12 rounded-xl hover:border-white/25 transition-colors">취소</button>
              <button onClick={save} disabled={saving || !form.entity_id || !form.title}
                className="flex-1 py-3 text-sm font-bold bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors disabled:opacity-40"
              >{saving ? '저장 중...' : '저장'}</button>
            </div>
          </div>
        )}

        {/* 필터 */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select value={filterEntity} onChange={e => setFilterEntity(e.target.value)}
            className="bg-white/8 border border-white/12 rounded-xl px-4 py-2 text-xs text-white/60 outline-none focus:border-blue-500"
          >
            <option value="">전체 엔티티</option>
            {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <div className="flex gap-1">
            {[{value:'',label:'전체'}, ...CATEGORIES].map(c => (
              <button key={c.value} onClick={() => setFilterCat(c.value)}
                className="px-3 py-1.5 text-xs font-bold rounded-full border transition-all"
                style={filterCat === c.value
                  ? { backgroundColor:'#3B82F620', borderColor:'#3B82F6', color:'#3B82F6' }
                  : { backgroundColor:'transparent', borderColor:'rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.4)' }
                }
              >{'icon' in c ? `${c.icon} ` : ''}{c.label}</button>
            ))}
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {CATEGORIES.map(c => {
            const count = docs.filter(d => d.category === c.value).length;
            return (
              <div key={c.value} className="p-4 rounded-xl border border-white/8 bg-white/3 text-center">
                <p className="text-xl mb-1">{c.icon}</p>
                <p className="text-lg font-extrabold text-white">{count}</p>
                <p className="text-xs text-white/30">{c.label}</p>
              </div>
            );
          })}
        </div>

        {/* 문서 목록 */}
        {filtered.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-white/15 text-center">
            <p className="text-3xl mb-3">📂</p>
            <p className="text-white/30 text-sm mb-2">등록된 문서가 없습니다</p>
            <button onClick={() => setShowForm(true)} className="text-xs text-blue-400 font-bold hover:text-blue-300">+ 첫 문서 등록하기</button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(d => {
              const cat = CATEGORIES.find(c => c.value === d.category);
              return (
                <div key={d.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/8 bg-white/3 hover:border-white/15 transition-all group">
                  <span className="text-xl flex-shrink-0 mt-0.5">{cat?.icon || '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white text-sm font-semibold">{d.title}</p>
                      {d.year && <span className="text-xs text-white/30">{d.year}</span>}
                      {d.result && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{
                          backgroundColor: d.result==='선정' ? '#10B98120' : d.result==='탈락' ? '#EF444420' : '#6366F120',
                          color: d.result==='선정' ? '#10B981' : d.result==='탈락' ? '#EF4444' : '#6366F1',
                        }}>{d.result}</span>
                      )}
                    </div>
                    {d.content && <p className="text-white/40 text-xs line-clamp-2">{d.content}</p>}
                    <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: (d.entity_color||'#3B82F6')+'20', color: d.entity_color||'#3B82F6' }}>{d.entity_name}</span>
                  </div>
                  <button onClick={() => deleteDoc(d.id)} className="text-white/15 hover:text-red-400 transition-colors text-sm flex-shrink-0 opacity-0 group-hover:opacity-100">✕</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

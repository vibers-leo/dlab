'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Brand = {
  id: number; slug: string; name: string; domain: string;
  description: string; primary_color: string; category: string; status: string;
};
type Entity = {
  id: number; slug: string; name: string; ceo: string; business_no: string;
  address: string; industry: string; color: string; description: string;
  type: string; brands: Brand[];
};

const BRAND_STATUS: Record<string, string> = {
  active: '운영중', development: '개발중', paused: '보류', archived: '종료'
};

export default function EntityDetailPage() {
  const { id } = useParams();
  const [entity, setEntity] = useState<Entity | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Entity>>({});

  useEffect(() => {
    fetch(`/api/collab/entities/${id}`)
      .then(r => r.json())
      .then(data => { setEntity(data); setForm(data); });
  }, [id]);

  const save = async () => {
    const res = await fetch(`/api/collab/entities/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setEntity({ ...entity!, ...updated });
    setEditing(false);
  };

  if (!entity) return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#051226' }}>
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-white">{entity.name}</p>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="px-4 py-2 text-xs font-bold text-white/50 hover:text-white/80 transition-colors">취소</button>
                <button onClick={save} className="px-4 py-2 text-xs font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors">저장</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="px-4 py-2 text-xs font-bold bg-white/10 text-white rounded-lg hover:bg-white/15 transition-colors">편집</button>
            )}
          </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-10">
        {/* 엔티티 정보 */}
        <div className="p-6 rounded-2xl border border-white/8 mb-8" style={{ background: `linear-gradient(135deg, ${entity.color}12 0%, transparent 100%)` }}>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0" style={{ backgroundColor: entity.color + '25', color: entity.color }}>
              {entity.name.slice(0, 1)}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'name', label: '상호', type: 'text' },
                    { key: 'ceo', label: '대표자', type: 'text' },
                    { key: 'business_no', label: '사업자번호', type: 'text' },
                    { key: 'industry', label: '업종', type: 'text' },
                    { key: 'color', label: '대표색', type: 'color' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs text-white/40 block mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        value={(form as Record<string, string>)[f.key] || ''}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="text-xs text-white/40 block mb-1">주소</label>
                    <input
                      value={form.address || ''}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-white/40 block mb-1">소개</label>
                    <textarea
                      value={form.description || ''}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      rows={2}
                      className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-extrabold text-white mb-1">{entity.name}</h1>
                  <p className="text-white/50 text-sm mb-4">{entity.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                    {entity.ceo && <div><span className="text-white/30">대표</span> <span className="text-white/70">{entity.ceo}</span></div>}
                    {entity.business_no && <div><span className="text-white/30">사업자</span> <span className="text-white/70">{entity.business_no}</span></div>}
                    {entity.industry && <div><span className="text-white/30">업종</span> <span className="text-white/70">{entity.industry}</span></div>}
                    {entity.address && <div className="col-span-2"><span className="text-white/30">주소</span> <span className="text-white/70">{entity.address}</span></div>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 브랜드 목록 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white/40 tracking-widest uppercase">운영 브랜드 ({entity.brands?.length || 0})</h2>
            <Link href={`/collab/brands/new?entity=${entity.id}`} className="text-xs text-blue-400 hover:text-blue-300 font-bold">+ 브랜드 추가</Link>
          </div>
          {(!entity.brands || entity.brands.length === 0) ? (
            <div className="p-8 rounded-2xl border border-dashed border-white/15 text-center">
              <p className="text-white/30 text-sm">등록된 브랜드가 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {entity.brands.map(b => (
                <div key={b.id} className="p-5 rounded-2xl border border-white/8 hover:border-white/20 transition-all"
                  style={{ background: `linear-gradient(135deg, ${b.primary_color}10 0%, transparent 100%)` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: b.primary_color + '20', color: b.primary_color }}>
                      {b.category || '기타'}
                    </span>
                    <span className="text-xs text-white/30">{BRAND_STATUS[b.status] || b.status}</span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-1">{b.name}</h3>
                  {b.domain && <a href={`https://${b.domain}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400/70 hover:text-blue-400 mb-2 block">{b.domain}</a>}
                  {b.description && <p className="text-white/40 text-xs leading-relaxed">{b.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

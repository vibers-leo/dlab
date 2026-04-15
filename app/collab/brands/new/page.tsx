'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

type Entity = { id: number; name: string; color: string };

const CATEGORIES = ['플랫폼', 'AI', '에이전시', '커머스', 'IoT/AI', '엔터테인먼트', '기타'];
const STATUSES = [['active','운영중'], ['development','개발중'], ['paused','보류'], ['archived','종료']];

function NewBrandForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [form, setForm] = useState({
    entity_id: sp.get('entity') || '',
    slug: '', name: '', domain: '', description: '',
    primary_color: '#3B82F6', secondary_color: '#1E40AF',
    tagline: '', category: '', status: 'active',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/collab/entities').then(r => r.json()).then(setEntities);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const entityId = form.entity_id ? parseInt(form.entity_id) : null;
    const res = await fetch('/api/collab/brands', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, entity_id: entityId }),
    });
    const saved = await res.json();
    router.push(form.entity_id ? `/collab/entities/${form.entity_id}` : `/collab`);
    void saved;
  };

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: 'rgba(5,18,38,0.85)' }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-2 text-sm">
          <Link href="/collab" className="text-white/40 hover:text-white/60">Collab Hub</Link>
          <span className="text-white/20">/</span>
          <span className="text-white font-bold">새 브랜드 등록</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-white/40 block mb-1.5">소속 엔티티 *</label>
            <select value={form.entity_id} onChange={e => setForm({...form, entity_id: e.target.value})} required
              className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="">선택</option>
              {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['name','브랜드명 *','팬이지'], ['slug','슬러그 *','faneasy'], ['domain','도메인','faneasy.kr'], ['tagline','슬로건','인플루언서를 위한...']].map(([k,l,p]) => (
              <div key={k}>
                <label className="text-xs text-white/40 block mb-1.5">{l}</label>
                <input value={(form as Record<string,string>)[k]} onChange={e => setForm({...form, [k]: e.target.value})} placeholder={p}
                  required={k==='name'||k==='slug'}
                  className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/20"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1.5">설명</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2}
              placeholder="이 브랜드를 한 줄로 설명해주세요"
              className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/20 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 block mb-1.5">카테고리</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="">선택</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1.5">상태</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                {STATUSES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            {[['primary_color','주 색상'], ['secondary_color','보조 색상']].map(([k,l]) => (
              <div key={k} className="flex-1">
                <label className="text-xs text-white/40 block mb-1.5">{l}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={(form as Record<string,string>)[k]} onChange={e => setForm({...form, [k]: e.target.value})}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                  <span className="text-xs text-white/40 font-mono">{(form as Record<string,string>)[k]}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 flex gap-3">
            <button type="button" onClick={() => router.back()} className="flex-1 py-3 text-sm font-bold text-white/50 border border-white/12 rounded-xl hover:border-white/25 transition-colors">취소</button>
            <button type="submit" disabled={saving || !form.name || !form.slug || !form.entity_id}
              className="flex-1 py-3 text-sm font-bold bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors disabled:opacity-40"
            >{saving ? '저장 중...' : '브랜드 등록'}</button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function NewBrandPage() {
  return <Suspense><NewBrandForm /></Suspense>;
}

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function NewEntityForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [form, setForm] = useState({
    slug: '', name: '', ceo: '', business_no: '', address: '',
    industry: '', color: '#3B82F6', description: '',
    type: sp.get('type') || 'internal',
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/collab/entities', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push('/collab');
  };

  const F = ({ label, k, type = 'text', placeholder = '' }: { label: string; k: string; type?: string; placeholder?: string }) => (
    <div>
      <label className="text-xs text-white/40 block mb-1.5">{label}</label>
      <input
        type={type}
        value={(form as Record<string, string>)[k] || ''}
        onChange={e => setForm({ ...form, [k]: e.target.value })}
        placeholder={placeholder}
        className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors placeholder:text-white/20"
      />
    </div>
  );

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: 'rgba(5,18,38,0.85)' }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/collab" className="text-white/40 hover:text-white/60">Collab Hub</Link>
            <span className="text-white/20">/</span>
            <span className="text-white font-bold">새 엔티티 추가</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-white/40 block mb-1.5">유형</label>
            <div className="flex gap-2">
              {[['internal','내부 엔티티'], ['partner','협력사'], ['client','클라이언트']].map(([val, lbl]) => (
                <button key={val} type="button"
                  onClick={() => setForm({ ...form, type: val })}
                  className="px-4 py-2 text-xs font-bold rounded-lg border transition-all"
                  style={form.type === val
                    ? { backgroundColor: '#3B82F620', borderColor: '#3B82F6', color: '#3B82F6' }
                    : { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }
                  }
                >{lbl}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <F label="상호 *" k="name" placeholder="주식회사 디랩" />
            <F label="슬러그 *" k="slug" placeholder="dlab" />
            <F label="대표자" k="ceo" placeholder="이준호" />
            <F label="사업자등록번호" k="business_no" placeholder="000-00-00000" />
          </div>
          <F label="업종" k="industry" placeholder="정보통신업 / 소프트웨어 개발" />
          <F label="주소" k="address" placeholder="서울시 강남구..." />
          <div>
            <label className="text-xs text-white/40 block mb-1.5">소개</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="이 엔티티를 한 줄로 설명해주세요"
              className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors placeholder:text-white/20 resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1.5">대표 색상</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
                className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-sm text-white/50 font-mono">{form.color}</span>
            </div>
          </div>
          <div className="pt-2 flex gap-3">
            <Link href="/collab" className="flex-1 py-3 text-sm font-bold text-white/50 border border-white/12 rounded-xl text-center hover:border-white/25 transition-colors">
              취소
            </Link>
            <button type="submit" disabled={saving || !form.name || !form.slug}
              className="flex-1 py-3 text-sm font-bold bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors disabled:opacity-40"
            >
              {saving ? '저장 중...' : '엔티티 추가'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function NewEntityPage() {
  return <Suspense><NewEntityForm /></Suspense>;
}

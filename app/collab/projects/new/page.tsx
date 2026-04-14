'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Entity = { id: number; name: string; color: string; type: string };

export default function NewProjectPage() {
  const router = useRouter();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', status: 'proposal',
    deadline: '', budget: '', tags: '',
    created_by: '', member_ids: [] as { entity_id: number; role: string }[],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/collab/entities').then(r => r.json()).then(setEntities);
  }, []);

  const toggleMember = (entity_id: number) => {
    setForm(f => {
      const exists = f.member_ids.find(m => m.entity_id === entity_id);
      return {
        ...f,
        member_ids: exists
          ? f.member_ids.filter(m => m.entity_id !== entity_id)
          : [...f.member_ids, { entity_id, role: '' }],
      };
    });
  };

  const setRole = (entity_id: number, role: string) => {
    setForm(f => ({
      ...f,
      member_ids: f.member_ids.map(m => m.entity_id === entity_id ? { ...m, role } : m),
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/collab/projects', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        budget: form.budget ? parseInt(form.budget) : null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        created_by: form.created_by ? parseInt(form.created_by) : null,
      }),
    });
    router.push('/collab/projects');
  };

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: 'rgba(5,18,38,0.85)' }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-2 text-sm">
          <Link href="/collab" className="text-white/40 hover:text-white/60">Collab Hub</Link>
          <span className="text-white/20">/</span>
          <Link href="/collab/projects" className="text-white/40 hover:text-white/60">프로젝트</Link>
          <span className="text-white/20">/</span>
          <span className="text-white font-bold">새 프로젝트</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <form onSubmit={submit} className="space-y-5">
          {/* 기본 정보 */}
          <div>
            <label className="text-xs text-white/40 block mb-1.5">프로젝트명 *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="2026 부산 봄꽃 페스티벌 행사 운영"
              className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 block mb-1.5">설명</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="프로젝트 개요를 입력하세요"
              className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors placeholder:text-white/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 block mb-1.5">상태</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors"
              >
                <option value="proposal">제안중</option>
                <option value="active">진행중</option>
                <option value="completed">완료</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1.5">마감일</label>
              <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1.5">예산 (원)</label>
              <input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}
                placeholder="10000000"
                className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1.5">주관 엔티티</label>
              <select value={form.created_by} onChange={e => setForm({ ...form, created_by: e.target.value })}
                className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">선택</option>
                {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-white/40 block mb-1.5">태그 (쉼표로 구분)</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="행사, 공공, 부산, 2026"
              className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors placeholder:text-white/20"
            />
          </div>

          {/* 참여 엔티티 */}
          <div>
            <label className="text-xs text-white/40 block mb-3">참여 엔티티 & 역할</label>
            <div className="space-y-2">
              {entities.map(e => {
                const selected = form.member_ids.find(m => m.entity_id === e.id);
                return (
                  <div key={e.id} className="flex items-center gap-3">
                    <button type="button" onClick={() => toggleMember(e.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all flex-shrink-0"
                      style={selected
                        ? { backgroundColor: e.color + '20', borderColor: e.color + '60', color: e.color }
                        : { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }
                      }
                    >
                      <span className="text-xs font-bold">{e.name}</span>
                    </button>
                    {selected && (
                      <input
                        value={selected.role}
                        onChange={e2 => setRole(e.id, e2.target.value)}
                        placeholder="역할 (예: 운영, 기획, 개발)"
                        className="flex-1 bg-white/8 border border-white/12 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 placeholder:text-white/20"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Link href="/collab/projects" className="flex-1 py-3 text-sm font-bold text-white/50 border border-white/12 rounded-xl text-center hover:border-white/25 transition-colors">
              취소
            </Link>
            <button type="submit" disabled={saving || !form.title}
              className="flex-1 py-3 text-sm font-bold bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors disabled:opacity-40"
            >
              {saving ? '저장 중...' : '프로젝트 생성'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

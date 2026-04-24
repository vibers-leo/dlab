'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalAuth } from '@/components/portal-auth-context';

interface Portfolio {
  id: number;
  title: string;
  category: string;
  client_name: string | null;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  tags: string[];
  is_featured: boolean;
  sort_order: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  web: '웹개발',
  design: '디자인',
  marketing: '마케팅',
  ai: 'AI',
  consulting: '컨설팅',
};

const CATEGORIES = Object.entries(CATEGORY_LABELS);

const emptyForm = {
  title: '',
  category: 'web',
  client_name: '',
  description: '',
  image_url: '',
  link_url: '',
  tags: '',
  is_featured: false,
  sort_order: 0,
};

export default function AdminPortfolioPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = usePortalAuth();
  const [items, setItems] = useState<Portfolio[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/portal');
  }, [loading, user, router]);

  const fetchItems = () => {
    setFetching(true);
    fetch('/api/portal/admin/portfolio')
      .then(r => r.json())
      .then(d => setItems(d.items ?? d ?? []))
      .catch(() => setItems([]))
      .finally(() => setFetching(false));
  };

  useEffect(() => { if (isAdmin) fetchItems(); }, [isAdmin]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p: Portfolio) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      category: p.category,
      client_name: p.client_name ?? '',
      description: p.description ?? '',
      image_url: p.image_url ?? '',
      link_url: p.link_url ?? '',
      tags: (p.tags ?? []).join(', '),
      is_featured: p.is_featured,
      sort_order: p.sort_order,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        sort_order: Number(form.sort_order),
        client_name: form.client_name || null,
        description: form.description || null,
        image_url: form.image_url || null,
        link_url: form.link_url || null,
      };
      const url = editingId
        ? `/api/portal/admin/portfolio/${editingId}`
        : '/api/portal/admin/portfolio';
      const r = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error();
      setShowModal(false);
      fetchItems();
    } catch { alert(editingId ? '수정 실패' : '추가 실패'); }
    finally { setSubmitting(false); }
  };

  const toggleFeatured = async (p: Portfolio) => {
    await fetch(`/api/portal/admin/portfolio/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_featured: !p.is_featured }),
    });
    fetchItems();
  };

  const handleDelete = async (p: Portfolio) => {
    if (!confirm(`"${p.title}" 포트폴리오를 삭제하시겠습니까?`)) return;
    await fetch(`/api/portal/admin/portfolio/${p.id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading || !isAdmin) return null;

  const inputStyle = { backgroundColor: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.12)', color: 'rgba(255,255,255,0.85)' };

  return (
    <div className="p-6 space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6"
        style={{ borderBottom: '1px solid rgba(96,165,250,0.1)', backgroundColor: 'rgba(4,14,30,0.5)' }}>
        <h1 className="text-lg font-bold text-white/90">포트폴리오 관리</h1>
        <button onClick={openAdd} className="text-xs font-medium px-4 py-2 rounded-xl transition-all"
          style={{ backgroundColor: 'rgba(96,165,250,0.12)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.2)' }}>
          추가
        </button>
      </div>

      {/* Table */}
      {fetching ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(96,165,250,0.08)' }}>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr style={{ backgroundColor: 'rgba(96,165,250,0.04)' }}>
                {['제목', '카테고리', '클라이언트', '추천', '정렬순서', '액션'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid rgba(96,165,250,0.06)' }}
                  className="transition-colors"
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.03)')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td className="px-4 py-3">
                    <div className="text-white/80 font-medium">{p.title}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(96,165,250,0.1)', color: '#60A5FA' }}>
                      {CATEGORY_LABELS[p.category] ?? p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/50">{p.client_name ?? '-'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(p)}
                      className="w-9 h-5 rounded-full relative transition-all"
                      style={{ backgroundColor: p.is_featured ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)' }}>
                      <div className="w-3.5 h-3.5 rounded-full absolute top-0.5 transition-all"
                        style={{ left: p.is_featured ? 18 : 3, backgroundColor: p.is_featured ? '#22C55E' : 'rgba(255,255,255,0.3)' }} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-white/40 font-mono text-xs">{p.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-[11px] px-2.5 py-1 rounded-lg transition-all"
                        style={{ color: '#60A5FA', border: '1px solid rgba(96,165,250,0.15)' }}>
                        편집
                      </button>
                      <button onClick={() => handleDelete(p)} className="text-[11px] px-2.5 py-1 rounded-lg transition-all"
                        style={{ color: 'rgba(248,113,113,0.8)', border: '1px solid rgba(248,113,113,0.15)' }}>
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-white/20 text-sm">등록된 포트폴리오가 없습니다</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleSubmit}
            className="w-full max-w-lg mx-4 rounded-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: '#0a1628', border: '1px solid rgba(96,165,250,0.15)' }}>
            <h3 className="text-sm font-bold text-white/90">{editingId ? '포트폴리오 수정' : '포트폴리오 추가'}</h3>

            <div className="space-y-1">
              <label className="text-xs text-white/40">제목 *</label>
              <input type="text" required value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/40">카테고리</label>
              <select value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle}>
                {CATEGORIES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/40">클라이언트</label>
              <input type="text" value={form.client_name}
                onChange={e => setForm(prev => ({ ...prev, client_name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/40">설명</label>
              <textarea value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none" rows={3} style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/40">이미지 URL</label>
              <input type="text" value={form.image_url}
                onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/40">링크 URL</label>
              <input type="text" value={form.link_url}
                onChange={e => setForm(prev => ({ ...prev, link_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/40">태그 (쉼표 구분)</label>
              <input type="text" value={form.tags} placeholder="React, Next.js, TypeScript"
                onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>

            <div className="flex gap-4">
              <div className="space-y-1 flex-1">
                <label className="text-xs text-white/40">정렬순서</label>
                <input type="number" value={form.sort_order}
                  onChange={e => setForm(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
              <div className="space-y-1 flex-1">
                <label className="text-xs text-white/40">추천</label>
                <label className="flex items-center gap-2 pt-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured}
                    onChange={e => setForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="accent-blue-400" />
                  <span className="text-xs text-white/50">추천 포트폴리오</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-xl text-sm text-white/30"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                취소
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
                style={{ backgroundColor: 'rgba(96,165,250,0.15)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)' }}>
                {submitting ? '...' : editingId ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

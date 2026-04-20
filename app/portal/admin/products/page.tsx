'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalAuth } from '@/components/portal-auth-context';

interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  duration_days: number | null;
  is_active: boolean;
  sort_order: number;
}

const CATEGORIES = ['웹개발', '디자인', '마케팅', 'AI', '컨설팅', '기타'];

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = usePortalAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ slug: '', name: '', category: '', description: '', price: '', duration_days: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/portal');
  }, [loading, user, router]);

  const fetchProducts = () => {
    setFetching(true);
    fetch('/api/portal/products')
      .then(r => r.json())
      .then(d => setProducts(d.items ?? d ?? []))
      .catch(() => setProducts([]))
      .finally(() => setFetching(false));
  };

  useEffect(() => { if (isAdmin) fetchProducts(); }, [isAdmin]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = { ...addForm, price: Number(addForm.price), duration_days: addForm.duration_days ? Number(addForm.duration_days) : null };
      const r = await fetch('/api/portal/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error();
      setShowAddModal(false);
      setAddForm({ slug: '', name: '', category: '', description: '', price: '', duration_days: '' });
      fetchProducts();
    } catch { alert('상품 추가 실패'); }
    finally { setSubmitting(false); }
  };

  const toggleActive = async (p: Product) => {
    await fetch(`/api/portal/admin/products/${p.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !p.is_active }),
    });
    fetchProducts();
  };

  if (loading || !isAdmin) return null;

  const inputStyle = { backgroundColor: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.12)', color: 'rgba(255,255,255,0.85)' };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white/90">상품 관리</h1>
        <button onClick={() => setShowAddModal(true)} className="text-xs font-medium px-4 py-2 rounded-xl transition-all"
          style={{ backgroundColor: 'rgba(96,165,250,0.12)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.2)' }}>
          상품 추가
        </button>
      </div>

      {fetching ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(96,165,250,0.08)' }}>
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr style={{ backgroundColor: 'rgba(96,165,250,0.04)' }}>
                {['이름', '카테고리', '가격', '기간(일)', '활성', '정렬순서'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid rgba(96,165,250,0.06)' }}
                  className="transition-colors"
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.03)')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td className="px-4 py-3">
                    <div className="text-white/80 font-medium">{p.name}</div>
                    <div className="text-white/30 text-xs">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(96,165,250,0.1)', color: '#60A5FA' }}>{p.category}</span>
                  </td>
                  <td className="px-4 py-3 text-white/70 font-mono">{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-white/50">{p.duration_days ?? '-'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(p)}
                      className="w-9 h-5 rounded-full relative transition-all"
                      style={{ backgroundColor: p.is_active ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)' }}>
                      <div className="w-3.5 h-3.5 rounded-full absolute top-0.5 transition-all"
                        style={{ left: p.is_active ? 18 : 3, backgroundColor: p.is_active ? '#22C55E' : 'rgba(255,255,255,0.3)' }} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-white/40 font-mono text-xs">{p.sort_order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleAdd}
            className="w-full max-w-md mx-4 rounded-2xl p-6 space-y-4" style={{ backgroundColor: '#0a1a2f', border: '1px solid rgba(96,165,250,0.15)' }}>
            <h3 className="text-sm font-bold text-white/90">상품 추가</h3>
            {[
              { k: 'slug', label: 'Slug', required: true },
              { k: 'name', label: '상품명', required: true },
              { k: 'price', label: '가격', required: true, type: 'number' },
              { k: 'duration_days', label: '기간(일)', type: 'number' },
            ].map(f => (
              <div key={f.k} className="space-y-1">
                <label className="text-xs text-white/40">{f.label}</label>
                <input type={f.type ?? 'text'} required={f.required}
                  value={(addForm as Record<string, string>)[f.k]} onChange={e => setAddForm(prev => ({ ...prev, [f.k]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-xs text-white/40">카테고리</label>
              <select value={addForm.category} onChange={e => setAddForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle}>
                <option value="">선택</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40">설명</label>
              <textarea value={addForm.description} onChange={e => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none" rows={3} style={inputStyle} />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl text-sm text-white/30" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>취소</button>
              <button type="submit" disabled={submitting} className="flex-1 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
                style={{ backgroundColor: 'rgba(96,165,250,0.15)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)' }}>
                {submitting ? '...' : '추가'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

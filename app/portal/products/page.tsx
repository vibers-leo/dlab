'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalAuth } from '@/components/portal-auth-context';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  duration_days: number;
}

const CATEGORY: Record<string, string> = {
  web: '웹개발',
  design: '디자인',
  marketing: '마케팅',
  consulting: '컨설팅',
  ai: 'AI',
};

const TABS = ['전체', '웹개발', '디자인', '마케팅', 'AI', '컨설팅'] as const;

export default function ProductsPage() {
  const { user, loading } = usePortalAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('전체');
  const [modal, setModal] = useState<Product | null>(null);
  const [requirements, setRequirements] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/portal/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/portal/products')
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? d))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user]);

  const filtered =
    activeTab === '전체'
      ? products
      : products.filter((p) => CATEGORY[p.category] === activeTab);

  const handleOrder = async () => {
    if (!modal || !user || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/portal/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: modal.id, requirements }),
      });
      if (res.ok) {
        router.push('/portal/orders');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">서비스 카탈로그</h1>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="rounded-lg px-4 py-1.5 text-sm font-medium transition-colors"
            style={
              activeTab === tab
                ? { background: 'rgba(96,165,250,0.2)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)' }
                : { background: 'transparent', color: '#9CA3AF', border: '1px solid rgba(96,165,250,0.1)' }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {fetching ? (
        <p className="text-gray-400 text-center py-12">불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-12">등록된 상품이 없습니다.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex flex-col justify-between rounded-xl p-5 space-y-3"
              style={{ background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.1)' }}
            >
              <div className="space-y-2">
                <span
                  className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold"
                  style={{ background: 'rgba(96,165,250,0.15)', color: '#60A5FA' }}
                >
                  {CATEGORY[p.category] ?? p.category}
                </span>
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.description}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <p className="text-blue-400 font-semibold">{p.price.toLocaleString()} 만원</p>
                  <p className="text-xs text-gray-500">예상 {p.duration_days}일</p>
                </div>
                <button
                  onClick={() => { setModal(p); setRequirements(''); }}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
                  style={{ background: '#3B82F6' }}
                >
                  주문하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModal(null)}>
          <div
            className="w-full max-w-md mx-4 rounded-2xl p-6 space-y-4"
            style={{ background: '#0A1A35', border: '1px solid rgba(96,165,250,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white">{modal.name}</h2>
            <p className="text-sm text-gray-400">{modal.description}</p>
            <p className="text-blue-400 font-semibold">{modal.price.toLocaleString()} 만원</p>

            <div>
              <label className="block text-sm text-gray-300 mb-1">상세 요청사항</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={4}
                className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
                style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}
                placeholder="요청사항을 입력해 주세요..."
              />
            </div>

            {user.credits < modal.price && (
              <p className="text-sm text-red-400">잔액이 부족합니다. (보유: {user.credits.toLocaleString()}만원)</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModal(null)}
                className="flex-1 rounded-lg py-2.5 text-sm font-medium text-gray-300"
                style={{ border: '1px solid rgba(96,165,250,0.15)' }}
              >
                취소
              </button>
              <button
                onClick={handleOrder}
                disabled={user.credits < modal.price || submitting}
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                style={{ background: '#3B82F6' }}
              >
                {submitting ? '처리중...' : `${modal.price.toLocaleString()}만원 차감 후 주문`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

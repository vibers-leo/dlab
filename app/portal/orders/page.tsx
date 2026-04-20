'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePortalAuth } from '@/components/portal-auth-context';

interface Order {
  id: number;
  product_name: string;
  status: string;
  price: number;
  created_at: string;
}

const STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: '대기중', color: '#F59E0B' },
  accepted: { label: '수락됨', color: '#3B82F6' },
  in_progress: { label: '진행중', color: '#8B5CF6' },
  review: { label: '검토중', color: '#EC4899' },
  completed: { label: '완료', color: '#10B981' },
  cancelled: { label: '취소', color: '#6B7280' },
};

const FILTER_TABS = ['전체', '진행중', '완료'] as const;

export default function OrdersPage() {
  const { user, loading } = usePortalAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('전체');

  useEffect(() => {
    if (!loading && !user) router.replace('/portal/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/portal/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? d))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user]);

  const filtered = orders.filter((o) => {
    if (activeTab === '전체') return true;
    if (activeTab === '진행중') return ['pending', 'accepted', 'in_progress', 'review'].includes(o.status);
    if (activeTab === '완료') return o.status === 'completed';
    return true;
  });

  if (loading || !user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">주문 내역</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {FILTER_TABS.map((tab) => (
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

      {/* List */}
      {fetching ? (
        <p className="text-gray-400 text-center py-12">불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-12">주문 내역이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const s = STATUS[o.status] ?? STATUS.pending;
            return (
              <Link
                key={o.id}
                href={`/portal/orders/${o.id}`}
                className="flex flex-col gap-2 rounded-xl px-5 py-4 transition-colors hover:brightness-110 sm:flex-row sm:items-center sm:justify-between"
                style={{ background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.1)' }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-md px-2 py-0.5 text-xs font-semibold"
                    style={{ background: `${s.color}22`, color: s.color }}
                  >
                    {s.label}
                  </span>
                  <span className="text-sm font-medium text-white">{o.product_name}</span>
                </div>
                <div className="flex items-center gap-5 text-sm">
                  <span className="text-blue-400 font-semibold">{o.price.toLocaleString()} 크레딧</span>
                  <span className="text-gray-500">{new Date(o.created_at).toLocaleDateString('ko-KR')}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

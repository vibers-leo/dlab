'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalAuth } from '@/components/portal-auth-context';

interface Order {
  id: number;
  client_name: string;
  product_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

const STATUSES = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const;
const STATUS_LABELS: Record<string, string> = {
  all: '전체', pending: '대기', confirmed: '확인', in_progress: '진행중', completed: '완료', cancelled: '취소',
};
const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B', confirmed: '#3B82F6', in_progress: '#8B5CF6', completed: '#22C55E', cancelled: '#EF4444',
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = usePortalAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/portal');
  }, [loading, user, router]);

  const fetchOrders = () => {
    setFetching(true);
    fetch('/api/portal/admin/orders')
      .then(r => r.json())
      .then(d => setOrders(d.items ?? d ?? []))
      .catch(() => setOrders([]))
      .finally(() => setFetching(false));
  };

  useEffect(() => { if (isAdmin) fetchOrders(); }, [isAdmin]);

  const changeStatus = async (id: number, status: string) => {
    await fetch(`/api/portal/admin/orders/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  if (loading || !isAdmin) return null;

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-lg font-bold text-white/90">주문 관리</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={filter === s
              ? { backgroundColor: 'rgba(96,165,250,0.15)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)' }
              : { color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(96,165,250,0.08)' }
            }>
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {fetching ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(96,165,250,0.08)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'rgba(96,165,250,0.04)' }}>
                {['ID', '클라이언트', '상품', '금액', '상태', '생성일', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ borderTop: '1px solid rgba(96,165,250,0.06)' }}
                  className="transition-colors"
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.03)')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td className="px-4 py-3 text-white/40 font-mono text-xs">#{o.id}</td>
                  <td className="px-4 py-3 text-white/80">{o.client_name}</td>
                  <td className="px-4 py-3 text-white/60">{o.product_name}</td>
                  <td className="px-4 py-3 text-white/70 font-mono">{o.total_price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={e => changeStatus(o.id, e.target.value)}
                      className="text-[10px] px-2 py-1 rounded-lg outline-none cursor-pointer"
                      style={{ backgroundColor: `${STATUS_COLORS[o.status] ?? '#60A5FA'}15`, color: STATUS_COLORS[o.status] ?? '#60A5FA', border: `1px solid ${STATUS_COLORS[o.status] ?? '#60A5FA'}30` }}>
                      {STATUSES.filter(s => s !== 'all').map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-white/30 text-xs">{new Date(o.created_at).toLocaleDateString('ko')}</td>
                  <td className="px-4 py-3" />
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-white/20 text-sm">주문이 없습니다</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

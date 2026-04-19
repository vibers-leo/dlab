'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalAuth } from '@/components/portal-auth-context';

interface Transaction {
  id: number;
  type: 'earn' | 'spend' | 'refund';
  description: string;
  amount: number;
  balance_after: number;
  created_at: string;
}

const TYPE_MAP: Record<string, { label: string; color: string }> = {
  earn: { label: '적립', color: '#10B981' },
  spend: { label: '사용', color: '#EF4444' },
  refund: { label: '환불', color: '#3B82F6' },
};

export default function CreditsPage() {
  const { user, loading } = usePortalAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace('/portal/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/portal/credits')
      .then((r) => r.json())
      .then((d) => setTransactions(d.transactions ?? d))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">크레딧 내역</h1>
        <span
          className="rounded-full px-4 py-1.5 text-sm font-semibold"
          style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60A5FA' }}
        >
          잔액 {user.credits.toLocaleString()} 크레딧
        </span>
      </div>

      {/* List */}
      <div
        className="overflow-hidden rounded-xl"
        style={{ background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.1)' }}
      >
        {fetching ? (
          <p className="p-8 text-center text-gray-400">불러오는 중...</p>
        ) : transactions.length === 0 ? (
          <p className="p-8 text-center text-gray-400">거래 내역이 없습니다.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => {
              const t = TYPE_MAP[tx.type] ?? TYPE_MAP.earn;
              const sign = tx.type === 'spend' ? '-' : '+';
              return (
                <div key={tx.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-md px-2 py-0.5 text-xs font-semibold"
                      style={{ background: `${t.color}22`, color: t.color }}
                    >
                      {t.label}
                    </span>
                    <span className="text-sm text-gray-200">{tx.description}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span style={{ color: t.color }} className="font-semibold">
                      {sign}{Math.abs(tx.amount).toLocaleString()}
                    </span>
                    <span className="text-gray-400 w-24 text-right">{tx.balance_after.toLocaleString()}</span>
                    <span className="text-gray-500 w-28 text-right">
                      {new Date(tx.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePortalAuth } from '@/components/portal-auth-context';

const STATUS_COLOR: Record<string, string> = {
  pending: '#F59E0B',
  accepted: '#3B82F6',
  in_progress: '#8B5CF6',
  review: '#EC4899',
  completed: '#10B981',
  cancelled: '#6B7280',
};

const STATUS_LABEL: Record<string, string> = {
  pending: '대기중',
  accepted: '수락됨',
  in_progress: '진행중',
  review: '검토중',
  completed: '완료',
  cancelled: '취소',
};

interface DashboardData {
  credits: number;
  activeOrders: number;
  totalOrders: number;
  recentOrders: { id: number; status: string; product_name: string; created_at: string }[];
  recentCredits: { id: number; type: string; amount: number; balance: number; created_at: string }[];
}

export default function PortalDashboardPage() {
  const { user, loading } = usePortalAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/portal/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/portal/dashboard')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || !user) return null;

  const stats = [
    { label: '보유 잔액 (만원)', value: data?.credits ?? 0, color: '#60A5FA', bg: 'rgba(96,165,250,0.08)' },
    { label: '진행중 주문', value: data?.activeOrders ?? 0, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    { label: '총 주문', value: data?.totalOrders ?? 0, color: '#818CF8', bg: 'rgba(129,140,248,0.08)' },
  ];

  const quickActions = [
    { label: '상품 둘러보기', href: '/portal/products', icon: '◉' },
    { label: '주문 내역', href: '/portal/orders', icon: '◎' },
    { label: '충전 문의', href: '/portal/inquiry', icon: '✦' },
  ];

  return (
    <div className="relative min-h-full">
      {/* 도트 그리드 배경 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      {/* 장식 원 */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-10 w-56 h-56 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 인사 */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white/90">
            안녕하세요, {user.name}님
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>클라이언트 포털</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: user.role === 'admin' ? 'rgba(129,140,248,0.15)' : 'rgba(96,165,250,0.12)',
                color: user.role === 'admin' ? '#a5b4fc' : '#60A5FA',
                border: `1px solid ${user.role === 'admin' ? 'rgba(129,140,248,0.25)' : 'rgba(96,165,250,0.2)'}`,
              }}>
              {user.role === 'admin' ? '관리자' : '클라이언트'}
            </span>
          </div>
        </div>

        {/* 통계 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl p-5"
              style={{ backgroundColor: s.bg, border: '1px solid rgba(96,165,250,0.08)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: s.color }}>
                {fetching ? '—' : s.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 최근 주문 */}
          <div className="rounded-xl p-5" style={{ backgroundColor: 'rgba(10,25,50,0.5)', border: '1px solid rgba(96,165,250,0.08)' }}>
            <h2 className="text-sm font-bold text-white/70 mb-4">최근 주문</h2>
            {fetching ? (
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>불러오는 중...</p>
            ) : !data?.recentOrders?.length ? (
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>주문 내역이 없습니다</p>
            ) : (
              <div className="space-y-3">
                {data.recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: STATUS_COLOR[order.status] ?? '#6B7280' }} />
                      <span className="text-sm text-white/60 truncate">{order.product_name}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${STATUS_COLOR[order.status] ?? '#6B7280'}15`,
                          color: STATUS_COLOR[order.status] ?? '#6B7280',
                        }}>
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {new Date(order.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 최근 거래 내역 */}
          <div className="rounded-xl p-5" style={{ backgroundColor: 'rgba(10,25,50,0.5)', border: '1px solid rgba(96,165,250,0.08)' }}>
            <h2 className="text-sm font-bold text-white/70 mb-4">최근 거래 내역</h2>
            {fetching ? (
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>불러오는 중...</p>
            ) : !data?.recentCredits?.length ? (
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>거래 내역이 없습니다</p>
            ) : (
              <div className="space-y-3">
                {data.recentCredits.map(credit => (
                  <div key={credit.id} className="flex items-center justify-between">
                    <span className="text-sm text-white/60">{credit.type}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium"
                        style={{ color: credit.amount >= 0 ? '#10B981' : '#F87171' }}>
                        {credit.amount >= 0 ? '+' : ''}{credit.amount.toLocaleString()}
                      </span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        잔액 {credit.balance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 빠른 액션 */}
        <div>
          <h2 className="text-sm font-bold text-white/70 mb-3">빠른 메뉴</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActions.map(a => (
              <Link key={a.href} href={a.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all"
                style={{ backgroundColor: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.08)' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.2)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.08)'; }}
              >
                <span className="text-base" style={{ color: '#60A5FA' }}>{a.icon}</span>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

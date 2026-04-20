'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePortalAuth } from '@/components/portal-auth-context';

interface Comment {
  id: number;
  author_name: string;
  role: 'admin' | 'client';
  content: string;
  created_at: string;
}

interface OrderDetail {
  id: number;
  product_name: string;
  status: string;
  price: number;
  requirements: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  comments: Comment[];
}

const STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: '대기중', color: '#F59E0B' },
  accepted: { label: '수락됨', color: '#3B82F6' },
  in_progress: { label: '진행중', color: '#8B5CF6' },
  review: { label: '검토중', color: '#EC4899' },
  completed: { label: '완료', color: '#10B981' },
  cancelled: { label: '취소', color: '#6B7280' },
};

const STEPS = ['pending', 'accepted', 'in_progress', 'review', 'completed'] as const;
const STEP_LABELS = ['대기중', '수락됨', '진행중', '검토중', '완료'];

function fmtDate(d: string | null) {
  return d ? new Date(d).toLocaleDateString('ko-KR') : '-';
}

export default function OrderDetailPage() {
  const { user, loading } = usePortalAuth();
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [fetching, setFetching] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/portal/login');
  }, [user, loading, router]);

  const fetchOrder = () => {
    if (!user || !id) return;
    fetch(`/api/portal/orders/${id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d))
      .catch(() => {})
      .finally(() => setFetching(false));
  };

  useEffect(fetchOrder, [user, id]);

  const handleComment = async () => {
    if (!comment.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/portal/orders/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment }),
      });
      if (res.ok) {
        setComment('');
        fetchOrder();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user || fetching) return null;
  if (!order) return <p className="text-gray-400 text-center py-12">주문을 찾을 수 없습니다.</p>;

  const s = STATUS[order.status] ?? STATUS.pending;
  const currentIdx = STEPS.indexOf(order.status as (typeof STEPS)[number]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/portal/orders')} className="text-gray-400 hover:text-white text-sm">
          ← 목록
        </button>
        <h1 className="text-2xl font-bold text-white">{order.product_name}</h1>
        <span
          className="rounded-md px-2 py-0.5 text-xs font-semibold"
          style={{ background: `${s.color}22`, color: s.color }}
        >
          {s.label}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="rounded-xl p-5"
        style={{ background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.1)' }}
      >
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => {
            const active = i <= currentIdx;
            return (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background: active ? STATUS[step].color : 'rgba(96,165,250,0.08)',
                      color: active ? '#fff' : '#6B7280',
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="hidden text-xs sm:block" style={{ color: active ? STATUS[step].color : '#6B7280' }}>
                    {STEP_LABELS[i]}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="mx-1 h-0.5 flex-1"
                    style={{ background: i < currentIdx ? STATUS[STEPS[i + 1]].color : 'rgba(96,165,250,0.1)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info card */}
      <div
        className="rounded-xl p-5 space-y-3"
        style={{ background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.1)' }}
      >
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-gray-500">금액</p>
            <p className="text-blue-400 font-semibold">{order.price.toLocaleString()} 크레딧</p>
          </div>
          <div>
            <p className="text-gray-500">주문일</p>
            <p className="text-gray-200">{fmtDate(order.created_at)}</p>
          </div>
          <div>
            <p className="text-gray-500">시작일</p>
            <p className="text-gray-200">{fmtDate(order.started_at)}</p>
          </div>
          <div>
            <p className="text-gray-500">완료일</p>
            <p className="text-gray-200">{fmtDate(order.completed_at)}</p>
          </div>
        </div>
        {order.requirements && (
          <div>
            <p className="text-gray-500 text-sm mb-1">요청사항</p>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{order.requirements}</p>
          </div>
        )}
      </div>

      {/* Comments */}
      <div
        className="rounded-xl p-5 space-y-4"
        style={{ background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.1)' }}
      >
        <h2 className="text-lg font-bold text-white">코멘트</h2>

        {order.comments.length === 0 ? (
          <p className="text-gray-500 text-sm">아직 코멘트가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {order.comments.map((c) => (
              <div
                key={c.id}
                className="rounded-lg p-3"
                style={{ background: 'rgba(96,165,250,0.06)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{c.author_name}</span>
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                    style={{
                      background: c.role === 'admin' ? 'rgba(139,92,246,0.2)' : 'rgba(96,165,250,0.15)',
                      color: c.role === 'admin' ? '#A78BFA' : '#60A5FA',
                    }}
                  >
                    {c.role === 'admin' ? '관리자' : '클라이언트'}
                  </span>
                  <span className="text-xs text-gray-500">{fmtDate(c.created_at)}</span>
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{c.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* New comment */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none resize-none sm:flex-1"
            style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}
            placeholder="코멘트를 입력하세요..."
          />
          <button
            onClick={handleComment}
            disabled={!comment.trim() || submitting}
            className="self-end rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 sm:self-end"
            style={{ background: '#3B82F6' }}
          >
            {submitting ? '...' : '전송'}
          </button>
        </div>
      </div>
    </div>
  );
}

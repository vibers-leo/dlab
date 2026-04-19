'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalAuth } from '@/components/portal-auth-context';

interface Inquiry {
  id: number;
  company_name: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  category: string | null;
  budget_range: string | null;
  description: string;
  status: string;
  created_at: string;
}

const STATUSES = ['all', 'new', 'reviewing', 'quoted', 'accepted', 'rejected'] as const;
const STATUS_LABELS: Record<string, string> = {
  all: '전체', new: '신규', reviewing: '검토중', quoted: '견적발송', accepted: '수락', rejected: '거절',
};
const STATUS_COLORS: Record<string, string> = {
  new: '#F59E0B', reviewing: '#3B82F6', quoted: '#6366F1', accepted: '#22C55E', rejected: '#6B7280',
};

export default function AdminInquiriesPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = usePortalAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/portal');
  }, [loading, user, router]);

  const fetchInquiries = () => {
    setFetching(true);
    fetch('/api/portal/admin/inquiries')
      .then(r => r.json())
      .then(d => setInquiries(d.items ?? d ?? []))
      .catch(() => setInquiries([]))
      .finally(() => setFetching(false));
  };

  useEffect(() => { if (isAdmin) fetchInquiries(); }, [isAdmin]);

  const changeStatus = async (id: number, status: string) => {
    await fetch(`/api/portal/admin/inquiries/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchInquiries();
  };

  if (loading || !isAdmin) return null;

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-lg font-bold text-white/90">외주 문의</h1>

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
                {['회사명', '담당자', '이메일', '카테고리', '예산', '상태', '날짜'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(inq => (
                <>
                  <tr key={inq.id}
                    className="transition-colors cursor-pointer"
                    style={{ borderTop: '1px solid rgba(96,165,250,0.06)' }}
                    onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.03)')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <td className="px-4 py-3 text-white/60">{inq.company_name || '-'}</td>
                    <td className="px-4 py-3 text-white/80 font-medium">{inq.contact_name}</td>
                    <td className="px-4 py-3 text-white/50">{inq.email}</td>
                    <td className="px-4 py-3">
                      {inq.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(96,165,250,0.1)', color: '#60A5FA' }}>{inq.category}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">{inq.budget_range || '-'}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <select value={inq.status} onChange={e => changeStatus(inq.id, e.target.value)}
                        className="text-[10px] px-2 py-1 rounded-lg outline-none cursor-pointer"
                        style={{ backgroundColor: `${STATUS_COLORS[inq.status] ?? '#60A5FA'}15`, color: STATUS_COLORS[inq.status] ?? '#60A5FA', border: `1px solid ${STATUS_COLORS[inq.status] ?? '#60A5FA'}30` }}>
                        {STATUSES.filter(s => s !== 'all').map(s => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-white/30 text-xs">{new Date(inq.created_at).toLocaleDateString('ko')}</td>
                  </tr>
                  {expandedId === inq.id && (
                    <tr key={`${inq.id}-detail`}>
                      <td colSpan={7} className="px-6 py-4" style={{ backgroundColor: 'rgba(96,165,250,0.02)', borderTop: '1px solid rgba(96,165,250,0.04)' }}>
                        <p className="text-xs text-white/30 mb-1">프로젝트 설명</p>
                        <p className="text-sm text-white/60 whitespace-pre-wrap">{inq.description}</p>
                        {inq.phone && <p className="text-xs text-white/30 mt-3">연락처: <span className="text-white/50">{inq.phone}</span></p>}
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-white/20 text-sm">문의가 없습니다</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

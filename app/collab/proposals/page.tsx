'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Proposal = {
  id: number; title: string; rfp_no: string; status: string;
  project_title: string; entity_ids: number[]; created_at: string;
  rfp_raw: { org?: string; budget?: string; deadline?: string };
};

const STATUS: Record<string, { label: string; color: string }> = {
  draft: { label: '초안', color: '#6B7280' },
  review: { label: '검토중', color: '#F59E0B' },
  final: { label: '완성', color: '#10B981' },
  submitted: { label: '제출완료', color: '#6366F1' },
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collab/proposals').then(r => r.json()).then(data => {
      setProposals(data); setLoading(false);
    });
  }, []);

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      <div className="border-b border-white/8" style={{ backgroundColor: 'rgba(4,14,30,0.6)' }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>AI 제안서</h1>
            <p className="text-xs text-white/30 mt-0.5">Claude AI 기반 제안서 자동 생성</p>
          </div>
          <Link href="/collab/proposals/new" className="px-3 py-1.5 text-xs font-bold bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-colors">
            ✦ 새 제안서 생성
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : proposals.length === 0 ? (
          <div className="p-16 rounded-2xl border border-dashed border-white/15 text-center">
            <p className="text-4xl mb-4">✨</p>
            <p className="text-white font-bold mb-2">첫 AI 제안서를 만들어보세요</p>
            <p className="text-white/30 text-sm mb-6">RFP 정보를 입력하면 Claude AI가 제안서 초안을 자동 생성합니다</p>
            <Link href="/collab/proposals/new" className="inline-block px-6 py-3 text-sm font-bold bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-colors">
              제안서 생성하기 →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {proposals.map(p => {
              const st = STATUS[p.status] || STATUS.draft;
              return (
                <Link key={p.id} href={`/collab/proposals/${p.id}`}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5 transition-all group"
                >
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: st.color + '20', color: st.color }}>{st.label}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm mb-1 group-hover:text-blue-300 transition-colors">{p.title}</p>
                    <div className="flex items-center gap-3 text-xs text-white/30">
                      {p.rfp_raw?.org && <span>{p.rfp_raw.org}</span>}
                      {p.rfp_raw?.budget && <span>{p.rfp_raw.budget}</span>}
                      {p.rfp_raw?.deadline && <span>마감 {p.rfp_raw.deadline}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-white/25 flex-shrink-0">{p.created_at?.slice(0, 10)}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

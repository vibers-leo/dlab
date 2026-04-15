'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Project = {
  id: number; title: string; description: string; status: string;
  deadline: string; budget: number; tags: string[];
  created_by_name: string; created_by_color: string;
  members: { name: string; color: string; role: string }[];
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  proposal: { label: '제안중', color: '#F59E0B' },
  active:   { label: '진행중', color: '#10B981' },
  completed:{ label: '완료',   color: '#6366F1' },
  archived: { label: '보관',   color: '#6B7280' },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collab/projects').then(r => r.json()).then(data => {
      setProjects(data); setLoading(false);
    });
  }, []);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-2 flex items-center justify-between">
        <h1 className="text-sm font-bold text-white/40 tracking-widest uppercase">프로젝트</h1>
        <Link href="/collab/projects/new" className="px-4 py-2 text-xs font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors">
          + 프로젝트 생성
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 필터 */}
        <div className="flex gap-2 mb-6">
          {[['all','전체'], ['proposal','제안중'], ['active','진행중'], ['completed','완료']].map(([val, lbl]) => (
            <button key={val} onClick={() => setFilter(val)}
              className="px-4 py-1.5 text-xs font-bold rounded-full border transition-all"
              style={filter === val
                ? { backgroundColor: '#3B82F620', borderColor: '#3B82F6', color: '#3B82F6' }
                : { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }
              }
            >{lbl} {val === 'all' ? `(${projects.length})` : `(${projects.filter(p=>p.status===val).length})`}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-white/15 text-center">
            <p className="text-white/30 text-sm mb-3">프로젝트가 없습니다</p>
            <Link href="/collab/projects/new" className="text-xs text-blue-400 font-bold hover:text-blue-300">+ 프로젝트 생성</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(p => {
              const st = STATUS_LABEL[p.status] || STATUS_LABEL.proposal;
              return (
                <Link key={p.id} href={`/collab/projects/${p.id}`}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5 transition-all group"
                >
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: st.color + '20', color: st.color }}>
                    {st.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm mb-1 group-hover:text-blue-300 transition-colors">{p.title}</p>
                    {p.description && <p className="text-white/35 text-xs line-clamp-1">{p.description}</p>}
                    {p.tags?.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {p.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/8 text-white/40">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {p.members?.slice(0, 4).map((m, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: m.color + '20', color: m.color }}>{m.name}</span>
                    ))}
                    {(p.members?.length || 0) > 4 && <span className="text-xs text-white/25">+{p.members.length - 4}</span>}
                  </div>
                  {p.deadline && (
                    <span className="text-xs text-white/25 flex-shrink-0">{p.deadline.slice(0, 10)}</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

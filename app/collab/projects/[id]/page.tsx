'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Member = { entity_id: number; name: string; color: string; role: string };
type Project = {
  id: number; title: string; description: string; status: string;
  deadline: string; budget: number; tags: string[];
  created_by_name: string; created_by_color: string; members: Member[];
};

const STATUS_LABEL: Record<string, { label: string; color: string; next: string }> = {
  proposal: { label: '제안중', color: '#F59E0B', next: 'active' },
  active:   { label: '진행중', color: '#10B981', next: 'completed' },
  completed:{ label: '완료',   color: '#6366F1', next: '' },
  archived: { label: '보관',   color: '#6B7280', next: '' },
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [proposals, setProposals] = useState<Array<{ id: number; title: string; status: string }>>([]);

  useEffect(() => {
    fetch('/api/collab/projects').then(r => r.json()).then(data => {
      const found = data.find((p: Project) => String(p.id) === String(id));
      setProject(found || null);
    });
    fetch('/api/collab/proposals').then(r => r.json()).then(data => {
      setProposals(data.filter((p: { project_id: number }) => String(p.project_id) === String(id)));
    });
  }, [id]);

  const advance = async () => {
    if (!project) return;
    const next = STATUS_LABEL[project.status]?.next;
    if (!next) return;
    await fetch(`/api/collab/projects/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) }).catch(() => {});
    setProject({ ...project, status: next });
  };

  if (!project) return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#051226' }}>
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const st = STATUS_LABEL[project.status] || STATUS_LABEL.proposal;
  const daysLeft = project.deadline ? Math.ceil((new Date(project.deadline).getTime() - Date.now()) / 86400000) : null;

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: 'rgba(5,18,38,0.85)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/collab" className="text-white/40 hover:text-white/60">Collab Hub</Link>
            <span className="text-white/20">/</span>
            <Link href="/collab/projects" className="text-white/40 hover:text-white/60">프로젝트</Link>
            <span className="text-white/20">/</span>
            <span className="text-white font-bold truncate max-w-xs">{project.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: st.color+'20', color: st.color }}>{st.label}</span>
            {st.next && (
              <button onClick={advance} className="px-3 py-1.5 text-xs font-bold border border-white/15 text-white/60 rounded-lg hover:border-white/30 transition-all">
                {STATUS_LABEL[st.next]?.label}으로 →
              </button>
            )}
            <Link href={`/collab/proposals/new`} className="px-4 py-1.5 text-xs font-bold bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-colors">✨ 제안서 생성</Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* 기본 정보 */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/3">
          <h1 className="text-2xl font-extrabold text-white mb-4">{project.title}</h1>
          {project.description && <p className="text-white/50 text-sm mb-6 leading-relaxed">{project.description}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {project.deadline && (
              <div>
                <p className="text-xs text-white/30 mb-0.5">마감일</p>
                <p className="text-white font-semibold text-sm">{project.deadline.slice(0,10)}</p>
                {daysLeft !== null && (
                  <p className="text-xs mt-0.5" style={{ color: daysLeft <= 3 ? '#EF4444' : daysLeft <= 7 ? '#F59E0B' : '#10B981' }}>
                    {daysLeft < 0 ? '마감됨' : `D-${daysLeft}`}
                  </p>
                )}
              </div>
            )}
            {project.budget && (
              <div>
                <p className="text-xs text-white/30 mb-0.5">예산</p>
                <p className="text-white font-semibold text-sm">{project.budget.toLocaleString()}원</p>
              </div>
            )}
            {project.created_by_name && (
              <div>
                <p className="text-xs text-white/30 mb-0.5">주관</p>
                <p className="font-semibold text-sm" style={{ color: project.created_by_color }}>{project.created_by_name}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-white/30 mb-0.5">제안서</p>
              <p className="text-white font-semibold text-sm">{proposals.length}개</p>
            </div>
          </div>
          {project.tags?.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {project.tags.map(t => <span key={t} className="text-xs px-2 py-1 rounded-lg bg-white/8 text-white/50">{t}</span>)}
            </div>
          )}
        </div>

        {/* 참여 기관 */}
        <div>
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">참여 기관 ({project.members?.length || 0})</h2>
          {(!project.members || project.members.length === 0) ? (
            <p className="text-white/25 text-sm">참여 기관이 없습니다</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {project.members.map((m, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/8 flex items-center gap-3" style={{ borderColor: m.color+'30' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0" style={{ backgroundColor: m.color+'25', color: m.color }}>
                    {m.name.slice(0,1)}
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">{m.name}</p>
                    {m.role && <p className="text-white/35 text-xs">{m.role}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 연결된 제안서 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">제안서 ({proposals.length})</h2>
            <Link href="/collab/proposals/new" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">+ 새 제안서</Link>
          </div>
          {proposals.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-white/15 text-center">
              <p className="text-white/25 text-sm mb-2">연결된 제안서가 없습니다</p>
              <Link href="/collab/proposals/new" className="text-xs text-indigo-400 font-bold">✨ AI 제안서 생성하기</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {proposals.map(p => (
                <Link key={p.id} href={`/collab/proposals/${p.id}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-white/8 hover:border-white/20 transition-all group"
                >
                  <span className="text-sm">📄</span>
                  <p className="text-white text-sm flex-1 group-hover:text-blue-300 transition-colors">{p.title}</p>
                  <span className="text-xs text-white/30">{p.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

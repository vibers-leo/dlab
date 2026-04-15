'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Entity = {
  id: number; slug: string; name: string; ceo: string; color: string;
  description: string; type: string; brand_count: number;
};

type Project = {
  id: number; title: string; status: string; deadline: string;
  tags: string[]; created_by_name: string; created_by_color: string;
  members: { name: string; color: string; role: string }[];
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  proposal: { label: '제안중', color: '#F59E0B' },
  active:   { label: '진행중', color: '#10B981' },
  completed:{ label: '완료',   color: '#6366F1' },
  archived: { label: '보관',   color: '#6B7280' },
};

export default function CollabPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/collab/entities').then(r => r.json()),
      fetch('/api/collab/projects').then(r => r.json()),
    ]).then(([e, p]) => {
      setEntities(e);
      setProjects(p);
      setLoading(false);
    });
  }, []);

  const internal = entities.filter(e => e.type === 'internal');
  const partners = entities.filter(e => e.type === 'partner');

  return (
    <main style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: 'rgba(5,18,38,0.85)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-base font-extrabold" style={{ letterSpacing: '-0.02em' }}>
              <span style={{ color: '#60A5FA' }}>:</span><span className="text-white/60">DLAB</span>
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-white font-bold text-base">Collab Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/collab/proposals" className="px-4 py-2 text-xs font-bold bg-indigo-500/80 text-white rounded-lg hover:bg-indigo-500 transition-colors">
              ✨ AI 제안서
            </Link>
            <Link href="/collab/entities/new" className="px-4 py-2 text-xs font-bold bg-white/10 text-white rounded-lg hover:bg-white/15 transition-colors">
              + 엔티티
            </Link>
            <Link href="/collab/projects/new" className="px-4 py-2 text-xs font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors">
              + 프로젝트
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* 통계 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { label: '내부 엔티티', value: internal.length, color: '#3B82F6' },
                { label: '협력사', value: partners.length, color: '#10B981' },
                { label: '진행중 프로젝트', value: projects.filter(p => p.status === 'active').length, color: '#F59E0B' },
                { label: '총 브랜드', value: entities.reduce((s, e) => s + (e.brand_count || 0), 0), color: '#6366F1' },
              ].map(s => (
                <div key={s.label} className="p-5 rounded-2xl border border-white/8 bg-white/3">
                  <p className="text-3xl font-extrabold text-white mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-white/40 font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            {/* 내부 엔티티 */}
            <section className="mb-10">
              <h2 className="text-sm font-bold text-white/40 tracking-widest uppercase mb-4">내부 엔티티</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {internal.map(e => (
                  <Link key={e.id} href={`/collab/entities/${e.id}`}
                    className="p-5 rounded-2xl border border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: e.color + '30', border: `1px solid ${e.color}50` }}>
                        <div className="w-full h-full rounded-lg flex items-center justify-center text-xs font-black" style={{ color: e.color }}>
                          {e.name.slice(0, 1)}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-bold truncate group-hover:text-blue-300 transition-colors">{e.name}</p>
                        {e.ceo && <p className="text-white/30 text-xs">{e.ceo} 대표</p>}
                      </div>
                    </div>
                    {e.description && <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-3">{e.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/25">브랜드 {e.brand_count}개</span>
                      <span className="text-xs font-bold" style={{ color: e.color }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 협력사 */}
            {partners.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white/40 tracking-widest uppercase">협력사</h2>
                  <Link href="/collab/entities/new?type=partner" className="text-xs text-blue-400 hover:text-blue-300">+ 협력사 추가</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {partners.map(e => (
                    <Link key={e.id} href={`/collab/entities/${e.id}`}
                      className="p-4 rounded-xl border border-white/8 bg-white/3 hover:border-white/20 transition-all group flex items-center gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-black" style={{ backgroundColor: e.color + '25', color: e.color }}>
                        {e.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-bold truncate">{e.name}</p>
                        <p className="text-white/30 text-xs">{e.type === 'partner' ? '협력사' : '클라이언트'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 프로젝트 */}
            {/* 퀵 액션 */}
            <section className="mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { href: '/collab/proposals', icon: '✨', label: 'AI 제안서', color: '#6366F1', desc: '제안서 자동 생성' },
                  { href: '/collab/knowledge', icon: '🧠', label: '지식베이스', color: '#10B981', desc: 'RAG 학습 문서' },
                  { href: '/collab/projects/new', icon: '📋', label: '프로젝트', color: '#F59E0B', desc: '협업 프로젝트 생성' },
                  { href: '/collab/entities/new', icon: '🏢', label: '엔티티 추가', color: '#3B82F6', desc: '협력사 온보딩' },
                ].map(a => (
                  <Link key={a.href} href={a.href} className="p-4 rounded-2xl border border-white/8 hover:border-white/20 hover:bg-white/3 transition-all group">
                    <div className="text-2xl mb-2">{a.icon}</div>
                    <p className="text-white text-sm font-bold group-hover:text-blue-300 transition-colors">{a.label}</p>
                    <p className="text-white/30 text-xs mt-0.5">{a.desc}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white/40 tracking-widest uppercase">프로젝트</h2>
                <Link href="/collab/projects" className="text-xs text-blue-400 hover:text-blue-300">전체 보기 →</Link>
              </div>
              {projects.length === 0 ? (
                <div className="p-10 rounded-2xl border border-dashed border-white/15 text-center">
                  <p className="text-white/30 text-sm mb-3">아직 프로젝트가 없습니다</p>
                  <Link href="/collab/projects/new" className="text-xs text-blue-400 hover:text-blue-300 font-bold">첫 프로젝트 만들기 →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.slice(0, 8).map(p => {
                    const st = STATUS_LABEL[p.status] || STATUS_LABEL.proposal;
                    return (
                      <Link key={p.id} href={`/collab/projects/${p.id}`}
                        className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5 transition-all group"
                      >
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: st.color + '20', color: st.color }}>
                          {st.label}
                        </span>
                        <p className="text-white text-sm font-semibold flex-1 truncate group-hover:text-blue-300 transition-colors">{p.title}</p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {p.members?.slice(0, 3).map((m, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: m.color + '20', color: m.color }}>{m.name}</span>
                          ))}
                          {(p.members?.length || 0) > 3 && (
                            <span className="text-xs text-white/30">+{p.members.length - 3}</span>
                          )}
                        </div>
                        {p.deadline && (
                          <span className="text-xs text-white/30 flex-shrink-0">{p.deadline.slice(0, 10)}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

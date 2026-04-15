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
      setEntities(Array.isArray(e) ? e : []);
      setProjects(Array.isArray(p) ? p : []);
      setLoading(false);
    });
  }, []);

  const internal = entities.filter(e => e.type === 'internal');
  const partners = entities.filter(e => e.type === 'partner');

  return (
    <main className="relative overflow-hidden" style={{ backgroundColor: '#051226', minHeight: '100vh' }}>
      {/* 도트 그리드 배경 */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
      {/* 우상단 원형 장식 */}
      <div className="absolute top-[-4rem] right-[-4rem] w-80 h-80 rounded-full border pointer-events-none" style={{ borderColor: 'rgba(96,165,250,0.12)' }} />
      <div className="absolute top-[-2rem] right-[-2rem] w-52 h-52 rounded-full border pointer-events-none" style={{ borderColor: 'rgba(96,165,250,0.07)' }} />
      {/* 좌하단 블루 블러 */}
      <div className="absolute bottom-32 left-[-6rem] w-96 h-96 rounded-full pointer-events-none" style={{ background: 'rgba(59,130,246,0.06)', filter: 'blur(60px)' }} />

      {/* 페이지 헤더 */}
      <div className="relative" style={{ borderBottom: '1px solid rgba(96,165,250,0.1)', backgroundColor: 'rgba(4,14,30,0.5)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ border: '1px solid rgba(96,165,250,0.3)', color: 'rgba(96,165,250,0.8)', backgroundColor: 'rgba(96,165,250,0.06)' }}>
                Vibers Collab Hub
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white" style={{ letterSpacing: '-0.03em' }}>생태계 협업 현황</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/collab/proposals/new"
              className="px-4 py-2 text-xs font-bold rounded-full transition-all"
              style={{ border: '1px solid rgba(99,102,241,0.5)', color: '#a5b4fc', backgroundColor: 'rgba(99,102,241,0.1)' }}
            >
              ✦ AI 제안서
            </Link>
            <Link href="/collab/projects/new"
              className="px-4 py-2 text-xs font-bold text-white rounded-full transition-all"
              style={{ backgroundColor: '#3B82F6' }}
            >
              + 프로젝트
            </Link>
          </div>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* 통계 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {[
                { label: '내부 엔티티', value: internal.length, color: '#60A5FA' },
                { label: '협력사', value: partners.length, color: '#34D399' },
                { label: '진행중 프로젝트', value: projects.filter(p => p.status === 'active').length, color: '#FBBF24' },
                { label: '총 브랜드', value: entities.reduce((s, e) => s + (e.brand_count || 0), 0), color: '#818CF8' },
              ].map(s => (
                <div key={s.label} className="p-5 rounded-2xl transition-all"
                  style={{ border: `1px solid ${s.color}20`, backgroundColor: `${s.color}06` }}>
                  <p className="text-3xl font-extrabold mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* 내부 엔티티 */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(96,165,250,0.5)' }}>내부 엔티티</h2>
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(96,165,250,0.08)' }} />
                <Link href="/collab/entities/new" className="text-xs" style={{ color: 'rgba(96,165,250,0.5)' }}>+ 추가</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {internal.map(e => (
                  <Link key={e.id} href={`/collab/entities/${e.id}`}
                    className="p-5 rounded-2xl transition-all group"
                    style={{ border: `1px solid ${e.color}18`, backgroundColor: `${e.color}05` }}
                    onMouseOver={ev => { ev.currentTarget.style.border = `1px solid ${e.color}40`; ev.currentTarget.style.backgroundColor = `${e.color}0c`; }}
                    onMouseOut={ev => { ev.currentTarget.style.border = `1px solid ${e.color}18`; ev.currentTarget.style.backgroundColor = `${e.color}05`; }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                        style={{ backgroundColor: e.color + '25', color: e.color, border: `1px solid ${e.color}35` }}>
                        {e.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-bold truncate">{e.name}</p>
                        {e.ceo && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{e.ceo} 대표</p>}
                      </div>
                    </div>
                    {e.description && <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>{e.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>브랜드 {e.brand_count}개</span>
                      <span className="text-xs font-bold" style={{ color: e.color }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 협력사 */}
            {partners.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(96,165,250,0.5)' }}>협력사</h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(96,165,250,0.08)' }} />
                  <Link href="/collab/entities/new?type=partner" className="text-xs" style={{ color: 'rgba(96,165,250,0.5)' }}>+ 추가</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {partners.map(e => (
                    <Link key={e.id} href={`/collab/entities/${e.id}`}
                      className="p-4 rounded-xl transition-all flex items-center gap-3"
                      style={{ border: `1px solid ${e.color}18`, backgroundColor: `${e.color}05` }}
                      onMouseOver={ev => { ev.currentTarget.style.border = `1px solid ${e.color}35`; }}
                      onMouseOut={ev => { ev.currentTarget.style.border = `1px solid ${e.color}18`; }}
                    >
                      <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-black"
                        style={{ backgroundColor: e.color + '25', color: e.color }}>
                        {e.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-bold truncate">{e.name}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>협력사</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 퀵 액션 */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(96,165,250,0.5)' }}>바로가기</h2>
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(96,165,250,0.08)' }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { href: '/collab/proposals', icon: '✦', label: 'AI 제안서', color: '#818CF8', desc: '제안서 자동 생성' },
                  { href: '/collab/knowledge', icon: '◎', label: '지식베이스', color: '#34D399', desc: 'RAG 학습 문서' },
                  { href: '/collab/projects/new', icon: '◉', label: '프로젝트', color: '#FBBF24', desc: '협업 프로젝트 생성' },
                  { href: '/collab/entities/new', icon: '◈', label: '엔티티 추가', color: '#60A5FA', desc: '협력사 온보딩' },
                ].map(a => (
                  <Link key={a.href} href={a.href}
                    className="p-4 rounded-2xl transition-all group"
                    style={{ border: `1px solid ${a.color}15`, backgroundColor: `${a.color}05` }}
                    onMouseOver={ev => { ev.currentTarget.style.border = `1px solid ${a.color}35`; ev.currentTarget.style.backgroundColor = `${a.color}0c`; }}
                    onMouseOut={ev => { ev.currentTarget.style.border = `1px solid ${a.color}15`; ev.currentTarget.style.backgroundColor = `${a.color}05`; }}
                  >
                    <div className="text-xl mb-2 font-bold" style={{ color: a.color }}>{a.icon}</div>
                    <p className="text-white text-sm font-bold mb-0.5">{a.label}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{a.desc}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* 최근 프로젝트 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(96,165,250,0.5)' }}>최근 프로젝트</h2>
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(96,165,250,0.08)' }} />
                <Link href="/collab/projects" className="text-xs" style={{ color: 'rgba(96,165,250,0.5)' }}>전체 보기 →</Link>
              </div>
              {projects.length === 0 ? (
                <div className="p-10 rounded-2xl text-center" style={{ border: '1px dashed rgba(96,165,250,0.15)' }}>
                  <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>아직 프로젝트가 없습니다</p>
                  <Link href="/collab/projects/new" className="text-xs font-bold" style={{ color: '#60A5FA' }}>첫 프로젝트 만들기 →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.slice(0, 6).map(p => {
                    const st = STATUS_LABEL[p.status] || STATUS_LABEL.proposal;
                    return (
                      <Link key={p.id} href={`/collab/projects/${p.id}`}
                        className="flex items-center gap-4 p-4 rounded-xl transition-all group"
                        style={{ border: '1px solid rgba(96,165,250,0.08)', backgroundColor: 'rgba(96,165,250,0.02)' }}
                        onMouseOver={ev => { ev.currentTarget.style.border = '1px solid rgba(96,165,250,0.2)'; ev.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.05)'; }}
                        onMouseOut={ev => { ev.currentTarget.style.border = '1px solid rgba(96,165,250,0.08)'; ev.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.02)'; }}
                      >
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                          style={{ backgroundColor: st.color + '18', color: st.color, border: `1px solid ${st.color}30` }}>
                          {st.label}
                        </span>
                        <p className="text-white text-sm font-semibold flex-1 truncate">{p.title}</p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {p.members?.slice(0, 3).map((m, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: m.color + '18', color: m.color, border: `1px solid ${m.color}25` }}>
                              {m.name}
                            </span>
                          ))}
                          {(p.members?.length || 0) > 3 && (
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>+{p.members.length - 3}</span>
                          )}
                        </div>
                        {p.deadline && (
                          <span className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }}>{p.deadline.slice(0, 10)}</span>
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

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/collab', label: '대시보드', icon: '◈', exact: true },
  { href: '/collab/proposals', label: 'AI 제안서', icon: '✦', badge: 'AI' },
  { href: '/collab/projects', label: '프로젝트', icon: '◉' },
  { href: '/collab/knowledge', label: '지식베이스', icon: '◎' },
];

export default function CollabShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const Sidebar = () => (
    <aside
      className="flex flex-col h-full select-none relative overflow-hidden"
      style={{
        backgroundColor: '#040e1e',
        borderRight: '1px solid rgba(96,165,250,0.1)',
        width: collapsed ? 56 : 220,
        transition: 'width 0.2s ease',
        flexShrink: 0,
      }}
    >
      {/* 도트 그리드 배경 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      {/* 블루 블러 장식 */}
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* 로고 */}
      <div className="relative flex items-center justify-between px-4 py-4" style={{ height: 56, borderBottom: '1px solid rgba(96,165,250,0.08)' }}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-base font-extrabold" style={{ letterSpacing: '-0.02em' }}>
              <span style={{ color: '#60A5FA' }}>:</span>
              <span className="text-white/80">DLAB</span>
            </span>
            <span className="text-xs font-medium" style={{ color: 'rgba(96,165,250,0.4)' }}>collab</span>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all ml-auto"
          style={{ color: 'rgba(96,165,250,0.4)' }}
          onMouseOver={e => (e.currentTarget.style.color = 'rgba(96,165,250,0.8)')}
          onMouseOut={e => (e.currentTarget.style.color = 'rgba(96,165,250,0.4)')}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* 메인 네비 */}
      <nav className="relative px-2 py-3 space-y-0.5">
        {NAV.map(item => {
          const active = isActive(item.href, item.exact);
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={active
                ? { backgroundColor: 'rgba(96,165,250,0.12)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.2)' }
                : { color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' }
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="text-base flex-shrink-0" style={{ width: 20, textAlign: 'center' }}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{ backgroundColor: 'rgba(99,102,241,0.2)', color: '#a5b4fc', fontSize: 9, border: '1px solid rgba(99,102,241,0.3)' }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 구분선 */}
      <div className="relative mx-3 my-1" style={{ borderTop: '1px solid rgba(96,165,250,0.08)' }} />

      {/* 하단 */}
      <div className="relative mt-auto px-2 py-3 space-y-0.5" style={{ borderTop: '1px solid rgba(96,165,250,0.08)' }}>
        <Link href="/collab/entities/new"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-all"
          style={{ color: 'rgba(96,165,250,0.4)', border: '1px solid transparent' }}
          onMouseOver={e => { e.currentTarget.style.color = 'rgba(96,165,250,0.7)'; e.currentTarget.style.border = '1px solid rgba(96,165,250,0.1)'; }}
          onMouseOut={e => { e.currentTarget.style.color = 'rgba(96,165,250,0.4)'; e.currentTarget.style.border = '1px solid transparent'; }}
          title={collapsed ? '엔티티 추가' : undefined}
        >
          <span style={{ width: 20, textAlign: 'center' }}>＋</span>
          {!collapsed && <span>엔티티 / 협력사 추가</span>}
        </Link>
        <Link href="/"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-all"
          style={{ color: 'rgba(255,255,255,0.2)', border: '1px solid transparent' }}
          title={collapsed ? '디랩 사이트' : undefined}
        >
          <span style={{ width: 20, textAlign: 'center' }}>↗</span>
          {!collapsed && <span>디랩 사이트로</span>}
        </Link>
      </div>
    </aside>
  );

  return (
    <div style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh', display: 'flex' }}>
      {/* 데스크톱 사이드바 */}
      <div className="hidden md:flex flex-col" style={{ height: '100vh', position: 'sticky', top: 0 }}>
        <Sidebar />
      </div>

      {/* 모바일 오버레이 */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex flex-col" style={{ width: 220 }}>
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto" style={{ minHeight: '100vh' }}>
        {/* 모바일 탑바 */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-40"
          style={{ backgroundColor: 'rgba(5,18,38,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(96,165,250,0.1)' }}>
          <button onClick={() => setMobileOpen(true)} className="w-8 h-8 flex items-center justify-center transition-colors" style={{ color: 'rgba(96,165,250,0.6)' }}>
            ☰
          </button>
          <span className="text-sm font-bold" style={{ color: '#60A5FA' }}>
            {NAV.find(n => isActive(n.href, n.exact))?.label ?? 'Collab Hub'}
          </span>
        </div>

        {/* 페이지 콘텐츠 */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

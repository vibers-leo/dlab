'use client';

import { useState } from 'react';
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

  const internal = entities.filter(e => e.type === 'internal');
  const partners = entities.filter(e => e.type === 'partner');

  const Sidebar = () => (
    <aside
      className="flex flex-col h-full border-r border-white/8 select-none"
      style={{ backgroundColor: '#040e1e', width: collapsed ? 56 : 220, transition: 'width 0.2s ease', flexShrink: 0 }}
    >
      {/* 로고 */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/8" style={{ height: 56 }}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-base font-extrabold" style={{ letterSpacing: '-0.02em' }}>
              <span style={{ color: '#60A5FA' }}>:</span>
              <span className="text-white/70">DLAB</span>
            </span>
            <span className="text-xs text-white/25 font-medium">collab</span>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/8 transition-all ml-auto"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* 메인 네비 */}
      <nav className="px-2 py-3 space-y-0.5">
        {NAV.map(item => {
          const active = isActive(item.href, item.exact);
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all group"
              style={active
                ? { backgroundColor: 'rgba(59,130,246,0.15)', color: '#60A5FA' }
                : { color: 'rgba(255,255,255,0.45)' }
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="text-base flex-shrink-0" style={{ width: 20, textAlign: 'center' }}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: '#6366F130', color: '#818cf8', fontSize: 10 }}>{item.badge}</span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 구분선 */}
      <div className="mx-3 border-t border-white/8 my-2" />

      {/* 하단 */}
      <div className="mt-auto border-t border-white/8 px-2 py-3 space-y-0.5">
        <Link href="/collab/entities/new"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
          title={collapsed ? '엔티티 추가' : undefined}
        >
          <span style={{ width: 20, textAlign: 'center' }}>＋</span>
          {!collapsed && <span>엔티티 / 협력사 추가</span>}
        </Link>
        <Link href="/"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-white/20 hover:text-white/40 hover:bg-white/5 transition-all"
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
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto" style={{ minHeight: '100vh' }}>
        {/* 모바일 탑바 */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/8 sticky top-0 z-40" style={{ backgroundColor: 'rgba(4,14,30,0.95)', backdropFilter: 'blur(12px)' }}>
          <button onClick={() => setMobileOpen(true)} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white/80 transition-colors">
            ☰
          </button>
          <span className="text-sm font-bold text-white/70">
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

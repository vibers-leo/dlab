'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePortalAuth } from '@/components/portal-auth-context';

const NAV = [
  { href: '/portal', label: '대시보드', icon: '◈', exact: true },
  { href: '/portal/products', label: '상품 목록', icon: '◉' },
  { href: '/portal/orders', label: '주문 내역', icon: '◎' },
  { href: '/portal/credits', label: '크레딧', icon: '✦' },
];

const ADMIN_NAV = [
  { href: '/portal/admin/clients', label: '계정 관리', icon: '◇' },
  { href: '/portal/admin/orders', label: '주문 관리', icon: '◆' },
  { href: '/portal/admin/products', label: '상품 관리', icon: '▣' },
  { href: '/portal/admin/inquiries', label: '문의 관리', icon: '▤' },
];

const PUBLIC_PATHS = ['/portal/login', '/portal/portfolio', '/portal/inquiry'];

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAdmin, logout } = usePortalAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));

  // 공개 페이지는 사이드바 없이 렌더
  if (isPublic) {
    return (
      <div style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}>
        {children}
      </div>
    );
  }

  // 로딩 중 스피너
  if (loading) {
    return (
      <div style={{ fontFamily: "'Paperlogy', sans-serif", backgroundColor: '#051226', minHeight: '100vh' }}
        className="flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  // 미인증 → 로그인
  if (!user) {
    router.replace('/portal/login');
    return null;
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const NavItem = ({ item }: { item: { href: string; label: string; icon: string; exact?: boolean } }) => {
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
        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      </Link>
    );
  };

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
          <Link href="/portal" className="flex items-center gap-1.5">
            <span className="text-base font-extrabold" style={{ letterSpacing: '-0.02em' }}>
              <span style={{ color: '#60A5FA' }}>:</span>
              <span className="text-white/80">DLAB</span>
            </span>
            <span className="text-xs font-medium" style={{ color: 'rgba(96,165,250,0.4)' }}>portal</span>
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
        {NAV.map(item => <NavItem key={item.href} item={item} />)}
      </nav>

      {/* 어드민 영역 */}
      {isAdmin && (
        <>
          <div className="relative mx-3 my-1" style={{ borderTop: '1px solid rgba(96,165,250,0.08)' }} />
          <nav className="relative px-2 py-2 space-y-0.5">
            {!collapsed && (
              <span className="block px-2.5 pb-1 text-xs font-medium" style={{ color: 'rgba(96,165,250,0.3)' }}>관리자</span>
            )}
            {ADMIN_NAV.map(item => <NavItem key={item.href} item={item} />)}
          </nav>
        </>
      )}

      {/* 하단 */}
      <div className="relative mt-auto px-2 py-3 space-y-0.5" style={{ borderTop: '1px solid rgba(96,165,250,0.08)' }}>
        <Link href="/portal/portfolio"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-all"
          style={{ color: 'rgba(96,165,250,0.4)', border: '1px solid transparent' }}
          onMouseOver={e => { e.currentTarget.style.color = 'rgba(96,165,250,0.7)'; e.currentTarget.style.border = '1px solid rgba(96,165,250,0.1)'; }}
          onMouseOut={e => { e.currentTarget.style.color = 'rgba(96,165,250,0.4)'; e.currentTarget.style.border = '1px solid transparent'; }}
          title={collapsed ? '포트폴리오 보기' : undefined}
        >
          <span style={{ width: 20, textAlign: 'center' }}>↗</span>
          {!collapsed && <span>포트폴리오 보기</span>}
        </Link>
        <button onClick={logout}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-all w-full text-left"
          style={{ color: 'rgba(255,255,255,0.2)', border: '1px solid transparent' }}
          onMouseOver={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
          onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)'; }}
          title={collapsed ? '로그아웃' : undefined}
        >
          <span style={{ width: 20, textAlign: 'center' }}>⏻</span>
          {!collapsed && <span>로그아웃</span>}
        </button>
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
          <div className="flex flex-col" style={{ width: 'min(220px, 80vw)' }}>
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
          <button onClick={() => setMobileOpen(true)} className="w-10 h-10 flex items-center justify-center transition-colors" style={{ color: 'rgba(96,165,250,0.6)' }}>
            ☰
          </button>
          <span className="text-base font-bold" style={{ color: '#60A5FA' }}>
            {NAV.find(n => isActive(n.href, n.exact))?.label ?? 'Portal'}
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

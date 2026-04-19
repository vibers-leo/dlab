import type { Metadata } from 'next';
import { PortalAuthProvider } from '@/components/portal-auth-context';
import PortalShell from './PortalShell';

export const metadata: Metadata = { title: '클라이언트 포털 | 디랩', robots: 'noindex' };

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalAuthProvider>
      <PortalShell>{children}</PortalShell>
    </PortalAuthProvider>
  );
}

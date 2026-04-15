import type { Metadata } from 'next';
import CollabShell from './CollabShell';

export const metadata: Metadata = {
  title: 'Vibers Collab Hub | 디랩',
  description: '계발자들 생태계 협업 허브 — 엔티티, 브랜드, 프로젝트, AI 제안서 통합 관리',
  robots: 'noindex',
};

export default function CollabLayout({ children }: { children: React.ReactNode }) {
  return <CollabShell>{children}</CollabShell>;
}

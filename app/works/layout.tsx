import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '포트폴리오 | 디랩',
  description: '디랩이 만든 웹 프로젝트들 — 이벤트, 기업, 앱, 제안서 등 다양한 업종의 납품 실적을 확인하세요.',
  openGraph: {
    title: '포트폴리오 | 디랩',
    description: '디랩이 만든 웹 프로젝트들을 확인하세요.',
    url: 'https://dlab.vibers.co.kr/works',
  },
};

export default function WorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}

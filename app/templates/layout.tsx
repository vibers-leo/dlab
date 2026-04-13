import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '업종별 템플릿 | 디랩',
  description: '36가지 업종별 웹사이트 템플릿 — 식당, 카페, 병원, 뷰티, 쇼핑몰 등 빠르게 시작하세요.',
  openGraph: {
    title: '업종별 템플릿 | 디랩',
    description: '36가지 업종별 웹사이트 템플릿으로 빠르게 시작하세요.',
    url: 'https://dlab.vibers.co.kr/templates',
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

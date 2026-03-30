import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "마이넥스트가이드 | Next.js 학습 가이드",
  description: "Next.js 아키텍처와 개발 패턴을 쉽게 배우는 가이드",
  metadataBase: new URL("https://my-next-guide.vercel.app"),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://my-next-guide.vercel.app",
    siteName: "마이넥스트가이드",
    title: "마이넥스트가이드 | Next.js 학습 가이드",
    description: "Next.js 아키텍처와 개발 패턴을 쉽게 배우는 가이드. 비개발자도 이해할 수 있는 웹 애플리케이션 학습 플랫폼.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7704550771011130"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CGK1BSBM63"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CGK1BSBM63');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: '마이넥스트가이드',
            description: 'Next.js 아키텍처와 개발 패턴을 쉽게 배우는 가이드. 비개발자도 이해할 수 있는 웹 애플리케이션 학습 플랫폼.',
            url: 'https://my-next-guide.vercel.app',
            inLanguage: 'ko',
            author: {
              '@type': 'Organization',
              name: '계발자들',
              url: 'https://vibers.co.kr',
            },
          }) }}
        />
        {children}
      </body>
    </html>
  );
}

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
  title: "디랩 | 전문 개발 에이전시",
  description: "기획부터 배포까지 함께하는 풀스택 개발 파트너. 웹 서비스, 앱, 커머스, 유지보수 전문.",
  metadataBase: new URL("https://dlab.vibers.co.kr"),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://dlab.vibers.co.kr",
    siteName: "디랩",
    title: "디랩 | 전문 개발 에이전시",
    description: "기획부터 배포까지 함께하는 풀스택 개발 파트너. 웹 서비스, 앱, 커머스, 유지보수 전문.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "디랩" }],
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
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
            name: '디랩',
            description: '기획부터 배포까지 함께하는 풀스택 개발 파트너. 웹 서비스, 앱, 커머스, 유지보수 전문.',
            url: 'https://dlab.vibers.co.kr',
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

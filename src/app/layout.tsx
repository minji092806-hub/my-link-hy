import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://my-link-hy.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "My Link HY - 나만의 올인원 바이오링크 & 포트폴리오",
    template: "%s | My Link HY",
  },
  description:
    "웹툰, SNS 채널, 스마트스토어, 포트폴리오까지 나의 모든 링크를 단 하나의 세련된 프로필로 연결하는 바이오링크 서비스",
  applicationName: "My Link HY",
  keywords: [
    "마이링크",
    "바이오링크",
    "링크트리",
    "포트폴리오",
    "링크모음",
    "크리에이터 프로필",
    "인스타 링크",
    "My Link",
    "My Link HY",
  ],
  authors: [{ name: "My Link Team" }],
  creator: "My Link",
  publisher: "My Link",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "My Link HY",
    title: "My Link HY - 나만의 올인원 바이오링크 & 포트폴리오",
    description:
      "웹툰, SNS 채널, 스마트스토어, 포트폴리오까지 나의 모든 링크를 단 하나의 세련된 프로필로 연결하는 바이오링크 서비스",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Link HY - 나만의 올인원 바이오링크 & 포트폴리오",
    description:
      "웹툰, SNS 채널, 스마트스토어, 포트폴리오까지 나의 모든 링크를 단 하나의 세련된 프로필로 연결하는 바이오링크 서비스",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "My Link HY",
  url: siteUrl,
  description:
    "웹툰, SNS 채널, 스마트스토어, 포트폴리오까지 나의 모든 링크를 단 하나의 세련된 프로필로 연결하는 바이오링크 서비스",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/{displayName}`,
    "query-input": "required name=displayName",
  },
};

import { QueryProvider } from "@/components/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <head>
        {/* Schema.org WebSite JSON-LD 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Pretendard Variable — Toss Product Sans 무료 대체 서체 */}
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

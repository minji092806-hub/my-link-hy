import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "김민지 (꺄륵) ✦ 공식 프로필 & 링크",
  description: "웹툰 작가 김민지(꺄륵)의 공식 바이오링크 및 작업 포트폴리오",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* Pretendard Variable — Toss Product Sans 무료 대체 서체 */}
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

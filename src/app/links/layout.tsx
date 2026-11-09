import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://my-link-hy.vercel.app';

export const metadata: Metadata = {
  title: '내 링크 관리',
  description:
    '나만의 링크를 추가, 수정, 삭제하고 카테고리별로 정돈하여 하나의 바이오링크 프로필로 관리하세요.',
  alternates: {
    canonical: '/links',
  },
  openGraph: {
    title: '내 링크 관리 | My Link HY',
    description:
      '나만의 링크를 추가, 수정, 삭제하고 카테고리별로 정돈하여 하나의 바이오링크 프로필로 관리하세요.',
    url: `${siteUrl}/links`,
    siteName: 'My Link HY',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '내 링크 관리 | My Link HY',
    description:
      '나만의 링크를 추가, 수정, 삭제하고 카테고리별로 정돈하여 하나의 바이오링크 프로필로 관리하세요.',
  },
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

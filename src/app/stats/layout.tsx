import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://my-link-hy-six.vercel.app';

export const metadata: Metadata = {
  title: '링크 성과 통계 대시보드',
  description:
    '방문자들의 실시간 클릭 수와 카테고리별 성과 통계를 차트로 확인하고 링크를 최적화하세요.',
  alternates: {
    canonical: '/stats',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: '링크 성과 통계 대시보드 | My Link HY',
    description:
      '방문자들의 실시간 클릭 수와 카테고리별 성과 통계를 차트로 확인하고 링크를 최적화하세요.',
    url: `${siteUrl}/stats`,
    siteName: 'My Link HY',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '링크 성과 통계 대시보드 | My Link HY',
    description:
      '방문자들의 실시간 클릭 수와 카테고리별 성과 통계를 차트로 확인하고 링크를 최적화하세요.',
  },
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

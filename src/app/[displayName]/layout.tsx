import type { Metadata } from 'next';
import { getUserByDisplayName } from '@/lib/authService';

interface Props {
  params: Promise<{ displayName: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const rawDisplayName = resolvedParams.displayName || '';
  const decodedDisplayName = decodeURIComponent(rawDisplayName).trim();

  let title = `${decodedDisplayName || '크리에이터'} | 공식 프로필 & 링크`;
  let description = `${decodedDisplayName || '크리에이터'}님의 공식 마이링크 페이지입니다. 다양한 링크와 소식을 한눈에 확인해보세요. ✨`;
  let profilePhoto: string | undefined = undefined;

  try {
    if (decodedDisplayName) {
      const user = await getUserByDisplayName(decodedDisplayName);
      if (user) {
        title = `${user.displayName || decodedDisplayName} ✦ 공식 프로필 & 링크`;
        if (user.bio) {
          description = user.bio;
        }
        if (user.photoURL) {
          profilePhoto = user.photoURL;
        }
      }
    }
  } catch (err) {
    console.warn('[Metadata] 유저 정보 조회 실패 폴백:', err);
  }

  const encodedPath = `/${encodeURIComponent(decodedDisplayName)}`;

  return {
    title,
    description,
    keywords: [
      decodedDisplayName,
      `${decodedDisplayName} 프로필`,
      `${decodedDisplayName} 링크`,
      '마이링크',
      '바이오링크',
      '포트폴리오',
      '링크트리',
    ],
    alternates: {
      canonical: encodedPath,
    },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: encodedPath,
      siteName: 'My Link HY',
      locale: 'ko_KR',
      ...(profilePhoto ? { images: [{ url: profilePhoto, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(profilePhoto ? { images: [profilePhoto] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  };
}

export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

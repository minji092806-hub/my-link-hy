import { ImageResponse } from 'next/og';
import { loadKoreanFont } from '@/lib/og-font';
import { getUserByDisplayName, type UserData } from '@/lib/authService';
import { getLinksFromFirestore } from '@/lib/linkService';
import type { LinkItem } from '@/types';

export const alt = '마이링크 (My Link) - 크리에이터 프로필 & 링크 모음';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export const revalidate = 3600; // 1시간 캐시 (프로필 수정 반영)

interface Props {
  params: Promise<{ displayName: string }>;
}

export default async function Image({ params }: Props) {
  const resolvedParams = await params;
  const rawDisplayName = resolvedParams.displayName || '';
  const decodedDisplayName = decodeURIComponent(rawDisplayName).trim();

  // 1. 한글 폰트 로드
  const fontData = await loadKoreanFont();

  // 2. Firestore에서 해당 사용자 프로필 및 링크 조회
  let userData: UserData | null = null;
  let userLinks: LinkItem[] = [];

  try {
    if (decodedDisplayName) {
      userData = await getUserByDisplayName(decodedDisplayName);
      if (userData?.uid) {
        userLinks = await getLinksFromFirestore(userData.uid);
      }
    }
  } catch (err) {
    console.warn('[OG Dynamic] 사용자 데이터 조회 실패 폴백 적용:', err);
  }

  // 3. 표시할 정보 정제
  const displayName = userData?.displayName || decodedDisplayName || '크리에이터';
  const handle = userData?.handle || `@${decodedDisplayName || 'mylink'}`;
  const bio =
    userData?.bio ||
    (decodedDisplayName
      ? `${displayName}님의 공식 마이링크 및 포트폴리오 공간입니다 ✨`
      : '마이링크로 연결되는 나만의 프로필 공간이에요 ✨');
  const photoURL = userData?.photoURL && userData.photoURL.startsWith('http') ? userData.photoURL : null;
  const initialChar = displayName.charAt(0).toUpperCase() || '✨';

  // 활성 링크 최대 3개 선별 (없으면 감각적인 기본 카테고리 프리셋 링크 사용)
  const activeLinks = userLinks.filter((item) => item.isActive !== false);
  const totalLinkCount = userLinks.length;

  const displayLinks: Array<{ id: string; title: string; icon: string }> =
    activeLinks.length > 0
      ? activeLinks.slice(0, 3).map((item) => ({
          id: item.id,
          title: item.title,
          icon: item.icon || '🔗',
        }))
      : [
          { id: 'preset-1', title: '공식 웹툰 & 작품 포트폴리오', icon: '🎨' },
          { id: 'preset-2', title: '인스타그램 공식 SNS 채널', icon: '📷' },
          { id: 'preset-3', title: '스마트스토어 & 공식 굿즈 마켓', icon: '🛍️' },
        ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F2F4F6',
          position: 'relative',
          padding: '36px',
          fontFamily: fontData ? 'Noto Sans KR, sans-serif' : 'sans-serif',
        }}
      >
        {/* 배경 은은한 앰비언트 글로우 */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-100px',
            width: '480px',
            height: '480px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(49, 130, 246, 0.24) 0%, rgba(242, 244, 246, 0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-100px',
            width: '480px',
            height: '480px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(242, 244, 246, 0) 70%)',
          }}
        />

        {/* 메인 프로필 카드 (TDS 스타일 프리미엄 화이트 카드) */}
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
            borderRadius: '32px',
            border: '2px solid #E5E8EB',
            boxShadow: '0 24px 60px rgba(49, 130, 246, 0.08)',
            padding: '44px 52px',
            position: 'relative',
          }}
        >
          {/* ── 1. 상단 바: 로고 & 공개 프로필 인증 뱃지 ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {/* 마이링크 브랜드 태그 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  backgroundColor: '#3182F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 6px 14px rgba(49, 130, 246, 0.3)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#191F28',
                    letterSpacing: '-0.3px',
                  }}
                >
                  마이링크 <span style={{ color: '#3182F6' }}>MyLink</span>
                </span>
              </div>
            </div>

            {/* 공식 인증 / 프로필 배지 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 15px',
                borderRadius: '9999px',
                backgroundColor: '#E8F3FF',
                border: '1px solid #C7E0FF',
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '9999px',
                  backgroundColor: '#3182F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1B64DA',
                }}
              >
                공식 프로필
              </span>
            </div>
          </div>

          {/* ── 2. 중앙 메인: 좌측 프로필 + 우측 대표 링크 2열 레이아웃 ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: '40px',
              margin: '10px 0',
            }}
          >
            {/* [좌측 컬럼] 프로필 정보 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 560px',
                gap: '14px',
              }}
            >
              {/* 아바타 & 상태 태그 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '96px',
                    height: '96px',
                    display: 'flex',
                  }}
                >
                  {photoURL ? (
                    // 프로필 사진이 있는 경우
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoURL}
                      alt={displayName}
                      style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '30px',
                        objectFit: 'cover',
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                      }}
                    />
                  ) : (
                    // 기본 이니셜 아바타
                    <div
                      style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '30px',
                        background: 'linear-gradient(135deg, #3182F6 0%, #1B64DA 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontSize: '40px',
                        fontWeight: 900,
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 8px 24px rgba(49, 130, 246, 0.3)',
                      }}
                    >
                      {initialChar}
                    </div>
                  )}

                  {/* 아바타 위 체크 뱃지 */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '9999px',
                      backgroundColor: '#3182F6',
                      border: '3px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                {/* 이름 및 핸들 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '34px',
                      fontWeight: 900,
                      letterSpacing: '-1px',
                      color: '#191F28',
                      lineHeight: 1.2,
                    }}
                  >
                    {displayName}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#3182F6',
                      fontFamily: 'monospace',
                    }}
                  >
                    {handle}
                  </div>
                </div>
              </div>

              {/* 자기소개 (Bio) */}
              <div
                style={{
                  display: 'flex',
                  fontSize: '18px',
                  fontWeight: 500,
                  color: '#4E5968',
                  lineHeight: 1.5,
                  maxHeight: '56px',
                  overflow: 'hidden',
                }}
              >
                {bio}
              </div>

              {/* 통계 알약 배지 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#F2F4F6',
                    border: '1px solid #E5E8EB',
                  }}
                >
                  <span style={{ fontSize: '15px' }}>🔗</span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#333D4B',
                    }}
                  >
                    {totalLinkCount > 0 ? `등록된 링크 ${totalLinkCount}개` : '공식 링크 모음'}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E8EB',
                  }}
                >
                  <span style={{ fontSize: '15px' }}>✨</span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#333D4B',
                    }}
                  >
                    모바일 프로필 최적화
                  </span>
                </div>
              </div>
            </div>

            {/* [우측 컬럼] 대표 링크 미리보기 카드 (사용자의 실제 링크 표시) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: '0 0 420px',
                gap: '10px',
                padding: '16px',
                borderRadius: '24px',
                backgroundColor: '#F9FAFB',
                border: '1.5px solid #E5E8EB',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#8B95A1',
                  letterSpacing: '0.5px',
                  marginBottom: '2px',
                  paddingLeft: '4px',
                }}
              >
                CONNECT LINKS
              </div>

              {displayLinks.map((link) => (
                <div
                  key={link.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E8EB',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{link.icon}</span>
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#191F28',
                        maxWidth: '280px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {link.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '16px', color: '#B0B8C1', fontWeight: 900 }}>
                    →
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3. 하단 푸터 ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingTop: '20px',
              borderTop: '1px solid #F2F4F6',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#333D4B' }}>
                {displayName} 님의 공식 프로필
              </span>
              <span style={{ color: '#D1D6DB' }}>·</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#8B95A1' }}>
                한눈에 확인하는 바이오링크
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: '15px',
                fontWeight: 700,
                color: '#3182F6',
                fontFamily: 'monospace',
              }}
            >
              mylink.hy/{decodedDisplayName || 'profile'}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: 'Noto Sans KR',
              data: fontData,
              style: 'normal',
              weight: 700,
            },
          ]
        : undefined,
    }
  );
}

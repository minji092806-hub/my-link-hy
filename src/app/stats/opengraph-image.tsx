import { ImageResponse } from 'next/og';
import { loadKoreanFont } from '@/lib/og-font';

export const alt = '마이링크 통계 대시보드 - 실시간 클릭 수와 링크 성과 분석';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export const revalidate = 86400; // 24시간 캐시

export default async function Image() {
  const fontData = await loadKoreanFont();

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
          padding: '40px',
          fontFamily: fontData ? 'Noto Sans KR, sans-serif' : 'sans-serif',
        }}
      >
        {/* 배경 앰비언트 글로우 데코레이션 */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-80px',
            width: '420px',
            height: '420px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, rgba(242, 244, 246, 0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-80px',
            width: '420px',
            height: '420px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(49, 130, 246, 0.20) 0%, rgba(242, 244, 246, 0) 70%)',
          }}
        />

        {/* 메인 카드 */}
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
            padding: '48px 56px',
            position: 'relative',
          }}
        >
          {/* 상단 헤더 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: '#3182F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '22px',
                  fontWeight: 800,
                  boxShadow: '0 8px 16px rgba(49, 130, 246, 0.28)',
                }}
              >
                📊
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 900,
                    letterSpacing: '-0.5px',
                    color: '#191F28',
                  }}
                >
                  마이링크 <span style={{ color: '#3182F6' }}>통계 대시보드</span>
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#8B95A1' }}>
                  Realtime Analytics & Insights
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: '#10B981',
                }}
              />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#065F46',
                }}
              >
                실시간 데이터 집계
              </span>
            </div>
          </div>

          {/* 중앙 타이틀 & KPI 요약 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              margin: '12px 0',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div
                style={{
                  fontSize: '44px',
                  fontWeight: 900,
                  letterSpacing: '-1.2px',
                  color: '#191F28',
                  lineHeight: 1.2,
                }}
              >
                어떤 링크가 가장 사랑받았을까요?
              </div>
              <span
                style={{
                  fontSize: '19px',
                  fontWeight: 500,
                  color: '#4E5968',
                }}
              >
                방문자 클릭 추이와 카테고리별 유입 비중을 직관적인 차트로 확인하세요.
              </span>
            </div>

            {/* KPI 카드 3개 */}
            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px 24px',
                  borderRadius: '20px',
                  backgroundColor: '#E8F3FF',
                  border: '1.5px solid #BFDBFE',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1B64DA' }}>
                  누적 클릭 분석
                </span>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    color: '#191F28',
                    marginTop: '4px',
                  }}
                >
                  실시간 집계 <span style={{ color: '#3182F6', fontSize: '18px' }}>⚡</span>
                </span>
              </div>

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px 24px',
                  borderRadius: '20px',
                  backgroundColor: '#F9FAFB',
                  border: '1.5px solid #E5E8EB',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#6B7684' }}>
                  카테고리별 비중
                </span>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    color: '#191F28',
                    marginTop: '4px',
                  }}
                >
                  작품 · SNS · 스토어
                </span>
              </div>

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px 24px',
                  borderRadius: '20px',
                  backgroundColor: '#F9FAFB',
                  border: '1.5px solid #E5E8EB',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#6B7684' }}>
                  인기 순위 TOP
                </span>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    color: '#191F28',
                    marginTop: '4px',
                  }}
                >
                  1위 ~ 8위 랭킹
                </span>
              </div>
            </div>
          </div>

          {/* 하단 푸터 */}
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
                마이링크 대시보드
              </span>
              <span style={{ color: '#D1D6DB' }}>·</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#8B95A1' }}>
                Toss Design System 스타일
              </span>
            </div>

            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#8B95A1',
                fontFamily: 'monospace',
              }}
            >
              mylink.hy/stats
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

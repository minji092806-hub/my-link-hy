import { ImageResponse } from 'next/og';
import { loadKoreanFont } from '@/lib/og-font';

export const alt = '마이링크 (My Link) - 나의 모든 링크를 단 하나의 페이지로';
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
          backgroundColor: '#FFFFFF',
          position: 'relative',
          padding: '48px 64px',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: fontData ? 'Noto Sans KR, sans-serif' : 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* 랜딩 히어로 배경 은은한 오라(Aura) 그라디언트 블러 */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            left: '100px',
            width: '600px',
            height: '600px',
            borderRadius: '9999px',
            background:
              'radial-gradient(circle, rgba(59, 130, 246, 0.16) 0%, rgba(147, 197, 253, 0.12) 40%, rgba(255, 255, 255, 0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-160px',
            right: '250px',
            width: '500px',
            height: '500px',
            borderRadius: '9999px',
            background:
              'radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, rgba(224, 231, 255, 0.08) 50%, rgba(255, 255, 255, 0) 70%)',
          }}
        />

        {/* ─── [좌측 컬럼] 랜딩 히어로 콘텐츠 (폭 610px) ─── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '610px',
          }}
        >
          {/* 1. 상단 뱃지 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              alignSelf: 'flex-start',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '9999px',
                backgroundColor: '#2563EB',
              }}
            />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#2563EB',
                letterSpacing: '-0.2px',
              }}
            >
              크리에이터 & 모두를 위한 단 하나의 프로필 링크
            </span>
          </div>

          {/* 2. 볼드 메인 헤드라인 (히어로 타이틀) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '54px',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-1.8px',
              color: '#0A0A0A',
            }}
          >
            <span>나의 모든 링크를</span>
            <span
              style={{
                marginTop: '6px',
                color: '#2563EB',
              }}
            >
              단 하나의 페이지로
            </span>
          </div>

          {/* 3. 서브 카피 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '16px',
              fontSize: '18px',
              fontWeight: 500,
              color: '#525252',
              lineHeight: 1.5,
              letterSpacing: '-0.3px',
            }}
          >
            <span>포트폴리오, 인스타툰, 스마트스토어, 문의 채널까지.</span>
            <span>흩어진 내 작업들을 하나의 링크로 모아 연결하세요.</span>
          </div>

          {/* 4. 내 링크 주소 선점하기(Claim Handle) 바 모형 */}
          <div
            style={{
              marginTop: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '450px',
              padding: '6px 8px 6px 16px',
              borderRadius: '18px',
              backgroundColor: '#F9FAFB',
              border: '2px solid #BFDBFE',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#64748B',
                  fontFamily: 'monospace',
                }}
              >
                mylink.hy/@
              </span>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#0F172A',
                }}
              >
                내아이디
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '12px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              }}
            >
              <span>주소 만들기</span>
              <span style={{ fontSize: '13px' }}>→</span>
            </div>
          </div>

          {/* 5. 신뢰 포인트 (체크리스트) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginTop: '26px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#525252',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '9999px',
                  backgroundColor: '#DBEAFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span>100% 무료 제공</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '9999px',
                  backgroundColor: '#DBEAFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span>링크 개수 무제한</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '9999px',
                  backgroundColor: '#DBEAFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span>실시간 클릭 분석</span>
            </div>
          </div>
        </div>

        {/* ─── [우측 컬럼] 랜딩 히어로 인터랙티브 스마트폰 목업 (폭 340px) ─── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '380px',
          }}
        >
          {/* 스마트폰 기기 프레임 */}
          <div
            style={{
              width: '330px',
              height: '520px',
              borderRadius: '42px',
              border: '9px solid #171717',
              backgroundColor: '#0A0A0A',
              padding: '6px',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* 상단 다이내믹 아일랜드 스피커 바 */}
            <div
              style={{
                width: '84px',
                height: '14px',
                borderRadius: '9999px',
                backgroundColor: '#171717',
                alignSelf: 'center',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '6px',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '9999px',
                  backgroundColor: '#0A0A0A',
                }}
              />
            </div>

            {/* 폰 스크린 내부 */}
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '32px',
                backgroundColor: '#F8FAFC',
                padding: '16px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* 상단 상태표시줄 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#94A3B8',
                  padding: '0 4px',
                  marginBottom: '6px',
                }}
              >
                <span>09:41</span>
                <span style={{ fontSize: '9px' }}>5G 🔋</span>
              </div>

              {/* 프로필 정보 (Mylink) */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {/* 아바타 */}
                <div
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)',
                    marginBottom: '8px',
                  }}
                >
                  🔗
                </div>

                {/* 이름 & PRO 뱃지 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '17px',
                      fontWeight: 900,
                      color: '#0F172A',
                      letterSpacing: '-0.3px',
                    }}
                  >
                    Mylink
                  </span>
                  <div
                    style={{
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      fontSize: '9px',
                      fontWeight: 900,
                    }}
                  >
                    PRO
                  </div>
                </div>

                {/* 핸들 ID */}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#64748B',
                    fontFamily: 'monospace',
                    marginTop: '2px',
                  }}
                >
                  @mylink
                </span>

                {/* 소개 문구 */}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#64748B',
                    marginTop: '4px',
                    lineHeight: 1.35,
                    maxWidth: '220px',
                  }}
                >
                  마이링크로 연결되는 나만의 프로필 공간이에요 ✨
                </span>
              </div>

              {/* 카테고리 칩 탭 바 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  margin: '10px 0',
                }}
              >
                <div
                  style={{
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 800,
                  }}
                >
                  전체
                </div>
                <div
                  style={{
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    color: '#64748B',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  작품
                </div>
                <div
                  style={{
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    color: '#64748B',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  SNS
                </div>
                <div
                  style={{
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    color: '#64748B',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  스토어
                </div>
              </div>

              {/* 링크 카드 리스트 3개 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px' }}>📗</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                      공식 웹툰 연재작
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 900 }}>→</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px' }}>📷</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                      공식 인스타그램
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 900 }}>→</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px' }}>🛍️</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                      굿즈 스마트스토어
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 900 }}>→</span>
                </div>
              </div>

              {/* 폰 하단 홈 바 */}
              <div
                style={{
                  width: '90px',
                  height: '4px',
                  borderRadius: '9999px',
                  backgroundColor: '#CBD5E1',
                  alignSelf: 'center',
                  marginTop: '10px',
                }}
              />
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

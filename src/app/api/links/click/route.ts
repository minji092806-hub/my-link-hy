import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

/**
 * POST /api/links/click
 * 서버 측 안전한 링크 클릭 카운트 증가 API Route
 * - Firestore 'users/{userId}/links/{linkId}' 문서의 'clickCount' 필드를 원자적으로(atomic) 1 증가
 * - 동시 요청(Concurrent clicks) 시에도 레이스 컨디션 없이 안전하게 카운트
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, linkId } = body;

    // 1. 유효성 검증 및 로그인 확인
    if (!userId || typeof userId !== 'string' || userId.trim() === '' || userId === 'anonymous') {
      const errorMsg = '[API /api/links/click] 로그인 확인 실패: 유효한 userId가 제공되지 않았습니다.';
      console.error(errorMsg);
      return NextResponse.json(
        { success: false, error: 'Unauthorized or invalid userId' },
        { status: 401 }
      );
    }

    if (!linkId || typeof linkId !== 'string' || linkId.trim() === '') {
      const errorMsg = '[API /api/links/click] 요청 에러: linkId가 누락되었습니다.';
      console.error(errorMsg);
      return NextResponse.json(
        { success: false, error: 'linkId is required' },
        { status: 400 }
      );
    }

    // 2. Firestore 문서 참조: users/{userId}/links/{linkId}
    const linkDocRef = doc(db, 'users', userId.trim(), 'links', linkId.trim());

    // 3. 서버 측 원자적(Atomic) clickCount 증가 처리
    await updateDoc(linkDocRef, {
      clickCount: increment(1),
      updatedAt: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: `Link ${linkId} click count incremented successfully`,
    });
  } catch (error: unknown) {
    const errorMsg = `[API /api/links/click] Firestore 클릭 카운트 저장 실패:`;
    console.error(errorMsg, error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment click count' },
      { status: 500 }
    );
  }
}

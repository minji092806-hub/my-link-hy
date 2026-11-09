import fs from 'node:fs';
import path from 'node:path';

/**
 * Open Graph(OG) 이미지 생성 시 한글 폰트(Noto Sans KR Bold)를 로컬 파일에서
 * 초고속으로 읽어오고 메모리에 캐시하는 유틸리티
 */

let fontCache: ArrayBuffer | null = null;

// 로컬 폰트 파일 경로
const LOCAL_FONT_PATH = path.join(process.cwd(), 'public', 'fonts', 'NotoSansKR-Bold.ttf');

export async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  if (fontCache) return fontCache;

  try {
    // 1. 로컬 파일 시스템에서 직접 읽기 (0ms 지연, 외부 네트워크 무의존)
    if (fs.existsSync(LOCAL_FONT_PATH)) {
      const buffer = fs.readFileSync(LOCAL_FONT_PATH);
      fontCache = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      );
      return fontCache;
    }
  } catch (err) {
    console.warn('[OG Font] 로컬 폰트 파일 읽기 실패, 외부 CDN 시도:', err);
  }

  // 2. 만약 로컬 파일이 없는 예외 상황 대비 CDN Fallback
  try {
    const res = await fetch(
      'https://fonts.gstatic.com/s/notosanskr/v40/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzg01eLQ.ttf'
    );
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    fontCache = arrayBuffer;
    return fontCache;
  } catch (error) {
    console.warn('[OG Font] 폰트 로드 실패, 기본 시스템 폰트로 폴백:', error);
    return null;
  }
}

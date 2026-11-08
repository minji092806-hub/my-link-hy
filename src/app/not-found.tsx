'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  ArrowLeft, 
  Compass, 
  Search, 
  Sparkles, 
  HelpCircle,
  Link2Off,
  ChevronRight
} from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4 py-12 selection:bg-blue-500 selection:text-white">
      {/* ── 배경 앰비언트 글로우 및 그리드 장식 ── */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-60 dark:opacity-40"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-blue-400/20 via-indigo-300/15 to-transparent blur-3xl animate-pulse duration-1000" />
        <div className="absolute -bottom-32 left-1/3 w-[460px] h-[460px] rounded-full bg-gradient-to-br from-sky-400/15 via-blue-500/10 to-transparent blur-3xl" />
      </div>

      {/* 미세 그리드 배경 패턴 */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-70"
      />

      {/* ── 메인 콘텐츠 컨테이너 ── */}
      <main className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
        {/* 상단 뱃지 */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 shadow-xs mb-6 animate-in fade-in zoom-in-95 duration-500">
          <Sparkles className="size-3.5 text-blue-500 animate-spin-slow" />
          <span>페이지를 찾을 수 없습니다</span>
        </div>

        {/* 대형 404 그래픽 비주얼 */}
        <div className="relative flex items-center justify-center select-none my-2">
          {/* 부드러운 백그라운드 섀도우 */}
          <span 
            className="text-[6.5rem] sm:text-[9rem] font-black tracking-tighter leading-none bg-gradient-to-b from-blue-600 via-indigo-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm flex items-center justify-center"
          >
            4
            <span className="relative inline-flex items-center justify-center mx-1 sm:mx-2 size-20 sm:size-28 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/25 ring-4 ring-white dark:ring-background transform hover:rotate-6 transition-transform duration-300">
              <Link2Off className="size-10 sm:size-14 stroke-[2.2] animate-bounce duration-1000" />
            </span>
            4
          </span>
        </div>

        {/* 헤드라인 타이틀 */}
        <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground break-keep">
          길을 잃으셨나요?
        </h1>

        {/* 친절한 서브 설명문 */}
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed break-keep max-w-md">
          요청하신 페이지가 사라졌거나, 잘못된 주소로 연결되었어요.<br className="hidden sm:inline" /> 
          입력하신 주소가 정확한지 다시 한번 확인해 주세요.
        </p>

        {/* 친절한 원인 가이드 박스 */}
        <div className="mt-6 w-full rounded-2xl bg-card/70 dark:bg-card/40 backdrop-blur-md border border-border/80 p-4 text-left shadow-xs transition-all hover:border-blue-200 dark:hover:border-blue-900/60">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-2.5">
            <HelpCircle className="size-4 text-blue-500 shrink-0" />
            <span>이런 이유일 수 있어요</span>
          </div>
          <ul className="text-xs sm:text-[13px] text-muted-foreground space-y-1.5 pl-6 list-disc leading-relaxed">
            <li>프로필 아이디(<code className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1 py-0.5 rounded">@username</code>)의 철자가 틀렸을 수 있습니다.</li>
            <li>작성자가 링크를 삭제했거나 비공개로 변경했을 수 있습니다.</li>
          </ul>
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full">
          <Button 
            onClick={handleGoBack}
            variant="outline"
            className="w-full sm:flex-1 h-12 rounded-xl text-sm font-semibold border-border/90 hover:bg-muted/70 active:scale-[0.98] transition-all gap-2"
          >
            <ArrowLeft className="size-4" />
            <span>이전 페이지로</span>
          </Button>

          <Link href="/" className="w-full sm:flex-1">
            <Button 
              className="w-full h-12 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all gap-2"
            >
              <Home className="size-4" />
              <span>홈으로 돌아가기</span>
            </Button>
          </Link>
        </div>

        {/* 추천 바로가기 탐색 */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>나만의 링크 페이지를 만들고 싶으신가요?</span>
          <Link 
            href="/" 
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
          >
            시작하기
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </main>

      {/* ── 하단 카피라이트 푸터 ── */}
      <footer className="mt-12 text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <div className="size-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-black">
            M
          </div>
          <span>My Link</span>
          <span className="text-muted-foreground/50">•</span>
          <span className="text-[11px] font-normal text-muted-foreground/80">세상의 모든 나를 잇다</span>
        </Link>
      </footer>
    </div>
  );
}

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Link2,
  BarChart2,
  Sliders,
  ArrowRight,
  Loader2,
  ExternalLink,
  Shield,
  Smartphone,
  Check,
} from 'lucide-react';
import { DUMMY_LINKS } from '@/data/links';

/**
 * Google 공식 브랜드 아이콘 SVG (단정하고 깔끔함)
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

interface MyLinkIntroProps {
  onLogin: () => void;
  isLoggingIn: boolean;
}

export function MyLinkIntro({ onLogin, isLoggingIn }: MyLinkIntroProps) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* ─── 상단 헤더 ─── */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Link2 className="size-4" />
            </div>
            <span className="text-lg font-black tracking-tight text-neutral-950">
              마이링크
            </span>
          </div>

          <Button
            onClick={onLogin}
            disabled={isLoggingIn}
            className="h-9 rounded-full text-xs font-bold gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 cursor-pointer shadow-xs transition-all"
          >
            {isLoggingIn ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>Google 로그인</span>
          </Button>
        </div>
      </header>

      {/* ─── 첫 화면 (HERO): 큰 글씨 & 볼드체 & 프라이머리 컬러 ─── */}
      <section className="relative px-5 pt-16 pb-20 sm:pt-28 sm:pb-28 text-center bg-white border-b border-neutral-200/80">
        <div className="mx-auto max-w-3xl">
          {/* 상단 레이블 */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 mb-6 border border-blue-200/60">
            <span>단 하나의 프로필 링크</span>
          </div>

          {/* 메인 큰 글씨 타이틀 (2픽셀 도톰한 볼드체 + 프라이머리 컬러) */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15]"
            style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}
          >
            <span
              className="block text-neutral-950"
              style={{ fontWeight: 900, WebkitTextStroke: '0.45px #0a0a0a' }}
            >
              나의 모든 링크를
            </span>
            <span
              className="block text-blue-600 mt-1.5 sm:mt-2"
              style={{ fontWeight: 900, WebkitTextStroke: '0.45px #2563EB' }}
            >
              하나의 페이지로
            </span>
          </h1>

          {/* 간결한 2줄 서브 텍스트 */}
          <p className="mt-7 text-base sm:text-xl font-bold text-neutral-600 max-w-xl mx-auto leading-relaxed">
            SNS, 포트폴리오, 블로그, 문의 채널까지. <br className="hidden sm:inline" />
            링크 하나로 나를 온전히 보여주세요.
          </p>

          {/* 큰 시작 버튼 */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={onLogin}
              disabled={isLoggingIn}
              className="h-13 w-full sm:w-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base px-8 shadow-md shadow-blue-600/20 gap-2.5 cursor-pointer transition-all hover:scale-[1.01]"
            >
              {isLoggingIn ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              <span>Google로 3초 만에 시작하기</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>

          {/* 신뢰 포인트 */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs font-semibold text-neutral-500">
            <span>무료 이용</span>
            <span className="text-neutral-300">•</span>
            <span>별도 가입 없음</span>
            <span className="text-neutral-300">•</span>
            <span>모바일 최적화</span>
          </div>
        </div>
      </section>

      {/* ─── 핵심 요약 (3단 그리드 - 짧고 간결함) ─── */}
      <section className="py-16 sm:py-20 px-5 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950"
              style={{ fontWeight: 900, WebkitTextStroke: '0.45px #0a0a0a' }}
            >
              마이링크가 필요한 이유
            </h2>
            <p className="mt-2 text-sm sm:text-base font-normal text-neutral-500 break-keep leading-relaxed">
              인스타그램이나 SNS 프로필에 <br className="hidden xs:inline" />
              링크 하나만 올려두면 충분합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <Card className="p-6 border-neutral-200 bg-white shadow-xs flex flex-col">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 font-bold">
                <Link2 className="size-5" />
              </div>
              <h3 className="text-lg font-extrabold text-neutral-950 mb-2">
                모든 링크 통합
              </h3>
              <p className="text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                인스타그램, 유튜브, 스토어 등 <br />
                흩어진 링크를 한 페이지에 모읍니다.
              </p>
            </Card>

            {/* Card 2 */}
            <Card className="p-6 border-neutral-200 bg-white shadow-xs flex flex-col">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 font-bold">
                <BarChart2 className="size-5" />
              </div>
              <h3 className="text-lg font-extrabold text-neutral-950 mb-2">
                실시간 통계
              </h3>
              <p className="text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                방문자 수와 각 링크의 클릭 수를 <br />
                실시간으로 집계해 보여줍니다.
              </p>
            </Card>

            {/* Card 3 */}
            <Card className="p-6 border-neutral-200 bg-white shadow-xs flex flex-col">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 font-bold">
                <Sliders className="size-5" />
              </div>
              <h3 className="text-lg font-extrabold text-neutral-950 mb-2">
                손쉬운 실시간 편집
              </h3>
              <p className="text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                로그인 후 모바일에서도 <br />
                몇 초 만에 링크를 추가하고 수정합니다.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── 이용 방법 3단계 ─── */}
      <section className="py-14 bg-white border-y border-neutral-200/80 px-5 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2
              className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950"
              style={{ fontWeight: 900, WebkitTextStroke: '0.45px #0a0a0a' }}
            >
              간단한 이용 방법
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-black shadow-xs">
                1
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-neutral-950">Google 로그인</h4>
                <p className="mt-1 text-xs sm:text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                  클릭 한 번으로 <br />
                  나만의 클라우드 저장소가 생성됩니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-black shadow-xs">
                2
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-neutral-950">링크 등록</h4>
                <p className="mt-1 text-xs sm:text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                  보여주고 싶은 사이트 이름과 <br />
                  URL을 입력해 추가합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-black shadow-xs">
                3
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-neutral-950">프로필 공유</h4>
                <p className="mt-1 text-xs sm:text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                  완성된 링크 주소를 복사해 <br />
                  인스타그램 소개란에 등록합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 미리보기 (간결하고 정갈한 폰 목업) ─── */}
      <section className="py-16 sm:py-20 px-5 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-center mb-10">
            <h2
              className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 mb-2"
              style={{ fontWeight: 900, WebkitTextStroke: '0.45px #0a0a0a' }}
            >
              완성된 프로필 화면
            </h2>
            <p className="text-sm sm:text-base font-normal text-neutral-500 mb-8 break-keep leading-relaxed">
              방문자에게 이렇게 깔끔한 <br className="xs:hidden" />
              모바일 화면으로 보여집니다.
            </p>
          </div>

          <div className="mx-auto max-w-[360px] rounded-3xl border border-neutral-300 bg-white p-5 shadow-sm text-left">
            {/* 프로필 정보 */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-neutral-100">
              <div className="size-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-base font-black shadow-md shadow-blue-500/20 mb-2">
                MY
              </div>
              <h4 className="text-base font-extrabold text-neutral-950">마이 링크</h4>
              <p className="text-xs text-neutral-400 font-mono">@my_llink</p>
              <p className="mt-2 text-xs font-normal text-neutral-500 leading-relaxed max-w-[240px] break-keep">
                나만의 모든 작업과 소셜 채널을 <br />
                한곳에 모은 마이링크입니다.
              </p>
            </div>

            {/* 샘플 링크 카드들 (단정하고 텍스트 중심) */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
                <span className="text-xs font-bold text-neutral-900">인스타그램</span>
                <ExternalLink className="size-3.5 text-neutral-400" />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
                <span className="text-xs font-bold text-neutral-900">포트폴리오 & 작품 보기</span>
                <ExternalLink className="size-3.5 text-neutral-400" />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
                <span className="text-xs font-bold text-neutral-900">굿즈 스토어 바로가기</span>
                <ExternalLink className="size-3.5 text-neutral-400" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 text-center">
              <span className="text-xs font-medium text-neutral-500 break-keep">
                로그인하면 내 링크를 바로 채울 수 있습니다.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 하단 액션 배너 (CTA): 프라이머리 컬러 배경 ─── */}
      <section className="py-16 px-5 sm:px-8 bg-blue-600 text-white text-center">
        <div className="mx-auto max-w-xl">
          <h2
            className="text-2xl sm:text-4xl font-black tracking-tight text-white break-keep leading-tight"
            style={{ fontWeight: 900, WebkitTextStroke: '0.45px #ffffff' }}
          >
            지금 나만의 링크를 <br className="hidden xs:inline" />
            만들어보세요
          </h2>
          <p className="mt-3 text-sm sm:text-base font-normal text-blue-100 break-keep leading-relaxed">
            복잡한 설정 없이 <br className="xs:hidden" />
            3초 만에 바로 완성됩니다.
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={onLogin}
              disabled={isLoggingIn}
              className="h-12 rounded-full bg-white text-blue-600 hover:bg-blue-50 font-black text-sm px-8 gap-2 cursor-pointer shadow-lg shadow-blue-800/20 transition-all hover:scale-[1.02]"
            >
              {isLoggingIn ? (
                <Loader2 className="size-4 animate-spin text-blue-600" />
              ) : (
                <GoogleIcon />
              )}
              <span>Google 계정으로 시작하기</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 푸터 ─── */}
      <footer className="py-6 bg-white border-t border-neutral-200 text-center text-xs text-neutral-500">
        <p>© 2026 마이링크 (My Link) • All rights reserved.</p>
      </footer>
    </div>
  );
}

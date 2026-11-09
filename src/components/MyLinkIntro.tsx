'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Link2,
  BarChart3,
  Smartphone,
  Check,
  ArrowRight,
  Palette,
  Zap,
  ShoppingBag,
  GraduationCap,
  Music,
  Share2,
  MousePointerClick,
  Compass,
} from 'lucide-react';

/**
 * Google 공식 브랜드 아이콘 SVG
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

// 폰 목업 테마 타입 및 데이터
type PhoneTheme = 'blue' | 'purple' | 'dark' | 'emerald';

interface ThemeConfig {
  id: PhoneTheme;
  name: string;
  badgeBg: string;
  phoneBg: string;
  headerAccent: string;
  avatarBg: string;
  cardBg: string;
  cardBorder: string;
  cardHover: string;
  textColor: string;
  subtextColor: string;
  accentColor: string;
}

const THEMES: Record<PhoneTheme, ThemeConfig> = {
  blue: {
    id: 'blue',
    name: '시그니처 블루',
    badgeBg: 'bg-blue-600',
    phoneBg: 'bg-gradient-to-b from-blue-50/70 via-white to-sky-50/50',
    headerAccent: 'text-blue-600',
    avatarBg: 'bg-gradient-to-tr from-blue-600 to-sky-400 text-white',
    cardBg: 'bg-white/90',
    cardBorder: 'border-blue-100 hover:border-blue-300',
    cardHover: 'hover:bg-blue-50/50 hover:shadow-md hover:shadow-blue-500/10',
    textColor: 'text-neutral-900',
    subtextColor: 'text-neutral-500',
    accentColor: '#2563EB',
  },
  purple: {
    id: 'purple',
    name: '파스텔 바이올렛',
    badgeBg: 'bg-purple-600',
    phoneBg: 'bg-gradient-to-b from-purple-50/80 via-white to-pink-50/40',
    headerAccent: 'text-purple-600',
    avatarBg: 'bg-gradient-to-tr from-purple-600 to-pink-400 text-white',
    cardBg: 'bg-white/90',
    cardBorder: 'border-purple-100 hover:border-purple-300',
    cardHover: 'hover:bg-purple-50/50 hover:shadow-md hover:shadow-purple-500/10',
    textColor: 'text-neutral-900',
    subtextColor: 'text-neutral-500',
    accentColor: '#9333EA',
  },
  dark: {
    id: 'dark',
    name: '시크 다크',
    badgeBg: 'bg-neutral-800',
    phoneBg: 'bg-gradient-to-b from-neutral-900 via-neutral-950 to-black',
    headerAccent: 'text-neutral-100',
    avatarBg: 'bg-gradient-to-tr from-neutral-700 to-neutral-800 text-white border border-neutral-700',
    cardBg: 'bg-neutral-900/90',
    cardBorder: 'border-neutral-800 hover:border-neutral-700',
    cardHover: 'hover:bg-neutral-800 hover:shadow-md hover:shadow-black/50',
    textColor: 'text-white',
    subtextColor: 'text-neutral-400',
    accentColor: '#38BDF8',
  },
  emerald: {
    id: 'emerald',
    name: '내추럴 포레스트',
    badgeBg: 'bg-emerald-600',
    phoneBg: 'bg-gradient-to-b from-emerald-50/80 via-white to-teal-50/40',
    headerAccent: 'text-emerald-700',
    avatarBg: 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white',
    cardBg: 'bg-white/90',
    cardBorder: 'border-emerald-100 hover:border-emerald-300',
    cardHover: 'hover:bg-emerald-50/50 hover:shadow-md hover:shadow-emerald-500/10',
    textColor: 'text-neutral-900',
    subtextColor: 'text-neutral-500',
    accentColor: '#059669',
  },
};

// 폰 목업 링크 데이터 (사용자: Mylink)
interface MockLink {
  id: string;
  category: 'work' | 'sns' | 'shop';
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
  clicks: number;
}

const INITIAL_MOCK_LINKS: MockLink[] = [
  {
    id: '1',
    category: 'work',
    title: '포트폴리오 & 최신 프로젝트',
    subtitle: '노션 및 작업물 아카이브 바로가기',
    icon: '📁',
    badge: '인기',
    clicks: 1420,
  },
  {
    id: '2',
    category: 'sns',
    title: '공식 인스타그램 @mylink',
    subtitle: '새로운 소식과 일상 둘러보기',
    icon: '📸',
    badge: 'NEW',
    clicks: 890,
  },
  {
    id: '3',
    category: 'shop',
    title: '공식 온라인 굿즈 스토어',
    subtitle: '스마트스토어 기획전 및 마켓',
    icon: '🛍️',
    clicks: 654,
  },
  {
    id: '4',
    category: 'work',
    title: '블로그 & 뉴스레터 아카이브',
    subtitle: '생각과 이야기를 기록하는 공간',
    icon: '📝',
    clicks: 412,
  },
];

// 페르소나 데이터 (한양여대 관련 내용 제거 -> 일반 대학생 및 크리에이터)
interface PersonaCase {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  tag: string;
  features: string[];
  sampleLinks: { title: string; category: string; tag: string }[];
}

const PERSONA_CASES: PersonaCase[] = [
  {
    id: 'artist',
    title: '웹툰 / 일러스트 작가',
    icon: <Palette className="size-4" />,
    tag: '크리에이터 추천',
    subtitle: '연재처, 포트폴리오, 팬아트, 굿즈 샵을 하나로 묶어 SNS 바이오에 걸어보세요.',
    features: ['포트폴리오 노션 & 비핸스 연동', '통판 마켓 & 스마트스토어 링크', '인스타툰 & 외주 문의 메일함'],
    sampleLinks: [
      { title: '매주 목요 웹툰 바로보기', category: '연재', tag: 'HIT' },
      { title: '2026 통판 굿즈 마켓', category: '스토어', tag: '신상' },
      { title: '캐릭터 포트폴리오 (PDF)', category: '포트폴리오', tag: '외주문의' },
    ],
  },
  {
    id: 'student',
    title: '대학생 & 취준생',
    icon: <GraduationCap className="size-4" />,
    tag: '학생 필수템',
    subtitle: '과제전 작품 링크, 깃허브, 이력서, 링크드인을 프로필 한 줄로 스마트하게 공유하세요.',
    features: ['졸업작품전 & 프로젝트 영상 연동', '노션 포트폴리오 & 깃허브 링크', '이메일 & 오픈프로필 문의'],
    sampleLinks: [
      { title: '2026 프로젝트 포트폴리오 웹사이트', category: '작품', tag: 'Live' },
      { title: '디자이너 포트폴리오 (Notion)', category: '이력서', tag: 'CV' },
      { title: 'GitHub & 프로젝트 소스코드', category: '개발', tag: 'Repo' },
    ],
  },
  {
    id: 'seller',
    title: '스마트스토어 & 마켓 셀러',
    icon: <ShoppingBag className="size-4" />,
    tag: '매출 2배 상승',
    subtitle: '인스타 릴스 보고 온 고객에게 신상 링크, 베스트셀러, CS 채널을 즉시 안내하세요.',
    features: ['실시간 링크별 유입 클릭수 추적', '카카오톡 1:1 상담 채널 바로가기', '쿠폰 및 이벤트 페이지 연결'],
    sampleLinks: [
      { title: '오늘만 전품목 15% 할인 기획전', category: '스토어', tag: '쿠폰' },
      { title: '실시간 주문제작 문의 (카카오톡)', category: '상담', tag: '빠른응답' },
      { title: '스마트스토어 공식몰 바로가기', category: '공식몰', tag: '인기' },
    ],
  },
  {
    id: 'creator',
    title: '유튜버 & 콘텐츠 크리에이터',
    icon: <Music className="size-4" />,
    tag: '팬덤 연결',
    subtitle: '유튜브 채널, 라이브 스트리밍, 팬카페, 후원 채널을 팬들에게 한 번에 전달하세요.',
    features: ['최신 영상 및 릴스 다이렉트 연결', '팬 소통 디스코드 & 카페 링크', '비즈니스 협찬 문의 채널'],
    sampleLinks: [
      { title: '최신 유튜브 브이로그 시청하기', category: '영상', tag: 'NEW' },
      { title: '팬 전용 디스코드 커뮤니티', category: '커뮤니티', tag: '소통' },
      { title: '비즈니스 광고/협찬 문의', category: '비즈니스', tag: 'Mail' },
    ],
  },
];

interface MyLinkIntroProps {
  onLogin: () => void;
  isLoggingIn: boolean;
  onExploreDemo?: () => void;
}

export function MyLinkIntro({ onLogin, isLoggingIn, onExploreDemo }: MyLinkIntroProps) {
  // 1. 핸들 선점 인터랙션 상태
  const [handleInput, setHandleInput] = useState('');
  const [handleStatus, setHandleStatus] = useState<string | null>(null);

  // 2. 폰 목업 인터랙션 상태
  const [activeTheme, setActiveTheme] = useState<PhoneTheme>('blue');
  const [mockCategory, setMockCategory] = useState<'all' | 'work' | 'sns' | 'shop'>('all');
  const [mockLinks, setMockLinks] = useState<MockLink[]>(INITIAL_MOCK_LINKS);
  const [clickedFeedback, setClickedFeedback] = useState<string | null>(null);

  // 3. 페르소나 탭 상태
  const [activePersona, setActivePersona] = useState<string>('artist');

  // 핸들 타이핑 핸들러
  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, '');
    setHandleInput(val);
    if (val.length >= 2) {
      setHandleStatus(`✨ @${val} 주소는 지금 바로 사용할 수 있어요!`);
    } else {
      setHandleStatus(null);
    }
  };

  // 폰 목업 내부 링크 클릭 체험
  const handleMockLinkClick = (id: string, title: string) => {
    setMockLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, clicks: l.clicks + 1 } : l))
    );
    setClickedFeedback(`🎉 "${title}" 클릭 수 +1 증가!`);
    setTimeout(() => {
      setClickedFeedback(null);
    }, 2000);
  };

  // 필터링된 폰 목업 링크
  const filteredMockLinks = mockLinks.filter(
    (l) => mockCategory === 'all' || l.category === mockCategory
  );

  const curTheme = THEMES[activeTheme];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-neutral-900 antialiased selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
      {/* ─── 1. 상단 GNB 네비게이션 헤더 ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/85 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* 좌측 로고 */}
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/25">
              <Link2 className="size-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-neutral-950">
                마이링크
              </span>
              <Badge
                variant="secondary"
                className="hidden sm:inline-flex rounded-md bg-blue-50 text-[10px] font-extrabold text-blue-600 border border-blue-200/60 px-1.5 py-0"
              >
                PRO
              </Badge>
            </div>
          </div>

          {/* 중앙 네비 링크 (데스크톱 전용) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-neutral-600">
            <a
              href="#playground"
              className="hover:text-blue-600 transition-colors"
            >
              라이브 체험
            </a>
            <a
              href="#features"
              className="hover:text-blue-600 transition-colors"
            >
              주요 기능
            </a>
            <a
              href="#personas"
              className="hover:text-blue-600 transition-colors"
            >
              활용 사례
            </a>
          </nav>

          {/* 우측 액션 버튼들 */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onExploreDemo && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExploreDemo}
                className="hidden xs:flex h-9 rounded-full text-xs font-bold gap-1.5 border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 px-3.5 cursor-pointer shadow-xs transition-all"
              >
                <Compass className="size-3.5 text-blue-600" />
                <span>샘플 둘러보기</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={onLogin}
              disabled={isLoggingIn}
              className="h-9 rounded-full text-xs font-bold gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 cursor-pointer shadow-sm shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <GoogleIcon />
              <span>로그인 시작</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ─── 2. 메인 HERO 섹션 (반응형 2-Column: 좌측 카피 & 선점, 우측 인터랙티브 폰) ─── */}
      <section
        id="playground"
        className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/80 bg-white overflow-hidden"
      >
        {/* 부드러운 배경 오라(Aura) 그라디언트 효과 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] sm:size-[800px] rounded-full bg-gradient-to-tr from-blue-400/15 via-sky-300/10 to-indigo-300/15 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* 좌측 콘텐츠 (7 Cols) */}
            <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
              {/* 상단 뱃지 */}
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-600 mb-6 border border-blue-200/70 shadow-xs">
                <span className="flex size-2 rounded-full bg-blue-600 animate-pulse" />
                <span>크리에이터 & 모두를 위한 단 하나의 프로필 링크</span>
              </div>

              {/* 볼드 메인 헤드라인 */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] sm:leading-[1.18] text-neutral-950">
                <span className="block">나의 모든 링크를</span>
                <span className="block mt-2 sm:mt-3 bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                  단 하나의 감각적인 페이지로
                </span>
              </h1>

              {/* 서브 카피 */}
              <p className="mt-6 text-base sm:text-lg font-medium text-neutral-600 max-w-xl leading-relaxed break-keep">
                포트폴리오, 인스타툰, 스마트스토어, 문의 채널까지. <br className="hidden sm:inline" />
                흩어진 내 작업들을 하나의 링크로 모아 팬과 고객에게 연결하세요.
              </p>

              {/* ⚡ 인터랙티브 기능: 내 링크 주소 선점하기 (Claim Handle) */}
              <div className="mt-8 w-full max-w-md">
                <div className="relative flex items-center rounded-2xl border-2 border-blue-200 bg-neutral-50/80 p-1.5 shadow-sm focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                  <div className="flex items-center pl-3 pr-1 text-xs sm:text-sm font-extrabold text-neutral-500 font-mono select-none">
                    mylink.hy/@
                  </div>
                  <input
                    type="text"
                    value={handleInput}
                    onChange={handleHandleChange}
                    placeholder="내아이디입력"
                    maxLength={20}
                    className="flex-1 bg-transparent px-1 py-2 text-xs sm:text-sm font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden"
                  />
                  <Button
                    size="sm"
                    onClick={onLogin}
                    disabled={isLoggingIn}
                    className="shrink-0 h-9 sm:h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm px-3.5 sm:px-4 cursor-pointer shadow-xs gap-1"
                  >
                    <span>주소 만들기</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>

                {handleStatus ? (
                  <p className="mt-2 text-xs font-bold text-emerald-600 text-left pl-2 animate-in fade-in slide-in-from-top-1">
                    {handleStatus}
                  </p>
                ) : (
                  <p className="mt-2 text-[11px] font-semibold text-neutral-400 text-left pl-2">
                    💡 영문, 숫자, 밑줄(_)을 입력해 나만의 주소를 미리 확인해보세요.
                  </p>
                )}
              </div>

              {/* 퀵 액션 버튼 그룹 */}
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full">
                <Button
                  size="lg"
                  onClick={onLogin}
                  disabled={isLoggingIn}
                  className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-6 shadow-md shadow-blue-600/25 gap-2.5 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <GoogleIcon />
                  <span>Google로 3초 만에 시작</span>
                </Button>

                {onExploreDemo && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={onExploreDemo}
                    className="h-12 rounded-2xl border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 font-extrabold text-sm px-5 gap-2 cursor-pointer shadow-xs transition-all"
                  >
                    <Compass className="size-4 text-blue-600" />
                    <span>샘플 둘러보기</span>
                  </Button>
                )}
              </div>

              {/* 신뢰 포인트 */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs font-bold text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <Check className="size-4 text-blue-600 stroke-[3]" />
                  <span>100% 무료 제공</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="size-4 text-blue-600 stroke-[3]" />
                  <span>링크 개수 무제한</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="size-4 text-blue-600 stroke-[3]" />
                  <span>실시간 클릭 분석</span>
                </div>
              </div>
            </div>

            {/* 우측 인터랙티브 폰 목업 (5 Cols) - 사용자: Mylink */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              {/* 테마 스위처 칩 바 (Phone 위쪽) */}
              <div className="mb-4 flex items-center gap-1.5 rounded-full bg-neutral-100 p-1 border border-neutral-200/80 shadow-xs">
                {(['blue', 'purple', 'dark', 'emerald'] as PhoneTheme[]).map((themeKey) => {
                  const t = THEMES[themeKey];
                  const isActive = activeTheme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => setActiveTheme(themeKey)}
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-neutral-950 shadow-xs scale-105'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      <span className={`size-2.5 rounded-full ${t.badgeBg}`} />
                      <span className="hidden xs:inline">{t.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* 스마트폰 기기 프레임 */}
              <div className="relative w-full max-w-[320px] sm:max-w-[340px] rounded-[44px] border-[10px] border-neutral-900 bg-neutral-950 p-2 shadow-2xl shadow-neutral-900/40 ring-1 ring-neutral-800">
                {/* 상단 다이내믹 아일랜드 / 스피커 바 */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-neutral-900 rounded-full z-30 flex items-center justify-end px-2">
                  <span className="size-2 rounded-full bg-neutral-950/80 ring-1 ring-neutral-800" />
                </div>

                {/* 폰 스크린 내부 */}
                <div
                  className={`relative w-full rounded-[34px] overflow-hidden pt-8 pb-6 px-4 transition-all duration-300 min-h-[500px] flex flex-col justify-between ${curTheme.phoneBg}`}
                >
                  {/* 상단 상태표시줄 */}
                  <div className="flex items-center justify-between text-[10px] font-bold px-2 mb-3 text-neutral-400">
                    <span>09:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]">5G</span>
                      <div className="w-4 h-2 rounded-[3px] border border-neutral-400 flex items-center p-0.5">
                        <div className="h-full w-full bg-neutral-400 rounded-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* 프로필 정보 (사용자: Mylink) */}
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`size-16 rounded-2xl flex items-center justify-center text-xl font-black shadow-md mb-2.5 transition-all ${curTheme.avatarBg}`}
                    >
                      {activeTheme === 'dark' ? '✨' : '🔗'}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <h3 className={`text-base font-black ${curTheme.textColor}`}>
                        {handleInput.trim() ? `@${handleInput}` : 'Mylink'}
                      </h3>
                      <Badge className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0 h-4 rounded-full">
                        PRO
                      </Badge>
                    </div>

                    <p className={`mt-0.5 text-[11px] font-bold font-mono ${curTheme.subtextColor}`}>
                      {handleInput.trim() ? `mylink.hy/@${handleInput}` : '@mylink'}
                    </p>

                    <p className={`mt-1.5 text-xs font-normal max-w-[230px] leading-relaxed break-keep ${curTheme.subtextColor}`}>
                      마이링크로 연결되는 나만의 프로필 공간이에요 ✨
                    </p>
                  </div>

                  {/* 인터랙티브 카테고리 필터 탭 */}
                  <div className="mt-3.5 flex items-center justify-center gap-1">
                    {([
                      { id: 'all' as const, label: '전체' },
                      { id: 'work' as const, label: '작품' },
                      { id: 'sns' as const, label: 'SNS' },
                      { id: 'shop' as const, label: '스토어' },
                    ]).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setMockCategory(tab.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          mockCategory === tab.id
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-black/10'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* 링크 카드 리스트 (클릭 인터랙티브 체험 가능) */}
                  <div className="mt-3 flex flex-col gap-2 flex-1">
                    {filteredMockLinks.map((link) => (
                      <div
                        key={link.id}
                        onClick={() => handleMockLinkClick(link.id, link.title)}
                        className={`group relative flex items-center justify-between rounded-xl border p-2.5 transition-all cursor-pointer active:scale-95 ${curTheme.cardBg} ${curTheme.cardBorder} ${curTheme.cardHover}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg shrink-0">{link.icon}</span>
                          <div className="flex flex-col min-w-0 text-left">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-extrabold truncate ${curTheme.textColor}`}>
                                {link.title}
                              </span>
                              {link.badge && (
                                <span className="rounded bg-rose-50 text-[9px] font-black text-rose-600 px-1 py-0.2 border border-rose-200">
                                  {link.badge}
                                </span>
                              )}
                            </div>
                            <span className={`text-[10px] truncate ${curTheme.subtextColor}`}>
                              {link.subtitle}
                            </span>
                          </div>
                        </div>

                        {/* 클릭 수 카운터 뱃지 */}
                        <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 shrink-0 ml-1">
                          <MousePointerClick className="size-3 text-blue-500" />
                          <span>{link.clicks.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 폰 내부 피드백 토스트 알림 */}
                  {clickedFeedback && (
                    <div className="mt-2 rounded-xl bg-blue-600 text-white text-[11px] font-bold py-1.5 px-3 text-center shadow-lg animate-in fade-in slide-in-from-bottom-2">
                      {clickedFeedback}
                    </div>
                  )}

                  {/* 폰 하단 안내 */}
                  <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/10 text-center">
                    <span className="text-[10px] font-semibold text-neutral-400">
                      👆 카드를 터치해 실시간 카운트를 체험해보세요
                    </span>
                  </div>
                </div>
              </div>

              {/* 주변 플로팅 배지 1: 실시간 방문자 */}
              <div className="hidden sm:flex absolute -left-8 top-28 items-center gap-2.5 rounded-2xl bg-white/95 p-3 shadow-xl border border-neutral-200/80 backdrop-blur-md">
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BarChart3 className="size-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-neutral-400">실시간 누적 유입</span>
                  <span className="text-xs font-black text-neutral-900">+1,420명 방문 중</span>
                </div>
              </div>

              {/* 주변 플로팅 배지 2: 소셜 프로필 연동 */}
              <div className="hidden sm:flex absolute -right-6 bottom-16 items-center gap-2.5 rounded-2xl bg-white/95 p-3 shadow-xl border border-neutral-200/80 backdrop-blur-md">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Zap className="size-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-neutral-400">인스타 바이오 등록</span>
                  <span className="text-xs font-black text-neutral-900">클릭률 3.8배 상승</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. 주요 기능 하이라이트 (Bento Grid) ─── */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <Badge className="bg-blue-50 text-blue-600 border border-blue-200/80 font-bold mb-3 px-3 py-1">
              강력하고 손쉬운 기능
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950">
              링크 관리에 필요한 모든 것, <br />
              <span className="text-blue-600">오직 마이링크</span>에만 있습니다
            </h2>
            <p className="mt-3 text-sm sm:text-base font-medium text-neutral-500 max-w-xl mx-auto break-keep">
              복잡한 코딩이나 웹 빌더를 배울 필요 없이, 누구나 10초 만에 감각적인 모바일 프로필 페이지를 완성합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="p-7 border-neutral-200 bg-white rounded-3xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-5 font-bold">
                  <Link2 className="size-6" />
                </div>
                <h3 className="text-xl font-extrabold text-neutral-950 mb-2">
                  초간단 링크 통합
                </h3>
                <p className="text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                  SNS, 유튜브, 포트폴리오 노션, 스마트스토어 등 흩어진 모든 채널의 URL을 한 번에 정리하세요.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center text-xs font-bold text-blue-600 gap-1">
                <span>무제한 등록 가능</span>
                <ArrowRight className="size-3" />
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="p-7 border-neutral-200 bg-white rounded-3xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-5 font-bold">
                  <BarChart3 className="size-6" />
                </div>
                <h3 className="text-xl font-extrabold text-neutral-950 mb-2">
                  실시간 클릭 & 유입 통계
                </h3>
                <p className="text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                  방문자가 어떤 링크에 가장 관심이 많은지 각 링크별 실시간 클릭 수와 누적 조회수를 데이터로 확인합니다.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center text-xs font-bold text-indigo-600 gap-1">
                <span>원자적 실시간 집계</span>
                <ArrowRight className="size-3" />
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="p-7 border-neutral-200 bg-white rounded-3xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 mb-5 font-bold">
                  <Smartphone className="size-6" />
                </div>
                <h3 className="text-xl font-extrabold text-neutral-950 mb-2">
                  모바일 최적화 & 반응형
                </h3>
                <p className="text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                  인스타그램 인앱 브라우저나 스마트폰 환경에서 가장 보기 편하도록 터치 최적화된 UX를 제공합니다.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center text-xs font-bold text-sky-600 gap-1">
                <span>iOS / Android 최적화</span>
                <ArrowRight className="size-3" />
              </div>
            </Card>

            {/* Feature 4 */}
            <Card className="p-7 border-neutral-200 bg-white rounded-3xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-5 font-bold">
                  <Palette className="size-6" />
                </div>
                <h3 className="text-xl font-extrabold text-neutral-950 mb-2">
                  개성 있는 프로필 브랜딩
                </h3>
                <p className="text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                  나만의 대표 사진, 한 줄 소개, 인증 뱃지, 강조 배너로 내 브랜드의 정체성을 돋보이게 만듭니다.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center text-xs font-bold text-emerald-600 gap-1">
                <span>프로필 사진 & 뱃지 커스텀</span>
                <ArrowRight className="size-3" />
              </div>
            </Card>

            {/* Feature 5 */}
            <Card className="p-7 border-neutral-200 bg-white rounded-3xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-5 font-bold">
                  <Zap className="size-6" />
                </div>
                <h3 className="text-xl font-extrabold text-neutral-950 mb-2">
                  0초 클라우드 동기화
                </h3>
                <p className="text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                  구글 로그인 한 번이면 Firebase Cloud에 즉시 안전 저장되며, 스마트폰과 PC 어디서든 즉시 동기화됩니다.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center text-xs font-bold text-amber-600 gap-1">
                <span>안전한 클라우드 백업</span>
                <ArrowRight className="size-3" />
              </div>
            </Card>

            {/* Feature 6 */}
            <Card className="p-7 border-neutral-200 bg-white rounded-3xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-5 font-bold">
                  <Share2 className="size-6" />
                </div>
                <h3 className="text-xl font-extrabold text-neutral-950 mb-2">
                  원클릭 주소 복사 & 공유
                </h3>
                <p className="text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                  웹 공유 API와 원클릭 클립보드 복사를 통해 카카오톡, 인스타, 에브리타임 어디든 빠르게 공유하세요.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center text-xs font-bold text-rose-600 gap-1">
                <span>원터치 클립보드 복사</span>
                <ArrowRight className="size-3" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── 4. 페르소나별 활용 사례 탭 (Use Cases) ─── */}
      <section id="personas" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-neutral-200/80">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="bg-indigo-50 text-indigo-600 border border-indigo-200/80 font-bold mb-3 px-3 py-1">
              맞춤 활용법
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950">
              나의 분야에 맞게 자유롭게 꾸며보세요
            </h2>
            <p className="mt-2 text-sm sm:text-base font-medium text-neutral-500">
              다양한 크리에이터와 학생들이 마이링크를 이렇게 똑똑하게 활용하고 있어요.
            </p>
          </div>

          {/* 탭 버튼들 */}
          <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
            {PERSONA_CASES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePersona(item.id)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activePersona === item.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          {/* 활성화된 페르소나 카드 디테일 */}
          {(() => {
            const persona =
              PERSONA_CASES.find((p) => p.id === activePersona) || PERSONA_CASES[0];
            return (
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-10 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* 설명 컬럼 (7 Cols) */}
                  <div className="lg:col-span-7">
                    <span className="inline-block rounded-md bg-blue-100 text-blue-700 text-xs font-black px-2.5 py-1 mb-3">
                      {persona.tag}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-neutral-950">
                      {persona.title}를 위한 추천 구성
                    </h3>
                    <p className="mt-3 text-sm sm:text-base font-medium text-neutral-600 leading-relaxed break-keep">
                      {persona.subtitle}
                    </p>

                    <div className="mt-6 flex flex-col gap-2.5">
                      {persona.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-neutral-800">
                          <div className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-white shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <Button
                        onClick={onLogin}
                        className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold gap-2 px-5 cursor-pointer shadow-xs"
                      >
                        <GoogleIcon />
                        <span>이 구성으로 지금 내 링크 만들기</span>
                      </Button>
                    </div>
                  </div>

                  {/* 예시 프리뷰 카드 (5 Cols) */}
                  <div className="lg:col-span-5 flex flex-col gap-2.5 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                    <span className="text-xs font-extrabold text-neutral-400 mb-1">
                      미리보기 예시 구성
                    </span>
                    {persona.sampleLinks.map((sLink, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-neutral-50 px-3.5 py-3 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex flex-col min-w-0 text-left">
                          <span className="text-xs font-bold text-neutral-900 truncate">
                            {sLink.title}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {sLink.category}
                          </span>
                        </div>
                        <span className="rounded bg-blue-50 text-[10px] font-black text-blue-600 px-2 py-0.5 border border-blue-200">
                          {sLink.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ─── 5. 이용 방법 3단계 (Step-by-Step) ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="bg-sky-50 text-sky-600 border border-sky-200/80 font-bold mb-3 px-3 py-1">
            간편한 시작
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950 mb-4">
            단 3단계면 나만의 링크 완성
          </h2>
          <p className="text-sm sm:text-base font-medium text-neutral-500 mb-12">
            가입부터 링크 공유까지 단 10초면 충분합니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white text-lg font-black shadow-md shadow-blue-500/20 mb-4">
                1
              </span>
              <h4 className="text-lg font-extrabold text-neutral-950 mb-1.5">
                Google 3초 로그인
              </h4>
              <p className="text-xs sm:text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                복잡한 회원가입 절차 없이 <br />
                구글 계정으로 즉시 시작합니다.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-600 text-white text-lg font-black shadow-md shadow-indigo-500/20 mb-4">
                2
              </span>
              <h4 className="text-lg font-extrabold text-neutral-950 mb-1.5">
                링크 및 소개 입력
              </h4>
              <p className="text-xs sm:text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                포트폴리오, SNS, 스토어 등 <br />
                보여주고 싶은 주소를 등록합니다.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-sky-600 text-white text-lg font-black shadow-md shadow-sky-500/20 mb-4">
                3
              </span>
              <h4 className="text-lg font-extrabold text-neutral-950 mb-1.5">
                인스타 바이오 공유
              </h4>
              <p className="text-xs sm:text-sm font-normal text-neutral-500 leading-relaxed break-keep">
                완성된 주소를 복사해 <br />
                SNS 프로필 링크에 걸면 끝!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. 하단 대형 CTA 배너 ─── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 text-white text-center relative overflow-hidden">
        {/* 장식용 원형 블러 */}
        <div className="absolute top-0 right-0 size-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 size-96 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-2xl relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            지금 10초 만에 <br />
            나만의 마이링크를 시작하세요
          </h2>
          <p className="mt-4 text-sm sm:text-base font-medium text-blue-100 max-w-lg mx-auto leading-relaxed break-keep">
            복잡한 설정이나 비용 없이, 구글 로그인 하나로 언제 어디서든 <br className="hidden sm:inline" />
            나만의 멋진 프로필 페이지를 무료로 가질 수 있습니다.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={onLogin}
              disabled={isLoggingIn}
              className="h-13 rounded-2xl bg-white text-blue-700 hover:bg-neutral-100 font-black text-sm sm:text-base px-8 cursor-pointer shadow-xl shadow-blue-900/30 gap-2.5 transition-all hover:scale-[1.02]"
            >
              <GoogleIcon />
              <span>Google로 무료 시작하기</span>
            </Button>

            {onExploreDemo && (
              <Button
                size="lg"
                variant="outline"
                onClick={onExploreDemo}
                className="h-13 rounded-2xl border-white/30 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm sm:text-base px-6 cursor-pointer backdrop-blur-xs transition-all"
              >
                <Compass className="size-4" />
                <span>둘러보기 모드 체험</span>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ─── 7. 푸터 ─── */}
      <footer className="py-10 bg-white border-t border-neutral-200 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black">
              MY
            </div>
            <span className="font-bold text-neutral-800">
              마이링크 (My Link)
            </span>
          </div>

          <p className="text-neutral-400">
            © 2026 MyLink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

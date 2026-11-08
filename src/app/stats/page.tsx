'use client';

import * as React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from 'firebase/auth';
import type { LinkItem } from '@/types';
import { subscribeAuthState, getUserProfile, getEmailPrefix, type UserData } from '@/lib/authService';
import { subscribeToLinks } from '@/lib/linkService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ArrowLeft,
  MousePointerClick,
  Link as LinkIcon,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Flame,
  PieChart as PieIcon,
  BarChart3,
  Loader2,
  Sparkles,
  Award,
} from 'lucide-react';

// 카테고리 명칭 매핑
const CATEGORY_NAMES: Record<string, string> = {
  work: '작품',
  sns: 'SNS',
  shop: '스토어',
  contact: '문의',
};

// 카테고리 색상 팔레트
const CATEGORY_COLORS: Record<string, string> = {
  work: '#3b82f6', // blue
  sns: '#ec4899', // pink
  shop: '#10b981', // emerald
  contact: '#8b5cf6', // purple
  etc: '#64748b', // slate
};

// 차트 설정
const barChartConfig: ChartConfig = {
  clicks: {
    label: '클릭수',
    color: '#3b82f6',
  },
};

const pieChartConfig: ChartConfig = {
  work: {
    label: '작품',
    color: CATEGORY_COLORS.work,
  },
  sns: {
    label: 'SNS',
    color: CATEGORY_COLORS.sns,
  },
  shop: {
    label: '스토어',
    color: CATEGORY_COLORS.shop,
  },
  contact: {
    label: '문의',
    color: CATEGORY_COLORS.contact,
  },
};

export default function StatsPage() {
  const router = useRouter();

  // 인증 상태
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // 링크 데이터 상태
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // 1. 로그인 인증 상태 감지 및 비로그인 리다이렉트
  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (user) => {
      if (!user) {
        // 비로그인 사용자: 즉시 홈으로 리다이렉트
        setCurrentUser(null);
        setUserProfile(null);
        setIsAuthLoading(false);
        router.replace('/');
        return;
      }

      setCurrentUser(user);
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (err) {
        console.warn('프로필 정보 불러오기 실패:', err);
      } finally {
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 2. 로그인 유저의 Firestore 링크 실시간 구독
  useEffect(() => {
    if (isAuthLoading || !currentUser) return;

    setIsDataLoading(true);
    const unsubscribe = subscribeToLinks(
      currentUser.uid,
      (fetchedLinks) => {
        setLinks(fetchedLinks);
        setIsDataLoading(false);
        setLastRefreshedAt(new Date());
        setIsRefreshing(false);
      },
      (error) => {
        console.error('링크 통계 데이터 불러오기 오류:', error);
        setIsDataLoading(false);
        setIsRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, isAuthLoading]);

  // 수동 새로고침 핸들러
  const handleRefresh = useCallback(() => {
    if (!currentUser || isRefreshing) return;
    setIsRefreshing(true);
    // 실시간 구독이 즉시 최신 상태를 유지하지만 UI 피드백을 위해 상태 갱신
    setTimeout(() => {
      setLastRefreshedAt(new Date());
      setIsRefreshing(false);
    }, 600);
  }, [currentUser, isRefreshing]);

  // 3. 통계 계산 로직 (총 클릭수, 활성 링크 수, 평균 클릭수, 최고 인기 링크)
  const totalClicks = useMemo(() => {
    return links.reduce((sum, link) => sum + (link.clickCount || 0), 0);
  }, [links]);

  const totalLinksCount = links.length;

  const activeLinksCount = useMemo(() => {
    return links.filter((link) => link.isActive !== false).length;
  }, [links]);

  const averageClicks = useMemo(() => {
    if (totalLinksCount === 0) return '0.0';
    return (totalClicks / totalLinksCount).toFixed(1);
  }, [totalClicks, totalLinksCount]);

  // 클릭수가 많은 순으로 정렬한 링크 목록
  const sortedLinks = useMemo(() => {
    return [...links].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
  }, [links]);

  const topLink = sortedLinks[0];

  // 4. 막대 차트용 데이터 (상위 8개 링크)
  const barChartData = useMemo(() => {
    return sortedLinks.slice(0, 8).map((link) => ({
      name: link.title.length > 8 ? `${link.title.slice(0, 8)}...` : link.title,
      fullName: link.title,
      clicks: link.clickCount || 0,
      category: link.category || 'work',
    }));
  }, [sortedLinks]);

  // 5. 도넛/파이 차트용 카테고리별 클릭수 데이터
  const categoryPieData = useMemo(() => {
    const counts: Record<string, number> = {};

    links.forEach((link) => {
      const cat = link.category || 'work';
      counts[cat] = (counts[cat] || 0) + (link.clickCount || 0);
    });

    const categories = Object.keys(counts);
    if (categories.length === 0) return [];

    return categories.map((cat) => ({
      name: CATEGORY_NAMES[cat] || cat,
      key: cat,
      clicks: counts[cat],
      fill: CATEGORY_COLORS[cat] || CATEGORY_COLORS.etc,
    }));
  }, [links]);

  // 로그인 확인 로딩 화면
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-3xl shadow-sm border border-border max-w-sm w-full text-center">
          <Loader2 className="size-8 text-blue-600 animate-spin" />
          <h2 className="text-base font-bold text-foreground">인증 상태를 확인하고 있어요</h2>
          <p className="text-xs text-muted-foreground">
            잠시만 기다려 주시면 통계 페이지로 안내합니다.
          </p>
        </div>
      </div>
    );
  }

  // 비로그인 사용자 리다이렉트 안내
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-3xl shadow-sm border border-border max-w-sm w-full text-center">
          <div className="size-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Sparkles className="size-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">로그인이 필요한 페이지입니다</h2>
            <p className="text-xs text-muted-foreground mt-1">
              마이링크 통계는 본인 계정으로 로그인 후 이용하실 수 있습니다. 홈으로 이동합니다...
            </p>
          </div>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl'
            )}
          >
            홈으로 이동하기
          </Link>
        </div>
      </div>
    );
  }

  const userDisplayName =
    userProfile?.displayName || getEmailPrefix(currentUser.email, currentUser.displayName);

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-16">
      {/* ── 상단 네비게이션 헤더 ── */}
      <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-border bg-white/90 px-4 sm:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'rounded-xl px-2.5 h-9 text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs font-semibold'
            )}
          >
            <ArrowLeft className="size-4" />
            <span>내 마이링크로 돌아가기</span>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <BarChart3 className="size-4 text-blue-600" />
            <span className="text-sm font-bold text-foreground">통계 대시보드</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground hidden md:inline font-mono">
            {lastRefreshedAt.toLocaleTimeString('ko-KR')} 기준
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-xl h-8 px-2.5 text-xs font-medium border-border/80 hover:bg-muted/80 gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>새로고침</span>
          </Button>
        </div>
      </header>

      {/* ── 본문 컨테이너 ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* 타이틀 헤더 */}
        <div className="pb-2 border-b border-border/60">
          <div className="flex items-start gap-2.5">
            <span className="inline-flex items-center justify-center size-8 sm:size-9 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs shrink-0 mt-0.5">
              📊
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-foreground break-keep leading-snug">
                <span className="inline-block">{userDisplayName} 님의</span>{' '}
                <span className="inline-block">링크 성과 통계</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-keep leading-relaxed">
                방문자들의 클릭 수와 카테고리별 성과를 한눈에 파악하고 링크를 최적화해 보세요.
              </p>
            </div>
          </div>
        </div>

        {/* ── 1. 핵심 KPI 지표 카드 4선 ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 총 클릭수 (가장 중요한 지표) */}
          <Card className="rounded-2xl border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-white shadow-xs overflow-hidden relative">
            <div className="absolute -right-3 -bottom-3 opacity-10 pointer-events-none">
              <Flame className="size-24 text-blue-600" />
            </div>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-blue-700">총 클릭수</CardTitle>
                <span className="flex size-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                  <MousePointerClick className="size-4" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">
                {totalClicks.toLocaleString()}
                <span className="text-xs font-bold text-blue-500 ml-1">회</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                <Flame className="size-3 text-orange-500 fill-orange-500 inline" />
                모든 링크에서 발생한 누적 클릭 합산
              </p>
            </CardContent>
          </Card>

          {/* 등록된 총 링크 수 */}
          <Card className="rounded-2xl border-border bg-white shadow-xs">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  등록 링크 수
                </CardTitle>
                <span className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <LinkIcon className="size-4" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {totalLinksCount}
                <span className="text-xs font-bold text-muted-foreground ml-1">개</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                내 마이링크에 추가된 전체 링크
              </p>
            </CardContent>
          </Card>

          {/* 노출 중인 활성 링크 수 */}
          <Card className="rounded-2xl border-border bg-white shadow-xs">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  활성 링크 수
                </CardTitle>
                <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="size-4" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                {activeLinksCount}
                <span className="text-xs font-bold text-muted-foreground ml-1">개</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                방문자에게 현재 노출 중인 링크
              </p>
            </CardContent>
          </Card>

          {/* 링크당 평균 클릭수 */}
          <Card className="rounded-2xl border-border bg-white shadow-xs">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  평균 클릭수
                </CardTitle>
                <span className="flex size-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <TrendingUp className="size-4" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl sm:text-3xl font-black text-purple-600 tracking-tight">
                {averageClicks}
                <span className="text-xs font-bold text-muted-foreground ml-1">회 / 개</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                링크 1개당 평균적인 클릭 유입수
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── 2. shadcn 차트 영역 (막대 차트 + 카테고리 파이 차트) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 링크별 클릭수 BarChart (2열 차지) */}
          <Card className="lg:col-span-2 rounded-2xl border-border bg-white shadow-xs">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                    <BarChart3 className="size-4 text-blue-600" />
                    링크별 누적 클릭수 비교
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    클릭수가 높은 순으로 상위 링크의 방문 횟수를 비교합니다.
                  </CardDescription>
                </div>
                {topLink && (
                  <Badge variant="blue" className="text-[11px] font-semibold hidden sm:inline-flex">
                    최고 인기: {topLink.title} ({topLink.clickCount || 0}회)
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {barChartData.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-xs">
                  <p>등록된 링크 데이터가 없습니다.</p>
                </div>
              ) : (
                <ChartContainer config={barChartConfig} className="h-64 sm:h-72 w-full">
                  <BarChart
                    data={barChartData}
                    margin={{ top: 15, right: 15, left: -10, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E8EB" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-[11px] font-medium"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={4}
                      allowDecimals={false}
                      className="text-[11px] font-medium"
                    />
                    <ChartTooltip
                      cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar
                      dataKey="clicks"
                      radius={[6, 6, 0, 0]}
                      fill="var(--color-clicks)"
                      maxBarSize={48}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* 우측: 카테고리별 클릭 점유율 PieChart (1열 차지) */}
          <Card className="rounded-2xl border-border bg-white shadow-xs flex flex-col">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                <PieIcon className="size-4 text-purple-600" />
                카테고리별 클릭 비중
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                작품, SNS, 스토어 등 카테고리별 유입 비중
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-center">
              {categoryPieData.length === 0 || totalClicks === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-muted-foreground text-xs text-center p-4">
                  <PieIcon className="size-8 text-muted-foreground/40 mb-2" />
                  <p>아직 클릭된 링크가 없습니다.</p>
                  <p className="text-[11px] mt-1 text-muted-foreground/80">
                    링크를 공유하여 첫 클릭을 발생시켜 보세요!
                  </p>
                </div>
              ) : (
                <>
                  <ChartContainer
                    config={pieChartConfig}
                    className="h-52 sm:h-56 w-full mx-auto aspect-square"
                  >
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Pie
                        data={categoryPieData}
                        dataKey="clicks"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        stroke="#fff"
                        strokeWidth={2}
                      >
                        {categoryPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>

                  {/* 카테고리 범례 (Legend) */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/60">
                    {categoryPieData.map((item) => {
                      const percentage =
                        totalClicks > 0 ? ((item.clicks / totalClicks) * 100).toFixed(0) : 0;
                      return (
                        <div key={item.key} className="flex items-center justify-between text-xs p-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className="size-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.fill }}
                            />
                            <span className="font-medium text-foreground truncate">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-mono text-muted-foreground shrink-0 text-[11px]">
                            {item.clicks}회 ({percentage}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── 3. 인기 링크 랭킹 TOP 리스트 ── */}
        <Card className="rounded-2xl border-border bg-white shadow-xs">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <Award className="size-4 text-amber-500" />
                  링크별 클릭수 상세 순위
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  내 마이링크의 모든 링크 클릭 현황과 점유율입니다.
                </CardDescription>
              </div>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'text-xs text-blue-600 font-semibold'
                )}
              >
                링크 편집하러 가기
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            {sortedLinks.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-xs">
                <LinkIcon className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                <p>아직 등록된 링크가 없습니다.</p>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'sm' }),
                    'mt-3 bg-blue-600 text-white rounded-xl'
                  )}
                >
                  새 링크 추가하기
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {sortedLinks.map((link, idx) => {
                  const clickCount = link.clickCount || 0;
                  const percentage =
                    totalClicks > 0 ? ((clickCount / totalClicks) * 100).toFixed(1) : '0.0';

                  // 메달 뱃지
                  const rankBadge =
                    idx === 0 ? (
                      <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-xs">
                        🥇 1
                      </span>
                    ) : idx === 1 ? (
                      <span className="flex size-6 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                        🥈 2
                      </span>
                    ) : idx === 2 ? (
                      <span className="flex size-6 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold text-xs">
                        🥉 3
                      </span>
                    ) : (
                      <span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold text-xs">
                        {idx + 1}
                      </span>
                    );

                  return (
                    <div
                      key={link.id}
                      className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-muted/30 px-2 rounded-xl transition-colors"
                    >
                      {/* 좌측: 순위 + 아이콘 + 타이틀 + URL */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="shrink-0">{rankBadge}</div>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-muted/60 text-base shrink-0">
                          {link.icon || '🔗'}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground truncate">
                              {link.title}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 font-normal shrink-0"
                            >
                              {CATEGORY_NAMES[link.category || 'work'] || link.category}
                            </Badge>
                            {link.isActive === false && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 text-muted-foreground shrink-0"
                              >
                                비활성
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground truncate font-mono mt-0.5">
                            {link.url}
                          </span>
                        </div>
                      </div>

                      {/* 우측: 클릭수 + 프로그레스 점유율 + 바로가기 */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-9 sm:pl-0">
                        {/* 클릭수 및 점유율 바 */}
                        <div className="flex flex-col items-end min-w-[100px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-foreground font-mono">
                              {clickCount.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">클릭</span>
                            <span className="text-[11px] text-blue-600 font-semibold font-mono ml-1">
                              ({percentage}%)
                            </span>
                          </div>
                          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(Number(percentage), 3)}%` }}
                            />
                          </div>
                        </div>

                        {/* 외부 링크 바로가기 */}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            buttonVariants({ variant: 'ghost', size: 'icon' }),
                            'size-8 rounded-lg text-muted-foreground hover:text-foreground inline-flex items-center justify-center'
                          )}
                          title="링크 열기"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

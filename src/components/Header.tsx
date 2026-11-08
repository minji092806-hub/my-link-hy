'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { User } from 'firebase/auth';
import type { UserData } from '@/lib/authService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  LogOut,
  Loader2,
  RefreshCw,
  Plus,
  ChevronDown,
  Eye,
  Sparkles,
  BarChart3,
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  userProfile?: UserData | null;
  userDisplayName: string;
  userHandleId?: string;
  isAuthLoading?: boolean;
  isLoggingIn?: boolean;
  isLoggingOut?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenProfileDialog?: () => void;
  onOpenAddDialog?: () => void;
  onRefresh?: () => void;
  isSyncing?: boolean;
  isLoading?: boolean;
  onShare?: () => void;
  onCopyLink?: () => void;
  isCopied?: boolean;
  onOpenPreview?: () => void;
  isPreviewMode?: boolean;
}

/**
 * Google 공식 컬러 브랜드 아이콘 SVG
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16">
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

export function Header({
  currentUser,
  userProfile,
  userDisplayName,
  userHandleId,
  isAuthLoading = false,
  isLoggingIn = false,
  isLoggingOut = false,
  onLogin,
  onLogout,
  onOpenProfileDialog,
  onOpenAddDialog,
  onRefresh,
  isSyncing = false,
  isLoading = false,
  onShare,
  onCopyLink,
  isCopied = false,
  onOpenPreview,
  isPreviewMode = false,
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 사용자 핸들 ID 기반 개인 페이지 링크 (예: /kkyareuk)
  const effectiveHandleId =
    (userHandleId && userHandleId.trim()) ||
    (userProfile?.handle ? userProfile.handle.trim().replace(/^@/, '') : '') ||
    userDisplayName;

  const userPageHref = `/${encodeURIComponent(effectiveHandleId || 'user')}`;

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-border bg-background/90 px-2.5 sm:px-6 backdrop-blur-md transition-all">
      {/* ── 좌측: 서비스 로고 및 핸들 ── */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-2 group hover:opacity-90 transition-opacity"
        >
          <span className="flex size-7 sm:size-8 items-center justify-center rounded-xl bg-blue-600 text-xs sm:text-sm font-black text-white shadow-xs group-hover:scale-105 transition-transform">
            🔗
          </span>
          <div className="flex flex-col">
            <span className="text-sm sm:text-[15px] font-bold tracking-tight text-foreground leading-none">
              마이링크
            </span>
            <span className="text-[10px] text-muted-foreground font-mono mt-0.5 hidden md:inline">
              {currentUser ? `users/${currentUser.uid.slice(0, 8)}...` : 'public view'}
            </span>
          </div>
        </Link>

        {currentUser ? (
          <Badge
            variant="blue"
            className="text-[11px] font-semibold px-2 py-0.5 ml-1 hidden md:inline-flex"
          >
            {userProfile?.handle || `@${userDisplayName}`}
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="text-[11px] font-medium px-2 py-0.5 ml-1 hidden md:inline-flex"
          >
            둘러보기 모드
          </Badge>
        )}
      </div>

      {/* ── 우측: 로그인 / 프로필 드롭다운 / 액션 버튼 ── */}
      <div className="flex items-center gap-1 sm:gap-2">
        {isAuthLoading ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground px-1.5 py-1">
            <Loader2 className="size-3.5 animate-spin text-blue-600" />
            <span className="hidden md:inline">인증 확인 중...</span>
          </div>
        ) : currentUser ? (
          /* ── 로그인 상태: 프로필 드롭다운 메뉴 ── */
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className={cn(
                'flex items-center gap-1.5 rounded-full bg-muted/60 p-1 sm:pl-1.5 sm:pr-2.5 sm:py-1 border border-border/60 hover:bg-muted/90 cursor-pointer transition-all shrink-0',
                isDropdownOpen && 'ring-2 ring-blue-500/30 bg-muted/90 border-blue-300'
              )}
            >
              <Avatar className="size-6 sm:size-6.5 rounded-full ring-1 ring-border">
                {userProfile?.photoURL || currentUser.photoURL ? (
                  <AvatarImage
                    src={userProfile?.photoURL || currentUser.photoURL || ''}
                    alt={userDisplayName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="text-[11px] bg-blue-600 text-white font-bold">
                  {userDisplayName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-foreground max-w-[85px] sm:max-w-[120px] truncate hidden sm:inline">
                {userDisplayName}
              </span>
              <ChevronDown
                className={cn(
                  'size-3.5 text-muted-foreground transition-transform duration-200 hidden sm:inline',
                  isDropdownOpen && 'rotate-180 text-foreground'
                )}
              />
            </button>

            {/* ── 프로필 드롭다운 팝오버 ── */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-popover/95 p-1.5 text-popover-foreground shadow-xl backdrop-blur-md z-50 animate-in fade-in-0 zoom-in-95 origin-top-right">
                {/* 드롭다운 상단: 사용자 요약 정보 */}
                <div className="px-3 py-2.5 border-b border-border/70 mb-1">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-9 rounded-full ring-1 ring-border">
                      {userProfile?.photoURL || currentUser.photoURL ? (
                        <AvatarImage
                          src={userProfile?.photoURL || currentUser.photoURL || ''}
                          alt={userDisplayName}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="text-sm bg-blue-600 text-white font-bold">
                        {userDisplayName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-bold text-foreground truncate">
                        {userDisplayName}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate font-mono">
                        {userProfile?.handle || `@${userDisplayName}`}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded truncate">
                    users/{currentUser.uid}/links
                  </div>
                </div>

                {/* 개인별 페이지 이동 (핸들 ID 기반) */}
                <Link
                  href={userPageHref}
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 transition-colors"
                >
                  <span className="flex size-6 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50">
                    <Sparkles className="size-3.5" />
                  </span>
                  <div className="flex flex-col text-left flex-1 min-w-0">
                    <span className="font-bold">내 마이링크 방문</span>
                    <span className="text-[10px] text-muted-foreground truncate font-mono">
                      /{effectiveHandleId}
                    </span>
                  </div>
                </Link>

                {/* 통계 대시보드 페이지 이동 (/stats) */}
                <Link
                  href="/stats"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 transition-colors"
                >
                  <span className="flex size-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50">
                    <BarChart3 className="size-3.5" />
                  </span>
                  <div className="flex flex-col text-left flex-1 min-w-0">
                    <span className="font-bold">통계 대시보드</span>
                    <span className="text-[10px] text-muted-foreground truncate font-mono">
                      /stats
                    </span>
                  </div>
                </Link>

                <div className="h-px bg-border/70 my-1" />

                {/* 로그아웃 버튼 */}
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left"
                  >
                    <span className="flex size-6 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50">
                      {isLoggingOut ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <LogOut className="size-3.5" />
                      )}
                    </span>
                    <span>로그아웃</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ── 비로그인 상태: Google 로그인 버튼 ── */
          <Button
            variant="outline"
            size="sm"
            onClick={onLogin}
            disabled={isLoggingIn}
            className="h-9 rounded-full text-xs font-bold gap-2 border-border bg-white hover:bg-neutral-50 text-neutral-800 shadow-xs dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-100 cursor-pointer px-3.5"
          >
            {isLoggingIn ? (
              <Loader2 className="size-3.5 animate-spin text-blue-600" />
            ) : (
              <GoogleIcon className="size-4" />
            )}
            <span>Google로 로그인</span>
          </Button>
        )}

        {/* 새로고침 버튼 */}
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isSyncing || isLoading}
            title="목록 새로고침"
            className="size-7 sm:size-8 rounded-full p-0 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          >
            <RefreshCw className={cn('size-3 sm:size-3.5', isSyncing && 'animate-spin text-blue-600')} />
          </Button>
        )}


        {/* 새 링크 추가 버튼 */}
        {onOpenAddDialog && (
          <Button
            variant="default"
            size="sm"
            onClick={onOpenAddDialog}
            className="rounded-full gap-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs h-7.5 sm:h-8 px-2 sm:px-3 cursor-pointer shrink-0"
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">새 링크</span>
          </Button>
        )}

        {/* 내 페이지 미리보기 버튼 */}
        {onOpenPreview && (
          <Button
            variant={isPreviewMode ? 'default' : 'outline'}
            size="sm"
            onClick={onOpenPreview}
            className={cn(
              'rounded-full gap-1 text-xs font-bold h-7.5 sm:h-8 px-2 sm:px-3 cursor-pointer shadow-xs transition-all shrink-0',
              isPreviewMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-400/30'
                : 'border-border bg-card hover:bg-muted text-foreground'
            )}
            title={isPreviewMode ? '편집 모드로 돌아가기' : '방문자 시점 미리보기'}
          >
            <Eye className="size-3.5 text-blue-500" />
            <span className="hidden sm:inline">
              {isPreviewMode ? '편집 모드' : '내 페이지 미리보기'}
            </span>
            <span className="hidden xs:inline sm:hidden">
              {isPreviewMode ? '복귀' : '미리보기'}
            </span>
          </Button>
        )}
      </div>
    </header>
  );
}

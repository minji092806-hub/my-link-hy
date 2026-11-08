'use client';

import * as React from 'react';
import { use, useState, useEffect, useMemo, useCallback } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from 'firebase/auth';
import type { LinkItem } from '@/types';
import { LinkCard } from '@/components/LinkCard';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Toast } from '@/components/toss/Toast';
import { Header } from '@/components/Header';
import { AddLinkDialog } from '@/components/AddLinkDialog';
import { EditLinkDialog } from '@/components/EditLinkDialog';
import { DeleteLinkDialog } from '@/components/DeleteLinkDialog';
import { EditProfileDialog } from '@/components/EditProfileDialog';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';
import {
  addLinkToFirestore,
  updateLinkInFirestore,
  incrementClickCountInFirestore,
  deleteLinkFromFirestore,
  getLinksFromFirestore,
  subscribeToLinks,
} from '@/lib/linkService';
import {
  loginWithGoogle,
  logoutFirebase,
  subscribeAuthState,
  getUserProfile,
  getUserByDisplayName,
  getEmailPrefix,
  getUserHandleId,
  type UserData,
} from '@/lib/authService';
import {
  Share2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Camera,
  ShoppingBag,
  Mail,
  Zap,
  Plus,
  Loader2,
  RefreshCw,
  Layers,
  Pencil,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

type FilterCategory = 'all' | 'work' | 'sns' | 'shop' | 'contact';

interface TabConfig {
  id: FilterCategory;
  label: string;
  icon: React.ReactNode;
}

const CATEGORY_TABS: TabConfig[] = [
  { id: 'all', label: '전체', icon: <Sparkles className="size-3" /> },
  { id: 'work', label: '작품', icon: <BookOpen className="size-3" /> },
  { id: 'sns', label: 'SNS', icon: <Camera className="size-3" /> },
  { id: 'shop', label: '스토어', icon: <ShoppingBag className="size-3.5" /> },
  { id: 'contact', label: '문의', icon: <Mail className="size-3" /> },
];

interface UserProfilePageProps {
  params: Promise<{ displayName: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  // Next.js 15+ async params 언랩
  const resolvedParams = use(params);
  const rawDisplayName = resolvedParams.displayName;
  const decodedDisplayName = decodeURIComponent(rawDisplayName || '').trim();

  const router = useRouter();

  // 대상 유저 상태 (displayName으로 검색된 사용자)
  const [targetUser, setTargetUser] = useState<UserData | null>(null);
  const [isSearchingUser, setIsSearchingUser] = useState<boolean>(true);

  // 현재 로그인한 사용자 상태
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserData | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // 링크 데이터 상태 (users/{targetUser.uid}/links)
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // 다이얼로그 상태 (본인 페이지일 때 사용 가능)
  const [editTarget, setEditTarget] = useState<LinkItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState<boolean>(false);

  // UI 상태
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 로그인 유저 프로필 캐시
  const { data: cachedCurrentProfile } = useProfile(currentUser?.uid);
  const activeCurrentProfile = cachedCurrentProfile ?? currentUserProfile;

  const currentDisplayName = useMemo(() => {
    if (!currentUser) return '';
    return activeCurrentProfile?.displayName || getEmailPrefix(currentUser.email, currentUser.displayName);
  }, [currentUser, activeCurrentProfile]);

  const currentHandleId = useMemo(() => {
    return getUserHandleId(activeCurrentProfile?.handle, currentUser?.email, currentDisplayName);
  }, [activeCurrentProfile?.handle, currentUser?.email, currentDisplayName]);

  // 대상 유저 프로필 캐시
  const { data: cachedTargetProfile } = useProfile(targetUser?.uid);
  const activeTargetProfile = cachedTargetProfile ?? targetUser;

  // 대상 유저 핸들 ID (URL 슬러그)
  const targetHandleId = useMemo(() => {
    return getUserHandleId(activeTargetProfile?.handle, targetUser?.email, decodedDisplayName);
  }, [activeTargetProfile?.handle, targetUser?.email, decodedDisplayName]);

  // 본인 페이지인지 여부
  const isOwner = useMemo(() => {
    if (!currentUser || !targetUser) return false;
    return currentUser.uid === targetUser.uid;
  }, [currentUser, targetUser]);

  // 토스트 메시지
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2400);
  }, []);

  // ── 1. displayName으로 유저 검색 (없으면 notFound) ──
  useEffect(() => {
    let isMounted = true;
    setIsSearchingUser(true);

    async function searchUser() {
      try {
        const found = await getUserByDisplayName(decodedDisplayName);
        if (!isMounted) return;

        if (!found) {
          // 요구사항: username 없으면 404 페이지
          notFound();
          return;
        }

        setTargetUser(found);
      } catch (error) {
        console.error('유저 검색 에러:', error);
        if (isMounted) notFound();
      } finally {
        if (isMounted) setIsSearchingUser(false);
      }
    }

    if (decodedDisplayName) {
      searchUser();
    } else {
      notFound();
    }

    return () => {
      isMounted = false;
    };
  }, [decodedDisplayName]);

  // ── 2. Firebase onAuthStateChanged 실시간 인증 상태 감지 ──
  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          const emailPrefix = getEmailPrefix(user.email, user.displayName);
          setCurrentUserProfile(
            profile || {
              uid: user.uid,
              displayName: emailPrefix,
              email: user.email,
              photoURL: user.photoURL,
              handle: `@${emailPrefix}`,
              bio: '마이링크로 연결되는 나만의 공간이에요 ✨',
            }
          );
        } catch (err) {
          console.warn('유저 프로필 조회 에러:', err);
        }
      } else {
        setCurrentUserProfile(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── 3. 대상 사용자의 링크 목록 구독: users/{targetUser.uid}/links ──
  useEffect(() => {
    if (!targetUser || !targetUser.uid) return;

    let isMounted = true;
    setIsLoadingLinks(true);

    const unsubscribe = subscribeToLinks(
      targetUser.uid,
      (fetchedLinks) => {
        if (!isMounted) return;
        setLinks(fetchedLinks);
        setIsLoadingLinks(false);
      },
      (error) => {
        console.warn(`[Firestore] users/${targetUser.uid}/links 로드 실패:`, error);
        if (isMounted) {
          setLinks([]);
          setIsLoadingLinks(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [targetUser]);

  // ── 4. 로그인 / 로그아웃 핸들러 ──
  const handleGoogleLogin = useCallback(async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const user = await loginWithGoogle();
      const displayName = getEmailPrefix(user.email, user.displayName);
      showToast(`${displayName}님 환영해요! 🎉`);
    } catch (error: unknown) {
      console.error('Google 로그인 에러:', error);
      const err = error as { code?: string; message?: string };
      if (err?.code !== 'auth/popup-closed-by-user') {
        showToast('로그인에 실패했어요. 다시 시도해주세요.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  }, [isLoggingIn, showToast]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutFirebase();
      showToast('로그아웃되었어요 👋');
    } catch (error) {
      console.error('로그아웃 에러:', error);
      showToast('로그아웃 처리 중 오류가 발생했어요.');
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, showToast]);

  // 새로고침 핸들러
  const handleRefresh = useCallback(async () => {
    if (!targetUser) return;
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const refreshed = await getLinksFromFirestore(targetUser.uid);
      setLinks(refreshed);
      showToast('최신 링크 목록으로 갱신되었어요 🔄');
    } catch (error) {
      console.error('링크 갱신 실패:', error);
      showToast('목록 갱신에 실패했어요.');
    } finally {
      setIsSyncing(false);
    }
  }, [targetUser, isSyncing, showToast]);

  // 링크 추가 핸들러 (본인 페이지일 때)
  const handleAddLink = useCallback(
    async (newLinkData: Omit<LinkItem, 'id' | 'order' | 'clickCount'>) => {
      if (!isOwner || !currentUser) {
        showToast('본인의 페이지만 수정할 수 있어요 🔒');
        return;
      }

      setIsSyncing(true);
      try {
        const saved = await addLinkToFirestore(
          {
            ...newLinkData,
            order: 1,
            clickCount: 0,
            isActive: true,
          },
          currentUser.uid
        );

        setLinks((prev) => [saved, ...prev.filter((i) => i.id !== saved.id)]);
        showToast(`'${newLinkData.title}' 링크가 추가되었어요! ✨`);
      } catch (error) {
        console.error('링크 추가 실패:', error);
        showToast('링크 저장에 실패했어요.');
        throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [isOwner, currentUser, showToast]
  );

  // 링크 수정 핸들러
  const handleUpdateLink = useCallback(
    async (
      linkId: string,
      updates: Partial<Pick<LinkItem, 'title' | 'url' | 'description' | 'category' | 'icon' | 'color' | 'badge' | 'isActive'>>
    ) => {
      if (!isOwner || !currentUser) {
        showToast('수정 권한이 없습니다.');
        return;
      }

      setIsSyncing(true);
      try {
        setLinks((prev) =>
          prev.map((item) =>
            item.id === linkId
              ? { ...item, ...updates, updated_at: new Date() }
              : item
          )
        );
        await updateLinkInFirestore(linkId, updates, currentUser.uid);
        showToast(`'${updates.title || '링크'}' 정보가 수정되었어요! ✨`);
        setEditTarget(null);
      } catch (error) {
        console.error('링크 수정 에러:', error);
        showToast('링크 수정에 실패했어요.');
        throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [isOwner, currentUser, showToast]
  );

  // 링크 삭제 요청 & 최종 확인
  const handleDeleteRequest = useCallback(
    (link: LinkItem) => {
      if (!isOwner) {
        showToast('삭제 권한이 없습니다.');
        return;
      }
      setDeleteTarget(link);
    },
    [isOwner, showToast]
  );

  const handleConfirmDelete = useCallback(
    async (linkId: string) => {
      if (!isOwner || !currentUser) return;

      setDeletingId(linkId);
      setIsDeleting(true);
      setIsSyncing(true);
      try {
        setLinks((prev) => prev.filter((i) => i.id !== linkId));
        await deleteLinkFromFirestore(linkId, currentUser.uid);
        showToast('링크가 삭제되었어요 🗑️');
        setDeleteTarget(null);
      } catch (error) {
        console.error('링크 삭제 실패:', error);
        showToast('링크 삭제에 실패했어요.');
      } finally {
        setDeletingId(null);
        setIsDeleting(false);
        setIsSyncing(false);
      }
    },
    [isOwner, currentUser, showToast]
  );

  // 링크 클릭 핸들러 (모든 방문자 클릭 카운트 증가 처리)
  const handleLinkClick = useCallback(
    async (targetLink: LinkItem) => {
      if (editTarget || isAddDialogOpen || deleteTarget) return;

      if (!targetUser?.uid) return;

      // 1. 낙관적 업데이트
      setLinks((prev) =>
        prev.map((item) =>
          item.id === targetLink.id
            ? { ...item, clickCount: (item.clickCount || 0) + 1 }
            : item
        )
      );

      // 2. Firestore users/{userId}/links/{linkId} clickCount 필드 증가
      try {
        await incrementClickCountInFirestore(targetLink.id, targetUser.uid);
      } catch (err) {
        console.error('클릭 카운트 저장 실패:', err);
      }
    },
    [editTarget, isAddDialogOpen, deleteTarget, targetUser]
  );

  // 프로필 링크 복사 & 공유
  // 프로필 링크 복사 & 공유 (사용자 핸들 ID 기반)
  const handleCopyProfileLink = useCallback(() => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/${encodeURIComponent(targetHandleId)}`;
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setIsCopied(true);
      showToast(`프로필 주소가 복사되었어요 🔗 (${shareUrl})`);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [targetHandleId, showToast]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/${encodeURIComponent(targetHandleId)}`;
    const name = activeTargetProfile?.displayName || decodedDisplayName;

    if (navigator.share) {
      navigator
        .share({
          title: `${name}의 마이링크`,
          text: `${name}님의 링크 모음 페이지를 확인해보세요!`,
          url: shareUrl,
        })
        .catch(() => null);
    } else {
      navigator.clipboard?.writeText(shareUrl).then(() => {
        showToast(`공유 주소가 클립보드에 복사되었어요 🔗 (${shareUrl})`);
      });
    }
  }, [targetHandleId, activeTargetProfile, decodedDisplayName, showToast]);

  // 프로필 업데이트 콜백
  const handleProfileUpdated = useCallback((updated: UserData) => {
    setCurrentUserProfile(updated);
    setTargetUser(updated);
    showToast('프로필 정보가 변경되었어요! ✨');
  }, [showToast]);

  // 필터링된 링크 목록
  const filteredLinks = useMemo(() => {
    if (selectedCategory === 'all') return links;
    return links.filter((link) => link.category === selectedCategory);
  }, [links, selectedCategory]);

  const totalClicks = useMemo(() => {
    return links.reduce((sum, item) => sum + (item.clickCount || 0), 0);
  }, [links]);

  // ── 검색 로딩 중 ──
  if (isSearchingUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 text-foreground gap-3">
        <Loader2 className="size-8 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
          @{decodedDisplayName} 프로필을 찾는 중...
        </p>
      </div>
    );
  }

  if (!targetUser) {
    notFound();
    return null;
  }

  const targetDisplayName = activeTargetProfile?.displayName || decodedDisplayName;
  const targetHandle = activeTargetProfile?.handle || `@${targetDisplayName}`;
  const targetBio = activeTargetProfile?.bio || `${targetDisplayName}님의 마이링크 페이지입니다 ✨`;
  const targetPhoto = activeTargetProfile?.photoURL || null;

  return (
    <div className="min-h-screen bg-muted/30 text-foreground antialiased relative">
      {/* ── 최상단 실시간 동기화 진행 바 ── */}
      {isSyncing && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-blue-100 dark:bg-blue-950 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 animate-[progress-slide_1.2s_ease-in-out_infinite]" />
        </div>
      )}

      {/* ── 상단 네비게이션 헤더 (요구사항: 헤더 & 프로필 드롭다운에 개인별 페이지 이동 포함) ── */}
      <Header
        currentUser={currentUser}
        userProfile={activeCurrentProfile}
        userDisplayName={currentDisplayName}
        userHandleId={currentHandleId}
        isAuthLoading={isAuthLoading}
        isLoggingIn={isLoggingIn}
        isLoggingOut={isLoggingOut}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onOpenProfileDialog={isOwner ? () => setIsProfileDialogOpen(true) : undefined}
        onOpenAddDialog={isOwner ? () => setIsAddDialogOpen(true) : undefined}
        onRefresh={handleRefresh}
        isSyncing={isSyncing}
        isLoading={isLoadingLinks}
        onShare={handleShare}
        onCopyLink={handleCopyProfileLink}
        isCopied={isCopied}
      />

      {/* ── 메인 셸 (최대 480px) ── */}
      <main className="mx-auto max-w-[480px] px-4 pt-5 pb-20 sm:px-5">
        {/* 본인 페이지인지 타인 페이지인지 안내 배너 */}
        {isOwner ? (
          <div className="mb-5 flex items-center justify-between gap-2 rounded-xl border border-blue-200 bg-blue-50/80 p-3 text-xs text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <UserCheck className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold truncate">
                내 공유용 공개 페이지예요
              </span>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors shrink-0"
            >
              <Pencil className="size-3" />
              <span>통합 관리 홈으로 가기</span>
            </Link>
          </div>
        ) : (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-muted-foreground shadow-xs">
            <div className="flex items-center gap-2 truncate">
              <Sparkles className="size-3.5 text-blue-600" />
              <span className="truncate">
                <strong className="text-foreground">{targetDisplayName}</strong> 님의 공식 프로필 공간
              </span>
            </div>
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
              공개 뷰
            </span>
          </div>
        )}

        {/* ── 프로필 섹션 ── */}
        <section className="flex flex-col items-center text-center">
          {/* 아바타 */}
          <div className="relative mb-3.5 inline-block group">
            <Avatar
              onClick={() => (isOwner ? setIsProfileDialogOpen(true) : undefined)}
              className={cn(
                'size-20 rounded-3xl ring-4 ring-background shadow-md transition-all',
                isOwner && 'cursor-pointer hover:ring-blue-300 dark:hover:ring-blue-700 hover:scale-105'
              )}
            >
              {targetPhoto ? (
                <AvatarImage src={targetPhoto} alt={targetDisplayName} className="object-cover" />
              ) : null}
              <AvatarFallback className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 text-3xl text-white font-bold">
                {targetDisplayName[0]?.toUpperCase() || '✨'}
              </AvatarFallback>
            </Avatar>

            {isOwner ? (
              <button
                type="button"
                onClick={() => setIsProfileDialogOpen(true)}
                title="내 프로필 수정하기"
                className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs ring-2 ring-background hover:bg-blue-700 cursor-pointer transition-transform hover:scale-110"
              >
                <Pencil className="size-3 stroke-[2.5]" />
              </button>
            ) : (
              <div
                className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs ring-2 ring-background"
                title="인증된 사용자"
              >
                <Check className="size-3.5 stroke-[3]" />
              </div>
            )}
          </div>

          {/* 작가/사용자 이름 및 핸들 */}
          <div className="flex items-center gap-1.5">
            <h1 className="text-[22px] font-extrabold tracking-tight text-foreground">
              {targetDisplayName}
            </h1>
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsProfileDialogOpen(true)}
                title="프로필 수정"
                className="size-7 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
              >
                <Pencil className="size-3.5" />
              </Button>
            )}
          </div>

          <p className="mt-1 text-xs font-medium text-muted-foreground font-mono">
            {targetHandle}
          </p>

          {/* 소개글 */}
          <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {targetBio}
          </p>

          {/* Firestore 컬렉션 경로 표기 (users/{userId}/links) */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-muted/80 px-3 py-1 text-[11px] font-medium text-muted-foreground border border-border/80">
            <Layers className="size-3 text-blue-600" />
            <span>경로: users/{targetUser.uid}/links</span>
          </div>

          {/* 빠른 액션 버튼 */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProfileDialogOpen(true)}
                className="rounded-full text-xs font-bold gap-1.5 h-8 px-3.5 border-blue-200 bg-blue-50/70 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 cursor-pointer shadow-xs"
              >
                <Pencil className="size-3.5 text-blue-600 dark:text-blue-400" />
                <span>프로필 수정</span>
              </Button>
            )}

            <Button
              variant={isCopied ? 'default' : 'outline'}
              size="sm"
              onClick={handleCopyProfileLink}
              className="rounded-full text-xs font-semibold gap-1.5 h-8 px-3.5 cursor-pointer shadow-xs"
              title="마이링크 주소 복사"
            >
              {isCopied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5 text-blue-600" />}
              <span>{isCopied ? '복사됨!' : '링크 복사'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-full text-xs font-semibold gap-1.5 h-8 px-3.5 cursor-pointer shadow-xs"
            >
              <Share2 className="size-3.5" />
              <span>공유하기</span>
            </Button>
          </div>

          {/* 통계 요약 카드 */}
          <Card className="mt-5 grid w-full grid-cols-2 gap-2.5 p-3.5 shadow-xs border-border bg-card">
            <div className="flex flex-col items-center justify-center rounded-xl bg-muted/50 py-2.5">
              <span className="text-[11px] font-semibold text-muted-foreground">
                등록된 링크 수
              </span>
              <span className="mt-0.5 text-lg font-black tracking-tight text-foreground">
                {links.length}개
              </span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-muted/50 py-2.5">
              <span className="text-[11px] font-semibold text-muted-foreground">
                총 링크 클릭 수
              </span>
              <span className="mt-0.5 text-lg font-black tracking-tight text-blue-600">
                {totalClicks.toLocaleString()}
              </span>
            </div>
          </Card>
        </section>

        {/* ── 카테고리 필터 탭 (스크롤 없이 한눈에 볼 수 있는 5분할 세그먼트) ── */}
        <section className="mt-5">
          <div className="grid grid-cols-5 gap-1 w-full rounded-2xl bg-muted/70 p-1 border border-border/60">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={cn(
                    'flex items-center justify-center gap-1 py-2 px-1 text-xs font-bold rounded-xl transition-all cursor-pointer',
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs font-black'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                  )}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 링크 목록 섹션 (users/{userId}/links) ── */}
        <section className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">
                링크 목록 ({filteredLinks.length})
              </h2>
              {isSyncing && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Loader2 className="size-3 animate-spin" />
                  <span>동기화 중...</span>
                </span>
              )}
            </div>

            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddDialogOpen(true)}
                className="rounded-full text-xs font-bold gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950 h-7 px-2.5 cursor-pointer"
              >
                <Plus className="size-3" />
                <span>새 링크 추가</span>
              </Button>
            )}
          </div>

          {/* 링크 카드 리스트 */}
          {isLoadingLinks ? (
            <div className="flex flex-col gap-3 py-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex h-20 w-full animate-pulse items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-xs"
                >
                  <div className="size-12 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/5 rounded-md bg-muted" />
                    <div className="h-3 w-4/5 rounded-md bg-muted/60" />
                  </div>
                  <div className="size-8 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          ) : filteredLinks.length === 0 ? (
            <Card className="flex flex-col items-center justify-center border-dashed py-12 text-center bg-card">
              <span className="text-3xl">{isOwner ? '🚀' : '🔍'}</span>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">
                {isOwner
                  ? '아직 등록된 링크가 없어요. 첫 번째 링크를 추가해보세요!'
                  : '등록된 링크가 아직 없거나, 해당 카테고리의 링크가 없어요.'}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {selectedCategory !== 'all' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className="rounded-full text-xs font-semibold cursor-pointer"
                  >
                    전체 링크 보기
                  </Button>
                )}
                {isOwner && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsAddDialogOpen(true)}
                    className="rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    새 링크 추가
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onClick={handleLinkClick}
                onUpdate={handleUpdateLink}
                onEditRequest={isOwner ? (item) => setEditTarget(item) : undefined}
                onDeleteRequest={isOwner ? handleDeleteRequest : undefined}
                isDeleting={deletingId === link.id}
                isEditing={editTarget?.id === link.id}
                canEdit={isOwner}
                onAuthRequired={() => showToast('수정 권한은 해당 페이지의 주인만 가능해요 🔒')}
              />
            ))
          )}
        </section>

        {/* ── 하단 푸터 ── */}
        <footer className="mt-12 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-card px-3.5 py-1.5 border border-border shadow-xs">
            <Zap className="size-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-muted-foreground">
              My Link로 제작된 {targetDisplayName}님의 페이지
            </span>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            © 2026 My Link • users/{targetUser.uid}/links
          </p>
        </footer>
      </main>

      {/* ── 본인 페이지용 다이얼로그들 ── */}
      {isOwner && (
        <>
          <AddLinkDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddLink={handleAddLink}
          />

          <EditLinkDialog
            open={!!editTarget}
            onOpenChange={(open) => {
              if (!open) setEditTarget(null);
            }}
            link={editTarget}
            onUpdateLink={handleUpdateLink}
          />

          <DeleteLinkDialog
            open={!!deleteTarget}
            onOpenChange={(open) => {
              if (!open) setDeleteTarget(null);
            }}
            link={deleteTarget}
            onConfirm={handleConfirmDelete}
            isDeleting={isDeleting}
          />

          <EditProfileDialog
            open={isProfileDialogOpen}
            onOpenChange={setIsProfileDialogOpen}
            userProfile={activeCurrentProfile}
            currentUser={currentUser}
            onProfileUpdated={handleProfileUpdated}
            onErrorToast={showToast}
          />
        </>
      )}

      {/* ── 토스트 알림 ── */}
      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}

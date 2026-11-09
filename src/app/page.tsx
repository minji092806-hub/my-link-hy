'use client';

import * as React from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { DUMMY_LINKS } from '@/data/links';
import type { LinkItem } from '@/types';
import { LinkCard } from '@/components/LinkCard';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Toast } from '@/components/toss/Toast';
import { AddLinkDialog } from '@/components/AddLinkDialog';
import { EditLinkDialog } from '@/components/EditLinkDialog';
import { DeleteLinkDialog } from '@/components/DeleteLinkDialog';
import { EditProfileDialog } from '@/components/EditProfileDialog';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';
import { MyLinkIntro } from '@/components/MyLinkIntro';
import { Header } from '@/components/Header';
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
  LogIn,
  LogOut,
  ShieldAlert,
  FolderLock,
  User as UserIcon,
  Info,
  Pencil,
  Eye,
  Compass,
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

export default function LinksPage() {
  // 인증 상태
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // 링크 데이터 상태
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // 수정, 삭제 및 추가 다이얼로그 상태
  const [editTarget, setEditTarget] = useState<LinkItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // UI 상태
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [totalViews] = useState(3842);

  // TanStack Query 프로필 조회 & 낙관적 업데이트 캐시 실시간 연동
  const { data: cachedProfile } = useProfile(currentUser?.uid);
  const activeUserProfile = cachedProfile ?? userProfile;

  // 디스플레이 네임: 이메일 앞부분(@ 이전) 사용
  const userDisplayName = useMemo(() => {
    if (!currentUser) return '김민지';
    return activeUserProfile?.displayName || getEmailPrefix(currentUser.email, currentUser.displayName);
  }, [currentUser, activeUserProfile]);

  // 사용자 핸들 (ID) 추출 (예: "@kkyareuk" -> "kkyareuk", URL 슬러그로 사용)
  const userHandleId = useMemo(() => {
    return getUserHandleId(activeUserProfile?.handle, currentUser?.email, userDisplayName);
  }, [activeUserProfile?.handle, currentUser?.email, userDisplayName]);

  // 토스트 메시지 헬퍼
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2400);
  }, []);

  // 프로필 수정 성공 콜백
  const handleProfileUpdated = useCallback((updated: UserData) => {
    setUserProfile(updated);
    showToast('프로필 정보가 성공적으로 변경되었어요! ✨');
  }, [showToast]);

  // ─── 1. Firebase onAuthStateChanged 실시간 인증 상태 감지 ───
  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          const emailPrefix = getEmailPrefix(user.email, user.displayName);
          setUserProfile(
            profile || {
              uid: user.uid,
              displayName: emailPrefix,
              email: user.email,
              photoURL: user.photoURL,
              handle: `@${emailPrefix}`,
              bio: '마이링크로 연결되는 나만의 프로필 공간이에요 ✨',
            }
          );
        } catch (err) {
          console.warn('유저 프로필 조회 에러:', err);
        }
      } else {
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ─── 2. 로그인 상태에 따른 Firestore 링크 목록 로드 & 실시간 구독 ───
  // Firestore 경로: users/{currentUser.uid}/links (비로그인: users/anonymous/links 또는 기본 둘러보기)
  useEffect(() => {
    // 인증 상태 파악 전이면 대기
    if (isAuthLoading) return;

    let isMounted = true;
    setIsLoading(true);

    const activeUserId = currentUser ? currentUser.uid : 'anonymous';

    // 실시간 구독 (onSnapshot)
    const unsubscribe = subscribeToLinks(
      activeUserId,
      (fetchedLinks) => {
        if (!isMounted) return;
        if (currentUser) {
          // 로그인한 유저의 개인화된 링크 목록
          setLinks(fetchedLinks);
        } else {
          // 비로그인 사용자: Firestore 데이터가 있으면 표시하고, 없으면 기본 둘러보기 샘플 표시 (조회=누구나)
          setLinks(fetchedLinks.length > 0 ? fetchedLinks : DUMMY_LINKS);
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn(`[Firestore] users/${activeUserId}/links 로드 실패:`, error);
        if (isMounted) {
          setLinks(DUMMY_LINKS);
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [currentUser, isAuthLoading]);

  // ─── 3. Google 팝업 로그인 핸들러 ───
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

  // ─── 4. Google 로그아웃 핸들러 ───
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

  // ─── 5. 권한 제어: 비로그인 수정 시도 차단 및 알림 ───
  const handleAuthRequired = useCallback(() => {
    showToast('수정 권한은 로그인 후 이용 가능해요! 🔒');
  }, [showToast]);

  // 새 링크 추가 버튼 클릭 시 권한 확인
  const handleOpenAddDialog = useCallback(() => {
    if (!currentUser) {
      showToast('새 링크 추가는 Google 로그인 후 가능해요! 🔒');
      return;
    }
    setIsAddDialogOpen(true);
  }, [currentUser, showToast]);

  // 수동 새로고침 핸들러
  const handleRefresh = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    const activeUserId = currentUser ? currentUser.uid : 'anonymous';
    try {
      const refreshedLinks = await getLinksFromFirestore(activeUserId);
      setLinks(refreshedLinks.length > 0 ? refreshedLinks : (currentUser ? [] : DUMMY_LINKS));
      showToast('최신 링크 목록으로 갱신되었어요 🔄');
    } catch (error) {
      console.error('링크 갱신 실패:', error);
      showToast('목록 갱신에 실패했어요.');
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser, isSyncing, showToast]);

  // 링크 추가 핸들러 (users/{currentUser.uid}/links 경로에 저장)
  const handleAddLink = useCallback(
    async (newLinkData: Omit<LinkItem, 'id' | 'order' | 'clickCount'>) => {
      if (!currentUser) {
        showToast('로그인 상태에서만 링크를 추가할 수 있어요.');
        return;
      }

      setIsSyncing(true);
      try {
        const savedLink = await addLinkToFirestore(
          {
            ...newLinkData,
            order: 1,
            clickCount: 0,
            isActive: true,
          },
          currentUser.uid
        );

        // 낙관적 렌더링
        setLinks((prev) => {
          const withoutDup = prev.filter((item) => item.id !== savedLink.id);
          return [savedLink, ...withoutDup];
        });

        if (newLinkData.category && selectedCategory !== 'all' && selectedCategory !== newLinkData.category) {
          setSelectedCategory(newLinkData.category);
        }

        showToast(`'${newLinkData.title}' 링크가 추가되었어요! ✨`);
      } catch (error) {
        console.error('Firestore 저장 중 에러 발생:', error);
        showToast('링크 저장에 실패했어요. 다시 시도해주세요.');
        throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [currentUser, selectedCategory, showToast]
  );

  // 링크 수정 핸들러 (users/{currentUser.uid}/links/{id} updateDoc)
  const handleUpdateLink = useCallback(
    async (
      linkId: string,
      updates: Partial<Pick<LinkItem, 'title' | 'url' | 'description' | 'category' | 'icon' | 'color' | 'badge' | 'isActive'>>
    ) => {
      if (!currentUser) {
        showToast('링크 수정은 로그인 후 가능해요 🔒');
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
        console.error('Firestore 링크 수정 에러:', error);
        showToast('링크 수정에 실패했어요.');
        throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [currentUser, showToast]
  );

  // 링크 삭제 요청 핸들러
  const handleDeleteRequest = useCallback(
    (link: LinkItem) => {
      if (!currentUser) {
        showToast('링크 삭제는 로그인 후 가능해요 🔒');
        return;
      }
      setDeleteTarget(link);
    },
    [currentUser, showToast]
  );

  // 링크 삭제 최종 확인 핸들러 (users/{currentUser.uid}/links/{id} deleteDoc)
  const handleConfirmDelete = useCallback(
    async (linkId: string) => {
      if (!currentUser) {
        showToast('링크 삭제는 로그인 후 가능해요 🔒');
        return;
      }

      setDeletingId(linkId);
      setIsDeleting(true);
      setIsSyncing(true);
      try {
        setLinks((prev) => prev.filter((item) => item.id !== linkId));
        await deleteLinkFromFirestore(linkId, currentUser.uid);
        showToast('링크가 삭제되었어요 🗑️');
        setDeleteTarget(null);
      } catch (error) {
        console.error('Firestore 삭제 에러:', error);
        showToast('링크 삭제에 실패했어요.');
      } finally {
        setDeletingId(null);
        setIsDeleting(false);
        setIsSyncing(false);
      }
    },
    [currentUser, showToast]
  );

  // 총 링크 클릭수 합계
  const totalClicks = useMemo(() => {
    return links.reduce((sum, item) => sum + (item.clickCount || 0), 0);
  }, [links]);

  // 카테고리 필터링된 링크 목록
  const filteredLinks = useMemo(() => {
    if (selectedCategory === 'all') return links;
    return links.filter((link) => link.category === selectedCategory);
  }, [links, selectedCategory]);

  // 링크 클릭 핸들러 (요구사항: 편집 모드가 아닐 때만 카운트 증가, 로그인 확인 및 실패 시 콘솔 에러)
  const handleLinkClick = useCallback(
    async (targetLink: LinkItem) => {
      // 요구사항: 편집 모드(수정 다이얼로그, 추가 모달, 삭제 확인 중, 프로필 편집 등)일 때는 카운트가 증가하지 않음
      if (editTarget || isAddDialogOpen || deleteTarget || isProfileDialogOpen) {
        return;
      }

      // 요구사항 3: 로그인 확인, 실패 시 콘솔 에러
      if (!currentUser || !currentUser.uid) {
        console.error(
          `[클릭 카운트 에러] 로그인 확인 실패: 로그인이 되어 있지 않아 클릭 카운트를 Firestore에 저장할 수 없습니다. (linkId: "${targetLink.id}")`
        );
        return;
      }

      // 1. 낙관적 UI 업데이트 (클릭 즉시 화면에 +1 반영)
      setLinks((prev) =>
        prev.map((item) =>
          item.id === targetLink.id
            ? { ...item, clickCount: (item.clickCount || 0) + 1 }
            : item
        )
      );

      // 2. Firestore 'users/{userId}/links/{linkId}' 문서에 원자적으로 clickCount 필드 저장 (서버 안전 처리)
      try {
        await incrementClickCountInFirestore(targetLink.id, currentUser.uid);
      } catch (error) {
        console.error(
          `[클릭 카운트 에러] Firestore users/${currentUser.uid}/links/${targetLink.id} 클릭 카운트 저장 실패:`,
          error
        );
      }
    },
    [currentUser, editTarget, isAddDialogOpen, deleteTarget, isProfileDialogOpen]
  );

  // 상단 공유하기
  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const shareUrl = currentUser
      ? `${window.location.origin}/${encodeURIComponent(userHandleId)}`
      : window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: currentUser ? `${userDisplayName}의 마이링크` : 'Mylink 마이링크',
          text: '나만의 링크 모음 페이지를 확인해보세요!',
          url: shareUrl,
        })
        .catch(() => null);
    } else {
      navigator.clipboard?.writeText(shareUrl).then(() => {
        showToast(`마이링크 주소가 클립보드에 복사되었어요 🔗 (${shareUrl})`);
      });
    }
  }, [currentUser, userHandleId, userDisplayName, showToast]);

  // 프로필 링크 복사 버튼 (공유하기 버튼 옆에 위치: 사용자 핸들 ID 기반 URL)
  const handleCopyProfileLink = useCallback(() => {
    if (typeof window === 'undefined') return;
    const targetUrl = currentUser
      ? `${window.location.origin}/${encodeURIComponent(userHandleId)}`
      : window.location.href;

    navigator.clipboard?.writeText(targetUrl).then(() => {
      setIsCopied(true);
      showToast(`내 마이링크 주소가 복사되었어요! 🔗 (${targetUrl})`);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [currentUser, userHandleId, showToast]);

  // ─── 0. 인증 상태 로딩 중 ───
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-foreground gap-3">
        <Loader2 className="size-8 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
          마이링크 불러오는 중...
        </p>
      </div>
    );
  }

  // ─── 0. 로그인 전: 마이 링크 설명 & 소개 랜딩 페이지 (둘러보기 모드가 아닐 때) ───
  if (!currentUser && !isDemoMode) {
    return (
      <>
        <MyLinkIntro
          onLogin={handleGoogleLogin}
          isLoggingIn={isLoggingIn}
          onExploreDemo={() => setIsDemoMode(true)}
        />
        <Toast message={toastMsg} visible={toastVisible} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 text-foreground antialiased relative">
      {/* ─── 최상단 실시간 동기화/갱신 진행 표시 바 ─── */}
      {isSyncing && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-blue-100 dark:bg-blue-950 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 animate-[progress-slide_1.2s_ease-in-out_infinite]" />
        </div>
      )}

      {/* ─── 상단 네비게이션 헤더 (GNB, 프로필 드롭다운 & 개인별 페이지 이동 포함) ─── */}
      <Header
        currentUser={currentUser}
        userProfile={activeUserProfile}
        userDisplayName={userDisplayName}
        userHandleId={userHandleId}
        isAuthLoading={isAuthLoading}
        isLoggingIn={isLoggingIn}
        isLoggingOut={isLoggingOut}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onOpenProfileDialog={() => setIsProfileDialogOpen(true)}
        onOpenAddDialog={handleOpenAddDialog}
        onRefresh={handleRefresh}
        isSyncing={isSyncing}
        isLoading={isLoading}
        onShare={handleShare}
        onCopyLink={handleCopyProfileLink}
        isCopied={isCopied}
        onOpenPreview={() => setIsPreviewMode((prev) => !prev)}
        isPreviewMode={isPreviewMode}
      />


      {/* ─── 모바일 최적화 메인 셸 (최대 480px 중앙 정렬, Mobile S/M 패딩 최적화) ─── */}
      <main className="mx-auto max-w-[480px] px-3 pt-3.5 pb-16 sm:px-5 sm:pt-5 sm:pb-20">
        {/* ─── 내 페이지 미리보기 모드 안내 배너 (기존 페이지 내 인라인 렌더링) ─── */}
        {isPreviewMode && (
          <div className="sticky top-16 sm:top-20 z-20 mb-4 sm:mb-5 flex items-center justify-between gap-2 sm:gap-3 rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 sm:p-3.5 text-white shadow-xl animate-in fade-in slide-in-from-top-3 backdrop-blur-md">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <span className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
                <Eye className="size-3.5 sm:size-4" />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] sm:text-xs font-bold leading-tight truncate">
                  내 페이지 미리보기 중
                </span>
                <span className="text-[9px] sm:text-[10px] text-blue-100 truncate mt-0.5">
                  방문자에게 실제로 보이는 화면이에요
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsPreviewMode(false)}
                className="h-6.5 sm:h-7 rounded-full text-[11px] sm:text-xs font-bold bg-white text-blue-700 hover:bg-neutral-100 shadow-xs cursor-pointer px-2.5 sm:px-3"
              >
                편집 모드로 복귀
              </Button>
            </div>
          </div>
        )}

        {/* ─── 비로그인 둘러보기 모드 안내 배너 ─── */}
        {!currentUser && isDemoMode && (
          <div className="sticky top-16 sm:top-20 z-20 mb-4 sm:mb-5 flex items-center justify-between gap-2 sm:gap-3 rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-2.5 sm:p-3.5 text-white shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <span className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
                <Compass className="size-3.5 sm:size-4" />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] sm:text-xs font-bold leading-tight truncate">
                  샘플 프로필 둘러보기 모드
                </span>
                <span className="text-[9px] sm:text-[10px] text-blue-100 truncate mt-0.5">
                  방문자에게 실제로 보이는 프로필 화면을 체험 중이에요
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsDemoMode(false)}
                className="h-6.5 sm:h-7 rounded-full text-[11px] sm:text-xs font-bold bg-white text-blue-700 hover:bg-neutral-100 shadow-xs cursor-pointer px-2.5 sm:px-3"
              >
                소개 페이지로
              </Button>
            </div>
          </div>
        )}

        {/* ─── 요구사항: 만약 로그인을 안 했다면 로그인 이후에 사용할 수 있도록 설명 문구 표시 ─── */}
        {!isPreviewMode && !currentUser && !isAuthLoading && (
          <Card className="mb-5 border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/50 p-4 shadow-xs dark:border-blue-900/50 dark:from-blue-950/30 dark:via-neutral-900 dark:to-blue-950/20">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <ShieldAlert className="size-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-foreground">
                    로그인 후 나만의 마이링크를 시작해보세요!
                  </h3>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  지금은 <span className="font-semibold text-blue-600">둘러보기(조회) 모드</span>예요.
                  Google 계정으로 로그인하시면 나만의 개인 경로(
                  <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-foreground">
                    users/&#123;uid&#125;/links
                  </code>
                  )에 링크를 등록하고 언제든 자유롭게 수정·삭제할 수 있어요.
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-1.5 px-3.5 cursor-pointer shadow-xs"
                  >
                    <GoogleIcon className="size-3.5" />
                    <span>3초 만에 Google로 로그인</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ─── 프로필 섹션 (해당 경로의 유저 정보 화면 표시) ─── */}
        <section className="flex flex-col items-center text-center">
          {/* 아바타 */}
          <div className="relative mb-3 inline-block group">
            <Avatar
              onClick={() => (currentUser ? setIsProfileDialogOpen(true) : handleAuthRequired())}
              className={cn(
                'size-16 sm:size-20 rounded-2xl sm:rounded-3xl ring-4 ring-background shadow-md transition-all',
                currentUser && 'cursor-pointer hover:ring-blue-300 dark:hover:ring-blue-700 hover:scale-105'
              )}
              title={currentUser ? '클릭하여 프로필 수정' : undefined}
            >
              {activeUserProfile?.photoURL || currentUser?.photoURL ? (
                <AvatarImage
                  src={activeUserProfile?.photoURL || currentUser?.photoURL || ''}
                  alt={userDisplayName}
                />
              ) : null}
              <AvatarFallback className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 text-2xl sm:text-3xl text-white font-bold">
                {currentUser ? userDisplayName[0]?.toUpperCase() : 'MY'}
              </AvatarFallback>
            </Avatar>
            {/* 공식 인증 또는 수정 뱃지 */}
            {currentUser && !isPreviewMode ? (
              <button
                type="button"
                onClick={() => setIsProfileDialogOpen(true)}
                title="프로필 수정하기"
                className="absolute -bottom-1 -right-1 flex size-5.5 sm:size-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs ring-2 ring-background hover:bg-blue-700 cursor-pointer transition-transform hover:scale-110"
              >
                <Pencil className="size-2.5 sm:size-3 stroke-[2.5]" />
              </button>
            ) : (
              <div
                className="absolute -bottom-1 -right-1 flex size-5.5 sm:size-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs ring-2 ring-background"
                title={currentUser ? '인증된 프로필' : '공식 데모 계정'}
              >
                <Check className="size-3 sm:size-3.5 stroke-[3]" />
              </div>
            )}
          </div>

          {/* 작가/사용자 이름 및 핸들 (users/{user.uid} 정보 표시) */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <h1 className="text-xl sm:text-[22px] font-extrabold tracking-tight text-foreground truncate max-w-[220px] sm:max-w-xs">
              {currentUser ? userDisplayName : 'Mylink'}
            </h1>
            <span className="text-xs sm:text-[14px] font-semibold text-muted-foreground">
              {currentUser ? '(내 링크)' : '(공식 데모)'}
            </span>
            {!isPreviewMode && currentUser && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsProfileDialogOpen(true)}
                title="프로필 수정"
                className="size-6 sm:size-7 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
              >
                <Pencil className="size-3 sm:size-3.5" />
              </Button>
            )}
          </div>

          <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs font-medium text-muted-foreground font-mono">
            {currentUser
              ? (activeUserProfile?.handle || `@${userDisplayName}`)
              : '@mylink'}
          </p>

          {/* 소개글 */}
          <p className="mt-2 max-w-[280px] sm:max-w-xs text-xs sm:text-sm leading-relaxed text-muted-foreground px-1">
            {currentUser ? (
              activeUserProfile?.bio || `${userDisplayName}님의 개인 마이링크 페이지예요.`
            ) : (
              <>
                마이링크로 연결되는 나만의 프로필 공간이에요 ✨<br />
                포트폴리오와 소셜 채널을 한곳에서 만나보세요.
              </>
            )}
          </p>

          {/* 프로필 액션 버튼 (프로필 수정 & 링크 복사 & 공유하기) */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {!isPreviewMode && currentUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProfileDialogOpen(true)}
                className="rounded-full text-xs font-bold gap-1.5 h-7.5 sm:h-8 px-3.5 sm:px-4 border-blue-200 bg-blue-50/70 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 cursor-pointer shadow-xs"
              >
                <Pencil className="size-3 sm:size-3.5 text-blue-600 dark:text-blue-400" />
                <span>프로필 수정</span>
              </Button>
            )}
            <Button
              variant={isCopied ? 'default' : 'outline'}
              size="sm"
              onClick={handleCopyProfileLink}
              className="rounded-full text-xs font-bold gap-1.5 h-7.5 sm:h-8 px-3.5 sm:px-4 border-border bg-card hover:bg-muted text-foreground cursor-pointer shadow-xs"
              title="마이링크 주소 복사"
            >
              {isCopied ? <Check className="size-3 sm:size-3.5 text-green-500" /> : <Copy className="size-3 sm:size-3.5 text-blue-600" />}
              <span>{isCopied ? '복사됨!' : '링크 복사'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-full text-xs font-bold gap-1.5 h-7.5 sm:h-8 px-3.5 sm:px-4 border-border bg-card hover:bg-muted text-foreground cursor-pointer shadow-xs"
            >
              <Share2 className="size-3 sm:size-3.5 text-blue-600 dark:text-blue-400" />
              <span>공유하기</span>
            </Button>
          </div>

          {/* ─── 통계 요약 카드 ─── */}
          <Card className="mt-4 sm:mt-5 grid w-full grid-cols-2 gap-2 sm:gap-2.5 p-2.5 sm:p-3.5 shadow-xs border-border bg-card">
            <div className="flex flex-col items-center justify-center rounded-xl bg-muted/50 py-2 sm:py-2.5">
              <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
                총 방문자 수
              </span>
              <span className="mt-0.5 text-base sm:text-lg font-black tracking-tight text-foreground">
                {currentUser ? '1' : totalViews.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-muted/50 py-2 sm:py-2.5">
              <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
                총 링크 클릭 수
              </span>
              <span className="mt-0.5 text-base sm:text-lg font-black tracking-tight text-blue-600">
                {totalClicks.toLocaleString()}
              </span>
            </div>
          </Card>
        </section>

        {/* ─── 카테고리 필터 탭 (스크롤 없이 한눈에 볼 수 있는 5분할 세그먼트) ─── */}
        <section className="mt-4 sm:mt-5">
          <div className="grid grid-cols-5 gap-0.5 sm:gap-1 w-full rounded-2xl bg-muted/70 p-1 border border-border/60">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={cn(
                    'flex flex-col xs:flex-row items-center justify-center gap-0.5 xs:gap-1 py-1.5 xs:py-2 px-0.5 xs:px-1 rounded-xl transition-all cursor-pointer',
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs font-black'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                  )}
                >
                  <span className="shrink-0 text-xs sm:text-sm">{tab.icon}</span>
                  <span className="text-[10px] xs:text-[11px] sm:text-xs truncate leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── 링크 목록 섹션 (핵심 기능) ─── */}
        <section className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">
                링크 목록 ({filteredLinks.length})
              </h2>
              {isSyncing && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 animate-in fade-in">
                  <Loader2 className="size-3 animate-spin" />
                  <span>동기화 중...</span>
                </span>
              )}
            </div>

            {/* 권한: 수정=로그인필수 (미리보기 모드일 땐 숨김) */}
            {!isPreviewMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenAddDialog}
                className="rounded-full text-xs font-bold gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950 h-7 px-2.5 cursor-pointer"
              >
                <Plus className="size-3" />
                <span>새 링크 추가</span>
              </Button>
            )}
          </div>

          {/* 링크 카드 리스트 */}
          {isLoading ? (
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
              <span className="text-3xl">{currentUser ? '🚀' : '🔍'}</span>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">
                {currentUser
                  ? '아직 등록된 링크가 없어요. 첫 번째 링크를 추가해보세요!'
                  : '해당 카테고리의 링크가 없어요'}
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
                {!isPreviewMode && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleOpenAddDialog}
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
                onEditRequest={(link) => setEditTarget(link)}
                onDeleteRequest={handleDeleteRequest}
                isDeleting={deletingId === link.id}
                isEditing={editTarget?.id === link.id}
                canEdit={!isPreviewMode && !!currentUser}
                onAuthRequired={handleAuthRequired}
              />
            ))
          )}
        </section>

        {/* ─── 하단 푸터 ─── */}
        <footer className="mt-12 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-card px-3.5 py-1.5 border border-border shadow-xs">
            <Zap className="size-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-muted-foreground">
              My Link로 제작된 페이지예요
            </span>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            © 2026 My Link • Google 로그인 & Firestore 개인화 링크트리
          </p>
        </footer>
      </main>

      {/* ─── 링크 추가 다이얼로그 ─── */}
      <AddLinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddLink={handleAddLink}
      />

      {/* ─── 링크 수정 다이얼로그 (카테고리, 아이콘, 뱃지, 컬러, 설명 포함) ─── */}
      <EditLinkDialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        link={editTarget}
        onUpdateLink={handleUpdateLink}
      />

      {/* ─── 링크 삭제 확인 모달 ─── */}
      <DeleteLinkDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        link={deleteTarget}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* ─── 프로필 수정 다이얼로그 (TanStack Query 낙관적 업데이트 적용) ─── */}
      <EditProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        userProfile={activeUserProfile}
        currentUser={currentUser}
        onProfileUpdated={handleProfileUpdated}
        onErrorToast={showToast}
      />

      {/* ─── 토스트 알림 ─── */}
      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}

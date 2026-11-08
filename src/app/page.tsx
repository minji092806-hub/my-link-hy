'use client';

import * as React from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { DUMMY_LINKS } from '@/data/links';
import type { LinkItem } from '@/types';
import { LinkCard } from '@/components/LinkCard';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Toast } from '@/components/toss/Toast';
import { AddLinkDialog } from '@/components/AddLinkDialog';
import { DeleteLinkDialog } from '@/components/DeleteLinkDialog';
import { cn } from '@/lib/utils';
import {
  addLinkToFirestore,
  updateLinkInFirestore,
  incrementClickCountInFirestore,
  deleteLinkFromFirestore,
  getLinksFromFirestore,
} from '@/lib/linkService';
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
} from 'lucide-react';

type FilterCategory = 'all' | 'work' | 'sns' | 'shop' | 'contact';

interface TabConfig {
  id: FilterCategory;
  label: string;
  icon: React.ReactNode;
}

const CATEGORY_TABS: TabConfig[] = [
  { id: 'all', label: '전체', icon: <Sparkles className="size-3.5" /> },
  { id: 'work', label: '연재작·작품', icon: <BookOpen className="size-3.5" /> },
  { id: 'sns', label: 'SNS·채널', icon: <Camera className="size-3.5" /> },
  { id: 'shop', label: '굿즈·스토어', icon: <ShoppingBag className="size-3.5" /> },
  { id: 'contact', label: '문의·후원', icon: <Mail className="size-3.5" /> },
];

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [totalViews] = useState(3842);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Firestore 1회 조회 (실시간 리스너 미사용)
  useEffect(() => {
    let isMounted = true;
    const fetchLinks = async () => {
      setIsLoading(true);
      try {
        const firestoreLinks = await getLinksFromFirestore();
        if (isMounted) {
          setLinks(firestoreLinks.length > 0 ? firestoreLinks : DUMMY_LINKS);
        }
      } catch (error) {
        console.warn('Firestore links 로드 실패, 기본 더미 데이터를 표시합니다:', error);
        if (isMounted) {
          setLinks(DUMMY_LINKS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLinks();
    return () => {
      isMounted = false;
    };
  }, []);

  // 토스트 메시지 헬퍼
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2200);
  }, []);

  // 수동 새로고침 핸들러
  const handleRefresh = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const refreshedLinks = await getLinksFromFirestore();
      setLinks(refreshedLinks);
      showToast('최신 링크 목록으로 갱신되었어요 🔄');
    } catch (error) {
      console.error('링크 갱신 실패:', error);
      showToast('목록 갱신에 실패했어요.');
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, showToast]);

  // 링크 추가 핸들러 (Firestore 'users/anonymous/links' 에 저장 및 최신순 갱신)
  const handleAddLink = useCallback(
    async (newLinkData: Omit<LinkItem, 'id' | 'order' | 'clickCount'>) => {
      setIsSyncing(true);
      try {
        const savedLink = await addLinkToFirestore({
          ...newLinkData,
          order: 1,
          clickCount: 0,
          isActive: true,
        });

        // 실시간 구독(onSnapshot)으로도 갱신되지만,
        // 사용자에게 즉각적인 체감 반응성을 제공하기 위해 최신순(맨 앞)에 낙관적 반영
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
    [selectedCategory, showToast]
  );

  // 링크 수정 핸들러 (Firestore 'users/anonymous/links/{id}' updateDoc 및 UI 즉시 반영)
  const handleUpdateLink = useCallback(
    async (linkId: string, updates: { title: string; url: string }) => {
      setIsSyncing(true);
      try {
        // UI 즉각적인 낙관적 반영 (수정 시각 updated_at 포함)
        setLinks((prev) =>
          prev.map((item) =>
            item.id === linkId
              ? { ...item, title: updates.title, url: updates.url, updated_at: new Date() }
              : item
          )
        );
        await updateLinkInFirestore(linkId, updates);
        showToast(`'${updates.title}' 링크가 수정되었어요! ✨`);
      } catch (error) {
        console.error('Firestore 링크 수정 에러:', error);
        showToast('링크 수정에 실패했어요.');
        throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [showToast]
  );

  // 링크 삭제 요청 핸들러 (확인 모달 표시)
  const handleDeleteRequest = useCallback((link: LinkItem) => {
    setDeleteTarget(link);
  }, []);

  // 링크 삭제 최종 확인 핸들러 (Firestore 'users/anonymous/links/{id}' deleteDoc)
  const handleConfirmDelete = useCallback(
    async (linkId: string) => {
      setDeletingId(linkId);
      setIsDeleting(true);
      setIsSyncing(true);
      try {
        setLinks((prev) => prev.filter((item) => item.id !== linkId));
        await deleteLinkFromFirestore(linkId);
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
    [showToast]
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

  // 링크 클릭 핸들러 (낙관적 클릭수 증가 및 Firestore 동기화)
  const handleLinkClick = useCallback((targetLink: LinkItem) => {
    setLinks((prev) =>
      prev.map((item) =>
        item.id === targetLink.id
          ? { ...item, clickCount: (item.clickCount || 0) + 1 }
          : item
      )
    );
    // Firestore 원자적 클릭 카운트 증가
    incrementClickCountInFirestore(targetLink.id);
  }, []);

  // 상단 공유하기
  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: '김민지(꺄륵) 작가 마이링크',
          text: '김민지 작가의 연재작, SNS, 굿즈 및 포트폴리오 링크를 확인해보세요!',
          url: shareUrl,
        })
        .catch(() => null);
    } else {
      navigator.clipboard?.writeText(shareUrl).then(() => {
        showToast('링크가 클립보드에 복사되었어요 🔗');
      });
    }
  }, [showToast]);

  // 프로필 링크 복사 버튼
  const handleCopyProfileLink = useCallback(() => {
    if (typeof window === 'undefined') return;
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setIsCopied(true);
      showToast('프로필 링크가 복사되었어요 🔗');
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [showToast]);

  return (
    <div className="min-h-screen bg-muted/30 text-foreground antialiased relative">
      {/* ─── 최상단 실시간 동기화/갱신 진행 표시 바 (TDS 슬림 바) ─── */}
      {isSyncing && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-blue-100 dark:bg-blue-950 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 animate-[progress-slide_1.2s_ease-in-out_infinite]" />
        </div>
      )}

      {/* ─── 상단 네비게이션 헤더 (TDS 모던 바) ─── */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md transition-all sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white shadow-xs">
            🔗
          </span>
          <span className="text-[15px] font-bold tracking-tight text-foreground">
            마이링크
          </span>
          <Badge variant="blue" className="text-[11px] font-semibold px-2 py-0.5">
            @minji_art
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 새로고침 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isSyncing || isLoading}
            title="목록 새로고침"
            className="size-8 rounded-full p-0 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RefreshCw className={cn('size-3.5', isSyncing && 'animate-spin text-blue-600')} />
          </Button>

          {/* 새 링크 추가 버튼 */}
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            className="rounded-full gap-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs h-8 px-3 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>새 링크</span>
          </Button>

          {/* 공유 버튼 */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            className="rounded-full gap-1.5 text-xs font-semibold h-8 px-3 cursor-pointer"
          >
            <Share2 className="size-3.5" />
            <span>공유</span>
          </Button>
        </div>
      </header>

      {/* ─── 모바일 최적화 메인 셸 (최대 480px 중앙 정렬) ─── */}
      <main className="mx-auto max-w-[480px] px-4 pt-6 pb-20 sm:px-5">
        {/* ─── 프로필 섹션 ─── */}
        <section className="flex flex-col items-center text-center">
          {/* 아바타 (토스 스타일 라운드 링 + 인증 뱃지) */}
          <div className="relative mb-3.5 inline-block">
            <Avatar className="size-20 rounded-3xl ring-4 ring-background shadow-md">
              <AvatarFallback className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 text-3xl text-white">
                🎨
              </AvatarFallback>
            </Avatar>
            {/* 공식 인증 체크 뱃지 */}
            <div
              className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs ring-2 ring-background"
              title="공식 인증 계정"
            >
              <Check className="size-3.5 stroke-[3]" />
            </div>
          </div>

          {/* 작가 이름 및 핸들 */}
          <div className="flex items-center gap-1.5">
            <h1 className="text-[22px] font-extrabold tracking-tight text-foreground">
              김민지
            </h1>
            <span className="text-[14px] font-semibold text-muted-foreground">(꺄륵)</span>
          </div>

          <p className="mt-1 text-xs font-medium text-muted-foreground">
            @minji_art
          </p>

          {/* 한 줄 소개 (해요체) */}
          <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            일상 속 작은 온기를 그리는 웹툰 작가예요.<br />
            연재작과 포트폴리오, 굿즈 링크를 모두 모아두었어요.
          </p>

          {/* 빠른 액션 칩스 */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant={isCopied ? "default" : "secondary"}
              size="sm"
              onClick={handleCopyProfileLink}
              className="rounded-full text-xs font-bold gap-1.5 h-8 px-3.5 cursor-pointer"
            >
              {isCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              <span>{isCopied ? '복사됨!' : '링크 복사'}</span>
            </Button>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-full text-xs font-semibold gap-1.5 h-8 px-3 cursor-pointer"
              )}
            >
              <Camera className="size-3.5 text-pink-500" />
              <span>인스타그램</span>
            </a>
            <a
              href="mailto:contact@kkyareuk.com"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-full text-xs font-semibold gap-1.5 h-8 px-3 cursor-pointer"
              )}
            >
              <Mail className="size-3.5 text-blue-500" />
              <span>외주 문의</span>
            </a>
          </div>

          {/* ─── 통계 요약 카드 (PRD F-06 지표) ─── */}
          <Card className="mt-5 grid w-full grid-cols-2 gap-2.5 p-3.5 shadow-xs border-border bg-card">
            <div className="flex flex-col items-center justify-center rounded-xl bg-muted/50 py-2.5">
              <span className="text-[11px] font-semibold text-muted-foreground">
                총 방문자 수
              </span>
              <span className="mt-0.5 text-lg font-black tracking-tight text-foreground">
                {totalViews.toLocaleString()}
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

        {/* ─── 카테고리 필터 탭 ─── */}
        <section className="mt-6">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(tab.id)}
                  className="rounded-full text-xs font-semibold gap-1.5 h-8 px-3 shrink-0 cursor-pointer"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </Button>
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddDialogOpen(true)}
              className="rounded-full text-xs font-bold gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950 h-7 px-2.5 cursor-pointer"
            >
              <Plus className="size-3" />
              <span>새 링크 추가</span>
            </Button>
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
              <span className="text-3xl">🔍</span>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">
                해당 카테고리의 링크가 없어요
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="rounded-full text-xs font-semibold cursor-pointer"
                >
                  전체 링크 보기
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsAddDialogOpen(true)}
                  className="rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1 cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  새 링크 추가
                </Button>
              </div>
            </Card>
          ) : (
            filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onClick={handleLinkClick}
                onUpdate={handleUpdateLink}
                onDeleteRequest={handleDeleteRequest}
                isDeleting={deletingId === link.id}
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
            © 2026 My Link • shadcn/ui & Tailwind CSS 기반 링크트리
          </p>
        </footer>
      </main>

      {/* ─── 링크 추가 다이얼로그 (PRD F-03-1) ─── */}
      <AddLinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddLink={handleAddLink}
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

      {/* ─── 토스트 알림 ─── */}
      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}

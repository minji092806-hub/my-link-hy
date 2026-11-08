'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import type { LinkItem } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Eye,
  ExternalLink,
  Trash2,
  Pencil,
  Loader2,
  Check,
  X,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isValidUrl, normalizeUrl } from '@/components/AddLinkDialog';

function formatUpdatedAt(val: unknown): string | null {
  if (!val) return null;
  let date: Date | null = null;
  if (val instanceof Date) {
    date = val;
  } else if (
    typeof val === 'object' &&
    val !== null &&
    'toDate' in val &&
    typeof (val as { toDate: () => Date }).toDate === 'function'
  ) {
    date = (val as { toDate: () => Date }).toDate();
  } else if (typeof val === 'string' || typeof val === 'number') {
    date = new Date(val);
  }
  if (!date || isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

interface LinkCardProps {
  link: LinkItem;
  onClick?: (link: LinkItem) => void;
  onUpdate?: (id: string, updates: Partial<LinkItem>) => Promise<void> | void;
  onEditRequest?: (link: LinkItem) => void;
  onDeleteRequest?: (link: LinkItem) => void;
  isDeleting?: boolean;
  canEdit?: boolean;
  onAuthRequired?: () => void;
  className?: string;
}

export function LinkCard({
  link,
  onClick,
  onUpdate,
  onEditRequest,
  onDeleteRequest,
  isDeleting,
  canEdit = true,
  onAuthRequired,
  className,
}: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  // link 데이터가 업데이트되면 편집용 기본값도 동기화
  useEffect(() => {
    setEditTitle(link.title);
    setEditUrl(link.url);
  }, [link.title, link.url]);

  // 입력 검증 (추가할 때와 동일한 기준: 필수, 길이, URL 형식)
  const validate = (): boolean => {
    const newErrors: { title?: string; url?: string } = {};
    const trimmedTitle = editTitle.trim();
    const trimmedUrl = editUrl.trim();

    if (!trimmedTitle) {
      newErrors.title = '링크 제목은 필수 항목이에요.';
    } else if (trimmedTitle.length < 2) {
      newErrors.title = '최소 2자 이상 입력해주세요.';
    } else if (trimmedTitle.length > 40) {
      newErrors.title = '최대 40자까지 입력할 수 있어요.';
    }

    if (!trimmedUrl) {
      newErrors.url = '연결할 URL을 입력해주세요.';
    } else if (!isValidUrl(normalizeUrl(trimmedUrl))) {
      newErrors.url = '올바른 URL(예: naver.com) 또는 mailto:... 형식을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canEdit === false) {
      if (onAuthRequired) onAuthRequired();
      return;
    }
    // 팝업 다이얼로그 요청이 있으면 다이얼로그 열기
    if (onEditRequest) {
      onEditRequest(link);
      return;
    }
    setEditTitle(link.title);
    setEditUrl(link.url);
    setErrors({});
    setIsEditing(true);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 원래 값으로 복구
    setEditTitle(link.title);
    setEditUrl(link.url);
    setErrors({});
    setIsEditing(false);
  };

  const handleSaveEdit = async (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validate()) return;

    try {
      setIsSaving(true);
      if (onUpdate) {
        await onUpdate(link.id, {
          title: editTitle.trim(),
          url: normalizeUrl(editUrl.trim()),
        });
      }
      setIsEditing(false);
    } catch (err) {
      console.error('링크 저장 실패:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canEdit === false) {
      if (onAuthRequired) onAuthRequired();
      return;
    }
    if (onDeleteRequest) {
      onDeleteRequest(link);
    }
  };

  const handleOpenLink = () => {
    if (isEditing) return;
    if (onClick) {
      onClick(link);
    }
    if (typeof window !== 'undefined') {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getBadgeVariant = (badge?: string): 'success' | 'blue' | 'pink' | 'purple' | 'secondary' => {
    switch (badge) {
      case '연재중':
        return 'success';
      case 'NEW':
        return 'blue';
      case 'DAILY':
        return 'pink';
      case '팬전용':
        return 'purple';
      default:
        return 'secondary';
    }
  };

  // ─── [1] 인라인 편집 모드 UI ───────────────────────────────────────
  if (isEditing) {
    return (
      <Card
        className={cn(
          'w-full p-4 border-2 border-blue-500 bg-card text-card-foreground shadow-md rounded-2xl transition-all duration-200',
          className
        )}
      >
        <div className="flex items-start gap-3">
          {/* 아이콘 */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl select-none dark:bg-blue-950 mt-1">
            {link.icon || '🔗'}
          </div>

          {/* 입력 필드들 */}
          <div className="flex-1 min-w-0 space-y-2.5">
            {/* 제목 입력 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-foreground">
                  링크 제목 <span className="text-red-500">*</span>
                </span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {editTitle.length}/40
                </span>
              </div>
              <Input
                type="text"
                value={editTitle}
                maxLength={40}
                placeholder="링크 제목 입력"
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: undefined }));
                  }
                }}
                disabled={isSaving}
                autoFocus
                className={cn(
                  'h-9 text-sm font-semibold rounded-xl bg-background',
                  errors.title ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                )}
              />
              {errors.title && (
                <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-500">
                  <AlertCircle className="size-3 shrink-0" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* 주소 입력 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-foreground">
                  연결할 URL <span className="text-red-500">*</span>
                </span>
              </div>
              <Input
                type="text"
                value={editUrl}
                placeholder="https://example.com 또는 naver.com"
                onChange={(e) => {
                  setEditUrl(e.target.value);
                  if (errors.url) {
                    setErrors((prev) => ({ ...prev, url: undefined }));
                  }
                }}
                disabled={isSaving}
                className={cn(
                  'h-9 text-xs font-mono rounded-xl bg-background',
                  errors.url ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                )}
              />
              {errors.url && (
                <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-500">
                  <AlertCircle className="size-3 shrink-0" />
                  {errors.url}
                </p>
              )}
            </div>

            {/* 저장/취소 버튼 */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="h-8 px-3 rounded-lg text-xs font-medium cursor-pointer"
              >
                <X className="size-3 mr-1" />
                취소
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="h-8 px-4 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs gap-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <Check className="size-3 stroke-[3]" />
                    <span>저장</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // ─── [2] 기본 표시 모드 UI (수정/삭제 버튼 항상 표시) ───────────────
  return (
    <Card
      onClick={handleOpenLink}
      className={cn(
        'group relative flex w-full items-center justify-between gap-3.5 p-4 border border-border bg-card text-card-foreground shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md active:scale-[0.99] cursor-pointer overflow-hidden rounded-2xl',
        isDeleting && 'opacity-60 pointer-events-none bg-muted/30',
        className
      )}
    >
      {/* 좌측: 아이콘 컨테이너 */}
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl transition-transform duration-200 group-hover:scale-105 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 select-none">
        {link.icon || '🔗'}
      </div>

      {/* 중앙: 텍스트 정보 */}
      <div className="flex min-w-0 flex-1 flex-col text-left">
        <div className="flex items-center gap-2">
          <span className="truncate text-base font-bold text-foreground group-hover:text-blue-600 transition-colors">
            {link.title}
          </span>
          {link.badge && (
            <Badge
              variant={getBadgeVariant(link.badge)}
              className="text-[10px] px-2 py-0.5 shrink-0"
            >
              {link.badge}
            </Badge>
          )}
        </div>

        {link.description ? (
          <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
            {link.description}
          </p>
        ) : (
          <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground/80 font-mono">
            {link.url}
          </p>
        )}

        {/* 클릭수 및 수정 시각 지표 */}
        <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-muted-foreground flex-wrap">
          {typeof link.clickCount === 'number' && (
            <div className="flex items-center gap-1">
              <Eye className="size-3 text-muted-foreground/80" />
              <span>{link.clickCount.toLocaleString()}회 클릭</span>
            </div>
          )}
          {formatUpdatedAt(link.updated_at) && (
            <div
              className="flex items-center gap-1 text-[10px] text-muted-foreground/80"
              title={`마지막 수정: ${formatUpdatedAt(link.updated_at)}`}
            >
              <Clock className="size-3 text-muted-foreground/70" />
              <span>수정 {formatUpdatedAt(link.updated_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* 우측 액션: 수정 버튼 + 삭제 버튼 + 외부 이동 버튼 (항상 표시) */}
      <div
        className="flex items-center gap-1 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 수정 버튼 (연필 아이콘 - 항상 표시) */}
        {(onUpdate || onEditRequest) && (
          <button
            type="button"
            onClick={handleStartEdit}
            title={canEdit ? "링크 수정" : "수정하려면 로그인이 필요해요"}
            aria-label="링크 수정"
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-neutral-600 hover:text-blue-600 hover:bg-blue-50 active:scale-95 transition-colors cursor-pointer dark:text-neutral-400 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 border border-transparent hover:border-blue-200 dark:hover:border-blue-900",
              !canEdit && "opacity-70 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60"
            )}
          >
            <Pencil className="size-3.5" />
          </button>
        )}

        {/* 삭제 버튼 (휴지통 아이콘 - 항상 표시) */}
        {onDeleteRequest && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            title={canEdit ? "링크 삭제" : "삭제하려면 로그인이 필요해요"}
            aria-label="링크 삭제"
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-colors cursor-pointer dark:text-neutral-400 dark:hover:bg-red-950/60 dark:hover:text-red-400 border border-transparent hover:border-red-200 dark:hover:border-red-900 disabled:pointer-events-none",
              !canEdit && "opacity-70 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60"
            )}
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin text-red-500" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </button>
        )}

        {/* 새 창 열기 버튼 (항상 표시) */}
        <div
          onClick={handleOpenLink}
          title="링크 열기"
          aria-label="링크 열기"
          className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white group-hover:translate-x-0.5 cursor-pointer ml-0.5"
        >
          <ExternalLink className="size-3.5" />
        </div>
      </div>
    </Card>
  );
}

'use client';

import * as React from 'react';
import { useState, useId, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { LinkItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Pencil,
  ExternalLink,
  BookOpen,
  Camera,
  ShoppingBag,
  Mail,
  Sparkles,
  AlertCircle,
  Check,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { isValidUrl, normalizeUrl } from '@/components/AddLinkDialog';

interface EditLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: LinkItem | null;
  onUpdateLink: (
    id: string,
    updates: Partial<Pick<LinkItem, 'title' | 'url' | 'description' | 'category' | 'icon' | 'color' | 'badge' | 'isActive'>>
  ) => Promise<void> | void;
}

// ─── 상수 정의 ─────────────────────────────────────────────────────────
const CATEGORY_OPTIONS: Array<{
  id: 'work' | 'sns' | 'shop' | 'contact';
  label: string;
  icon: React.ReactNode;
}> = [
  { id: 'work', label: '연재작 · 작품', icon: <BookOpen className="size-3.5" /> },
  { id: 'sns', label: 'SNS · 채널', icon: <Camera className="size-3.5" /> },
  { id: 'shop', label: '굿즈 · 스토어', icon: <ShoppingBag className="size-3.5" /> },
  { id: 'contact', label: '문의 · 후원', icon: <Mail className="size-3.5" /> },
];

const PRESET_ICONS = ['🔗', '📖', '📸', '🛍️', '📂', '🎬', '💬', '☕', '💌', '🎨', '💻', '⭐', '🚀', '🎵'];
const PRESET_BADGES = ['없음', 'NEW', '연재중', 'DAILY', 'HOT', '팬전용', '공식', '추천'];
const COLOR_OPTIONS: Array<{ id: NonNullable<LinkItem['color']>; label: string; bgClass: string }> = [
  { id: 'lime', label: '라임', bgClass: 'bg-lime-400' },
  { id: 'pink', label: '핑크', bgClass: 'bg-pink-400' },
  { id: 'cyan', label: '시안', bgClass: 'bg-cyan-400' },
  { id: 'yellow', label: '옐로우', bgClass: 'bg-amber-400' },
  { id: 'purple', label: '퍼플', bgClass: 'bg-purple-400' },
  { id: 'white', label: '화이트', bgClass: 'bg-neutral-200' },
];

const TITLE_MIN = 2;
const TITLE_MAX = 40;
const DESC_MAX = 60;

// ─── Zod 스키마 정의 ──────────────────────────────────────────────────
const editLinkFormSchema = z.object({
  title: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, '링크 제목은 필수 항목이에요.')
        .min(TITLE_MIN, `최소 ${TITLE_MIN}자 이상 입력해주세요.`)
        .max(TITLE_MAX, `최대 ${TITLE_MAX}자까지 입력할 수 있어요.`)
    ),
  url: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, '연결할 URL을 입력해주세요.')
        .refine((val) => isValidUrl(normalizeUrl(val)), {
          message: '올바른 URL(예: naver.com) 또는 mailto:... 형식을 입력해주세요.',
        })
    ),
  category: z.enum(['work', 'sns', 'shop', 'contact']),
  icon: z.string().default('🔗'),
  badge: z.string().optional(),
  color: z.enum(['lime', 'pink', 'cyan', 'yellow', 'purple', 'white']),
  description: z
    .string()
    .max(DESC_MAX, `최대 ${DESC_MAX}자까지 입력할 수 있어요.`)
    .optional(),
});

type EditLinkFormValues = z.input<typeof editLinkFormSchema>;
type EditLinkFormOutput = z.output<typeof editLinkFormSchema>;

// ─── 셰이크 애니메이션 훅 ──────────────────────────────────────────────
function useShake(): [boolean, () => void] {
  const [shaking, setShaking] = useState(false);
  const trigger = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);
  return [shaking, trigger];
}

export function EditLinkDialog({
  open,
  onOpenChange,
  link,
  onUpdateLink,
}: EditLinkDialogProps) {
  const [titleShaking, triggerTitleShake] = useShake();
  const [urlShaking, triggerUrlShake] = useShake();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleId = useId();
  const urlId = useId();
  const descId = useId();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, touchedFields, isValid },
  } = useForm<EditLinkFormValues, unknown, EditLinkFormOutput>({
    resolver: zodResolver(editLinkFormSchema),
    mode: 'onTouched',
    defaultValues: {
      title: link?.title || '',
      url: link?.url || '',
      category: link?.category || 'work',
      icon: link?.icon || '🔗',
      badge: link?.badge || '',
      color: link?.color || 'cyan',
      description: link?.description || '',
    },
  });

  // link 데이터가 변경되거나 모달이 열릴 때 기존 링크 정보로 폼 초기화
  useEffect(() => {
    if (link && open) {
      reset({
        title: link.title || '',
        url: link.url || '',
        category: link.category || 'work',
        icon: link.icon || '🔗',
        badge: link.badge || '',
        color: link.color || 'cyan',
        description: link.description || '',
      });
    }
  }, [link, open, reset]);

  // 실시간 폼 상태 감시 (미리보기용)
  const currentTitle = watch('title') || '';
  const currentUrl = watch('url') || '';
  const currentIcon = watch('icon') || '🔗';
  const currentCategory = watch('category') || 'work';
  const currentBadge = watch('badge') || '';
  const currentDescription = watch('description') || '';

  const getBadgeVariant = (b?: string): 'success' | 'blue' | 'pink' | 'purple' | 'secondary' => {
    switch (b) {
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

  const onValidSubmit = async (data: EditLinkFormOutput) => {
    if (!link) return;
    try {
      setIsSubmitting(true);
      const finalUrl = normalizeUrl(data.url);
      await onUpdateLink(link.id, {
        title: data.title,
        url: finalUrl,
        category: data.category,
        icon: (data.icon && data.icon.trim()) || '🔗',
        badge: data.badge && data.badge !== '없음' ? data.badge : undefined,
        color: data.color,
        description: data.description?.trim() || undefined,
      });
      onOpenChange(false);
    } catch (err) {
      console.error('링크 수정 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalidSubmit = (fieldErrors: typeof errors) => {
    if (fieldErrors.title) triggerTitleShake();
    if (fieldErrors.url) triggerUrlShake();
  };

  if (!link) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-[480px] p-5 sm:p-6 sm:rounded-3xl overflow-x-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Pencil className="size-4" />
            </span>
            <DialogTitle>링크 정보 수정</DialogTitle>
          </div>
          <DialogDescription>
            카테고리, 아이콘, 뱃지, 컬러, 설명 등 모든 정보를 수정할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="mt-1 space-y-3.5 w-full min-w-0 overflow-hidden">
          {/* ── 실시간 미리보기 ───────────────────────────────────────── */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-2.5 sm:p-3 dark:border-blue-900/40 dark:bg-blue-950/20 w-full min-w-0">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Sparkles className="size-3" />
                실시간 미리보기
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">
                수정 사항이 바로 반영돼요
              </span>
            </div>

            <Card className="flex w-full min-w-0 items-center justify-between gap-3 p-3 border-border bg-card shadow-xs overflow-hidden">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xl select-none">
                {currentIcon.trim() || '🔗'}
              </div>
              <div className="flex min-w-0 flex-1 flex-col text-left overflow-hidden">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={cn(
                      'truncate text-sm font-bold',
                      currentTitle.trim() ? 'text-foreground' : 'text-muted-foreground/50 italic'
                    )}
                  >
                    {currentTitle.trim() || '링크 제목이 여기에 표시돼요'}
                  </span>
                  {currentBadge && currentBadge !== '없음' && (
                    <Badge variant={getBadgeVariant(currentBadge)} className="text-[9px] px-1.5 py-0 shrink-0">
                      {currentBadge}
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {currentDescription.trim()
                    ? currentDescription.trim()
                    : currentUrl.trim()
                      ? normalizeUrl(currentUrl)
                      : '링크 설명 또는 URL이 표시돼요'}
                </p>
              </div>
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ExternalLink className="size-3.5" />
              </div>
            </Card>
          </div>

          {/* ── 링크 제목 (필수) ─────────────────────────────────────── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor={titleId} className="text-xs font-bold text-foreground">
                링크 제목 <span className="text-red-500">*</span>
              </Label>
              <span
                className={cn(
                  'text-[11px] tabular-nums transition-colors',
                  currentTitle.length >= TITLE_MAX
                    ? 'text-red-500 font-semibold'
                    : currentTitle.length >= TITLE_MAX - 5
                      ? 'text-amber-500 font-semibold'
                      : 'text-muted-foreground'
                )}
              >
                {currentTitle.length}/{TITLE_MAX}
              </span>
            </div>

            <div className={cn(titleShaking && 'animate-[shake_0.4s_ease-in-out]')}>
              <Input
                id={titleId}
                type="text"
                maxLength={TITLE_MAX}
                placeholder="예: 네이버웹툰: 꺄륵이의 하루하루"
                {...register('title')}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? `${titleId}-error` : undefined}
                className={cn(
                  errors.title
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                    : touchedFields.title && !errors.title && currentTitle.trim()
                      ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20'
                      : ''
                )}
              />
            </div>

            {errors.title ? (
              <p id={`${titleId}-error`} role="alert" className="flex items-center gap-1 text-[11px] font-medium text-red-500">
                <AlertCircle className="size-3 shrink-0" />
                {errors.title.message}
              </p>
            ) : touchedFields.title && currentTitle.trim() ? (
              <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <CheckCircle2 className="size-3 shrink-0" />
                좋아요!
              </p>
            ) : null}
          </div>

          {/* ── URL (필수) ───────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label htmlFor={urlId} className="text-xs font-bold text-foreground">
              연결할 URL <span className="text-red-500">*</span>
            </Label>

            <div className={cn(urlShaking && 'animate-[shake_0.4s_ease-in-out]')}>
              <Input
                id={urlId}
                type="text"
                placeholder="https://example.com 또는 naver.com"
                {...register('url')}
                aria-invalid={!!errors.url}
                aria-describedby={errors.url ? `${urlId}-error` : undefined}
                className={cn(
                  errors.url
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                    : touchedFields.url && !errors.url && currentUrl.trim()
                      ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20'
                      : ''
                )}
              />
            </div>

            {errors.url && (
              <p id={`${urlId}-error`} role="alert" className="flex items-center gap-1 text-[11px] font-medium text-red-500">
                <AlertCircle className="size-3 shrink-0" />
                {errors.url.message}
              </p>
            )}
          </div>

          {/* ── 카테고리 (2열 2행 카드 그리드) ────────────────────────── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground">카테고리</Label>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                {CATEGORY_OPTIONS.find((c) => c.id === currentCategory)?.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = currentCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setValue('category', cat.id, { shouldValidate: true })}
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition-all active:scale-[0.98] cursor-pointer min-w-0',
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-500 shadow-xs ring-1 ring-blue-600/20'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          'flex size-6 shrink-0 items-center justify-center rounded-lg text-xs transition-colors',
                          isSelected
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {cat.icon}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-bold whitespace-nowrap truncate',
                          isSelected ? 'text-blue-950 dark:text-blue-100 font-extrabold' : 'text-foreground/90'
                        )}
                      >
                        {cat.label}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 대표 아이콘 ──────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground">대표 아이콘</Label>
              <span className="text-[11px] text-muted-foreground">추천 클릭 또는 직접 입력</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Input
                type="text"
                maxLength={4}
                {...register('icon')}
                title="직접 이모지 입력"
                placeholder="🔗"
                className={cn(
                  'w-12 text-center text-base h-8.5 shrink-0 px-1',
                  !currentIcon.trim() && 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/20'
                )}
              />
              <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
                {PRESET_ICONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setValue('icon', emoji, { shouldValidate: true })}
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-lg border text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer',
                      currentIcon === emoji
                        ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950 shadow-xs'
                        : 'border-border bg-background hover:bg-muted'
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── 뱃지 (선택) ──────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground">
              뱃지 <span className="text-[11px] font-normal text-muted-foreground">(선택)</span>
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_BADGES.map((b) => {
                const isSelected = (b === '없음' && !currentBadge) || currentBadge === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setValue('badge', b === '없음' ? '' : b, { shouldValidate: true })}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-all active:scale-95 cursor-pointer',
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 테마 컬러 ─────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground">테마 컬러</Label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = watch('color') === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setValue('color', c.id, { shouldValidate: true })}
                    title={c.label}
                    className={cn(
                      'flex size-6 items-center justify-center rounded-full transition-transform active:scale-90 ring-offset-2 ring-offset-background cursor-pointer',
                      c.bgClass,
                      isSelected ? 'ring-2 ring-blue-600 scale-110' : 'hover:scale-105'
                    )}
                  >
                    {isSelected && <Check className="size-3 text-neutral-900 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 한 줄 설명 (선택) ────────────────────────────────────── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor={descId} className="text-xs font-bold text-foreground">
                한 줄 설명 <span className="text-[11px] font-normal text-muted-foreground">(선택)</span>
              </Label>
              <span
                className={cn(
                  'text-[11px] tabular-nums transition-colors',
                  currentDescription.length >= DESC_MAX
                    ? 'text-red-500 font-semibold'
                    : currentDescription.length >= DESC_MAX - 10
                      ? 'text-amber-500 font-semibold'
                      : 'text-muted-foreground'
                )}
              >
                {currentDescription.length}/{DESC_MAX}
              </span>
            </div>
            <Input
              id={descId}
              type="text"
              maxLength={DESC_MAX}
              placeholder="예: 매주 화·목 정기 연재 중! 최신화 바로 보러가기"
              {...register('description')}
              className={cn(
                currentDescription.length >= DESC_MAX && 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
              )}
            />
          </div>

          {/* ── 액션 버튼 ────────────────────────────────────────────── */}
          <DialogFooter className="pt-4 flex flex-row items-center justify-end gap-2 border-t border-border mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 rounded-xl font-medium cursor-pointer"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                (touchedFields.title && !!errors.title) ||
                (touchedFields.url && !!errors.url)
              }
              className={cn(
                'h-10 px-6 rounded-xl font-bold text-white shadow-sm cursor-pointer transition-all flex items-center gap-2',
                isValid && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-400 opacity-70 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>수정 중...</span>
                </>
              ) : (
                '수정 완료'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

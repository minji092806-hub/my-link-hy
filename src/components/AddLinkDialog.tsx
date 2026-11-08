'use client';

import * as React from 'react';
import { useState, useId, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  PlusCircle,
  ExternalLink,
  BookOpen,
  Camera,
  ShoppingBag,
  Mail,
  Sparkles,
  AlertCircle,
  Check,
  CheckCircle2,
} from 'lucide-react';

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLink: (newLink: Omit<LinkItem, 'id' | 'order' | 'clickCount'>) => void;
}

// ─── 상수 정의 ─────────────────────────────────────────────────────────
const CATEGORY_OPTIONS: Array<{
  id: 'work' | 'sns' | 'shop' | 'contact';
  label: string;
  icon: React.ReactNode;
}> = [
  { id: 'work', label: '연재작·작품', icon: <BookOpen className="size-3.5" /> },
  { id: 'sns', label: 'SNS·채널', icon: <Camera className="size-3.5" /> },
  { id: 'shop', label: '굿즈·스토어', icon: <ShoppingBag className="size-3.5" /> },
  { id: 'contact', label: '문의·후원', icon: <Mail className="size-3.5" /> },
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

// ─── URL 정규화 및 유효성 헬퍼 ───────────────────────────────────────────
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:')
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function isValidUrl(url: string): boolean {
  if (url.startsWith('mailto:')) {
    const email = url.slice('mailto:'.length);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    return parsed.hostname.includes('.');
  } catch {
    return false;
  }
}

// ─── Zod 스키마 정의 ──────────────────────────────────────────────────
const addLinkFormSchema = z.object({
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

type AddLinkFormValues = z.input<typeof addLinkFormSchema>;
type AddLinkFormOutput = z.output<typeof addLinkFormSchema>;

const DEFAULT_FORM_VALUES: AddLinkFormValues = {
  title: '',
  url: '',
  category: 'work',
  icon: '🔗',
  badge: '',
  color: 'cyan',
  description: '',
};

// ─── 셰이크 애니메이션 훅 ──────────────────────────────────────────────
function useShake(): [boolean, () => void] {
  const [shaking, setShaking] = useState(false);
  const trigger = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);
  return [shaking, trigger];
}

// ─── 메인 다이얼로그 컴포넌트 ──────────────────────────────────────────
export function AddLinkDialog({ open, onOpenChange, onAddLink }: AddLinkDialogProps) {
  const [titleShaking, triggerTitleShake] = useShake();
  const [urlShaking, triggerUrlShake] = useShake();

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
  } = useForm<AddLinkFormValues, unknown, AddLinkFormOutput>({
    resolver: zodResolver(addLinkFormSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_FORM_VALUES,
  });

  // 실시간 폼 상태 감시 (미리보기 및 카운터용)
  const currentTitle = watch('title') || '';
  const currentUrl = watch('url') || '';
  const currentIcon = watch('icon') || '🔗';
  const currentCategory = watch('category') || 'work';
  const currentBadge = watch('badge') || '';
  const currentColor = watch('color') || 'cyan';
  const currentDescription = watch('description') || '';

  // 다이얼로그가 닫힐 때 폼 초기화
  useEffect(() => {
    if (!open) {
      reset(DEFAULT_FORM_VALUES);
    }
  }, [open, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(DEFAULT_FORM_VALUES);
    }
    onOpenChange(nextOpen);
  };

  // 폼 검증 성공 시 제출
  const onValidSubmit = (data: AddLinkFormOutput) => {
    const finalUrl = normalizeUrl(data.url);
    onAddLink({
      title: data.title,
      url: finalUrl,
      description: data.description?.trim() || undefined,
      icon: (data.icon && data.icon.trim()) || '🔗',
      category: data.category,
      badge: data.badge && data.badge !== '없음' ? data.badge : undefined,
      color: data.color,
      isActive: true,
    });
    handleOpenChange(false);
  };

  // 폼 검증 실패 시 셰이크 애니메이션 트리거
  const onInvalidSubmit = (fieldErrors: typeof errors) => {
    if (fieldErrors.title) triggerTitleShake();
    if (fieldErrors.url) triggerUrlShake();
  };

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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[460px] p-6 sm:rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <PlusCircle className="size-4" />
            </span>
            <DialogTitle>새 링크 추가</DialogTitle>
          </div>
          <DialogDescription>
            React Hook Form과 Zod 검증으로 안전하게 링크를 추가할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="mt-2 space-y-4">
          {/* ── 실시간 미리보기 ───────────────────────────────────────── */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-3 dark:border-blue-900/40 dark:bg-blue-950/20">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Sparkles className="size-3" />
                실시간 미리보기
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">
                입력하는 내용이 바로 반영돼요
              </span>
            </div>

            <Card className="flex w-full items-center justify-between gap-3 p-3 border-border bg-card shadow-xs">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xl select-none">
                {currentIcon.trim() || '🔗'}
              </div>
              <div className="flex min-w-0 flex-1 flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'truncate text-sm font-bold',
                      currentTitle.trim() ? 'text-foreground' : 'text-muted-foreground/50 italic'
                    )}
                  >
                    {currentTitle.trim() || '링크 제목이 여기에 표시돼요'}
                  </span>
                  {currentBadge && currentBadge !== '없음' && (
                    <Badge variant={getBadgeVariant(currentBadge)} className="text-[9px] px-1.5 py-0">
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
                autoFocus
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
            ) : (
              <p className="text-[11px] text-muted-foreground">
                링크 카드에 표시될 이름이에요. ({TITLE_MIN}~{TITLE_MAX}자)
              </p>
            )}
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

            {errors.url ? (
              <p id={`${urlId}-error`} role="alert" className="flex items-center gap-1 text-[11px] font-medium text-red-500">
                <AlertCircle className="size-3 shrink-0" />
                {errors.url.message}
              </p>
            ) : touchedFields.url && currentUrl.trim() ? (
              <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <CheckCircle2 className="size-3 shrink-0" />
                유효한 주소예요.
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                https:// 없이 입력해도 자동으로 추가돼요.
              </p>
            )}
          </div>

          {/* ── 카테고리 ─────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground">카테고리</Label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = currentCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setValue('category', cat.id, { shouldValidate: true })}
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer',
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-400 shadow-xs'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 대표 아이콘 ──────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground">대표 아이콘</Label>
              <span className="text-[11px] text-muted-foreground">선택 또는 직접 입력</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Input
                type="text"
                maxLength={4}
                {...register('icon')}
                className={cn(
                  'w-16 text-center text-lg h-9',
                  !currentIcon.trim() && 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/20'
                )}
              />
              {!currentIcon.trim() && (
                <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  빈칸이면 🔗로 표시돼요
                </span>
              )}
              <div className="flex flex-1 items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {PRESET_ICONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setValue('icon', emoji, { shouldValidate: true })}
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-lg border text-base transition-all hover:scale-110 active:scale-95 cursor-pointer',
                      currentIcon === emoji
                        ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950'
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
                const isSelected = currentColor === c.id;
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
            {currentDescription.length >= DESC_MAX && (
              <p className="flex items-center gap-1 text-[11px] font-medium text-red-500">
                <AlertCircle className="size-3 shrink-0" />
                최대 {DESC_MAX}자까지 입력할 수 있어요.
              </p>
            )}
          </div>

          {/* ── 액션 버튼 ────────────────────────────────────────────── */}
          <DialogFooter className="pt-4 flex flex-row items-center justify-end gap-2 border-t border-border mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="h-10 px-4 rounded-xl font-medium cursor-pointer"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={
                /* 필수 필드가 터치된 후 에러가 있거나 이미 유효하지 않을 때 비활성화 */
                (touchedFields.title && !!errors.title) || (touchedFields.url && !!errors.url)
              }
              className={cn(
                'h-10 px-6 rounded-xl font-bold text-white shadow-sm cursor-pointer transition-all',
                isValid
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-400 opacity-70 cursor-not-allowed'
              )}
            >
              저장
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

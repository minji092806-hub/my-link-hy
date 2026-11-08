'use client';

import * as React from 'react';
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
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

interface DeleteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: LinkItem | null;
  onConfirm: (linkId: string) => Promise<void> | void;
  isDeleting?: boolean;
}

export function DeleteLinkDialog({
  open,
  onOpenChange,
  link,
  onConfirm,
  isDeleting = false,
}: DeleteLinkDialogProps) {
  if (!link) return null;

  const handleConfirm = async () => {
    await onConfirm(link.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] p-6 sm:rounded-3xl">
        <DialogHeader className="items-center text-center sm:items-center sm:text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <Trash2 className="size-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            정말 삭제하시겠습니까?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pt-1">
            <span className="font-semibold text-foreground">[{link.title}]</span> 링크가 삭제됩니다.
          </DialogDescription>
        </DialogHeader>

        {/* 경고 알림 박스 */}
        <div className="my-2 flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200/70 dark:border-red-900/40">
          <AlertTriangle className="size-4 shrink-0" />
          <span>이 작업은 되돌릴 수 없습니다.</span>
        </div>

        <DialogFooter className="mt-4 flex flex-row items-center justify-center gap-2.5 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="flex-1 h-10 rounded-xl font-medium cursor-pointer"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 h-10 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>삭제 중...</span>
              </>
            ) : (
              <span>삭제하기</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

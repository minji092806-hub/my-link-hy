'use client';

import React from 'react';

interface BottomCTAProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function BottomCTA({ label, onClick, disabled = false }: BottomCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[440px] px-4 pb-6">
      {/* 보호 그라디언트 — 스크롤 콘텐츠와 CTA 사이 */}
      <div className="pointer-events-none absolute left-0 right-0 top-[-28px] h-7 bg-gradient-to-t from-[#F2F4F6] to-transparent" />

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={[
          'relative flex h-14 w-full items-center justify-center rounded-2xl text-[17px] font-bold text-white transition-all',
          'shadow-[0_4px_20px_rgba(49,130,246,0.40)]',
          disabled
            ? 'cursor-not-allowed bg-[#B0B8C1] opacity-60 shadow-none'
            : 'bg-[#3182F6] hover:brightness-105 active:brightness-95 active:scale-[0.98]',
        ].join(' ')}
      >
        {label}
      </button>
    </div>
  );
}

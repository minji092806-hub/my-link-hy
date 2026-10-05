'use client';

import React from 'react';

interface TopBarProps {
  title?: string;
  onShare?: () => void;
}

export function TopBar({ title = '김민지', onShare }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#F2F4F6] bg-white/90 px-5 backdrop-blur-md transition-all">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F3FF] text-xs font-bold text-[#3182F6]">
          M
        </span>
        <h1 className="text-[17px] font-bold tracking-tight text-[#191F28]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onShare}
          type="button"
          aria-label="공유하기"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#4E5968] transition-colors hover:bg-[#F2F4F6] active:bg-[#E5E8EB]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    </header>
  );
}

'use client';

import React from 'react';

interface ProfileHeaderProps {
  onCopyLink: () => void;
}

export function ProfileHeader({ onCopyLink }: ProfileHeaderProps) {
  return (
    <section className="flex flex-col items-center px-5 pt-8 pb-6 text-center">
      {/* 아바타 (64px, 둥근 형태 + 미세한 링) */}
      <div className="relative mb-3 inline-block">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#3182F6] to-[#60A5FA] text-3xl shadow-sm ring-4 ring-white">
          🎨
        </div>
        {/* 토스 인증 체크마크 */}
        <div 
          className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#3182F6] text-white shadow-sm ring-2 ring-white"
          title="공식 인증 작가"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* 이름 및 타이틀 */}
      <div className="flex items-center gap-1.5">
        <h2 className="text-[22px] font-bold tracking-tight text-[#191F28]">
          김민지
        </h2>
        <span className="text-sm font-medium text-[#4E5968]">(꺄륵)</span>
      </div>

      {/* 해요체 소개 문구 */}
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-[#4E5968]">
        일상 속 작은 온기를 그리는 웹툰 작가예요.<br />
        연재작과 굿즈를 한곳에 모았어요.
      </p>

      {/* 소셜 및 링크 칩스 */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[34px] items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-semibold text-[#333D4B] border border-[#E5E8EB] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:bg-[#F9FAFB] active:scale-95"
        >
          <span>📷</span>
          <span>인스타그램</span>
        </a>
        <a
          href="#webtoon"
          className="inline-flex h-[34px] items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-semibold text-[#333D4B] border border-[#E5E8EB] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:bg-[#F9FAFB] active:scale-95"
        >
          <span>📖</span>
          <span>네이버웹툰</span>
        </a>
        <button
          onClick={onCopyLink}
          type="button"
          className="inline-flex h-[34px] items-center gap-1.5 rounded-full bg-[#E8F3FF] px-3.5 text-xs font-semibold text-[#3182F6] transition-all hover:bg-[#D9EAFE] active:scale-95"
        >
          <span>🔗</span>
          <span>프로필 링크 복사</span>
        </button>
      </div>
    </section>
  );
}

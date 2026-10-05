'use client';

import React, { useState } from 'react';

interface ListRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'red' | 'grey';
  href?: string;
  onClick?: () => void;
}

export function ListRow({
  icon,
  title,
  subtitle,
  badge,
  badgeColor = 'grey',
  href,
  onClick,
}: ListRowProps) {
  const badgeColorMap = {
    blue: 'bg-[#E8F3FF] text-[#3182F6]',
    green: 'bg-[#E6FAF0] text-[#04C062]',
    red: 'bg-[#FDECEE] text-[#F04452]',
    grey: 'bg-[#F2F4F6] text-[#6B7684]',
  };

  const inner = (
    <div className="flex min-h-[64px] w-full items-center gap-3 px-4 py-3.5">
      {/* 아이콘 */}
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#F2F4F6] text-xl">
        {icon}
      </div>

      {/* 텍스트 스택 */}
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <p className="truncate text-[15px] font-semibold leading-snug text-[#191F28]">{title}</p>
        {subtitle && (
          <p className="truncate text-[13px] leading-snug text-[#8B95A1]">{subtitle}</p>
        )}
      </div>

      {/* 배지 or 화살표 */}
      {badge ? (
        <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColorMap[badgeColor]}`}>
          {badge}
        </span>
      ) : (
        <svg
          className="h-4 w-4 flex-shrink-0 text-[#B0B8C1]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="block w-full transition-colors hover:bg-[#F9FAFB] active:bg-[#F2F4F6]"
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full text-left transition-colors hover:bg-[#F9FAFB] active:bg-[#F2F4F6]"
    >
      {inner}
    </button>
  );
}

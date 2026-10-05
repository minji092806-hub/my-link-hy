"use client";

import React, { useState } from "react";

interface ProfileSectionProps {
  onCopyLink: () => void;
  copied: boolean;
}

export function ProfileSection({ onCopyLink, copied }: ProfileSectionProps) {
  const [cheerCount, setCheerCount] = useState<number>(142);
  const [isCheering, setIsCheering] = useState<boolean>(false);

  const handleCheer = () => {
    setCheerCount((prev) => prev + 1);
    setIsCheering(true);
    setTimeout(() => setIsCheering(false), 250);
  };

  return (
    <div className="w-full bg-white rounded-3xl border-3 sm:border-4 border-black p-5 sm:p-7 shadow-[7px_7px_0px_0px_#000] relative flex flex-col items-center text-center">
      {/* Lanyard Hole Clip Graphic */}
      <div className="w-12 h-3.5 bg-neutral-200 border-2 border-black rounded-full mb-3 shadow-[1px_1px_0px_#000] flex items-center justify-center">
        <div className="w-5 h-1.5 bg-black rounded-full" />
      </div>

      {/* Top Tape Deco */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FFDE59] text-black font-black text-[11px] sm:text-xs uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_0px_#000] -rotate-1 select-none">
        ★ ARTIST PASS #0708 ★
      </div>

      {/* Polaroid-Style Avatar Container */}
      <div className="relative mt-2 mb-4 bg-neutral-100 p-2.5 pb-3 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_#000] -rotate-1 hover:rotate-0 transition-transform">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-2 border-black bg-[#FFE5EC] flex items-center justify-center text-5xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] select-none">
          🎨
        </div>
        <div className="mt-1.5 text-[11px] font-black text-neutral-800 tracking-tight select-none">
          artist kkyareuk ✨
        </div>

        {/* Live Working Status Badge */}
        <div className="absolute -bottom-2 -right-3 px-2.5 py-0.5 rounded-full bg-[#38EF7D] border-2 border-black text-black text-[10px] sm:text-[11px] font-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 select-none rotate-2">
          <span className="w-2 h-2 rounded-full bg-black animate-ping" />
          <span>마감 작업 중!</span>
        </div>
      </div>

      {/* Title & Nickname Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
        <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-[#D8BBFF] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] -rotate-1">
          네이버 웹툰 작가
        </span>
        <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-[#FF8FAB] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] rotate-1">
          작가 · 꺄륵
        </span>
      </div>

      {/* Name */}
      <h1 className="text-3xl font-black tracking-tight text-black mb-1">
        김민지
      </h1>
      <p className="text-xs font-extrabold text-neutral-500 mb-4 tracking-wider">
        @KKYAREUK_STUDIO
      </p>

      {/* Memo Box Bio */}
      <div className="w-full bg-[#FFFBEA] border-2 border-black rounded-xl p-3 sm:p-3.5 mb-5 shadow-[3px_3px_0px_0px_#000] text-center relative">
        <span className="absolute -top-2.5 left-4 px-2 py-0.2 bg-[#FF6B8B] text-white text-[9px] font-black uppercase rounded border border-black -rotate-2">
          INTRO
        </span>
        <p className="text-neutral-900 text-xs sm:text-sm font-bold leading-relaxed break-keep mt-1">
          일상의 소소하고 따뜻한 순간들을 만화로 그립니다. 🎨<br />
          선 하나, 대사 한 줄에 기분 좋은 위로를 전해요! ✨
        </p>
      </div>

      {/* Stats Bento Grid */}
      <div className="w-full grid grid-cols-3 gap-2 mb-5">
        <div className="bg-[#E7F0FD] border-2 border-black rounded-xl p-2 sm:p-2.5 shadow-[2px_2px_0px_0px_#000] flex flex-col items-center hover:-translate-y-0.5 transition-transform">
          <span className="text-[10px] sm:text-xs font-bold text-neutral-600">연재 화수</span>
          <span className="text-base sm:text-lg font-black text-black">42화+</span>
        </div>
        <div className="bg-[#FFE5EC] border-2 border-black rounded-xl p-2 sm:p-2.5 shadow-[2px_2px_0px_0px_#000] flex flex-col items-center hover:-translate-y-0.5 transition-transform">
          <span className="text-[10px] sm:text-xs font-bold text-neutral-600">독자 평점</span>
          <span className="text-base sm:text-lg font-black text-black">★ 9.98</span>
        </div>
        <div className="bg-[#E8F8F5] border-2 border-black rounded-xl p-2 sm:p-2.5 shadow-[2px_2px_0px_0px_#000] flex flex-col items-center hover:-translate-y-0.5 transition-transform">
          <span className="text-[10px] sm:text-xs font-bold text-neutral-600">SNS 팬</span>
          <span className="text-base sm:text-lg font-black text-black">5.8만</span>
        </div>
      </div>

      {/* Tag Badges */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-5">
        <span className="px-2 py-0.5 rounded border-2 border-black bg-neutral-100 text-black text-[11px] font-black shadow-[1.5px_1.5px_0px_#000]">
          #일상툰
        </span>
        <span className="px-2 py-0.5 rounded border-2 border-black bg-neutral-100 text-black text-[11px] font-black shadow-[1.5px_1.5px_0px_#000]">
          #공감툰
        </span>
        <span className="px-2 py-0.5 rounded border-2 border-black bg-neutral-100 text-black text-[11px] font-black shadow-[1.5px_1.5px_0px_#000]">
          #캐릭터
        </span>
        <span className="px-2 py-0.5 rounded border-2 border-black bg-[#A3FF38] text-black text-[11px] font-black shadow-[1.5px_1.5px_0px_#000]">
          #목요연재
        </span>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleCheer}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 sm:border-3 border-black bg-[#FF8FAB] text-black font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer ${
            isCheering ? "scale-95 bg-[#FF6B8B]" : ""
          }`}
        >
          <span className="text-lg">💖</span>
          <span>작가에게 응원 보내기</span>
          <span className="px-2 py-0.5 rounded-full bg-white border-2 border-black text-xs font-black shadow-[1px_1px_0px_#000]">
            {cheerCount}
          </span>
        </button>

        <button
          type="button"
          onClick={onCopyLink}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 sm:border-3 border-black bg-[#70D6FF] text-black font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
        >
          <span className="text-base">{copied ? "✅" : "🔗"}</span>
          <span>{copied ? "프로필 주소 복사완료!" : "프로필 링크 공유하기"}</span>
        </button>
      </div>

      {/* Social Channels */}
      <div className="w-full border-t-2 border-dashed border-black mt-5 pt-4 flex items-center justify-center gap-3">
        <a
          href="#instagram"
          title="인스타그램"
          className="w-10 h-10 rounded-xl border-2 border-black bg-[#FFE5EC] flex items-center justify-center font-bold text-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:shadow-none transition-all text-lg"
        >
          📷
        </a>
        <a
          href="#webtoon"
          title="웹툰"
          className="w-10 h-10 rounded-xl border-2 border-black bg-[#FFDE59] flex items-center justify-center font-bold text-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:shadow-none transition-all text-lg"
        >
          📖
        </a>
        <a
          href="#youtube"
          title="유튜브"
          className="w-10 h-10 rounded-xl border-2 border-black bg-[#FF6B8B] flex items-center justify-center font-bold text-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:shadow-none transition-all text-lg"
        >
          ▶️
        </a>
        <a
          href="#contact"
          title="이메일 문의"
          className="w-10 h-10 rounded-xl border-2 border-black bg-[#B7EF83] flex items-center justify-center font-bold text-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:shadow-none transition-all text-lg"
        >
          💌
        </a>
      </div>

      {/* Realistic Barcode Graphic Footer */}
      <div className="w-full mt-4 pt-3 border-t-2 border-black flex flex-col items-center select-none opacity-85">
        <div className="font-mono text-sm tracking-[4px] font-black text-black">
          ||||| | || ||||| | |||| | ||| | ||
        </div>
        <span className="font-mono text-[9px] font-bold text-neutral-600 tracking-widest mt-0.5">
          AUTH-ID: HY-2026-MINJI-LINK
        </span>
      </div>
    </div>
  );
}

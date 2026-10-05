import React from "react";

const TICKER_ITEMS = [
  "🔥 [HOT] 네이버 목요 웹툰 42화 절찬 연재 중!",
  "★",
  "🧸 꺄륵 한정판 아크릴 키링 & 스티커팩 스토어 OPEN",
  "★",
  "🎨 일상의 따뜻한 온도를 그리는 작가 김민지",
  "★",
  "📮 2026 하반기 브랜드 콜라보 & 외주 문의 접수 중",
  "★",
  "✨ INSTAGRAM @kkyareuk 팔로우하고 미공개 컷 보기",
  "★",
];

export function Ticker() {
  const content = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full flex flex-col border-b-2 sm:border-b-3 border-black select-none">
      {/* Top Caution Stripe Deco */}
      <div className="w-full h-1.5 sm:h-2 bg-caution-stripes border-b border-black" />

      {/* Marquee Ticker */}
      <div className="w-full bg-[#FFDE59] overflow-hidden py-1.5 sm:py-2 shadow-[0_2px_0_0_#000]">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-6 text-black font-black text-xs sm:text-sm tracking-wider">
          {content.map((item, index) => (
            <span
              key={index}
              className={
                item === "★"
                  ? "text-black bg-black text-[#FFDE59] px-1.5 py-0.5 rounded text-[10px] font-black"
                  : "hover:underline cursor-default flex items-center gap-1.5"
              }
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

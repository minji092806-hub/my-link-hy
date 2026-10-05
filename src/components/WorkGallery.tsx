import React from "react";
import type { WorkItem } from "@/types";

const WORKS_DATA: WorkItem[] = [
  {
    id: "work-1",
    title: "오늘도 꺄륵한 하루",
    genre: "일상 / 코믹 / 힐링",
    status: "연재 중 (매주 목)",
    description: "대학 졸업 후 좌충우돌 일러스트레이터 생존기! 엉뚱하지만 사랑스러운 매일의 기록.",
    thumbnailEmoji: "🐱",
    color: "yellow",
    rating: "★ 9.98",
    episodes: "총 42화 연재 중",
    linkUrl: "#webtoon",
  },
  {
    id: "work-2",
    title: "한밤의 작업실 고양이",
    genre: "드라마 / 판타지",
    status: "단편 완결",
    description: "마감 직전, 모니터 뒤에서 나타난 말하는 고양이와 함께 보낸 신비롭고 따뜻했던 밤 이야기.",
    thumbnailEmoji: "🌙",
    color: "purple",
    rating: "★ 9.95",
    episodes: "단편 8화 완결",
    linkUrl: "#webtoon-short",
  },
  {
    id: "work-3",
    title: "나의 링크 다이어리",
    genre: "에세이 컷툰",
    status: "SNS 연재작",
    description: "인스타그램 5만 독자가 공감한 소소한 일상 에세이 일러스트 컷 모음집.",
    thumbnailEmoji: "📔",
    color: "pink",
    rating: "★ 9.99",
    episodes: "100+ 컷 아카이빙",
    linkUrl: "#instagram-essay",
  },
];

const COLOR_MAP: Record<string, { bg: string; badge: string }> = {
  yellow: { bg: "bg-[#FFF4B8]", badge: "bg-[#FFDE59]" },
  purple: { bg: "bg-[#EADCF8]", badge: "bg-[#D8BBFF]" },
  pink: { bg: "bg-[#FED7E2]", badge: "bg-[#FF8FAB]" },
  cyan: { bg: "bg-[#CFFAFE]", badge: "bg-[#70D6FF]" },
  lime: { bg: "bg-[#DCFCE7]", badge: "bg-[#B7EF83]" },
};

export function WorkGallery() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b-2 border-black/10">
        <div>
          <h2 className="text-lg font-black text-black flex items-center gap-2">
            <span>📚</span> 연재 웹툰 & 코믹스 갤러리
          </h2>
          <p className="text-xs font-bold text-neutral-500 mt-0.5">
            작가 김민지(꺄륵)의 대표 연재작과 단편 아카이브
          </p>
        </div>
        <span className="hidden sm:inline-block text-xs font-black bg-[#A3FF38] border-2 border-black px-2.5 py-1 rounded-md shadow-[2px_2px_0px_#000] -rotate-2">
          🏆 목요 1위
        </span>
      </div>

      {/* Comic Book Card List */}
      <div className="grid grid-cols-1 gap-4">
        {WORKS_DATA.map((work, idx) => {
          const style = COLOR_MAP[work.color];

          return (
            <div
              key={work.id}
              className={`relative rounded-2xl border-2 sm:border-3 border-black ${style.bg} p-4 sm:p-5 shadow-[5px_5px_0px_0px_#000] flex flex-col justify-between hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000] transition-all`}
            >
              {/* Corner Ribbon Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-black text-white text-[10px] font-black tracking-wider uppercase">
                    {work.status}
                  </span>
                  <span className="text-[11px] font-black text-neutral-700 bg-white/80 border border-black px-2 py-0.5 rounded">
                    VOL. {idx + 1}
                  </span>
                </div>

                <span className="text-xs font-black text-black bg-white border-2 border-black px-2 py-0.5 rounded-md shadow-[1.5px_1.5px_0px_#000] flex items-center gap-1">
                  <span>⭐</span> {work.rating}
                </span>
              </div>

              {/* Main Content Info */}
              <div className="flex items-start gap-3.5 my-1">
                {/* Book Cover / Thumbnail Box */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 sm:border-3 border-black bg-white flex items-center justify-center text-3xl sm:text-4xl shadow-[3px_3px_0px_#000] flex-shrink-0 select-none group-hover:rotate-3 transition-transform">
                  {work.thumbnailEmoji}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-base sm:text-lg text-black leading-snug truncate">
                    {work.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-extrabold text-neutral-600">
                      {work.genre}
                    </span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-xs font-black text-purple-700">
                      {work.episodes}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-neutral-800 leading-relaxed mt-2 break-keep">
                    {work.description}
                  </p>
                </div>
              </div>

              {/* Action Button Bar */}
              <div className="mt-4 pt-3 border-t-2 border-dashed border-black/20 flex items-center justify-between gap-3">
                <div className="hidden xs:flex items-center gap-1 text-[11px] font-black text-neutral-600">
                  <span>독자 만족도 99%</span>
                </div>
                <a
                  href={work.linkUrl}
                  className="w-full xs:w-auto py-2 px-4 rounded-xl border-2 border-black bg-white text-black font-black text-xs sm:text-sm shadow-[2px_2px_0px_#000] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-1.5 ml-auto"
                >
                  <span>최신화 보러가기</span>
                  <span className="font-black">→</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

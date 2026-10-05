import React from "react";
import type { MerchItem } from "@/types";

const MERCH_DATA: MerchItem[] = [
  {
    id: "merch-1",
    name: "꺄륵이 리무버블 스티커팩 (20종 세트)",
    category: "STATIONERY",
    price: "₩4,500",
    badge: "BEST",
    icon: "✨",
    color: "yellow",
    buyUrl: "#shop-sticker",
  },
  {
    id: "merch-2",
    name: "작업실 고양이 아크릴 스마트톡",
    category: "ACCESSORY",
    price: "₩12,000",
    badge: "HOT",
    icon: "🐱",
    color: "pink",
    buyUrl: "#shop-tok",
  },
  {
    id: "merch-3",
    name: "2026 한정판 홀로그램 키링 3종",
    category: "LIMITED EDITION",
    price: "₩9,800",
    badge: "LIMITED",
    icon: "🔑",
    color: "lime",
    buyUrl: "#shop-keyring",
  },
  {
    id: "merch-4",
    name: "소확행 일러스트 떡메모지 3종",
    category: "STATIONERY",
    price: "₩3,500",
    badge: "SALE",
    icon: "📝",
    color: "cyan",
    buyUrl: "#shop-memo",
  },
];

const COLOR_MAP: Record<string, string> = {
  yellow: "bg-[#FFF4B8]",
  pink: "bg-[#FED7E2]",
  lime: "bg-[#DCFCE7]",
  cyan: "bg-[#CFFAFE]",
  purple: "bg-[#EADCF8]",
};

export function MerchGrid() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b-2 border-black/10">
        <div>
          <h2 className="text-lg font-black text-black flex items-center gap-2">
            <span>🧸</span> 캐릭터 공식 굿즈 팝업
          </h2>
          <p className="text-xs font-bold text-neutral-500 mt-0.5">
            네이버 스마트스토어 직영 · 한정판 굿즈 라인업
          </p>
        </div>
        <span className="text-xs font-black text-black bg-[#FFDE59] border-2 border-black px-2.5 py-1 rounded-md shadow-[2px_2px_0px_#000]">
          스마트스토어 직영
        </span>
      </div>

      {/* Grid of Price Tag Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MERCH_DATA.map((item) => (
          <div
            key={item.id}
            className={`relative rounded-2xl border-2 sm:border-3 border-black ${COLOR_MAP[item.color]} p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all`}
          >
            {/* Tag Hole Graphic */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-black bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" />

            <div>
              {/* Top Row: Icon & Badge */}
              <div className="flex items-center justify-between mt-2 mb-3">
                <div className="w-12 h-12 rounded-xl border-2 border-black bg-white flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000] select-none">
                  {item.icon}
                </div>
                {item.badge && (
                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-black text-white rounded border border-black -rotate-3 shadow-[1px_1px_0px_#000]">
                    ★ {item.badge}
                  </span>
                )}
              </div>

              {/* Title & Category */}
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 block">
                {item.category}
              </span>
              <h3 className="font-black text-sm sm:text-base text-black leading-snug my-1">
                {item.name}
              </h3>
            </div>

            {/* Bottom Row: Price & Buy Button */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-black/20 flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-neutral-500">판매가</span>
                <span className="font-black text-base text-black">
                  {item.price}
                </span>
              </div>
              <a
                href={item.buyUrl}
                className="py-2 px-3.5 rounded-xl border-2 border-black bg-white text-black font-black text-xs shadow-[2px_2px_0px_#000] hover:bg-black hover:text-white transition-all flex items-center gap-1"
              >
                <span>스토어 구매</span>
                <span>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Benefit Banner */}
      <div className="w-full bg-[#A3FF38] border-2 sm:border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3 mt-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl select-none">🎁</span>
          <div>
            <h4 className="font-black text-sm text-black">
              전 품목 3만원 이상 구매 시 무료 배송!
            </h4>
            <p className="text-xs font-bold text-neutral-800">
              구매 고객 전원에게 꺄륵 작가 친필 감사 엽서를 동봉해 드립니다.
            </p>
          </div>
        </div>
        <a
          href="#shop"
          className="w-full sm:w-auto py-2 px-4 rounded-xl border-2 border-black bg-white text-black font-black text-xs shadow-[2px_2px_0px_#000] hover:bg-black hover:text-white transition-all text-center flex-shrink-0"
        >
          스토어 홈 바로가기 →
        </a>
      </div>
    </div>
  );
}

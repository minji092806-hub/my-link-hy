import React from "react";

export function RightRail() {
  const ACTION_BUTTONS = [
    { label: "LOGIN TO NSIDER", icon: "🔑" },
    { label: "SUBSCRIBE / JOIN", icon: "⭐" },
    { label: "FREE NEWSLETTER", icon: "✉️" },
    { label: "CUSTOMER HELP", icon: "❓" },
  ];

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* 1. Carbon-Navy Command Layer Action Buttons */}
      <div className="flex flex-col gap-1.5">
        {ACTION_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            className="w-full bg-[#21242e] hover:bg-[#2e3342] active:bg-[#1a1c24] text-white text-[11px] font-bold uppercase tracking-[0.5px] py-2 px-3 bevel-carbon rounded-none flex items-center justify-between cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="text-xs">{btn.icon}</span>
              <span>{btn.label}</span>
            </span>
            <span className="text-[#ecab37] font-bold text-xs">▶</span>
          </button>
        ))}
      </div>

      {/* 2. Info Box: "WHAT IS — GAME FINDER" */}
      <div className="w-full bg-white bevel-plate rounded-xs overflow-hidden">
        {/* Amber Header Tab */}
        <div className="bg-[#ecab37] border-b border-[#8e6211] px-2.5 py-1 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
            WHAT IS — GAME FINDER
          </span>
          <span className="text-[10px] font-black text-[#21242e]">?</span>
        </div>
        {/* Copy */}
        <div className="p-3 text-[12px] text-[#21242e] leading-snug">
          <p className="mb-2">
            Looking for codes, walkthroughs, or system specs? Use our 2001 database search to discover release dates, ESRB ratings, and player tips.
          </p>
          <div className="border-dotted-indigo pt-1.5 flex items-center justify-between text-[11px] font-bold text-[#3d4f97]">
            <a href="#quicksearch" className="hover:underline">
              Quick Code Search
            </a>
            <span className="text-[#f68d1f]">→</span>
          </div>
        </div>
      </div>

      {/* 3. Side Promo Card (Pale Lavender with Product Render) */}
      <div className="w-full bg-[#acace7] bevel-plate p-3 rounded-xs flex flex-col items-center text-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#21242e] bg-white px-2 py-0.5 rounded-xs border border-[#3d4f97] mb-2">
          HARDWARE PREVIEW
        </span>

        {/* Product Representation */}
        <div className="w-20 h-20 rounded-lg bg-[#3d4f97] border-2 border-white flex items-center justify-center text-4xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] my-1 select-none">
          🎮
        </div>

        <h3 className="font-black text-sm text-[#21242e] mt-1 uppercase tracking-tight">
          GAME BOY ADVANCE
        </h3>
        <p className="text-[11px] text-[#21242e] leading-snug mt-1">
          32-Bit ARM CPU · 2.9" Reflective TFT Color Screen · 15hr Battery Life
        </p>

        <a
          href="#gba-specs"
          className="mt-2 px-3 py-1 bg-[#f68d1f] hover:bg-[#e48600] text-white text-[10px] font-bold uppercase tracking-[0.5px] rounded-xs bevel-chip-orange flex items-center gap-1"
        >
          <span>SYSTEM SPECS</span>
          <span>▶</span>
        </a>
      </div>
    </div>
  );
}

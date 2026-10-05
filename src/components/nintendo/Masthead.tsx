import React, { useState } from "react";

export function Masthead() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full flex items-center justify-between px-3 sm:px-6 py-2 select-none">
      {/* Mario Mascot with Speech Bubble */}
      <div className="flex items-center gap-2">
        {/* Pixel Mario Character Head Cutout */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e60012] border-2 border-white flex items-center justify-center text-xl shadow-[0_2px_4px_rgba(0,0,0,0.4)] flex-shrink-0 cursor-pointer hover:scale-105 transition-transform">
          🍄
        </div>

        {/* Mario Welcome Speech Bubble */}
        <div className="relative bg-white border border-[#3d4f97] rounded-lg px-2.5 py-1 shadow-[1px_1px_0px_#21242e]">
          {/* Bubble tail pointer */}
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[6px] border-r-white" />
          <span className="font-bold text-[10px] sm:text-[11px] text-[#21242e] tracking-tight leading-tight block">
            Welcome to Nintendo.com!
          </span>
        </div>
      </div>

      {/* Search Module */}
      <div className="flex items-center gap-1">
        {/* "All" Category Select */}
        <select className="hidden sm:block h-[22px] px-1 bg-white text-[#21242e] text-[11px] font-bold border border-[#3d4f97] rounded-xs cursor-pointer focus:outline-none">
          <option>All</option>
          <option>Games</option>
          <option>Systems</option>
          <option>Codes</option>
        </select>

        {/* Search Input Field */}
        <div className="h-[22px] bg-white border border-[#3d4f97] rounded-xs flex items-center px-1.5">
          <input
            type="text"
            placeholder="Search Nintendo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-24 sm:w-36 text-[11px] text-[#21242e] font-normal placeholder:text-neutral-400 focus:outline-none bg-transparent"
          />
        </div>

        {/* Amber Go Chip */}
        <button
          type="button"
          className="h-[22px] px-2.5 bg-[#ecab37] hover:bg-[#e48600] active:bg-[#d67b00] text-[#21242e] text-[11px] font-bold uppercase tracking-[0.5px] rounded-xs bevel-chip-amber cursor-pointer flex items-center justify-center transition-colors"
        >
          GO
        </button>
      </div>
    </div>
  );
}

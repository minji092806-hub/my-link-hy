import React from "react";
import type { LinkItem } from "@/types";

interface LinkCardProps {
  link: LinkItem;
}

const COLOR_MAP: Record<string, string> = {
  yellow: "bg-[#FFDE59] hover:bg-[#FFE57A]",
  pink: "bg-[#FF70A6] hover:bg-[#FF85B3]",
  cyan: "bg-[#70D6FF] hover:bg-[#8AE0FF]",
  lime: "bg-[#B7EF83] hover:bg-[#C5F496]",
  purple: "bg-[#D8BBFF] hover:bg-[#E3CEFF]",
  white: "bg-white hover:bg-neutral-50",
};

export function LinkCard({ link }: LinkCardProps) {
  const bgClass = (link.color && COLOR_MAP[link.color]) || COLOR_MAP.white;
  const formattedIndex = String(link.order).padStart(2, "0");

  return (
    <a
      href={link.url}
      target={link.url.startsWith("http") ? "_blank" : undefined}
      rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`group relative flex items-center justify-between w-full p-2.5 sm:p-4 rounded-xl border-2 sm:border-3 border-black ${bgClass} shadow-[2.5px_2.5px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all duration-150 ease-out overflow-hidden`}
    >
      {/* Safe Badge Position: Never overlaps or breaches boundaries */}
      {link.badge && (
        <span className="absolute -top-2 left-3 px-1.5 py-0.2 text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-black text-white rounded border border-black shadow-[1px_1px_0px_0px_#000] -rotate-2 group-hover:rotate-0 transition-transform select-none z-10">
          ★ {link.badge}
        </span>
      )}

      <div className="flex items-center gap-2 sm:gap-3 text-left min-w-0 pr-1.5 flex-1 overflow-hidden">
        {/* Index Number Badge (Visible on tablet/desktop) */}
        <span className="hidden sm:inline-flex items-center justify-center w-7 h-7 rounded-lg border-2 border-black bg-white/90 text-black text-[11px] font-black shadow-[1.5px_1.5px_0px_0px_#000] select-none flex-shrink-0">
          {formattedIndex}
        </span>

        {/* Icon Container */}
        {link.icon && (
          <div className="flex-shrink-0 w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl border-2 border-black bg-white flex items-center justify-center text-lg sm:text-2xl shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] select-none group-hover:scale-105 transition-transform">
            {link.icon}
          </div>
        )}

        {/* Text Content */}
        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
          <span className="font-black text-black text-[12px] sm:text-base tracking-tight truncate group-hover:underline leading-tight">
            {link.title}
          </span>
          {link.description && (
            <span className="text-[10px] sm:text-xs font-bold text-neutral-800 tracking-tight truncate mt-0.5 opacity-90 leading-tight">
              {link.description}
            </span>
          )}
        </div>
      </div>

      {/* Action Arrow Icon Button */}
      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-2 border-black bg-white flex items-center justify-center font-black text-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] group-hover:bg-black group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all select-none text-[11px] sm:text-sm">
        ↗
      </div>
    </a>
  );
}

import React from "react";

interface DualNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export function DualNav({ activeTab, onSelectTab }: DualNavProps) {
  const PRIMARY_ITEMS = [
    { id: "games", label: "GAMES" },
    { id: "systems", label: "SYSTEMS" },
    { id: "news", label: "NEWS" },
    { id: "nsider", label: "NSIDER" },
    { id: "downloads", label: "DOWNLOADS" },
  ];

  const SECONDARY_LINKS = [
    "PARENTS",
    "CUSTOMER SERVICE",
    "CORPORATE",
    "GLOBAL",
    "PRIVACY",
    "STORE",
    "CONTACT",
  ];

  return (
    <nav className="w-full flex flex-col select-none">
      {/* 1. Primary Carbon Command Nav Bar */}
      <div className="w-full bg-carbon-halftone bevel-carbon px-2 sm:px-4 py-1.5 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          {/* Nintendo Red Racetrack Pill Logo */}
          <div className="bg-white border-2 border-white rounded-full px-2.5 py-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] flex items-center justify-center flex-shrink-0">
            <span className="text-[#e60012] font-black text-xs sm:text-sm tracking-tighter uppercase font-mono">
              Nintendo<span className="text-[9px] align-top">®</span>
            </span>
          </div>

          {/* 5 Nav-Gold Section Words */}
          <div className="flex items-center gap-3 sm:gap-5">
            {PRIMARY_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.5px] transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === item.id
                    ? "text-[#ffffff] underline underline-offset-4 decoration-[#f68d1f]"
                    : "text-[#e48600] hover:text-[#ffbe73]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Utility Chips: Amber */}
        <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            className="h-[20px] px-2 bg-[#ecab37] hover:bg-[#e48600] text-[#21242e] text-[10px] font-bold uppercase tracking-[0.5px] rounded-xs bevel-chip-amber cursor-pointer"
          >
            CODE BANK
          </button>
          <button
            type="button"
            className="h-[20px] px-2 bg-[#ecab37] hover:bg-[#e48600] text-[#21242e] text-[10px] font-bold uppercase tracking-[0.5px] rounded-xs bevel-chip-amber cursor-pointer"
          >
            GAME FINDER
          </button>
        </div>
      </div>

      {/* 2. Secondary Pale Sky Strip */}
      <div className="w-full bg-[#9fbee7] border-b border-[#3d4f97] px-2 sm:px-4 py-1 flex items-center justify-center sm:justify-start gap-2 sm:gap-4 overflow-x-auto text-[10px] sm:text-[11px] font-bold text-[#21242e] tracking-[0.5px]">
        {SECONDARY_LINKS.map((link, idx) => (
          <React.Fragment key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="hover:underline hover:text-[#3d4f97] whitespace-nowrap"
            >
              {link}
            </a>
            {idx < SECONDARY_LINKS.length - 1 && (
              <span className="text-[#3d4f97]/40 select-none">|</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

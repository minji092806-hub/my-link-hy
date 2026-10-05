import React from "react";

interface HeroPanelProps {
  onForwardClick?: () => void;
}

export function HeroPanel({ onForwardClick }: HeroPanelProps) {
  return (
    <div className="w-full bg-[#acace7] bevel-plate p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Textured Retro Background Backdrop Pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#3d4f97 1px, transparent 1px), linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)",
          backgroundSize: "8px 8px, 100% 100%",
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: 3D Box-Art Typography & Tagline */}
        <div className="flex flex-col text-left max-w-lg">
          {/* Category Chip */}
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#ecab37] text-[#21242e] text-[10px] font-bold uppercase tracking-wider rounded-xs bevel-chip-amber w-max mb-1.5">
            <span>★</span> NOW PLAYING · 2001
          </div>

          {/* Heavy Outlined Display Wordmark */}
          <h1 className="text-boxart text-2xl sm:text-4xl md:text-[42px] leading-tight tracking-tight uppercase">
            SUPER MARIO ADVANCE
          </h1>

          {/* Hero Tagline */}
          <p className="text-[13px] sm:text-[15px] font-bold text-[#21242e] leading-snug mt-1 text-shadow-sm">
            Gorgeous graphics, great sound and high-speed console action on the go!
          </p>

          {/* Subtext info */}
          <p className="text-[11px] font-normal text-[#3d4f97] mt-1">
            Experience the definitive portable adventure. Connect up to 4 players with the Game Boy Advance Link Cable!
          </p>
        </div>

        {/* Right: Round Signal-Orange Forward Arrow Button (22px disc spec) */}
        <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onForwardClick}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#f68d1f] hover:bg-[#e48600] active:scale-95 border-2 border-white flex items-center justify-center text-white shadow-[0_3px_6px_rgba(0,0,0,0.4)] cursor-pointer transition-transform"
            title="Explore Now"
          >
            <span className="text-xl sm:text-2xl font-black ml-0.5">▶</span>
          </button>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3d4f97]">
            EXPLORE
          </span>
        </div>
      </div>
    </div>
  );
}

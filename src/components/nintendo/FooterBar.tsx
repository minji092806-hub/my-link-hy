import React from "react";

export function FooterBar() {
  return (
    <footer className="w-full bg-[#21242e] bg-carbon-halftone bevel-carbon text-white px-4 py-4 mt-6 select-none">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        {/* Left: ESRB Privacy-Certified Badge */}
        <div className="flex items-center gap-2.5">
          <div className="px-2 py-1 bg-[#ecab37] text-[#21242e] font-black text-[9px] uppercase tracking-wider rounded-xs bevel-chip-amber border border-[#8e6211] shadow-[1px_1px_0px_#000]">
            ESRB · PRIVACY CERTIFIED
          </div>
          <span className="text-[10px] text-[#9fbee7] font-bold">
            Official Trustmark
          </span>
        </div>

        {/* Center: Copyright & Legal Fine Print */}
        <div className="flex flex-col text-[10px] text-[#9fbee7] leading-relaxed">
          <span>
            © 1997-2001 Nintendo of America Inc. All Rights Reserved.
          </span>
          <span className="text-neutral-400">
            Nintendo trademarks are properties of Nintendo. Webtoon & comic characters © 2001 Kim Minji (Kkyareuk).
          </span>
        </div>

        {/* Right: Legal Quick Links */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#ecab37]">
          <a href="#terms" className="hover:underline">Terms</a>
          <span>·</span>
          <a href="#privacy" className="hover:underline">Privacy</a>
          <span>·</span>
          <a href="#contact" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
}

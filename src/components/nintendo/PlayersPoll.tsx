"use client";

import React, { useState } from "react";

export function PlayersPoll() {
  const [selectedOption, setSelectedOption] = useState<string>("gba");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [votes, setVotes] = useState<number>(3842);

  const OPTIONS = [
    { id: "gba", label: "Game Boy Advance (32-bit Portable)" },
    { id: "gamecube", label: "Nintendo GameCube Console" },
    { id: "pokemon", label: "Pokémon Crystal Special Edition" },
    { id: "webtoon", label: "Artist Kim Minji's Comic Book Series" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitted) {
      setVotes((prev) => prev + 1);
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full bg-[#8ba1d4] bevel-plate p-3.5 select-none">
      {/* Header Strip */}
      <div className="flex items-center justify-between border-b border-[#3d4f97] pb-1.5 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#21242e] font-bold">●</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
            PLAYER'S POLL · JUNE 2001
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#ecab37] bg-[#21242e] px-1.5 py-0.2 rounded-xs">
          VOTES: {votes}
        </span>
      </div>

      {/* Question */}
      <p className="text-[12px] font-bold text-[#21242e] leading-snug mb-2.5">
        Which upcoming 2001 system or release are you most looking forward to playing?
      </p>

      {/* Radio Options */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
        {OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-2 cursor-pointer text-[12px] font-normal text-[#21242e] hover:text-[#3d4f97] py-0.5"
          >
            <input
              type="radio"
              name="poll-option"
              value={opt.id}
              checked={selectedOption === opt.id}
              onChange={() => setSelectedOption(opt.id)}
              className="accent-[#f68d1f] w-3 h-3 cursor-pointer"
            />
            <span className={selectedOption === opt.id ? "font-bold text-[#21242e]" : ""}>
              {opt.label}
            </span>
          </label>
        ))}

        {/* Submit Button (Signal Orange spec) */}
        <div className="mt-2 pt-2 border-t border-[#3d4f97]/40 flex items-center justify-between">
          <button
            type="submit"
            disabled={submitted}
            className={`px-4 py-1 bg-[#f68d1f] hover:bg-[#e48600] active:bg-[#d67b00] text-white text-[11px] font-bold uppercase tracking-[0.5px] rounded-xs bevel-chip-orange cursor-pointer transition-colors ${
              submitted ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {submitted ? "VOTE RECORDED ✓" : "SUBMIT VOTE"}
          </button>
          <span className="text-[10px] font-bold text-[#3d4f97] hover:underline cursor-pointer">
            View Results →
          </span>
        </div>
      </form>
    </div>
  );
}

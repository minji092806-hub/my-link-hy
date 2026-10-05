import React from "react";

interface NewsItem {
  id: string;
  icon: string;
  title: string;
  date: string;
  category: string;
}

const NEWS_DATA: NewsItem[] = [
  {
    id: "n-1",
    icon: "🎮",
    title: "Game Boy Advance Launches Worldwide with Unprecedented 32-bit Power",
    date: "JUN 11",
    category: "HARDWARE",
  },
  {
    id: "n-2",
    icon: "⚡",
    title: "Official Pokémon Crystal Version Release Date and Mobile Adapter Details",
    date: "JUN 08",
    category: "GAMES",
  },
  {
    id: "n-3",
    icon: "🏆",
    title: "Nintendo Space World 2001 Showcase Announced for Tokyo, Japan",
    date: "JUN 04",
    category: "EVENTS",
  },
  {
    id: "n-4",
    icon: "🎨",
    title: "Webtoon Creator Spotlight: Kim Minji (Kkyareuk) Serializes Weekly Series",
    date: "JUN 01",
    category: "CREATOR",
  },
];

const FEATURED_SITES = [
  { name: "POKEMON.COM", url: "www.pokemon.com", icon: "⚡" },
  { name: "ZELDA.COM", url: "www.zelda.com", icon: "🗡️" },
  { name: "MARIO.COM", url: "www.mario.com", icon: "⭐" },
  { name: "KKYAREUK.COM", url: "kkyareuk.studio", icon: "🎨" },
];

export function NewsSection() {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Official News Module */}
      <div className="w-full bg-[#7a8aba] bevel-plate overflow-hidden">
        {/* Panel Header */}
        <div className="bg-[#7a8aba] border-b border-[#3d4f97] px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#21242e] font-bold">≡</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
              OFFICIAL NEWS & HEADLINES
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#3d4f97] uppercase">
            ARCHIVE →
          </span>
        </div>

        {/* Stacked Platinum News Rows */}
        <div className="p-2 flex flex-col gap-1.5 bg-[#8ba1d4]">
          {NEWS_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-[#dedede] hover:bg-white bevel-plate px-2.5 py-2 flex items-center justify-between gap-2 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-sm select-none flex-shrink-0">{item.icon}</span>
                <span className="text-[10px] font-bold uppercase text-[#3d4f97] bg-white/70 px-1 py-0.2 rounded-xs border border-[#3d4f97]/20 flex-shrink-0">
                  {item.category}
                </span>
                <span className="text-[12px] font-bold text-[#3d4f97] group-hover:text-[#21242e] group-hover:underline truncate">
                  {item.title}
                </span>
              </div>

              {/* Trailing 18px Signal Orange Chevron Chip */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[10px] font-bold text-[#60619c] font-mono">
                  {item.date}
                </span>
                <div className="w-[18px] h-[18px] bg-[#f68d1f] group-hover:bg-[#e48600] rounded-xs bevel-chip-orange flex items-center justify-center text-white text-[10px] font-black select-none">
                  ▶
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Featured Sites 2x2 Grid */}
      <div className="w-full bg-[#7a8aba] bevel-plate overflow-hidden">
        {/* Panel Header */}
        <div className="bg-[#7a8aba] border-b border-[#3d4f97] px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-xs text-[#21242e] font-bold">▦</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
            FEATURED SITES & NETWORKS
          </span>
        </div>

        {/* 2x2 Carbon-Framed Thumbnail Tiles */}
        <div className="p-2.5 bg-[#8ba1d4] grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FEATURED_SITES.map((site) => (
            <a
              key={site.name}
              href={`#${site.name.toLowerCase()}`}
              className="bg-[#21242e] bevel-carbon p-1.5 rounded-xs flex flex-col items-center justify-between text-center group hover:bg-[#2b3040] transition-colors"
            >
              <div className="w-full h-14 bg-[#14161c] border border-[#3d4f97]/40 flex items-center justify-center text-2xl select-none group-hover:scale-105 transition-transform">
                {site.icon}
              </div>
              <div className="mt-1 w-full truncate">
                <span className="text-[10px] font-bold text-[#ecab37] block truncate">
                  {site.name}
                </span>
                <span className="text-[9px] font-normal text-[#9fbee7] block truncate font-mono">
                  {site.url}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

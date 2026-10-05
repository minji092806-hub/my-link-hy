import React from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4 py-16 text-neutral-800 dark:text-neutral-100">
      <main className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Profile Card */}
        <div className="w-full rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-8 shadow-xl shadow-neutral-200/50 dark:shadow-none border border-neutral-200/60 dark:border-neutral-800 flex flex-col items-center">
          
          {/* Avatar / Profile Icon */}
          <div className="relative mb-5">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-500 via-purple-500 to-pink-500 p-[3px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center text-4xl select-none">
                🎨
              </div>
            </div>
            <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" title="작업 중" />
          </div>

          {/* Role Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50 mb-3">
            <span>✨</span> 웹툰 작가 · 꺄륵
          </span>

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
            김민지
          </h1>

          {/* Bio */}
          <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed mb-6 break-keep">
            일상의 소소한 순간들을 따뜻한 그림과 이야기로 그립니다. 🎨<br />
            선 하나, 대사 한 줄에 진심을 담아 기분 좋은 웃음과 위로를 전해요. ✨
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-neutral-200/70 dark:bg-neutral-800 mb-6" />

          {/* Link Buttons */}
          <div className="w-full flex flex-col gap-2.5">
            <a
              href="#webtoon"
              className="w-full py-3 px-4 rounded-xl font-medium text-sm text-neutral-700 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-800 dark:hover:bg-neutral-700/70 transition-colors flex items-center justify-center gap-2"
            >
              <span>📖</span>
              <span>연재 웹툰 보러가기</span>
            </a>
            <a
              href="#instagram"
              className="w-full py-3 px-4 rounded-xl font-medium text-sm text-neutral-700 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-800 dark:hover:bg-neutral-700/70 transition-colors flex items-center justify-center gap-2"
            >
              <span>📷</span>
              <span>인스타그램 & 일상</span>
            </a>
            <a
              href="#contact"
              className="w-full py-3 px-4 rounded-xl font-medium text-sm text-neutral-700 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-800 dark:hover:bg-neutral-700/70 transition-colors flex items-center justify-center gap-2"
            >
              <span>💌</span>
              <span>외주 및 비즈니스 문의</span>
            </a>
          </div>

          {/* Social Icons / Footer */}
          <div className="mt-8 text-xs text-neutral-400 dark:text-neutral-500">
            © 2026 김민지 (꺄륵). All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
}

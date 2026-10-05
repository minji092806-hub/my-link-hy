'use client';

import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  return (
    <div
      aria-live="polite"
      className={[
        'fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#191F28] px-5 py-3 text-[14px] font-semibold text-white shadow-xl transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2',
      ].join(' ')}
    >
      {message}
    </div>
  );
}

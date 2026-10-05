'use client';

import React, { useEffect } from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AMOUNTS = ['1,000', '3,000', '5,000', '10,000', '50,000'];

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* 스크림 */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 바텀시트 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[440px] rounded-t-3xl bg-white px-5 pb-safe-bottom shadow-2xl">
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="h-1 w-10 rounded-full bg-[#E5E8EB]" />
        </div>

        <h3 className="mb-1 text-center text-[18px] font-bold text-[#191F28]">
          💙 김민지 작가 응원하기
        </h3>
        <p className="mb-5 text-center text-[14px] text-[#8B95A1]">
          작가에게 따뜻한 마음을 전해보세요
        </p>

        {/* 계좌 정보 */}
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#F2F4F6] px-4 py-3.5">
          <div>
            <p className="text-xs font-medium text-[#8B95A1]">토스뱅크</p>
            <p className="mt-0.5 text-[15px] font-semibold text-[#191F28]">
              1000 - 0000 - 0000
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText('100000000000');
              alert('계좌번호가 복사되었어요!');
            }}
            className="flex h-8 items-center rounded-lg bg-white px-3 text-xs font-semibold text-[#3182F6] shadow-sm ring-1 ring-[#E5E8EB] transition-colors hover:bg-[#E8F3FF]"
          >
            복사
          </button>
        </div>

        {/* 금액 선택 칩 */}
        <p className="mb-2 text-[13px] font-medium text-[#6B7684]">금액 선택</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              className="inline-flex h-[36px] items-center rounded-full border border-[#E5E8EB] bg-white px-4 text-[13px] font-semibold text-[#333D4B] tabular-nums transition-all hover:border-[#3182F6] hover:bg-[#E8F3FF] hover:text-[#3182F6] active:scale-95"
            >
              {amt}원
            </button>
          ))}
        </div>

        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="mb-6 flex h-14 w-full items-center justify-center rounded-2xl bg-[#F2F4F6] text-[15px] font-semibold text-[#4E5968] transition-colors hover:bg-[#E5E8EB] active:bg-[#D1D6DB]"
        >
          닫기
        </button>
      </div>
    </>
  );
}

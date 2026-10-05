"use client";

import React, { useState } from "react";
import type { GuestbookMessage, FaqItem } from "@/types";

const INITIAL_MESSAGES: GuestbookMessage[] = [
  {
    id: "msg-1",
    author: "목요마니아 🐱",
    message: "작가님 이번 42화 지하철에서 보다가 너무 웃겨서 소리지를 뻔했어요 ㅋㅋㅋ 매주 목요일이 제 힐링입니다!!",
    timestamp: "10분 전",
    avatarEmoji: "🐱",
  },
  {
    id: "msg-2",
    author: "디자인꿈나무 ✨",
    message: "네오브루탈리즘 스타일 마이링크 UI 진짜 역대급으로 힙해요!! 캐릭터 키링 오픈런 성공해서 오늘 배송 왔어요 💖",
    timestamp: "1시간 전",
    avatarEmoji: "✨",
  },
  {
    id: "msg-3",
    author: "민지바라기 🌸",
    message: "일상툰 보면서 매번 제 이야기 같아서 위로받고 가요. 작가님 맛있는 거 많이 드시고 건강하게 연재해 주세요!",
    timestamp: "3시간 전",
    avatarEmoji: "🌸",
  },
  {
    id: "msg-4",
    author: "웹툰편집자 K 💼",
    message: "항상 마감 칼같이 지켜주시는 꺄륵 작가님 최고! 이번 단행본 1권도 대박 납시다 🔥",
    timestamp: "어제",
    avatarEmoji: "💼",
  },
];

const POSTIT_COLORS = [
  "bg-[#FFF9C4]", // Lemon
  "bg-[#FFE0B2]", // Peach
  "bg-[#C8E6C9]", // Mint
  "bg-[#BBDEFB]", // Sky
  "bg-[#E1BEE7]", // Lavender
];

const ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "rotate-0"];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "주로 사용하는 드로잉 장비와 그래픽 소프트웨어가 궁금해요!",
    answer: "아이패드 프로 12.9인치(6세대)와 애플펜슬 2세대를 사용하며, 스케치와 콘티 및 펜선 작업은 클립 스튜디오 페인트(Clip Studio Paint)로 진행합니다. 최종 편집과 타이포그래피는 포토샵을 활용해요.",
  },
  {
    question: "브랜드 인스타툰 및 일러스트 외주 협업은 어떻게 진행되나요?",
    answer: "외주 문의 링크 또는 공식 이메일(kkyareuk@studio.com)로 원하시는 프로젝트 내용, 예상 분량, 희망 마감일, 예산 가이드를 보내주시면 24시간 이내에 상세 견적과 포트폴리오를 회신드립니다.",
  },
  {
    question: "스마트스토어 굿즈 배송 일정과 오프라인 마켓 참가 계획이 있나요?",
    answer: "스마트스토어 주문 건은 월/수/금 정기 출고됩니다. 또한 올 하반기 서울일러스트레이션페어(서일페) 부스 참가가 확정되어 신규 한정판 굿즈를 현장에서 선보일 예정입니다!",
  },
];

export function GuestbookFaq() {
  const [messages, setMessages] = useState<GuestbookMessage[]>(INITIAL_MESSAGES);
  const [authorInput, setAuthorInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorInput.trim() || !messageInput.trim()) return;

    const emojis = ["🐱", "🐰", "🐻", "🐼", "🦊", "✨", "💖", "🎨"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newMessage: GuestbookMessage = {
      id: Date.now().toString(),
      author: authorInput.trim(),
      message: messageInput.trim(),
      timestamp: "방금 전",
      avatarEmoji: randomEmoji,
    };

    setMessages([newMessage, ...messages]);
    setMessageInput("");
  };

  const toggleFaq = (index: number) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Guestbook Section (Pinboard Theme) */}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b-2 border-black/10">
          <div>
            <h2 className="text-lg font-black text-black flex items-center gap-2">
              <span>📌</span> 팬 응원 메모 보드 (방명록)
            </h2>
            <p className="text-xs font-bold text-neutral-500 mt-0.5">
              작가님께 전하는 사랑과 응원의 한마디
            </p>
          </div>
          <span className="text-xs font-black text-black bg-[#FF8FAB] border-2 border-black px-2.5 py-1 rounded-md shadow-[2px_2px_0px_#000]">
            실시간 등록
          </span>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#FFFBEA] border-2 sm:border-3 border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col gap-3 relative"
        >
          <div className="flex items-center gap-1.5 text-xs font-black text-neutral-700">
            <span>✏️</span> 응원 메모 작성하기
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              placeholder="닉네임 (최대 12자)"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              maxLength={12}
              className="w-full sm:w-1/3 px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-xs sm:text-sm font-bold placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="text"
              placeholder="따뜻한 응원 한마디를 남겨주세요! (최대 100자)"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              maxLength={100}
              className="w-full sm:w-2/3 px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-xs sm:text-sm font-bold placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl border-2 border-black bg-[#FFDE59] text-black font-black text-xs sm:text-sm shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>핀 꽂고 응원 등록하기</span>
            <span>📍</span>
          </button>
        </form>

        {/* Post-it Grid (Pinboard) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-80 overflow-y-auto p-1">
          {messages.map((msg, idx) => {
            const colorClass = POSTIT_COLORS[idx % POSTIT_COLORS.length];
            const rotationClass = ROTATIONS[idx % ROTATIONS.length];

            return (
              <div
                key={msg.id}
                className={`relative ${colorClass} border-2 border-black rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between ${rotationClass} hover:rotate-0 hover:scale-102 transition-all`}
              >
                {/* Pin Graphic */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm select-none">
                  📍
                </div>

                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5 pt-1">
                    <span className="text-xs font-black text-black truncate flex items-center gap-1">
                      <span>{msg.avatarEmoji}</span>
                      <span>{msg.author}</span>
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500">
                      {msg.timestamp}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-neutral-800 leading-relaxed break-keep">
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. FAQ Section */}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b-2 border-black/10">
          <div>
            <h2 className="text-lg font-black text-black flex items-center gap-2">
              <span>❓</span> 자주 묻는 질문 (FAQ)
            </h2>
            <p className="text-xs font-bold text-neutral-500 mt-0.5">
              작업 도구, 외주 프로세스, 굿즈 배송 안내
            </p>
          </div>
          <span className="text-xs font-black text-black bg-[#70D6FF] border-2 border-black px-2.5 py-1 rounded-md shadow-[2px_2px_0px_#000]">
            Q&A
          </span>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = activeFaqIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border-2 sm:border-3 border-black bg-white shadow-[3px_3px_0px_#000] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className={`w-full p-4 text-left font-black text-xs sm:text-sm text-black flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isOpen ? "bg-[#FFFDE7]" : "hover:bg-neutral-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg border-2 border-black bg-[#D8BBFF] text-black flex items-center justify-center text-xs font-black flex-shrink-0 shadow-[1px_1px_0px_#000]">
                      Q
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <span className="w-6 h-6 rounded-lg border-2 border-black bg-white flex items-center justify-center text-xs font-black flex-shrink-0 shadow-[1px_1px_0px_#000]">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-4 pt-3 text-xs sm:text-sm font-bold text-neutral-700 border-t-2 border-black/15 bg-[#FCFAF5] leading-relaxed break-keep">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg border-2 border-black bg-[#38EF7D] text-black flex items-center justify-center text-xs font-black flex-shrink-0 shadow-[1px_1px_0px_#000]">
                        A
                      </span>
                      <p className="mt-0.5">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

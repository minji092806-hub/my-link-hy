'use client';

import React, { useState, useCallback } from 'react';
import { TopBar } from '@/components/toss/TopBar';
import { ProfileHeader } from '@/components/toss/ProfileHeader';
import { ListRow } from '@/components/toss/ListRow';
import { BottomCTA } from '@/components/toss/BottomCTA';
import { SupportModal } from '@/components/toss/SupportModal';
import { Toast } from '@/components/toss/Toast';

/* ─── 연재작 데이터 ─────────────────────────────── */
const WORKS = [
  {
    id: 'main',
    icon: '📖',
    title: '꺄륵이의 하루하루',
    subtitle: '네이버웹툰 • 매주 화·목 연재 중',
    badge: '연재중',
    badgeColor: 'green' as const,
    href: 'https://webtoon.naver.com',
  },
  {
    id: 'old',
    icon: '🌸',
    title: '봄날이 와도',
    subtitle: '네이버웹툰 • 완결 (전 48화)',
    badge: '완결',
    badgeColor: 'grey' as const,
    href: 'https://webtoon.naver.com',
  },
];

/* ─── 굿즈 데이터 ────────────────────────────────── */
const MERCH = [
  {
    id: 'm1',
    icon: '🧸',
    title: '꺄륵 캐릭터 아크릴 키링',
    subtitle: '공식 스토어 • 6,900원',
    badge: 'NEW',
    badgeColor: 'blue' as const,
    href: 'https://smartstore.naver.com',
  },
  {
    id: 'm2',
    icon: '📦',
    title: '봄날 굿즈 세트',
    subtitle: '공식 스토어 • 19,900원',
    href: 'https://smartstore.naver.com',
  },
  {
    id: 'm3',
    icon: '📮',
    title: '엽서팩 (6종)',
    subtitle: '공식 스토어 • 4,500원',
    href: 'https://smartstore.naver.com',
  },
];

/* ─── FAQ 데이터 ─────────────────────────────────── */
const FAQ: { q: string; a: string }[] = [
  {
    q: '섭외·콜라보 문의는 어떻게 하면 되나요?',
    a: '이메일(example@example.com)로 요청 사항을 남겨주시면 영업일 3일 이내로 답변드려요.',
  },
  {
    q: '팬 아트를 그려도 되나요?',
    a: '비영리·비상업적 팬 아트는 환영해요! 태그(@kkyareuk)를 달아주시면 제가 직접 볼 수도 있어요.',
  },
  {
    q: '개인 커미션을 받으시나요?',
    a: '현재는 개인 커미션을 받지 않고 있어요. 오픈 일정은 SNS로 공지할게요.',
  },
];

type TabType = 'all' | 'works' | 'merch' | 'qna';

const TABS: { id: TabType; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'works', label: '연재작' },
  { id: 'merch', label: '굿즈' },
  { id: 'qna', label: 'Q&A' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }, []);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: '김민지 작가 프로필', url }).catch(() => null);
    } else {
      navigator.clipboard?.writeText(url).then(() => {
        showToast('프로필 링크가 복사되었어요 🔗');
      });
    }
  }, [showToast]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      showToast('프로필 링크가 복사되었어요 🔗');
    });
  }, [showToast]);

  return (
    <div className="relative min-h-screen bg-[#F2F4F6]">
      {/* 상단 바 */}
      <TopBar title="김민지 작가" onShare={handleShare} />

      {/* 모바일 셸 — 최대 440px 중앙 정렬 */}
      <main className="mx-auto max-w-[440px]">
        {/* 프로필 헤더 */}
        <ProfileHeader onCopyLink={handleCopyLink} />

        {/* ─── 빠른 링크 섹션 ─────────────────────── */}
        <section className="mx-4 mb-4 overflow-hidden rounded-3xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="px-4 pt-4 pb-1">
            <p className="text-[13px] font-semibold text-[#8B95A1]">바로 가기</p>
          </div>
          <ListRow
            icon="🌐"
            title="공식 홈페이지"
            subtitle="작가 소개 및 전체 작품 목록"
            href="https://example.com"
          />
          <div className="mx-4 h-px bg-[#F2F4F6]" />
          <ListRow
            icon="📷"
            title="인스타그램"
            subtitle="일상·작업 비하인드 공유해요"
            href="https://instagram.com"
          />
          <div className="mx-4 h-px bg-[#F2F4F6]" />
          <ListRow
            icon="💌"
            title="이메일 문의"
            subtitle="섭외·콜라보는 이메일로 보내주세요"
            href="mailto:example@example.com"
          />
        </section>

        {/* ─── 탭 필터 ─────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                'inline-flex h-[34px] flex-shrink-0 items-center rounded-full px-4 text-[13px] font-semibold transition-all',
                activeTab === tab.id
                  ? 'bg-[#191F28] text-white'
                  : 'bg-white text-[#4E5968] border border-[#E5E8EB] hover:bg-[#F9FAFB]',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── 연재작 섹션 ─────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'works') && (
          <section className="mx-4 mb-4 overflow-hidden rounded-3xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between px-4 pt-4 pb-1">
              <p className="text-[13px] font-semibold text-[#8B95A1]">연재작</p>
              <a
                href="https://webtoon.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium text-[#3182F6] hover:underline"
              >
                전체 보기
              </a>
            </div>
            {WORKS.map((w, i) => (
              <React.Fragment key={w.id}>
                <ListRow
                  icon={w.icon}
                  title={w.title}
                  subtitle={w.subtitle}
                  badge={w.badge}
                  badgeColor={w.badgeColor}
                  href={w.href}
                />
                {i < WORKS.length - 1 && <div className="mx-4 h-px bg-[#F2F4F6]" />}
              </React.Fragment>
            ))}
          </section>
        )}

        {/* ─── 굿즈 섹션 ───────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'merch') && (
          <section className="mx-4 mb-4 overflow-hidden rounded-3xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between px-4 pt-4 pb-1">
              <p className="text-[13px] font-semibold text-[#8B95A1]">굿즈 스토어</p>
              <a
                href="https://smartstore.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium text-[#3182F6] hover:underline"
              >
                스토어 가기
              </a>
            </div>
            {MERCH.map((m, i) => (
              <React.Fragment key={m.id}>
                <ListRow
                  icon={m.icon}
                  title={m.title}
                  subtitle={m.subtitle}
                  badge={m.badge}
                  badgeColor={m.badgeColor}
                  href={m.href}
                />
                {i < MERCH.length - 1 && <div className="mx-4 h-px bg-[#F2F4F6]" />}
              </React.Fragment>
            ))}
          </section>
        )}

        {/* ─── Q&A 섹션 ────────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'qna') && (
          <section className="mx-4 mb-4 overflow-hidden rounded-3xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="px-4 pt-4 pb-1">
              <p className="text-[13px] font-semibold text-[#8B95A1]">자주 묻는 질문</p>
            </div>
            {FAQ.map((faq, i) => (
              <React.Fragment key={i}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-[#F9FAFB]"
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#E8F3FF] text-[10px] font-bold text-[#3182F6]">
                    Q
                  </span>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-[#191F28]">{faq.q}</p>
                    {openFaq === i && (
                      <p className="mt-2 text-[13px] leading-relaxed text-[#6B7684]">
                        {faq.a}
                      </p>
                    )}
                  </div>
                  <svg
                    className={[
                      'mt-0.5 h-4 w-4 flex-shrink-0 text-[#B0B8C1] transition-transform duration-200',
                      openFaq === i ? 'rotate-180' : '',
                    ].join(' ')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {i < FAQ.length - 1 && <div className="mx-4 h-px bg-[#F2F4F6]" />}
              </React.Fragment>
            ))}
          </section>
        )}

        {/* 하단 여백 (BottomCTA 공간 확보) */}
        <div className="h-28" />
      </main>

      {/* ─── 고정 하단 CTA ───────────────────────────── */}
      <BottomCTA
        label="💙 김민지 작가 응원하기"
        onClick={() => setModalOpen(true)}
      />

      {/* ─── 응원 모달 ────────────────────────────────── */}
      <SupportModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ─── 토스트 ──────────────────────────────────── */}
      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}

import { LinkItem } from "@/types";

/**
 * 링크 목록에 사용할 더미 데이터
 * - 김민지(꺄륵) 작가의 링크트리/프로필에 어울리는 대표 링크 목록입니다.
 * - LinkCard 및 ListRow 컴포넌트 모두에서 유연하게 활용할 수 있도록 구성되었습니다.
 */
export const DUMMY_LINKS: LinkItem[] = [
  {
    id: "link-1",
    title: "네이버 웹툰 공식 연재처",
    url: "https://comic.naver.com/webtoon",
    description: "매주 화·목 정기 연재 중! 최신화 바로 보러가기",
    icon: "📖",
    order: 1,
    isActive: true,
    color: "lime",
    badge: "연재중",
    clickCount: 1420,
    category: "work",
  },
  {
    id: "link-2",
    title: "공식 인스타그램",
    url: "https://instagram.com",
    description: "작업 비하인드 컷, 러프 스케치 및 작가 일상",
    icon: "📸",
    order: 2,
    isActive: true,
    color: "pink",
    badge: "DAILY",
    clickCount: 980,
    category: "sns",
  },
  {
    id: "link-3",
    title: "공식 굿즈 스마트스토어",
    url: "https://smartstore.naver.com",
    description: "아크릴 키링, 엽서팩, 스티커 등 공식 굿즈 판매",
    icon: "🛍️",
    order: 3,
    isActive: true,
    color: "yellow",
    badge: "NEW",
    clickCount: 654,
    category: "shop",
  },
  {
    id: "link-4",
    title: "노션 온라인 포트폴리오",
    url: "https://notion.site",
    description: "외주 이력, 캐릭터 디자인 시트, 브랜드 협업 아카이브",
    icon: "📂",
    order: 4,
    isActive: true,
    color: "cyan",
    clickCount: 320,
    category: "work",
  },
  {
    id: "link-5",
    title: "유튜브 (드로잉 & 브이로그)",
    url: "https://youtube.com",
    description: "웹툰 마감 타임랩스 및 웹툰 작가의 작업실 브이로그",
    icon: "🎬",
    order: 5,
    isActive: true,
    color: "white",
    clickCount: 512,
    category: "sns",
  },
  {
    id: "link-6",
    title: "팬 커뮤니티 (오픈카톡/디스코드)",
    url: "https://open.kakao.com",
    description: "독자님들과 소통하고 스포일러 없는 잡담 나누는 공간",
    icon: "💬",
    order: 6,
    isActive: true,
    color: "purple",
    badge: "팬전용",
    clickCount: 428,
    category: "sns",
  },
  {
    id: "link-7",
    title: "작가 응원 및 커피 한 잔 후원하기",
    url: "https://toss.me",
    description: "따뜻한 응원 한마디와 커피 한 잔 선물하기 ☕",
    icon: "☕",
    order: 7,
    isActive: true,
    color: "yellow",
    clickCount: 230,
    category: "contact",
  },
  {
    id: "link-8",
    title: "비즈니스 & 외주 문의 (이메일)",
    url: "mailto:contact@kkyareuk.com",
    description: "출판, 일러스트 외주, 광고/콜라보 제휴 문의",
    icon: "💌",
    order: 8,
    isActive: true,
    color: "white",
    clickCount: 89,
    category: "contact",
  },
];

/**
 * 카테고리별로 분류된 더미 링크 데이터 (필요 시 필터링에 사용)
 */
export const CATEGORIZED_LINKS = {
  works: DUMMY_LINKS.filter((item) => ["link-1"].includes(item.id)),
  sns: DUMMY_LINKS.filter((item) => ["link-2", "link-5", "link-6"].includes(item.id)),
  shop: DUMMY_LINKS.filter((item) => ["link-3"].includes(item.id)),
  contact: DUMMY_LINKS.filter((item) => ["link-4", "link-7", "link-8"].includes(item.id)),
};

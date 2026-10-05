export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  color?: "yellow" | "pink" | "cyan" | "lime" | "purple" | "white";
  badge?: string;
}

export interface UserProfile {
  name: string;
  bio?: string;
  avatarUrl?: string;
  links: LinkItem[];
}

export interface WorkItem {
  id: string;
  title: string;
  genre: string;
  status: string;
  description: string;
  thumbnailEmoji: string;
  color: "yellow" | "pink" | "cyan" | "lime" | "purple";
  rating: string;
  episodes: string;
  linkUrl: string;
}

export interface MerchItem {
  id: string;
  name: string;
  category: string;
  price: string;
  badge?: string;
  icon: string;
  color: "yellow" | "pink" | "cyan" | "lime" | "purple";
  buyUrl: string;
}

export interface GuestbookMessage {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  avatarEmoji: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

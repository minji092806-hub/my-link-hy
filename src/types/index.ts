export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface UserProfile {
  name: string;
  bio?: string;
  avatarUrl?: string;
  links: LinkItem[];
}

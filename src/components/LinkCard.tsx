'use client';

import * as React from 'react';
import type { LinkItem } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LinkCardProps {
  link: LinkItem;
  onClick?: (link: LinkItem) => void;
  className?: string;
}

export function LinkCard({ link, onClick, className }: LinkCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(link);
    }
  };

  const getBadgeVariant = (badge?: string): 'success' | 'blue' | 'pink' | 'purple' | 'secondary' => {
    switch (badge) {
      case '연재중':
        return 'success';
      case 'NEW':
        return 'blue';
      case 'DAILY':
        return 'pink';
      case '팬전용':
        return 'purple';
      default:
        return 'secondary';
    }
  };

  return (
    <a
      href={link.url}
      target={link.url.startsWith('http') ? '_blank' : undefined}
      rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
    >
      <Card
        className={cn(
          'group relative flex w-full items-center justify-between gap-3.5 p-4 border border-border bg-card text-card-foreground shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md active:scale-[0.98] active:bg-muted/40 cursor-pointer overflow-hidden',
          className
        )}
      >
        {/* 좌측: 아이콘 컨테이너 */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl transition-transform duration-200 group-hover:scale-105 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 select-none">
          {link.icon || '🔗'}
        </div>

        {/* 중앙: 텍스트 정보 */}
        <div className="flex min-w-0 flex-1 flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="truncate text-base font-bold text-foreground group-hover:text-blue-600 transition-colors">
              {link.title}
            </span>
            {link.badge && (
              <Badge
                variant={getBadgeVariant(link.badge)}
                className="text-[10px] px-2 py-0.5 shrink-0"
              >
                {link.badge}
              </Badge>
            )}
          </div>

          {link.description && (
            <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
              {link.description}
            </p>
          )}

          {/* 클릭수 및 지표 */}
          {typeof link.clickCount === 'number' && (
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Eye className="size-3 text-muted-foreground/80" />
              <span>{link.clickCount.toLocaleString()}회 클릭</span>
            </div>
          )}
        </div>

        {/* 우측: 이동 화살표 아이콘 */}
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white group-hover:translate-x-0.5">
          <ExternalLink className="size-4" />
        </div>
      </Card>
    </a>
  );
}

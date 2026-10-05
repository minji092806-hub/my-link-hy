import type { LinkItem } from "@/types";

interface LinkCardProps {
  link: LinkItem;
}

export function LinkCard({ link }: LinkCardProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-sm hover:shadow-md"
    >
      <div className="flex flex-col text-left">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{link.title}</span>
        {link.description && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{link.description}</span>
        )}
      </div>
      <span className="text-zinc-400 text-lg">→</span>
    </a>
  );
}

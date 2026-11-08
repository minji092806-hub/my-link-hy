import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, SearchX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 px-4 text-center">
      <div className="flex flex-col items-center max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-sm">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-5">
          <SearchX className="size-8" />
        </div>

        <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full mb-2">
          404 Not Found
        </span>

        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          사용자를 찾을 수 없습니다
        </h1>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed break-keep">
          요청하신 <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">displayName</code>의
          사용자가 존재하지 않거나, 잘못된 주소로 접근하셨습니다.
          주소를 다시 확인해주세요.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5 w-full">
          <Link href="/" className="w-full sm:w-auto flex-1">
            <Button className="w-full rounded-full gap-2 font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer h-10">
              <Home className="size-4" />
              <span>홈으로 돌아가기</span>
            </Button>
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        © 2026 My Link • 나만의 링크 공간
      </p>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <main className="wrap flex min-h-[70vh] flex-col justify-center py-16">
      <p className="font-mono text-sm text-faint">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">這頁不在作品庫裡</h1>
      <p className="mt-3 max-w-md text-muted">
        路徑可能打錯，或這件作品還沒登錄。從首頁或作品列表繼續。
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/">回首頁</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/works">瀏覽作品</Link>
        </Button>
      </div>
    </main>
  );
}

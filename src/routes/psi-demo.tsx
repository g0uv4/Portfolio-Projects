import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/psi-demo")({
  staticData: { chrome: "workbench" as const },
  head: () => ({
    meta: [{ title: "PSI 儀表板（展示站）" }],
  }),
  component: PsiDemoPage,
});

function PsiDemoPage() {
  return (
    <div className="flex h-dvh flex-col bg-bg">
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border px-3">
        <Link
          to="/works/$slug"
          params={{ slug: "psi-dashboard" }}
          className="text-sm text-muted hover:text-accent"
        >
          返回案例
        </Link>
        <span className="text-sm text-fg">PSI 展示站 · 資料已去識別化</span>
      </div>
      <iframe
        title="PSI 去識別化展示站"
        src="/psi-dashboard/index.html"
        className="min-h-0 w-full flex-1 border-0"
      />
    </div>
  );
}

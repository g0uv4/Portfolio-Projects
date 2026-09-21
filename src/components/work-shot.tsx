import type { Work } from "@/content/types";

export function workCoverSrc(slug: string) {
  return `/works/${slug}.jpg`;
}

export function WorkShot({ work }: { work: Work }) {
  if (work.slug === "psi-dashboard") {
    return (
      <figure
        id="demo"
        className="overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)]"
      >
        <iframe
          title="PSI 去識別化展示站"
          src="/psi-dashboard/index.html"
          className="h-[min(80vh,56rem)] w-full border-0 bg-white"
        />
        <figcaption className="border-t border-border px-4 py-2 text-xs text-faint">
          去識別化展示站 · 約 30% 抽樣，可操作四分頁，非正式資料
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)]">
      <img
        src={workCoverSrc(work.slug)}
        alt=""
        width={1200}
        height={676}
        className="aspect-video w-full object-cover"
      />
      <figcaption className="border-t border-border px-4 py-2 text-xs text-faint">
        示範畫面 · 示意資料，非正式環境
      </figcaption>
    </figure>
  );
}

import type { Work } from "@/content/types";

const COVERED = new Set([
  "psi-dashboard",
  "vsr-dashboard",
  "backlog-etd",
  "outlook-inbox",
  "po-qty-updater",
  "vba-studio",
  "datecode",
  "combin-backlog",
  "oracle-sql",
  "side-vba",
  "coloring-book",
  "what-is-the-data-saying",
]);

export function workCoverSrc(slug: string) {
  return `/works/${slug}.jpg`;
}

export function hasWorkCover(slug: string) {
  return COVERED.has(slug);
}

export function WorkCover({
  work,
  compact = false,
}: {
  work: Work;
  compact?: boolean;
}) {
  if (!hasWorkCover(work.slug)) {
    return (
      <div
        className={
          compact
            ? "flex aspect-[16/7] items-end bg-surface-2 px-4 py-3"
            : "flex aspect-video items-end bg-surface-2 px-5 py-4"
        }
      >
        <p className="text-sm font-semibold tracking-tight text-fg">{work.title}</p>
      </div>
    );
  }
  return (
    <img
      src={workCoverSrc(work.slug)}
      alt=""
      width={1200}
      height={676}
      className={compact ? "aspect-[16/7] w-full object-cover" : "aspect-video w-full object-cover"}
    />
  );
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
      <WorkCover work={work} />
      <figcaption className="border-t border-border px-4 py-2 text-xs text-faint">
        {work.slug === "coloring-book"
          ? "線稿示範 · 非正式照片"
          : work.slug === "what-is-the-data-saying"
            ? "啞鈴圖示意 · 非正式數字"
            : hasWorkCover(work.slug)
              ? "示範畫面 · 示意資料，非正式環境"
              : "此案例尚無畫面截圖"}
      </figcaption>
    </figure>
  );
}

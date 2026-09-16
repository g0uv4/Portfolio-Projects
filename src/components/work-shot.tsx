import type { Work } from "@/content/types";

export function workCoverSrc(slug: string) {
  return `/works/${slug}.jpg`;
}

export function WorkShot({ work }: { work: Work }) {
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

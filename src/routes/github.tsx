import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { profile } from "@/content/profile";
import { fetchGithubSnapshot, mergeCatalog, type CatalogRepo } from "@/lib/github";

export const Route = createFileRoute("/github")({
  loader: async () => {
    const snapshot = await fetchGithubSnapshot();
    return {
      snapshot,
      catalog: mergeCatalog(snapshot).filter((item) => item.visibility === "public"),
    };
  },
  component: GithubPage,
});

function GithubPage() {
  const { snapshot, catalog } = Route.useLoaderData();
  const liveCount = catalog.filter((item) => item.live).length;
  const publicRepos = snapshot.profile ? String(snapshot.profile.publicRepos) : "—";

  return (
    <main className="wrap py-12 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">GitHub</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        向{" "}
        <a
          href={profile.githubUrl}
          className="text-accent underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          {profile.handle}
        </a>{" "}
        讀取公開倉庫狀態，只列出作品庫已登錄的公開案例。
      </p>

      <p className="mt-8 text-sm text-muted">
        公開倉庫 {publicRepos}
        <span className="text-faint"> · </span>
        即時對上 {liveCount}
      </p>

      {snapshot.ok ? (
        <p className="mt-2 font-mono text-xs text-faint">
          讀取於 {formatTime(snapshot.fetchedAt)}
        </p>
      ) : (
        <p className="mt-2 text-sm text-warn">
          GitHub 即時讀取暫時失敗（{snapshot.error}）。下列仍顯示作品庫已登錄的倉庫。
        </p>
      )}

      {snapshot.profile ? (
        <div className="mt-8 flex items-center gap-4 border-t border-border pt-8">
          <img
            src={snapshot.profile.avatarUrl}
            alt=""
            className="size-12 rounded-md"
          />
          <div className="min-w-0">
            <p className="font-medium text-fg">
              {snapshot.profile.login}
            </p>
            <p className="truncate text-sm text-muted">
              {snapshot.profile.bio ?? "g0uv4 on GitHub"}
            </p>
          </div>
          <a
            href={snapshot.profile.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex h-11 items-center gap-1 text-sm font-medium text-accent"
          >
            開啟
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      ) : null}

      <ul className="mt-6 divide-y divide-border border-t border-border">
        {catalog.map((item) => (
          <RepoRow key={item.repo} item={item} />
        ))}
      </ul>
    </main>
  );
}

function RepoRow({ item }: { item: CatalogRepo }) {
  return (
    <li className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-fg">{item.title}</p>
          <Badge tone={item.live ? "fg" : "muted"}>{item.live ? "live" : "catalog"}</Badge>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
        <p className="mt-2 font-mono text-xs text-faint">
          {item.repo}
          {item.language ? ` · ${item.language}` : ""}
          {item.updatedAt ? ` · ${formatDay(item.updatedAt)}` : ""}
        </p>
      </div>
      <div className="flex gap-2">
        {item.workSlug ? (
          <Link
            to="/works/$slug"
            params={{ slug: item.workSlug }}
            className="inline-flex h-11 items-center px-3 text-sm text-muted hover:text-fg"
          >
            案例
          </Link>
        ) : null}
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-1 px-3 text-sm text-muted hover:text-fg"
        >
          <ArrowUpRight className="size-4" />
          GitHub
        </a>
      </div>
    </li>
  );
}

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Taipei",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatDay(iso: string) {
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      dateStyle: "medium",
      timeZone: "Asia/Taipei",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

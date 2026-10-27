import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LatticeMark } from "@/components/mark";
import { WorkCard } from "@/components/work-card";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";
import { featuredWorks, works, workStats } from "@/content/works";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZOLAND WORKS" },
      { property: "og:title", content: "ZOLAND WORKS" },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = featuredWorks();
  const featuredSlugs = new Set(featured.map((work) => work.slug));
  const rest = works.filter((work) => !featuredSlugs.has(work.slug));

  return (
    <main>
      <div className="hero-lattice border-b border-border">
        <section className="wrap grid gap-10 pt-14 pb-14 sm:pt-24 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs tracking-wide text-faint">
              <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {profile.latin} · {profile.handle} · {profile.location}
            </p>
            <h1 className="mt-5 max-w-3xl text-[2.25rem] leading-[1.15] font-semibold tracking-tight text-fg sm:text-5xl sm:leading-[1.1] lg:text-[3.5rem]">
              把現場流程做成可交接的系統。
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {profile.tagline}
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/works">
                  瀏覽作品
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <aside className="flex items-center gap-4 rounded-lg bg-surface px-5 py-4 shadow-[var(--shadow-border)] sm:p-6 lg:block">
            <LatticeMark className="size-5 shrink-0 text-accent lg:mb-4" />
            <p className="text-sm leading-relaxed text-muted">
              登錄 <span className="font-mono text-2xl font-medium text-fg">{workStats.total}</span> 件，其中{" "}
              <span className="font-mono text-2xl font-medium text-accent">{workStats.production}</span> 件正式在用。
            </p>
          </aside>
        </section>
      </div>

      <section className="wrap py-12 sm:py-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="section-title">精選作品</h2>
          <Link
            to="/works"
            className="inline-flex h-11 items-center gap-1 text-sm font-medium text-accent hover:text-accent/80"
          >
            全部作品
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((work) => (
            <WorkCard key={work.slug} work={work} />
          ))}
        </div>
      </section>

      <section className="wrap pb-16 sm:pb-24">
        <div className="border-t border-border pt-12 sm:pt-16">
          <h2 className="section-title">其他登錄</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {rest.map((work) => (
              <WorkCard key={work.slug} work={work} compact />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

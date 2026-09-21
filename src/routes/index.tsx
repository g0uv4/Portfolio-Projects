import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
  const featured = featuredWorks().slice(0, 2);
  const featuredSlugs = new Set(featured.map((work) => work.slug));
  const rest = works.filter((work) => !featuredSlugs.has(work.slug));

  return (
    <main>
      <section className="wrap grid gap-10 pt-16 pb-12 sm:pt-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(14rem,0.65fr)] lg:items-end">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
            把現場流程做成可交接的系統。
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
            {profile.latin}。{profile.tagline}
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link to="/works">
                瀏覽作品
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted">
          登錄 {workStats.total} 件，其中 {workStats.production} 件正式在用。
        </p>
      </section>

      <section className="wrap border-t border-border py-12 sm:py-16">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">精選作品</h2>
          <Link
            to="/works"
            className="inline-flex h-11 items-center gap-1 text-sm font-medium text-accent"
          >
            全部作品
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((work) => (
            <WorkCard key={work.slug} work={work} />
          ))}
        </div>
      </section>

      <section className="wrap pb-16">
        <h2 className="text-xl font-semibold tracking-tight">其他登錄</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {rest.map((work) => (
            <WorkCard key={work.slug} work={work} compact />
          ))}
        </div>
      </section>
    </main>
  );
}

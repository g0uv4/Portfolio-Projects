import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MetricGrid } from "@/components/metric-grid";
import { WorkCard } from "@/components/work-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/content/types";
import { getWork, relatedWorks } from "@/content/works";

export const Route = createFileRoute("/works/$slug")({
  loader: ({ params }) => {
    const work = getWork(params.slug);
    if (!work) throw notFound();
    return { work, related: relatedWorks(work) };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.work
          ? `${loaderData.work.title} · ZOLAND WORKS`
          : "ZOLAND WORKS",
      },
    ],
  }),
  component: WorkDetail,
});

function WorkDetail() {
  const { work, related } = Route.useLoaderData();
  const githubUrl = work.github
    ? `https://github.com/${work.github.owner}/${work.github.repo}`
    : null;

  return (
    <main className="wrap py-10 sm:py-14">
      <Link
        to="/works"
        className="inline-flex h-11 items-center gap-1.5 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft className="size-4" />
        作品庫
      </Link>

      <header className="mt-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="muted">{CATEGORY_LABEL[work.category]}</Badge>
          <Badge tone="muted">{work.year}</Badge>
          <Badge tone="fg">{STATUS_LABEL[work.status]}</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{work.title}</h1>
        <p className="mt-2 text-lg text-muted">{work.subtitle}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">{work.summary}</p>
      </header>

      <section className="mt-12 max-w-3xl space-y-10">
        <div>
          <h2 className="text-xl font-semibold">問題</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{work.problem.context}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{work.problem.pain}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">作法</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{work.approach.overview}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">成效</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{work.results.narrative}</p>
          <div className="mt-6">
            <MetricGrid metrics={work.results.metrics} />
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)]">
        <article>
          <h2 className="text-xl font-semibold">怎麼做</h2>
          <ol className="mt-4 space-y-4">
            {work.approach.steps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted">
                <span className="mt-0.5 font-mono text-xs tabular-nums text-faint">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <ul className="mt-6 flex flex-wrap gap-2">
            {work.highlights.map((item) => (
              <li key={item}>
                <Badge tone="muted">{item}</Badge>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            {githubUrl ? (
              <Button asChild variant="outline">
                <a href={githubUrl} target="_blank" rel="noreferrer">
                  {work.github?.visibility === "private" ? "私人倉" : "GitHub"}
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            ) : null}
            {work.liveUrl ? (
              <Button asChild>
                <a href={work.liveUrl} target="_blank" rel="noreferrer">
                  {work.liveLabel ?? "網站"}
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            ) : null}
          </div>
        </article>
        <dl>
          <Side dt="技術棧" dd={work.stack.join(" · ")} />
          {work.github ? (
            <Side
              dt="倉庫"
              dd={`${work.github.owner}/${work.github.repo}（${work.github.visibility === "private" ? "私人" : "公開"}）`}
            />
          ) : null}
          <Side dt="年份" dd={work.year} />
          <Side dt="狀態" dd={STATUS_LABEL[work.status]} />
        </dl>
      </section>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">相關作品</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <WorkCard key={item.slug} work={item} compact />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function Side({ dt, dd }: { dt: string; dd: string }) {
  return (
    <div className="border-t border-border py-3 first:border-t-0 first:pt-0">
      <dt className="text-xs text-faint">{dt}</dt>
      <dd className="mt-1 text-sm">{dd}</dd>
    </div>
  );
}

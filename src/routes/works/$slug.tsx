import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CaseToc } from "@/components/case-toc";
import { MetricTable } from "@/components/metric-table";
import { ProcessSteps } from "@/components/process-steps";
import { WorkCard } from "@/components/work-card";
import { WorkShot } from "@/components/work-shot";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_LABEL, PIPELINE_LABEL, STATUS_LABEL } from "@/content/types";
import { getWork, publicGithubHref, relatedWorks } from "@/content/works";

export const Route = createFileRoute("/works/$slug")({
  loader: ({ params }) => {
    const work = getWork(params.slug);
    if (!work) throw notFound();
    return { work, related: relatedWorks(work) };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.work
      ? `${loaderData.work.title} · ZOLAND WORKS`
      : "ZOLAND WORKS";
    const description = loaderData?.work?.summary;
    return {
      meta: [
        { title },
        { property: "og:title", content: title },
        ...(description
          ? [
              { name: "description", content: description },
              { property: "og:description", content: description },
            ]
          : []),
      ],
    };
  },
  component: WorkDetail,
});

function WorkDetail() {
  const { work, related } = Route.useLoaderData();

  return (
    <main className="wrap py-8 sm:py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/works" className="hover:text-accent">
              作品庫
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link
              to="/works"
              search={{ cat: work.category }}
              className="hover:text-accent"
            >
              {CATEGORY_LABEL[work.category]}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{work.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="muted">{CATEGORY_LABEL[work.category]}</Badge>
          <Badge tone="muted">{PIPELINE_LABEL[work.pipeline]}</Badge>
          <Badge tone="muted">{work.year}</Badge>
          <Badge tone="fg">{STATUS_LABEL[work.status]}</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{work.title}</h1>
        <p className="mt-2 text-lg text-muted">{work.subtitle}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">{work.summary}</p>
      </header>

      <div className="mt-8">
        <WorkShot work={work} />
      </div>

      <CaseToc work={work} />

      <section id="problem" className="mt-10 max-w-3xl scroll-mt-32">
        <h2 className="text-xl font-semibold">問題</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{work.problem.context}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{work.problem.pain}</p>
      </section>

      <Separator className="mt-10 max-w-3xl" />

      <section id="approach" className="mt-10 max-w-3xl scroll-mt-32">
        <h2 className="text-xl font-semibold">作法</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{work.approach.overview}</p>
      </section>

      <section id="results" className="mt-10 max-w-3xl scroll-mt-32">
        <h2 className="text-xl font-semibold">成效</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{work.results.narrative}</p>
        <div className="mt-6">
          <MetricTable
            metrics={work.results.metrics}
            caption="沒有公開數字的列只寫機制，不編造成效。"
          />
        </div>
      </section>

      <section id="method" className="mt-10 max-w-3xl scroll-mt-32">
        <h2 className="text-xl font-semibold">作法步驟</h2>
        <div className="mt-4">
          <ProcessSteps steps={work.approach.steps} />
        </div>
      </section>

      <section id="meta" className="mt-10 max-w-3xl scroll-mt-32">
        <h2 className="text-xl font-semibold">技術與倉庫</h2>
        <dl className="mt-4">
          <Side dt="技術棧" dd={work.stack.join(" · ")} />
          {publicGithubHref(work) && work.github ? (
            <Side dt="倉庫" dd={`${work.github.owner}/${work.github.repo}`} />
          ) : null}
          <Side dt="產線" dd={PIPELINE_LABEL[work.pipeline]} />
          <Side dt="年份" dd={work.year} />
          <Side dt="狀態" dd={STATUS_LABEL[work.status]} />
        </dl>
        <ul className="mt-4 flex flex-wrap gap-2">
          {work.highlights.map((item) => (
            <li key={item}>
              <Badge tone="muted">{item}</Badge>
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 ? (
        <section className="no-print mt-16">
          <h2 className="text-xl font-semibold tracking-tight">
            同一產線
            <span className="ml-2 text-sm font-normal text-faint">
              {PIPELINE_LABEL[work.pipeline]}
            </span>
          </h2>
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

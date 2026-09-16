import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";
import { workStats } from "@/content/works";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <main className="wrap py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
        <article>
          <h1 className="text-4xl font-semibold tracking-tight">
            從採購現場長出來的系統。
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted">{profile.blurb}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{profile.now}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            先量問題，再寫工具，最後留下可驗證的數字。沒有數字就寫機制，不編造成效。
          </p>
        </article>
        <aside className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold">現況</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {profile.latin} · {profile.role}。目前登錄 {workStats.total} 件，其中 {workStats.production}{" "}
              件標為正式在用。
            </p>
          </section>
          <section>
            <h2 className="text-sm font-semibold">採購／定價</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              五年採購、一年於前東擔任產品線窗口。月採購約 2,000 萬美元，約十家供應商。EOL
              料轉用、自動化報表讓交期不穩定約下降 60%。
            </p>
          </section>
          <section>
            <h2 className="text-sm font-semibold">現場系統</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Excel VBA、Outlook 落地、Oracle 對帳、Cloudflare / Vercel 儀表板。工具先解決自己每天要做的核對，再收成可給同事用的介面。
            </p>
          </section>
        </aside>
      </div>

      <section id="contact" className="mt-14 max-w-2xl border-t border-border pt-10">
        <h2 className="text-xl font-semibold">直接寫信</h2>
        <ul className="mt-4">
          <ContactRow label="Email">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </ContactRow>
          <ContactRow label="GitHub">
            <a href={profile.githubUrl} target="_blank" rel="noreferrer">
              {profile.handle}
            </a>
          </ContactRow>
          <ContactRow label="X">
            <a href={profile.xUrl} target="_blank" rel="noreferrer">
              @{profile.xHandle}
            </a>
          </ContactRow>
        </ul>
        <Button asChild className="mt-6">
          <Link to="/works">看作品庫</Link>
        </Button>
      </section>
    </main>
  );
}

function ContactRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <li className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-border py-3 text-sm first:border-t-0">
      <span className="pt-0.5 text-xs text-faint">{label}</span>
      <span className="text-fg hover:[&_a]:text-accent">{children}</span>
    </li>
  );
}

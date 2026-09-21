import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { WorkCard } from "@/components/work-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_LABEL, WORK_CATEGORIES, type WorkCategory } from "@/content/types";
import { matchWork, works } from "@/content/works";

type WorksSearch = {
  cat?: WorkCategory;
  q?: string;
};

const FILTERS = ["all", ...WORK_CATEGORIES] as const;
type FilterValue = (typeof FILTERS)[number];

export const Route = createFileRoute("/works/")({
  validateSearch: (search: Record<string, unknown>): WorksSearch => {
    const next: WorksSearch = {};
    const cat = search.cat;
    if (typeof cat === "string" && WORK_CATEGORIES.includes(cat as WorkCategory)) {
      next.cat = cat as WorkCategory;
    }
    if (typeof search.q === "string" && search.q.trim()) {
      next.q = search.q.trim();
    }
    return next;
  },
  head: () => ({
    meta: [
      { title: "作品庫 · ZOLAND WORKS" },
      { property: "og:title", content: "作品庫 · ZOLAND WORKS" },
    ],
  }),
  component: WorksIndex,
});

function WorksIndex() {
  const { cat, q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/works/" });
  const value: FilterValue = cat ?? "all";
  const visible = works.filter((work) => {
    if (cat && work.category !== cat) return false;
    return matchWork(work, q);
  });

  function onFilter(next: string) {
    const search: WorksSearch = {};
    if (q) search.q = q;
    if (next !== "all" && WORK_CATEGORIES.includes(next as WorkCategory)) {
      search.cat = next as WorkCategory;
    }
    void navigate({ search });
  }

  function onQuery(raw: string) {
    const search: WorksSearch = {};
    if (cat) search.cat = cat;
    const trimmed = raw.trim();
    if (trimmed) search.q = trimmed;
    void navigate({ search, replace: true });
  }

  return (
    <main className="wrap py-12 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">作品庫</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        每一件是獨立案例：問題、作法、成效。沒有公開數字的項目只寫機制，不編造成效。
      </p>

      <label className="relative mt-8 block max-w-md">
        <span className="sr-only">搜尋作品</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
        <Input
          defaultValue={q}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="搜尋標題、技術棧或摘要"
          className="pl-9"
        />
      </label>

      <Tabs value={value} onValueChange={onFilter} className="mt-6">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <TabsList aria-label="類型篩選" className="flex-nowrap">
            {FILTERS.map((key) => (
              <TabsTrigger key={key} value={key}>
                {key === "all" ? "全部" : CATEGORY_LABEL[key]}
                <span className="font-mono text-xs text-faint">{countFor(key)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={value}>
          {visible.length === 0 ? (
            <p className="py-10 text-sm text-muted">沒有符合的作品。</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {visible.map((work) => (
                <WorkCard key={work.slug} work={work} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

function countFor(key: FilterValue) {
  if (key === "all") return works.length;
  return works.filter((work) => work.category === key).length;
}

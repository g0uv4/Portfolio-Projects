import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { WorkCard } from "@/components/work-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_LABEL, WORK_CATEGORIES, type WorkCategory } from "@/content/types";
import { works } from "@/content/works";

type WorksSearch = {
  cat?: WorkCategory;
};

const FILTERS = ["all", ...WORK_CATEGORIES] as const;
type FilterValue = (typeof FILTERS)[number];

export const Route = createFileRoute("/works/")({
  validateSearch: (search: Record<string, unknown>): WorksSearch => {
    const cat = search.cat;
    if (typeof cat === "string" && WORK_CATEGORIES.includes(cat as WorkCategory)) {
      return { cat: cat as WorkCategory };
    }
    return {};
  },
  component: WorksIndex,
});

function WorksIndex() {
  const { cat } = Route.useSearch();
  const navigate = useNavigate({ from: "/works/" });
  const value: FilterValue = cat ?? "all";
  const visible = cat ? works.filter((work) => work.category === cat) : works;

  function onFilter(next: string) {
    if (next === "all") {
      void navigate({ search: {} });
      return;
    }
    if (WORK_CATEGORIES.includes(next as WorkCategory)) {
      void navigate({ search: { cat: next as WorkCategory } });
    }
  }

  return (
    <main className="wrap py-12 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">作品庫</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        每一件是獨立案例：問題、作法、成效。沒有公開數字的項目只寫機制，不編造成效。
      </p>

      <Tabs value={value} onValueChange={onFilter} className="mt-8">
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
            <p className="py-10 text-sm text-muted">這個類型還沒有登錄作品。</p>
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

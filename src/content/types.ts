export const WORK_CATEGORIES = [
  "vba",
  "web",
  "desktop",
  "automation",
  "data",
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export const CATEGORY_LABEL: Record<WorkCategory, string> = {
  vba: "VBA",
  web: "網頁",
  desktop: "桌面",
  automation: "自動化",
  data: "資料",
};

export type WorkStatus = "production" | "active" | "lab";

export const STATUS_LABEL: Record<WorkStatus, string> = {
  production: "正式在用",
  active: "持續迭代",
  lab: "實驗",
};

export type WorkMetric = {
  label: string;
  value: string;
  note?: string;
};

export const WORK_PIPELINES = ["planning", "etd", "ops", "lab"] as const;

export type WorkPipeline = (typeof WORK_PIPELINES)[number];

export const PIPELINE_LABEL: Record<WorkPipeline, string> = {
  planning: "規劃與簽核",
  etd: "交期與出貨",
  ops: "採購作業",
  lab: "方法實驗",
};

export type Work = {
  slug: string;
  title: string;
  subtitle: string;
  category: WorkCategory;
  pipeline: WorkPipeline;
  status: WorkStatus;
  year: string;
  stack: string[];
  featured: boolean;
  github?: {
    owner: string;
    repo: string;
    visibility: "public" | "private";
  };
  liveUrl?: string;
  summary: string;
  problem: {
    context: string;
    pain: string;
  };
  approach: {
    overview: string;
    steps: string[];
  };
  results: {
    narrative: string;
    metrics: WorkMetric[];
  };
  highlights: string[];
};

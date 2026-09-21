import type { Work, WorkCategory } from "./types";

/**
 * 新增作品：在此檔加入一個物件，並推進 `works` 陣列。
 * 路由 `/works/<slug>` 會自動出現，無需改頁面元件。
 */
export const works: Work[] = [
  {
    slug: "psi-dashboard",
    title: "PSI Dashboard",
    subtitle: "物料規劃工作台",
    category: "web",
    pipeline: "planning",
    status: "production",
    year: "2026",
    stack: ["JavaScript", "Cloudflare Pages", "D1", "R2"],
    featured: true,
    github: { owner: "g0uv4", repo: "psi-dashboard", visibility: "private" },
    live: { kind: "internal", to: "/psi-demo", label: "全螢幕" },
    summary:
      "把 PSI、預測、Rolling、庫存與在途採購單收進同一張物料規劃主表。規劃人員看六個月供需、在途與建議處置，調整會被保存，正式資料以不可變資料包切版。作品集附去識別化靜態展示站（約 30% 抽樣），不含正式資料與後端。",
    problem: {
      context:
        "物料規劃同時面對 PSI 主檔、預測、Rolling、庫存與在途採購單。資料在不同檔案、不同月份口徑，對不齊就不能下建議。",
      pain: "缺一欄、混用空白與 0、或把接單量跟預估值互相代填，都會讓建議處置失真。人工匯入也無法保證「畫面上的就是正式版」。",
    },
    approach: {
      overview:
        "做成 Cloudflare Pages 工作台：來源上傳與檢查 → 候選資料包 → 正式切版。主表先載工作索引與首批料號包，其餘按需補齊。",
      steps: [
        "四類來源對齊：PSI、預測、Rolling、在途採購單；銷售訂單只留歷史相容。",
        "正式服務資料包固定六個規劃月份，日曆跨月不自動重排。",
        "接單量與預估值分開欄位，空白、缺來源與已確認的 0 不可混用。",
        "破壞性清理需具名簽章票；預測依產品線分庫，不在畫面上暴露產線代碼。",
      ],
    },
    results: {
      narrative:
        "規劃改在同一張主表上看六個月供需、在途與建議處置。現行比對固定四類來源；預測依五條產品線分庫，互不覆寫。候選包與正式包分開切版，未審核資料不會進生產。",
      metrics: [
        { label: "規劃視窗", value: "6 個月", note: "正式資料包固定，日曆跨月不重排" },
        { label: "現行來源", value: "4 類", note: "PSI · FCST · Rolling · 在途 PO；SO 只留歷史相容" },
        { label: "預測分庫", value: "5 套", note: "各產品線獨立，畫面不列代碼" },
        { label: "切版層級", value: "2 層", note: "候選資料包與正式包分離" },
      ],
    },
    highlights: ["供需主表", "建議處置", "正式切版", "欄位公式"],
  },
  {
    slug: "vsr-dashboard",
    title: "VSR Dashboard",
    subtitle: "簽核意見與供需圖表",
    category: "web",
    pipeline: "planning",
    status: "production",
    year: "2026",
    stack: ["HTML", "Cloudflare Pages", "R2"],
    featured: true,
    github: { owner: "g0uv4", repo: "vsr-dashboard", visibility: "private" },
    summary:
      "靜態站部署在 Cloudflare Pages。匯入規劃主檔與通路對照後，自動產生簽核意見，並把未交採購／銷售、新單與 Rolling、產品線張數拆成可讀的圖。",
    problem: {
      context:
        "簽核需要同時看未交採購單、銷售訂單、庫存與 Rolling，再寫一段供給剩餘或缺口意見。資料每天更新，手寫意見容易跟數字脫節。",
      pain: "試算表開完還要對通路簡稱與價格表。口徑不一，圖表與文字各做一次，簽核速度被卡住。",
    },
    approach: {
      overview:
        "上傳試算表與通路對照到私有物件儲存，開頁自動載最新檔。意見文字隨輸入重算，不再按「計算」按鈕。",
      steps: [
        "必要工作表：銷售、採購、庫存、Rolling；對照欄位固定為鍵值、通路名稱、編號與價格表。",
        "對應規則：銷售與 Rolling 走編號，採購走通路簡稱，必要時用價格表做料號層回退。",
        "圖表分流：採購／銷售比較、新單與 Rolling（M～M+3）、產品線張數。",
        "本機排程每日 11:30 上傳最新檔，保留資料歷史 10 版、對照 5 版。",
      ],
    },
    results: {
      narrative:
        "簽核意見隨輸入重算，不再按計算鈕。開頁載最新檔；資料歷史保留 10 版、對照 5 版。Rolling 固定畫 M～M+3，與新單分開，避免檔新、意見舊。",
      metrics: [
        { label: "必要工作表", value: "4 張", note: "SO · PO · 庫存 · Rolling" },
        { label: "Rolling 視窗", value: "4 個月", note: "M · M+1 · M+2 · M+3，與新單分圖" },
        { label: "資料歷史", value: "10 版", note: "對照另留 5 版" },
        { label: "日更時刻", value: "11:30", note: "本機排程上傳；計算鈕已拿掉" },
      ],
    },
    highlights: ["簽核意見", "通路對照", "物件儲存", "產品線張數"],
  },
  {
    slug: "backlog-etd",
    title: "Backlog 交期比對",
    subtitle: "原廠 Open Order 交期",
    category: "vba",
    pipeline: "etd",
    status: "production",
    year: "2026",
    stack: ["VBA", "VBScript", "Python", "pandas"],
    featured: true,
    github: {
      owner: "g0uv4",
      repo: "Compare_POBacklog_ETD",
      visibility: "private",
    },
    summary:
      "選兩份原廠 Backlog，自動判斷檔名日期，用採購單號 + 項次 + 料號對鍵，標出提前、延後與新訂單，並算出天數差。",
    problem: {
      context:
        "原廠每週回 Open Order。採購要用兩份報表看出哪些線提前、哪些延後、哪些是新單，才能跟上下游對交期。",
      pain: "人工對三千列以上的 backlog，漏鍵、檔案先後放反、日期格式不一都很常見。核對常耗掉一個上午。",
    },
    approach: {
      overview:
        "VBA 與 Python 雙版本。鍵值為採購單號 + 項次 + 料號。檔名 8 碼日期自動判新舊，不必使用者記得選檔順序。",
      steps: [
        "狀態底色：提前綠、延後粉、新訂單藍；異動天數紅正綠負。",
        "輸出四張圖：通路異動筆數、金額散佈、天數分布、週別遷移。",
        "結果自動存到下載資料夾，檔名帶兩個日期。",
        "腳本迭代到 V6.09；Python 版保留同一套對鍵與天數邏輯。",
      ],
    },
    results: {
      narrative:
        "人工對三千列以上 backlog 常耗一個上午；現在選兩份檔，用三欄對鍵標提前、延後與新單，並算出天數差。這類自動化交期報表，讓交期不穩定能提早被看見。",
      metrics: [
        { label: "對鍵", value: "3 欄", note: "採購單號 · 項次 · 料號" },
        { label: "人工基準", value: "≥3,000 列", note: "核對常耗一個上午" },
        { label: "輸出圖", value: "4 張", note: "通路筆數 · 金額 · 天數 · 週別" },
        { label: "腳本版", value: "V6.09", note: "VBS 九個正式版；Python 同對鍵" },
      ],
    },
    highlights: ["交期天數", "提前 / 延後", "自動存檔", "雙實作"],
  },
  {
    slug: "outlook-inbox",
    title: "Outlook 附件收取",
    subtitle: "Backlog 與出貨通知",
    category: "automation",
    pipeline: "etd",
    status: "production",
    year: "2026",
    stack: ["Outlook VBA", "Excel"],
    featured: true,
    github: {
      owner: "g0uv4",
      repo: "Download_attacg_from_outlook",
      visibility: "private",
    },
    summary:
      "Outlook 一開就回溯五天信件，並即時監看指定資料夾。只收下試算表報表，自動建資料夾、擋重複檔，避免漏掉原廠 backlog 與出貨通知。",
    problem: {
      context:
        "原廠 backlog 與出貨通知進特定信件夾。後續比對工具都假設檔案已經在本機指定路徑。",
      pain: "郵件客戶端關掉的那幾天會漏信。簽名檔圖片、PDF 與試算表混在一起，手動另存每次都要判斷該不該覆蓋。",
    },
    approach: {
      overview:
        "啟動時掃過去五天，之後對目標資料夾做即時監控。副檔名鎖定試算表，路徑不存在就建立，檔名已存在就跳過。",
      steps: [
        "監看三個指定信件夾：原廠 backlog 與兩條產線的出貨通知。",
        "過濾非報表附件，避免簽名檔與無關圖片。",
        "與交期比對、日期碼檢查共用同一套落地規則，後段工具不必再找檔。",
      ],
    },
    results: {
      narrative:
        "每次開啟補掃三個指定夾過去五天的信，之後即時監看。只收下試算表，同檔名不覆蓋，讓交期比對與日期碼檢查不必再找檔。",
      metrics: [
        { label: "回溯", value: "5 天", note: "每次啟動補掃" },
        { label: "監看夾", value: "3 個", note: "原廠 backlog · 兩條產線出貨" },
        { label: "收檔", value: "試算表", note: "其餘附件不落地" },
        { label: "同名檔", value: "不覆蓋", note: "已存在就跳過" },
      ],
    },
    highlights: ["啟動補掃", "即時監看", "只收報表", "防覆蓋"],
  },
  {
    slug: "po-qty-updater",
    title: "採購單數量調整",
    subtitle: "出貨清單回寫數量與金額",
    category: "desktop",
    pipeline: "ops",
    status: "production",
    year: "2026",
    stack: ["Python", "openpyxl", "Windows"],
    featured: true,
    github: {
      owner: "g0uv4",
      repo: "purchase-order-quantity-updater",
      visibility: "public",
    },
    summary:
      "離線 Windows 工具。用出貨清單去改 HTML 格式採購單的數量、未稅金額與合計，另存新檔，不覆寫原單。",
    problem: {
      context:
        "出貨數量與原採購單常不一致，要依實際出貨改項次數量並重算金額。採購單是 HTML 包成的試算表，手動改容易動到不該動的列。",
      pain: "料號對不上、項次重複、或把沒出貨的列改成 0，都會讓合計錯。這份單不能上傳到雲端。",
    },
    approach: {
      overview:
        "本機選採購單與出貨清單，按採購單號 + 項次 + 料號完全相符才更新。未列出的項目保留原值。",
      steps: [
        "未稅金額 = 出貨數量 × 單價；合計只套用已修改列的差額。",
        "解析失敗、重複、料號不符時保留原值並寫入紀錄。",
        "結果與紀錄都在原資料夾另存；程式不含網路請求。",
        "打包成單一執行檔，使用端不必另裝執行環境。",
      ],
    },
    results: {
      narrative:
        "選採購單與出貨清單兩個檔，三欄完全相符才改數量。未稅金額依出貨數量 × 單價重算，合計只套用已改列差額。原單另存、程式不含網路請求。",
      metrics: [
        { label: "對鍵", value: "3 欄", note: "採購單號 · 項次 · 料號須全同" },
        { label: "輸入檔", value: "2 份", note: "HTML 採購單 + 出貨清單" },
        { label: "執行檔", value: "1 份", note: "使用端免裝環境" },
        { label: "原檔", value: "另存", note: "結果與紀錄都不覆寫原單" },
      ],
    },
    highlights: ["離線處理", "差額合計", "詳細紀錄", "Windows 包裝"],
  },
  {
    slug: "vba-studio",
    title: "Excel 解法室",
    subtitle: "用訪談整理 VBA 需求",
    category: "web",
    pipeline: "lab",
    status: "lab",
    year: "2026",
    stack: ["TypeScript", "vinext", "D1"],
    featured: false,
    github: { owner: "g0uv4", repo: "vba-web", visibility: "private" },
    summary:
      "把 Excel / VBA 需求從「直接寫巨集」改成先做白話訪談。用網站收問題、範圍與限制，再對應到公式或 VBA 解法。",
    problem: {
      context:
        "現場提出的 Excel 問題通常是症狀（「幫我對一下」），不是規格。直接開工容易做過或做錯邊界。",
      pain: "沒有地方把「資料從哪來、誰會按、失敗時要怎樣」寫下來，解法無法累積成下一案的模組。",
    },
    approach: {
      overview:
        "訪談式頁面收需求，範例與解法分開存放，後端可掛資料庫。目標是讓下一個人不用從聊天紀錄還原脈絡。",
      steps: [
        "以白話問題當入口，而不是先丟程式碼編輯器。",
        "解法室與需求訪談頁搭配，實務案例共用同一套提問結構。",
      ],
    },
    results: {
      narrative:
        "每個案例先寫資料從哪來、誰會按、失敗時要怎樣，再對到公式或 VBA。訪談頁與解法頁分開；加一題就是加一頁，不必改整站。還沒有已上線的案件數可報。",
      metrics: [
        { label: "頁型", value: "2 種", note: "需求訪談與解法室分開" },
        { label: "提問結構", value: "3 項", note: "來源 · 操作者 · 失敗時怎麼辦" },
        { label: "擴充單位", value: "1 頁 / 題", note: "新解法不改整站" },
        { label: "上線案件", value: "未計量", note: "實驗站，不編成件數成效" },
      ],
    },
    highlights: ["需求訪談", "解法庫", "可擴充頁"],
  },
  {
    slug: "datecode",
    title: "Date Code 檢查",
    subtitle: "出貨通知超過一年警示",
    category: "vba",
    pipeline: "etd",
    status: "production",
    year: "2026",
    stack: ["VBScript", "Excel"],
    featured: false,
    github: { owner: "g0uv4", repo: "check_datecode", visibility: "private" },
    summary:
      "讀取出貨通知，標出日期碼超過一年的批。讓過舊庫存在出貨前被看見，而不是在收貨端才爆。",
    problem: {
      context:
        "半導體料日期碼過舊會被退貨或拒收。出貨通知裡有批號，但人工掃容易漏。",
      pain: "年與週碼格式不統一，混在大量正常批裡，只靠肉眼幾乎一定漏。",
    },
    approach: {
      overview:
        "解析出貨通知的日期碼，與一年門檻比較，輸出需處理清單。與郵件自動落地的檔案銜接。",
      steps: [
        "只處理已標準化的出貨通知，不在信件裡臨時猜格式。",
        "超過一年的批單獨列出，供採購決定換批或通知窗口。",
      ],
    },
    results: {
      narrative:
        "出貨通知一進來就用日期碼對「今天往前一年」這道門檻。超齡批單獨列出，讓過舊庫存在出貨前被看見，而不是收貨端才爆。",
      metrics: [
        { label: "門檻", value: "1 年", note: "日期碼對應日早於今天往前一年" },
        { label: "輸入", value: "出貨通知", note: "與信件落地檔銜接" },
        { label: "年碼", value: "1 字母+週", note: "如 P01＝該年第 1 週" },
        { label: "輸出", value: "1 份清單", note: "只列超齡批，供換批或通知窗口" },
      ],
    },
    highlights: ["超齡批", "出貨前攔截"],
  },
  {
    slug: "combin-backlog",
    title: "PO Backlog合併",
    subtitle: "多份 Open Order 合成一表",
    category: "vba",
    pipeline: "etd",
    status: "production",
    year: "2026",
    stack: ["VBScript", "Excel"],
    featured: false,
    github: { owner: "g0uv4", repo: "combin_POBACKLOG", visibility: "private" },
    summary:
      "把分散的採購 backlog 檔合成一份可往後丟給交期比對的表。合併規則固定，避免每次手工複製造成欄位漂移。",
    problem: {
      context:
        "原廠或內部有時會拆多份 backlog。要比對交期，得先合成鍵值一致的一張表。",
      pain: "手工合併最常出的問題是欄位移位、表頭被貼兩次、以及漏掉某一份週檔。",
    },
    approach: {
      overview:
        "用固定欄位對應合併，輸出單一 backlog，再交給交期比對工具。",
      steps: [
        "合併與比對拆成兩個倉庫，單一職責，改其中一段不會拖垮另一段。",
        "輸出格式對齊交期比對工具的輸入契約。",
      ],
    },
    results: {
      narrative:
        "選一個資料夾，依檔名月份各留 1 份最新原廠 Backlog，表頭只抄一次，輸出單一工作表「合併報表_Summary」。合併與交期比對分倉，欄位契約固定後再往下丟。",
      metrics: [
        { label: "輸出表", value: "1 張", note: "工作表名合併報表_Summary" },
        { label: "每月取檔", value: "1 份最新", note: "檔名 YYYYMM 去重" },
        { label: "表頭", value: "抄 1 次", note: "後續檔從第 2 列接上" },
        { label: "下游", value: "1 個契約", note: "交給交期比對工具" },
      ],
    },
    highlights: ["多檔合成", "欄位契約"],
  },
  {
    slug: "oracle-sql",
    title: "Oracle SQL 對帳",
    subtitle: "採購與庫存查詢集",
    category: "data",
    pipeline: "ops",
    status: "production",
    year: "2026",
    stack: ["PL/SQL", "Oracle"],
    featured: false,
    github: { owner: "g0uv4", repo: "sql", visibility: "private" },
    summary:
      "把資料庫上反覆在用的對帳與查詢收成腳本庫。試算表與儀表板要的資料，有對應的可重跑語句，而不是每次現場現寫。",
    problem: {
      context:
        "質押、未交、庫存與價格經常要跟系統對。查詢散在個人視窗裡，交接時誰都找不到。",
      pain: "同一條邏輯被改出三個版本，報表對不上系統時，不知道該信哪一份。",
    },
    approach: {
      overview: "把實務查詢依用途分檔進版本庫，當試算表與網頁的上游契約。",
      steps: [
        "不把帳號或正式連線字串寫進倉。",
        "查詢與試算表／儀表板輸入欄位對齊，減少「多一欄、表就炸」的情況。",
      ],
    },
    results: {
      narrative:
        "質押、未交、庫存與價格四類對帳收成可重跑腳本。帳號與連線字串不進倉。同一邏輯不再並行三份，報表跟系統對不上時先對這份共同查詢。",
      metrics: [
        { label: "查詢主題", value: "4 類", note: "質押 · 未交 · 庫存 · 價格" },
        { label: "並行版本", value: "1 份", note: "同一邏輯收斂，不再並行" },
        { label: "痛點基準", value: "3 份", note: "改版前同一邏輯常被改出三個版本" },
        { label: "連線字串", value: "不進倉", note: "不寫帳號或正式連線" },
      ],
    },
    highlights: ["對帳查詢", "版本化 SQL"],
  },
  {
    slug: "side-vba",
    title: "現場 VBA 工具箱",
    subtitle: "對帳、調貨、補單、對照表",
    category: "vba",
    pipeline: "ops",
    status: "active",
    year: "2026",
    stack: ["VBA", "Excel"],
    featured: false,
    github: { owner: "g0uv4", repo: "side-project", visibility: "private" },
    summary:
      "把還在現場用、但尚未獨立成專案的 VBA 收在同一倉：對帳單、調貨信、補單、通路對照。之後哪一件穩定了，就拆出去變成獨立作品頁。",
    problem: {
      context:
        "採購現場會冒出一次性巨集。若不收進版本庫，人一換就只剩一個沒註解的巨集檔。",
      pain: "所有巨集塞進同一個檔案時，改 A 會弄壞 B，也無法在作品集裡單獨說明成效。",
    },
    approach: {
      overview:
        "依任務分子資料夾，原始碼另存，巨集檔只當載體。穩定後再升級成獨立倉庫與獨立案例。",
      steps: [
        "對帳單、調貨信件、補單需求、通路對照分開放。",
        "本作品集以「工具箱」呈現，不把未完成項假裝成已上線產品。",
      ],
    },
    results: {
      narrative:
        "對帳單、調貨信、補單、通路對照分四箱收。原始碼另存、巨集檔只當載體。能獨立說明的才拆成作品頁，其餘留在這一個工具箱，不把未完成項算成已上線。",
      metrics: [
        { label: "任務分箱", value: "4 類", note: "對帳 · 調貨 · 補單 · 對照" },
        { label: "工具箱", value: "1 倉", note: "未拆倉者不假裝已上線" },
        { label: "原始碼", value: "與巨集分存", note: "巨集檔只當載體，不當唯一真相" },
      ],
    },
    highlights: ["現場腳本", "可拆倉", "原始碼另存"],
  },
];

export function workCode(work: Work): string {
  const i = works.findIndex((item) => item.slug === work.slug);
  return `ZW-${String(Math.max(i, 0) + 1).padStart(2, "0")}`;
}

export function getWork(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug);
}

export function featuredWorks(): Work[] {
  return works.filter((work) => work.featured);
}

export function worksByCategory(category?: WorkCategory | "all"): Work[] {
  if (!category || category === "all") return works;
  return works.filter((work) => work.category === category);
}

export function matchWork(work: Work, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    work.title,
    work.subtitle,
    work.summary,
    work.stack.join(" "),
    work.highlights.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export function relatedWorks(work: Work, limit = 3): Work[] {
  const rest = works.filter((item) => item.slug !== work.slug);
  const samePipe = rest.filter((item) => item.pipeline === work.pipeline);
  if (samePipe.length > 0) return samePipe.slice(0, limit);
  return rest
    .filter((item) => item.category === work.category)
    .slice(0, limit);
}

export function githubKey(owner: string, repo: string): string {
  return `${owner}/${repo}`.toLowerCase();
}

export function publicGithubHref(work: Pick<Work, "github">): string | null {
  const gh = work.github;
  if (!gh || gh.visibility !== "public") return null;
  return `https://github.com/${gh.owner}/${gh.repo}`;
}

export function workByRepo(owner: string, repo: string): Work | undefined {
  const key = githubKey(owner, repo);
  return works.find(
    (work) =>
      work.github && githubKey(work.github.owner, work.github.repo) === key,
  );
}

export const workStats = {
  total: works.length,
  featured: featuredWorks().length,
  production: works.filter((work) => work.status === "production").length,
  categories: WORK_CATEGORY_COUNT(),
};

function WORK_CATEGORY_COUNT(): number {
  return new Set(works.map((work) => work.category)).size;
}

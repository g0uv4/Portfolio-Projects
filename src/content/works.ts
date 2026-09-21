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
    status: "production",
    year: "2026",
    stack: ["JavaScript", "Cloudflare Pages", "D1", "R2"],
    featured: true,
    github: { owner: "g0uv4", repo: "psi-dashboard", visibility: "private" },
    liveUrl: "/psi-dashboard/index.html",
    liveLabel: "展示站",
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
        "規劃從「對完檔再貼表」改成「在同一張主表上看建議、存調整、可回滾」。正式切版與預覽隔離，避免把未審核資料寫進生產。",
      metrics: [
        { label: "規劃視窗", value: "6 個月", note: "正式資料包固定月份" },
        { label: "預測分庫", value: "依產品線", note: "各線獨立，互不覆寫" },
        { label: "來源對齊", value: "4 類", note: "主檔 · 預測 · Rolling · 在途" },
        { label: "切版", value: "不可變包", note: "候選與正式分離" },
      ],
    },
    highlights: ["供需主表", "建議處置", "正式切版", "欄位公式"],
  },
  {
    slug: "vsr-dashboard",
    title: "VSR Dashboard",
    subtitle: "簽核意見與供需圖表",
    category: "web",
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
        "圖表分流：採購／銷售比較、新單與 Rolling（當月起三個月）、產品線張數。",
        "本機排程每日上傳最新檔，保留資料歷史 10 版、對照 5 版。",
      ],
    },
    results: {
      narrative:
        "簽核意見與圖表跟著同一份最新檔走。開頁即載、輸入即更新，減少「檔案是新的、意見還是舊的」這種落差。",
      metrics: [
        { label: "意見產生", value: "即時", note: "輸入變更自動重算" },
        { label: "資料歷史", value: "10 版", note: "物件儲存保留" },
        { label: "Rolling", value: "當月起 3 個月", note: "與新單分開繪製" },
        { label: "日更", value: "排程", note: "本機上傳至部署 API" },
      ],
    },
    highlights: ["簽核意見", "通路對照", "物件儲存", "產品線張數"],
  },
  {
    slug: "backlog-etd",
    title: "Backlog 交期比對",
    subtitle: "原廠 Open Order 交期",
    category: "vba",
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
        "交期核對從「對完鍵再著色」變成選兩份檔、等報表。這類自動化報表，讓交期不穩定能提早被看見，現場例外可以提前處理。",
      metrics: [
        { label: "迭代", value: "V6.09", note: "九個正式版" },
        { label: "對鍵", value: "3 欄", note: "單號 · 項次 · 料號" },
        { label: "圖表", value: "4 張", note: "通路 / 金額 / 天數 / 週別" },
        { label: "選檔", value: "無順序", note: "檔名日期自動判新舊" },
      ],
    },
    highlights: ["交期天數", "提前 / 延後", "自動存檔", "雙實作"],
  },
  {
    slug: "outlook-inbox",
    title: "Outlook 附件收取",
    subtitle: "Backlog 與出貨通知",
    category: "automation",
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
        "報表落地不再依賴「有沒有人剛好開著郵件客戶端」。漏檔與覆蓋原檔這兩類操作失誤，從流程裡拿掉。",
      metrics: [
        { label: "回溯", value: "5 天", note: "每次啟動補掃" },
        { label: "監看夾", value: "3 個", note: "Backlog + 兩條出貨通知" },
        { label: "格式", value: "試算表", note: "其餘附件丟棄" },
        { label: "去重", value: "檔名", note: "不覆蓋已存在檔" },
      ],
    },
    highlights: ["啟動補掃", "即時監看", "只收報表", "防覆蓋"],
  },
  {
    slug: "po-qty-updater",
    title: "採購單數量調整",
    subtitle: "出貨清單回寫數量與金額",
    category: "desktop",
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
        "大量改數量從「逐列手改」變成選兩個檔。原單保留，錯列可從紀錄回追，適合不能把採購單送出公司網的環境。",
      metrics: [
        { label: "對鍵", value: "3 欄", note: "單號 · 項次 · 料號" },
        { label: "原檔", value: "不覆寫", note: "結果另存" },
        { label: "網路", value: "無", note: "完全離線" },
        { label: "發布", value: "執行檔", note: "一般使用者免裝環境" },
      ],
    },
    highlights: ["離線處理", "差額合計", "詳細紀錄", "Windows 包裝"],
  },
  {
    slug: "vba-studio",
    title: "Excel 解法室",
    subtitle: "用訪談整理 VBA 需求",
    category: "web",
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
        "需求被寫成可重讀的案例，而不是散落在對話裡。之後加新解法只是加一頁，不必改整站。",
      metrics: [
        { label: "入口", value: "訪談", note: "先問題後程式" },
        { label: "儲存", value: "可掛庫", note: "案例可累積" },
        { label: "擴充", value: "分頁", note: "一題一解法" },
      ],
    },
    highlights: ["需求訪談", "解法庫", "可擴充頁"],
  },
  {
    slug: "datecode",
    title: "Date Code 檢查",
    subtitle: "出貨通知超過一年警示",
    category: "vba",
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
        "過舊批從「出貨後才發現」前移到「通知一進來就標紅」。屬於例外提前處理的一環。",
      metrics: [
        { label: "門檻", value: "1 年", note: "日期碼超齡" },
        { label: "輸入", value: "出貨通知", note: "與自動收取銜接" },
      ],
    },
    highlights: ["超齡批", "出貨前攔截"],
  },
  {
    slug: "combin-backlog",
    title: "Backlog 合併",
    subtitle: "多份 Open Order 合成一表",
    category: "vba",
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
        "比對工具不再承擔「檔案長什麼樣」的不確定性。前置合併失敗會停在這一步，而不是在天數圖上出現鬼列。",
      metrics: [
        { label: "職責", value: "單一", note: "只合併、不比對" },
        { label: "下游", value: "交期比對", note: "輸入契約固定" },
      ],
    },
    highlights: ["多檔合成", "欄位契約"],
  },
  {
    slug: "oracle-sql",
    title: "Oracle SQL 對帳",
    subtitle: "採購與庫存查詢集",
    category: "data",
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
        "對帳語句可以比對差異、可以回滾。系統數字與報表數字的爭議，至少有一份共同的查詢起點。",
      metrics: [
        { label: "來源", value: "資料庫", note: "與現場系統對帳" },
        { label: "形式", value: "腳本庫", note: "可版本控制" },
      ],
    },
    highlights: ["對帳查詢", "版本化 SQL"],
  },
  {
    slug: "side-vba",
    title: "現場 VBA 工具箱",
    subtitle: "對帳、調貨、補單、對照表",
    category: "vba",
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
        "現場腳本有了暫存與分級：能獨立說明的進正式案例，其餘留在工具箱。這就是模組化維護的起點。",
      metrics: [
        { label: "分箱", value: "多任務", note: "對帳 / 調貨 / 補單 / 對照" },
        { label: "下一步", value: "拆倉", note: "穩定後獨立成作品頁" },
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

export function relatedWorks(work: Work, limit = 3): Work[] {
  return works
    .filter((item) => item.slug !== work.slug)
    .sort((a, b) => {
      const aSame = a.category === work.category ? 1 : 0;
      const bSame = b.category === work.category ? 1 : 0;
      return bSame - aSame;
    })
    .slice(0, limit);
}

export function githubKey(owner: string, repo: string): string {
  return `${owner}/${repo}`.toLowerCase();
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

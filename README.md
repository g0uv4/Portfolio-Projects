# Portfolio Projects

ZOLAND WORKS — 力華暐（Zoland Li）的模組化作品集網站。

不是一頁式展示頁。每一件作品是獨立案例，寫清楚原先要解決的問題、作法，以及可以量化的成效。內容以採購／供應鏈現場的 VBA、網頁與桌面工具為主。

## 技術

- TanStack Start + React 19
- Tailwind CSS v4
- shadcn / Radix（Card、Tabs、Dialog）
- GitHub API 讀取已登錄倉庫狀態

## 本機

```bash
npm install
npm run dev
```

預設在 `8080`。正式建置：

```bash
npm run typecheck
npm run build
```

部署到 Vercel：連這個倉庫即可。框架會由建置流程自動偵測。

## 新增作品

編輯 [`src/content/works.ts`](src/content/works.ts)，在陣列加一個物件。`slug` 會自動變成 `/works/<slug>`，不必改路由。

個人資料在 [`src/content/profile.ts`](src/content/profile.ts)。

## 授權

原始碼以作品集展示為主。第三方套件各自依其授權。

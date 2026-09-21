import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import appCss from "../styles.css?url";

const APP_NAME = "ZOLAND WORKS";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Zoland Li 的作品庫。把現場流程做成可交接的系統：問題、作法、量化成效。",
      },
      { name: "theme-color", content: "#F4F7FB" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/og.jpg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Noto+Sans+TC:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  const chrome = useRouterState({
    select: (state) =>
      state.matches.some((match) => match.staticData.chrome === "workbench")
        ? "workbench"
        : "site",
  });
  const showSiteChrome = chrome === "site";

  return (
    <html lang="zh-Hant" className="overflow-x-clip" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
        <PreviewHostBridge />
        <AuthProvider>
          <TooltipProvider>
            <div className="flex min-h-dvh flex-col">
              {showSiteChrome ? <SiteHeader /> : null}
              <div className="flex-1">
                <Outlet />
              </div>
              {showSiteChrome ? <SiteFooter /> : null}
            </div>
          </TooltipProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

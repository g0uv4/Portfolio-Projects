import { createFileRoute } from "@tanstack/react-router";
import { PsiDemoBoard } from "@/components/psi-demo/board";
import { usePsiDemoSession } from "@/lib/psi-demo";

export const Route = createFileRoute("/psi-demo")({
  staticData: { chrome: "workbench" as const },
  head: () => ({
    meta: [{ title: "PSI 示意規劃表" }],
  }),
  component: PsiDemoPage,
});

function PsiDemoPage() {
  const { view, edit, reset } = usePsiDemoSession();
  return (
    <PsiDemoBoard
      view={view}
      onEdit={edit}
      onReset={reset}
      backTo={{ to: "/works/$slug", params: { slug: "psi-dashboard" } }}
    />
  );
}

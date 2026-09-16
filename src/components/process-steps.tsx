export function ProcessSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="relative ml-3 border-l border-border">
      {steps.map((step, i) => (
        <li key={step} className="relative pb-5 pl-5 last:pb-0">
          <span
            aria-hidden
            className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent"
          />
          <p className="font-mono text-[11px] tabular-nums text-faint">
            {String(i + 1).padStart(2, "0")}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{step}</p>
        </li>
      ))}
    </ol>
  );
}

export function LatticeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="none">
      <rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 1.5v13M10 1.5v13M1.5 6h13M1.5 10h13" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

import { Link } from "@tanstack/react-router";
import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface print:hidden">
      <div className="wrap flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {profile.latin} · {profile.location}
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-1">
          <Link to="/works" className="transition-colors duration-150 hover:text-accent">
            作品庫
          </Link>
          <Link to="/about" className="transition-colors duration-150 hover:text-accent">
            關於
          </Link>
          <Link to="/github" className="transition-colors duration-150 hover:text-accent">
            GitHub
          </Link>
        </p>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border print:hidden">
      <div className="wrap flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {profile.latin} · {profile.location}
        </p>
        <p className="flex flex-wrap gap-x-5">
          <Link to="/works" className="hover:text-fg">
            作品庫
          </Link>
          <Link to="/about" className="hover:text-fg">
            關於
          </Link>
          <Link to="/github" className="hover:text-fg">
            GitHub
          </Link>
        </p>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Übersicht" },
  { href: "/projekte", label: "Projekte" },
  { href: "/aktivitaet", label: "Aktivität" },
  { href: "/copilot", label: "Copilot" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Hauptnavigation"
      className="flex gap-1 overflow-x-auto border-b border-border bg-surface px-4 py-3 md:w-56 md:shrink-0 md:flex-col md:border-b-0 md:border-r md:px-3 md:py-6"
    >
      <div className="mr-4 flex items-center gap-2 px-2 font-semibold md:mb-6 md:mr-0">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-sm text-white">CP</span>
        <span className="whitespace-nowrap">Copilot Pro</span>
      </div>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-accent-soft font-medium text-accent"
                : "text-muted hover:bg-surface-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

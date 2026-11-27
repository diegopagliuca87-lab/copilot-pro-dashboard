import type { ReactNode } from "react";

import type { Stat } from "@/lib/data";

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
    </header>
  );
}

export function Card({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-border bg-surface p-5 ${className}`}>
      {title ? <h2 className="mb-4 text-sm font-medium text-muted">{title}</h2> : null}
      {children}
    </section>
  );
}

const TREND_STYLE: Record<Stat["trend"], string> = {
  up: "text-positive",
  down: "text-negative",
  flat: "text-muted",
};

export function StatCard({ stat }: { stat: Stat }) {
  return (
    <Card>
      <p className="text-sm text-muted">{stat.label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{stat.value}</p>
      <p className={`mt-1 text-xs ${TREND_STYLE[stat.trend]}`}>{stat.change}</p>
    </Card>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface-muted px-2 py-0.5 text-xs text-muted">
      {children}
    </span>
  );
}

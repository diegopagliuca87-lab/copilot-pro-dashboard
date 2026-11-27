import type { WeeklyActivity } from "@/lib/data";

const CHART_HEIGHT = 160;

export function ActivityChart({ data }: { data: readonly WeeklyActivity[] }) {
  const max = Math.max(...data.map((d) => d.commits), 1);

  return (
    <figure>
      <div
        className="flex items-end gap-2"
        style={{ height: CHART_HEIGHT }}
        role="img"
        aria-label={`Commits pro Woche, höchster Wert ${max}`}
      >
        {data.map((d) => (
          <div key={d.week} className="group relative flex h-full flex-1 flex-col justify-end">
            <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
              {d.commits}
            </span>
            <div
              className="rounded-t-md bg-accent/80 transition-colors group-hover:bg-accent"
              style={{ height: `${(d.commits / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <figcaption className="mt-2 flex gap-2 text-[10px] text-muted">
        {data.map((d) => (
          <span key={d.week} className="flex-1 text-center">
            {d.week.replace("KW ", "")}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

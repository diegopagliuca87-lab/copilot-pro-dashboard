import type { ActivityItem } from "@/lib/data";

const KIND_LABEL: Record<ActivityItem["kind"], string> = {
  commit: "Commit",
  issue: "Issue",
  pr: "Pull Request",
};

const KIND_DOT: Record<ActivityItem["kind"], string> = {
  commit: "bg-accent",
  issue: "bg-negative",
  pr: "bg-positive",
};

export function ActivityList({ items }: { items: readonly ActivityItem[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item) => (
        <li key={`${item.repo}-${item.title}`} className="flex gap-3">
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${KIND_DOT[item.kind]}`} aria-hidden />
          <div className="min-w-0">
            <p className="truncate text-sm">{item.title}</p>
            <p className="text-xs text-muted">
              {KIND_LABEL[item.kind]} · {item.repo} · {item.when}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

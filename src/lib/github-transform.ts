// Reine Umrechnungen von GitHub-API-Antworten in Dashboard-Daten (ohne Netzwerk, gut testbar).

import type { ActivityItem, Repo, Stat, WeeklyActivity } from "@/lib/data";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
export const WEEKS_SHOWN = 12;

export type GitHubRepo = {
  readonly name: string;
  readonly description: string | null;
  readonly language: string | null;
  readonly stargazers_count: number;
  readonly open_issues_count: number;
  readonly pushed_at: string | null;
  readonly updated_at: string;
  readonly private: boolean;
  readonly fork: boolean;
};

export type GitHubEvent = {
  readonly type: string;
  readonly created_at: string;
  readonly repo: { readonly name: string };
  readonly payload: Record<string, unknown>;
};

const relativeFormat = new Intl.RelativeTimeFormat("de", { numeric: "auto" });

export function formatRelative(iso: string, now: number): string {
  const diffMs = new Date(iso).getTime() - now;
  const minutes = Math.round(diffMs / 60000);
  if (Math.abs(minutes) < 60) return relativeFormat.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeFormat.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 14) return relativeFormat.format(days, "day");
  const weeks = Math.round(days / 7);
  if (Math.abs(weeks) < 9) return relativeFormat.format(weeks, "week");
  return relativeFormat.format(Math.round(days / 30), "month");
}

export function isGitHubRepo(value: unknown): value is GitHubRepo {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.name === "string" && typeof v.stargazers_count === "number" && typeof v.updated_at === "string";
}

export function isGitHubEvent(value: unknown): value is GitHubEvent {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  const repo = v.repo as Record<string, unknown> | undefined;
  return typeof v.type === "string" && typeof v.created_at === "string" && typeof repo?.name === "string";
}

export function toRepos(raw: readonly GitHubRepo[], now: number): Repo[] {
  return raw
    .filter((r) => !r.fork)
    .toSorted((a, b) => (b.pushed_at ?? b.updated_at).localeCompare(a.pushed_at ?? a.updated_at))
    .map((r) => ({
      name: r.name,
      description: r.description ?? "Keine Beschreibung",
      language: r.language ?? "–",
      stars: r.stargazers_count,
      openIssues: r.open_issues_count,
      updated: formatRelative(r.pushed_at ?? r.updated_at, now),
      visibility: r.private ? "privat" : "öffentlich",
    }));
}

/** Zaehlt Commit-Zeitpunkte in die letzten WEEKS_SHOWN Wochen (aelteste zuerst). */
export function toWeeklyActivity(commitDates: readonly string[], now: number): WeeklyActivity[] {
  const counts = new Array<number>(WEEKS_SHOWN).fill(0);
  for (const iso of commitDates) {
    const weeksAgo = Math.floor((now - new Date(iso).getTime()) / WEEK_MS);
    if (weeksAgo >= 0 && weeksAgo < WEEKS_SHOWN) counts[WEEKS_SHOWN - 1 - weeksAgo] += 1;
  }
  return counts.map((commits, i) => ({ week: weekLabel(now - (WEEKS_SHOWN - 1 - i) * WEEK_MS), commits }));
}

function weekLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((target.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7);
  return `KW ${week}`;
}

function shortRepo(fullName: string): string {
  return fullName.split("/").pop() ?? fullName;
}

function eventToItem(event: GitHubEvent, now: number): ActivityItem | null {
  const p = event.payload;
  const repo = shortRepo(event.repo.name);
  const when = formatRelative(event.created_at, now);
  switch (event.type) {
    case "PushEvent": {
      const branch = typeof p.ref === "string" ? p.ref.replace("refs/heads/", "") : "";
      const commits = Array.isArray(p.commits) ? p.commits : [];
      const last = commits.at(-1) as { message?: unknown } | undefined;
      const message = typeof last?.message === "string" ? last.message.split("\n")[0] : "";
      return { kind: "commit", title: message || `Änderungen hochgeladen${branch ? ` (${branch})` : ""}`, repo, when };
    }
    case "IssuesEvent": {
      const issue = p.issue as { title?: unknown } | undefined;
      const title = typeof issue?.title === "string" ? issue.title : "Issue";
      return { kind: "issue", title, repo, when };
    }
    case "PullRequestEvent": {
      const pr = p.pull_request as { title?: unknown } | undefined;
      const title = typeof pr?.title === "string" ? pr.title : "Pull Request";
      return { kind: "pr", title, repo, when };
    }
    case "CreateEvent":
      if (p.ref_type === "repository") return { kind: "commit", title: "Projekt angelegt", repo, when };
      return null;
    default:
      return null;
  }
}

export function toActivity(events: readonly GitHubEvent[], now: number, limit: number): ActivityItem[] {
  const items: ActivityItem[] = [];
  for (const event of events) {
    const item = eventToItem(event, now);
    if (item) items.push(item);
    if (items.length >= limit) break;
  }
  return items;
}

const numberFormat = new Intl.NumberFormat("de-DE");

export function toStats(repos: readonly Repo[], weekly: readonly WeeklyActivity[]): Stat[] {
  const stars = repos.reduce((sum, r) => sum + r.stars, 0);
  const openIssues = repos.reduce((sum, r) => sum + r.openIssues, 0);
  const last4 = weekly.slice(-4).reduce((sum, w) => sum + w.commits, 0);
  const prev4 = weekly.slice(-8, -4).reduce((sum, w) => sum + w.commits, 0);
  const diff = last4 - prev4;
  return [
    { label: "Projekte", value: numberFormat.format(repos.length), change: "eigene Repositories", trend: "flat" },
    { label: "Sterne", value: numberFormat.format(stars), change: "über alle Projekte", trend: "flat" },
    { label: "Offene Issues", value: numberFormat.format(openIssues), change: "inkl. Pull Requests", trend: "flat" },
    {
      label: "Commits (4 Wochen)",
      value: numberFormat.format(last4),
      change: diff === 0 ? "gleich wie davor" : `${diff > 0 ? "+" : "−"}${Math.abs(diff)} zu den 4 Wochen davor`,
      trend: diff > 0 ? "up" : diff < 0 ? "down" : "flat",
    },
  ];
}

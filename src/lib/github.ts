// Laedt echte Daten von der GitHub-API. Ergebnis wird einige Minuten zwischengespeichert,
// damit das Limit der GitHub-API (ohne Token 60 Anfragen pro Stunde) nicht erreicht wird.

import { cacheLife } from "next/cache";

import type { ActivityItem, Repo, Stat, WeeklyActivity } from "@/lib/data";
import {
  type GitHubEvent,
  type GitHubRepo,
  WEEKS_SHOWN,
  isGitHubEvent,
  isGitHubRepo,
  toActivity,
  toRepos,
  toStats,
  toWeeklyActivity,
} from "@/lib/github-transform";

const API = "https://api.github.com";
const DEFAULT_USERNAME = "diegopagliuca87-lab";
const REQUEST_TIMEOUT_MS = 10_000;
const ACTIVITY_LIMIT = 20;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export type DashboardData = {
  readonly username: string;
  readonly stats: readonly Stat[];
  readonly repos: readonly Repo[];
  readonly weekly: readonly WeeklyActivity[];
  readonly activity: readonly ActivityItem[];
};

export type DashboardResult =
  | { readonly ok: true; readonly data: DashboardData }
  | { readonly ok: false; readonly error: string };

class GitHubError extends Error {}

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function getJson(path: string): Promise<unknown> {
  const res = await fetch(`${API}${path}`, { headers: headers(), signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (res.status === 403 || res.status === 429) {
    throw new GitHubError("Das Abfrage-Limit von GitHub ist erreicht. Bitte in etwa einer Stunde erneut versuchen.");
  }
  if (res.status === 404) throw new GitHubError("Der GitHub-Benutzer wurde nicht gefunden.");
  if (res.status === 409) return []; // leeres Repository ohne Commits
  if (!res.ok) throw new GitHubError(`GitHub hat mit Fehler ${res.status} geantwortet.`);
  return res.json();
}

function asArray<T>(value: unknown, guard: (v: unknown) => v is T): T[] {
  return Array.isArray(value) ? value.filter(guard) : [];
}

function commitDates(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((c) => {
    const date = (c as { commit?: { author?: { date?: unknown } } })?.commit?.author?.date;
    return typeof date === "string" ? [date] : [];
  });
}

async function loadRepos(username: string): Promise<GitHubRepo[]> {
  // Mit Token: eigene Repos inkl. privater. Ohne Token: nur oeffentliche.
  const path = process.env.GITHUB_TOKEN
    ? "/user/repos?per_page=100&affiliation=owner&sort=pushed"
    : `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`;
  return asArray(await getJson(path), isGitHubRepo);
}

export async function getDashboardData(): Promise<DashboardResult> {
  "use cache";
  cacheLife("minutes");

  const username = process.env.GITHUB_USERNAME ?? DEFAULT_USERNAME;
  const now = Date.now();
  const since = new Date(now - WEEKS_SHOWN * WEEK_MS).toISOString();

  try {
    const rawRepos = await loadRepos(username);
    const ownRepos = rawRepos.filter((r) => !r.fork);
    const [eventsJson, ...commitLists] = await Promise.all([
      getJson(`/users/${encodeURIComponent(username)}/events?per_page=100`),
      ...ownRepos.map((r) =>
        getJson(`/repos/${encodeURIComponent(username)}/${encodeURIComponent(r.name)}/commits?per_page=100&since=${since}`),
      ),
    ]);

    const repos = toRepos(rawRepos, now);
    const weekly = toWeeklyActivity(commitLists.flatMap(commitDates), now);
    const activity = toActivity(asArray<GitHubEvent>(eventsJson, isGitHubEvent), now, ACTIVITY_LIMIT);
    return { ok: true, data: { username, stats: toStats(repos, weekly), repos, weekly, activity } };
  } catch (error) {
    const message =
      error instanceof GitHubError ? error.message : "GitHub ist gerade nicht erreichbar. Bitte später erneut versuchen.";
    console.error("[github] Laden fehlgeschlagen:", error);
    return { ok: false, error: message };
  }
}

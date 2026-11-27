import { describe, expect, test } from "vitest";

import {
  type GitHubEvent,
  type GitHubRepo,
  WEEKS_SHOWN,
  formatRelative,
  isGitHubEvent,
  isGitHubRepo,
  toActivity,
  toRepos,
  toStats,
  toWeeklyActivity,
} from "@/lib/github-transform";

const NOW = Date.parse("2026-11-27T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;

function repo(overrides: Partial<GitHubRepo> = {}): GitHubRepo {
  return {
    name: "demo",
    description: null,
    language: null,
    stargazers_count: 0,
    open_issues_count: 0,
    pushed_at: "2026-11-26T12:00:00Z",
    updated_at: "2026-11-26T12:00:00Z",
    private: false,
    fork: false,
    ...overrides,
  };
}

function event(type: string, payload: Record<string, unknown>, daysAgo = 1): GitHubEvent {
  return {
    type,
    created_at: new Date(NOW - daysAgo * DAY).toISOString(),
    repo: { name: "owner/demo" },
    payload,
  };
}

describe("formatRelative", () => {
  test("formats minutes, days and weeks in German", () => {
    expect(formatRelative(new Date(NOW - 5 * 60000).toISOString(), NOW)).toBe("vor 5 Minuten");
    expect(formatRelative(new Date(NOW - DAY).toISOString(), NOW)).toBe("gestern");
    expect(formatRelative(new Date(NOW - 21 * DAY).toISOString(), NOW)).toBe("vor 3 Wochen");
  });
});

describe("type guards", () => {
  test("accept valid objects and reject junk", () => {
    expect(isGitHubRepo(repo())).toBe(true);
    expect(isGitHubRepo({ name: "x" })).toBe(false);
    expect(isGitHubRepo(null)).toBe(false);
    expect(isGitHubEvent(event("PushEvent", {}))).toBe(true);
    expect(isGitHubEvent({ type: "PushEvent" })).toBe(false);
  });
});

describe("toRepos", () => {
  test("drops forks, sorts by last push and fills defaults", () => {
    const result = toRepos(
      [
        repo({ name: "old", pushed_at: "2026-10-01T00:00:00Z" }),
        repo({ name: "fork", fork: true }),
        repo({ name: "new", pushed_at: "2026-11-27T11:00:00Z", private: true, language: "Go", stargazers_count: 3 }),
      ],
      NOW,
    );
    expect(result.map((r) => r.name)).toEqual(["new", "old"]);
    expect(result[0]).toMatchObject({ visibility: "privat", language: "Go", stars: 3 });
    expect(result[1]).toMatchObject({ description: "Keine Beschreibung", language: "–", visibility: "öffentlich" });
  });
});

describe("toWeeklyActivity", () => {
  test("buckets commits into weeks, newest week last, ignores out-of-range dates", () => {
    const dates = [
      new Date(NOW - 1 * DAY).toISOString(),
      new Date(NOW - 2 * DAY).toISOString(),
      new Date(NOW - 8 * DAY).toISOString(),
      new Date(NOW - 200 * DAY).toISOString(),
      new Date(NOW + DAY).toISOString(),
    ];
    const weekly = toWeeklyActivity(dates, NOW);
    expect(weekly).toHaveLength(WEEKS_SHOWN);
    expect(weekly.at(-1)?.commits).toBe(2);
    expect(weekly.at(-2)?.commits).toBe(1);
    expect(weekly.reduce((s, w) => s + w.commits, 0)).toBe(3);
    expect(weekly.at(-1)?.week).toBe("KW 48");
  });
});

describe("toActivity", () => {
  test("maps known event types and skips unknown ones", () => {
    const items = toActivity(
      [
        event("PushEvent", { ref: "refs/heads/main", commits: [{ message: "first" }, { message: "Fix bug\n\ndetails" }] }),
        event("WatchEvent", {}),
        event("IssuesEvent", { issue: { title: "Crash on start" } }),
        event("PullRequestEvent", { pull_request: { title: "Add chart" } }),
        event("CreateEvent", { ref_type: "repository" }),
        event("CreateEvent", { ref_type: "branch" }),
      ],
      NOW,
      10,
    );
    expect(items.map((i) => [i.kind, i.title])).toEqual([
      ["commit", "Fix bug"],
      ["issue", "Crash on start"],
      ["pr", "Add chart"],
      ["commit", "Projekt angelegt"],
    ]);
    expect(items[0].repo).toBe("demo");
  });

  test("falls back to branch name when push has no commit list", () => {
    const [item] = toActivity([event("PushEvent", { ref: "refs/heads/dev" })], NOW, 5);
    expect(item.title).toBe("Änderungen hochgeladen (dev)");
  });

  test("respects the limit", () => {
    const events = Array.from({ length: 5 }, () => event("PushEvent", {}));
    expect(toActivity(events, NOW, 2)).toHaveLength(2);
  });
});

describe("toStats", () => {
  test("sums stars and issues and compares the last two 4-week blocks", () => {
    const repos = toRepos([repo({ stargazers_count: 2, open_issues_count: 1 }), repo({ name: "b", stargazers_count: 5 })], NOW);
    const weekly = Array.from({ length: WEEKS_SHOWN }, (_, i) => ({ week: `KW ${i}`, commits: i >= WEEKS_SHOWN - 4 ? 3 : 1 }));
    const stats = toStats(repos, weekly);
    expect(stats.map((s) => s.value)).toEqual(["2", "7", "1", "12"]);
    expect(stats[3]).toMatchObject({ trend: "up", change: "+8 zu den 4 Wochen davor" });
  });

  test("handles an account without commits", () => {
    const stats = toStats([], toWeeklyActivity([], NOW));
    expect(stats[3]).toMatchObject({ value: "0", trend: "flat", change: "gleich wie davor" });
  });
});

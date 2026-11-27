// Beispieldaten fuer das Dashboard. Spaeter durch echte GitHub-Daten ersetzen.

export type Stat = {
  readonly label: string;
  readonly value: string;
  readonly change: string;
  readonly trend: "up" | "down" | "flat";
};

export type WeeklyActivity = {
  readonly week: string;
  readonly commits: number;
};

export type Repo = {
  readonly name: string;
  readonly description: string;
  readonly language: string;
  readonly stars: number;
  readonly openIssues: number;
  readonly updated: string;
  readonly visibility: "öffentlich" | "privat";
};

export type ActivityItem = {
  readonly kind: "commit" | "issue" | "pr";
  readonly title: string;
  readonly repo: string;
  readonly when: string;
};

export type CopilotStat = {
  readonly label: string;
  readonly value: number;
  readonly unit: string;
};

export const stats: readonly Stat[] = [
  { label: "Projekte", value: "12", change: "+2 diesen Monat", trend: "up" },
  { label: "Sterne", value: "348", change: "+27 diese Woche", trend: "up" },
  { label: "Offene Issues", value: "9", change: "−4 seit Montag", trend: "down" },
  { label: "Commits (30 Tage)", value: "186", change: "gleich wie Vormonat", trend: "flat" },
];

export const weeklyActivity: readonly WeeklyActivity[] = [
  { week: "KW 37", commits: 18 },
  { week: "KW 38", commits: 26 },
  { week: "KW 39", commits: 21 },
  { week: "KW 40", commits: 34 },
  { week: "KW 41", commits: 29 },
  { week: "KW 42", commits: 41 },
  { week: "KW 43", commits: 37 },
  { week: "KW 44", commits: 45 },
  { week: "KW 45", commits: 39 },
  { week: "KW 46", commits: 52 },
  { week: "KW 47", commits: 48 },
  { week: "KW 48", commits: 57 },
];

export const repos: readonly Repo[] = [
  {
    name: "copilot-pro-dashboard",
    description: "Dieses Dashboard, gebaut mit Next.js und Copilot",
    language: "TypeScript",
    stars: 142,
    openIssues: 3,
    updated: "heute",
    visibility: "öffentlich",
  },
  {
    name: "budi",
    description: "Entwickler DUO",
    language: "Python",
    stars: 0,
    openIssues: 1,
    updated: "vor 11 Tagen",
    visibility: "privat",
  },
  {
    name: "wetter-widget",
    description: "Kleines Wetter-Widget für die Startseite",
    language: "JavaScript",
    stars: 87,
    openIssues: 2,
    updated: "vor 2 Tagen",
    visibility: "öffentlich",
  },
  {
    name: "rezept-api",
    description: "REST-Schnittstelle für Rezepte mit Suche",
    language: "Go",
    stars: 64,
    openIssues: 0,
    updated: "vor 5 Tagen",
    visibility: "öffentlich",
  },
  {
    name: "notizen-app",
    description: "Notizen mit Markdown und Offline-Modus",
    language: "TypeScript",
    stars: 55,
    openIssues: 3,
    updated: "vor 3 Wochen",
    visibility: "öffentlich",
  },
];

export const activity: readonly ActivityItem[] = [
  { kind: "commit", title: "Übersicht mit Kacheln und Diagramm", repo: "copilot-pro-dashboard", when: "vor 2 Std." },
  { kind: "pr", title: "Seitenleiste für Handy angepasst", repo: "copilot-pro-dashboard", when: "vor 5 Std." },
  { kind: "issue", title: "Dunkelmodus: Kontrast der Diagramme", repo: "copilot-pro-dashboard", when: "gestern" },
  { kind: "commit", title: "Suche nach Zutaten ergänzt", repo: "rezept-api", when: "vor 2 Tagen" },
  { kind: "pr", title: "Standort automatisch erkennen", repo: "wetter-widget", when: "vor 2 Tagen" },
  { kind: "issue", title: "Ziel des Projekts festhalten", repo: "budi", when: "vor 11 Tagen" },
  { kind: "commit", title: "Offline-Speicher stabilisiert", repo: "notizen-app", when: "vor 3 Wochen" },
];

export const copilotStats: readonly CopilotStat[] = [
  { label: "Vorschläge angenommen", value: 68, unit: "%" },
  { label: "Code-Zeilen mit Copilot", value: 2140, unit: "" },
  { label: "Gesparte Zeit (geschätzt)", value: 19, unit: "Std." },
];

export const copilotByLanguage: readonly { readonly language: string; readonly share: number }[] = [
  { language: "TypeScript", share: 54 },
  { language: "CSS", share: 21 },
  { language: "Markdown", share: 15 },
  { language: "JSON", share: 10 },
];

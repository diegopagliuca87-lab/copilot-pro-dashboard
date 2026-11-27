// Gemeinsame Datentypen des Dashboards und Beispielwerte fuer die Copilot-Seite.
// Projekte, Kennzahlen und Aktivitaet kommen live von GitHub (siehe github.ts).

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

// GitHub stellt Copilot-Nutzungszahlen nur fuer Organisationen bereit, daher Beispielwerte.
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

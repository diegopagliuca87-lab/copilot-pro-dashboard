import { Card, PageHeader } from "@/components/ui";
import { copilotByLanguage, copilotStats } from "@/lib/data";

const numberFormat = new Intl.NumberFormat("de-DE");

export default function CopilotPage() {
  return (
    <>
      <PageHeader title="Copilot" subtitle="Wie GitHub Copilot beim Bau dieses Dashboards geholfen hat" />

      <div className="grid gap-4 sm:grid-cols-3">
        {copilotStats.map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">
              {numberFormat.format(s.value)}
              {s.unit ? <span className="ml-1 text-lg text-muted">{s.unit}</span> : null}
            </p>
          </Card>
        ))}
      </div>

      <Card title="Anteil Copilot-Code nach Dateityp" className="mt-4">
        <ul className="space-y-3">
          {copilotByLanguage.map((l) => (
            <li key={l.language}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{l.language}</span>
                <span className="tabular-nums text-muted">{l.share} %</span>
              </div>
              <div className="h-2 rounded-full bg-surface-muted">
                <div className="h-2 rounded-full bg-accent" style={{ width: `${l.share}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

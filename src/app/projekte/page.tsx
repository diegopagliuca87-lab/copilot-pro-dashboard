import { Badge, Card, PageHeader } from "@/components/ui";
import { repos } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="Projekte" subtitle="Alle Repositories mit Sprache, Sternen und letzter Änderung" />
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-xs text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Projekt</th>
              <th className="px-5 py-3 font-medium">Sprache</th>
              <th className="px-5 py-3 text-right font-medium">Sterne</th>
              <th className="px-5 py-3 text-right font-medium">Offene Issues</th>
              <th className="px-5 py-3 font-medium">Geändert</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repo) => (
              <tr key={repo.name} className="border-b border-border last:border-0 hover:bg-surface-muted">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 font-medium">
                    {repo.name}
                    <Badge>{repo.visibility}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{repo.description}</p>
                </td>
                <td className="px-5 py-4">{repo.language}</td>
                <td className="px-5 py-4 text-right tabular-nums">{repo.stars}</td>
                <td className="px-5 py-4 text-right tabular-nums">{repo.openIssues}</td>
                <td className="px-5 py-4 text-muted">{repo.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

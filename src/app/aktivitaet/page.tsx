import { ActivityList } from "@/components/ActivityList";
import { Card, EmptyState, ErrorCard, PageHeader } from "@/components/ui";
import { getDashboardData } from "@/lib/github";

export default async function ActivityPage() {
  const result = await getDashboardData();

  return (
    <>
      <PageHeader title="Aktivität" subtitle="Letzte Commits, Issues und Pull Requests über alle Projekte" />
      {result.ok ? (
        <Card>
          {result.data.activity.length > 0 ? (
            <ActivityList items={result.data.activity} />
          ) : (
            <EmptyState>Noch keine öffentliche Aktivität.</EmptyState>
          )}
        </Card>
      ) : (
        <ErrorCard message={result.error} />
      )}
    </>
  );
}

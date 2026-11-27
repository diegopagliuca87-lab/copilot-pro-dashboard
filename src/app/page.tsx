import { ActivityChart } from "@/components/ActivityChart";
import { ActivityList } from "@/components/ActivityList";
import { Card, EmptyState, ErrorCard, PageHeader, StatCard } from "@/components/ui";
import { getDashboardData } from "@/lib/github";

const RECENT_ACTIVITY_COUNT = 5;

export default async function OverviewPage() {
  const result = await getDashboardData();

  if (!result.ok) {
    return (
      <>
        <PageHeader title="Übersicht" subtitle="Deine GitHub-Projekte auf einen Blick" />
        <ErrorCard message={result.error} />
      </>
    );
  }

  const { username, stats, weekly, activity } = result.data;
  return (
    <>
      <PageHeader title="Übersicht" subtitle={`Live-Daten von GitHub für ${username}`} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Commits pro Woche" className="lg:col-span-2">
          <ActivityChart data={weekly} />
        </Card>
        <Card title="Zuletzt passiert">
          {activity.length > 0 ? (
            <ActivityList items={activity.slice(0, RECENT_ACTIVITY_COUNT)} />
          ) : (
            <EmptyState>Noch keine öffentliche Aktivität.</EmptyState>
          )}
        </Card>
      </div>
    </>
  );
}

import { ActivityChart } from "@/components/ActivityChart";
import { ActivityList } from "@/components/ActivityList";
import { Card, PageHeader, StatCard } from "@/components/ui";
import { activity, stats, weeklyActivity } from "@/lib/data";

const RECENT_ACTIVITY_COUNT = 4;

export default function OverviewPage() {
  return (
    <>
      <PageHeader title="Übersicht" subtitle="Deine GitHub-Projekte auf einen Blick (Beispieldaten)" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Commits pro Woche" className="lg:col-span-2">
          <ActivityChart data={weeklyActivity} />
        </Card>
        <Card title="Zuletzt passiert">
          <ActivityList items={activity.slice(0, RECENT_ACTIVITY_COUNT)} />
        </Card>
      </div>
    </>
  );
}

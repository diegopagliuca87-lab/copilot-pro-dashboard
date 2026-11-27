import { ActivityList } from "@/components/ActivityList";
import { Card, PageHeader } from "@/components/ui";
import { activity } from "@/lib/data";

export default function ActivityPage() {
  return (
    <>
      <PageHeader title="Aktivität" subtitle="Letzte Commits, Issues und Pull Requests über alle Projekte" />
      <Card>
        <ActivityList items={activity} />
      </Card>
    </>
  );
}

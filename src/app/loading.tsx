const SKELETON_CARDS = 4;

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Daten werden geladen" className="animate-pulse">
      <div className="mb-6 h-7 w-40 rounded bg-surface-muted" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: SKELETON_CARDS }, (_, i) => (
          <div key={i} className="h-28 rounded-xl border border-border bg-surface" />
        ))}
      </div>
      <div className="mt-4 h-64 rounded-xl border border-border bg-surface" />
    </div>
  );
}

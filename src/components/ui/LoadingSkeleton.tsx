export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 rounded bg-brand-200" style={{ width: `${100 - i * 10}%` }} />
      ))}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl">📭</div>
      <h3 className="mt-3 text-lg font-semibold text-brand-800">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-brand-700">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

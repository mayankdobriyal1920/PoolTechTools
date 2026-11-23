export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl">⚠️</div>
      <h3 className="mt-3 text-lg font-semibold text-red-700">Something went wrong</h3>
      <p className="mt-1 max-w-sm text-sm text-brand-800">{message}</p>
      {onRetry && <button onClick={onRetry} className="btn-ghost mt-4">Retry</button>}
    </div>
  );
}

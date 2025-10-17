export function Progress({ value = 0, className = "" }: { value?: number; className?: string }) {
  return (
    <div className={`w-full rounded-full bg-neutral-200 ${className}`}>
      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

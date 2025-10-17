export function Avatar({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center ${className}`}>{children}</div>;
}
export function AvatarFallback({ children }: { children: React.ReactNode }) { return <span className="text-xs">{children}</span>; }

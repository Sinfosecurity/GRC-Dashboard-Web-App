import { cn } from "./_cn";
export function Badge({ className, children, variant = "secondary" as "secondary" | "default" }) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  const styles = variant === "secondary" ? "bg-neutral-100 text-neutral-700 border" : "bg-neutral-900 text-white";
  return <span className={cn(base, styles, className)}>{children}</span>;
}

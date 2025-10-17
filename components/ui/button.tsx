import * as React from "react";
import { cn } from "./_cn";

type Variant = "default" | "outline" | "ghost";
type Size = "sm" | "default" | "icon";

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant; size?: Size;
}>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const base = "inline-flex items-center justify-center rounded-2xl font-medium transition-colors";
  const byVariant = {
    default: "bg-neutral-900 text-white hover:bg-neutral-800",
    outline: "border bg-white hover:bg-neutral-50",
    ghost: "hover:bg-neutral-100"
  }[variant];
  const bySize = { sm: "h-8 px-3 text-sm", default: "h-10 px-4", icon: "h-9 w-9" }[size];
  return <button ref={ref} className={cn(base, byVariant, bySize, className)} {...props} />;
});
Button.displayName = "Button";

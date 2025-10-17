import * as React from "react";
import { cn } from "./_cn";

type Variant = "default" | "outline" | "ghost";
type Size = "sm" | "default" | "icon";

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant; size?: Size;
}>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const byVariant = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  }[variant];
  const bySize = { sm: "h-9 px-3 text-sm", default: "h-10 px-4 py-2", icon: "h-10 w-10" }[size];
  return <button ref={ref} className={cn(base, byVariant, bySize, className)} {...props} />;
});
Button.displayName = "Button";

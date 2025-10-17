import * as React from "react";
import { cn } from "./_cn";
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full h-10 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-neutral-300", className)} {...props} />;
}

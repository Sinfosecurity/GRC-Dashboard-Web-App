"use client";
import * as React from "react";
import { cn } from "./_cn";

type Ctx = { value: string; set: (v: string) => void };
const TabsCtx = React.createContext<Ctx | null>(null);

export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [value, set] = React.useState(defaultValue);
  return <TabsCtx.Provider value={{ value, set }}>{children}</TabsCtx.Provider>;
}
export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex rounded-xl border bg-white p-1">{children}</div>;
}
export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsCtx)!;
  const active = ctx.value === value;
  return (
    <button onClick={() => ctx.set(value)}
      className={cn("px-3 py-1 rounded-lg text-sm", active ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100")}>
      {children}
    </button>
  );
}
export function TabsContent({ value, children, className = "" }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}

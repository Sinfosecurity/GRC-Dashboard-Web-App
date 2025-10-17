import * as React from "react";
import { cn } from "./_cn";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full text-sm", className)} {...props} />;
}
export function TableHeader(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <thead {...props} />; }
export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <tbody {...props} />; }
export function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) { return <tr className="border-b" {...props} />; }
export function TableHead(props: React.ThHTMLAttributes<HTMLTableCellElement>) { return <th className="text-left p-3 text-neutral-500 font-medium" {...props} />; }
export function TableCell(props: React.TdHTMLAttributes<HTMLTableCellElement>) { return <td className="p-3 align-top" {...props} />; }

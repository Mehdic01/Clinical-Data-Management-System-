import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TableProps = {
  children: ReactNode;
  className?: string;
};

export function Table({ children, className }: TableProps) {
  return (
    <div className={cn(
      "overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-card",
      className
    )}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <thead className={cn("bg-neutral-50/80 backdrop-blur-sm text-left", className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: { children: ReactNode; className?: string }) {
  return <tbody className={cn("divide-y divide-neutral-100", className)}>{children}</tbody>;
}

export function TableRow({
  children,
  className,
  hoverable = true,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <tr 
      className={cn(
        "transition-colors",
        hoverable && "hover:bg-neutral-50/80",
        className
      )} 
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className,
  sortable = false,
  sorted,
}: {
  children: ReactNode;
  className?: string;
  sortable?: boolean;
  sorted?: "asc" | "desc" | null;
}) {
  return (
    <th 
      className={cn(
        "px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500",
        sortable && "cursor-pointer select-none hover:text-neutral-700",
        className
      )}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && sorted && (
          <svg 
            className={cn(
              "h-4 w-4 transition-transform",
              sorted === "desc" && "rotate-180"
            )} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
      </div>
    </th>
  );
}

export function TableCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-4 text-sm text-neutral-700", className)}>
      {children}
    </td>
  );
}

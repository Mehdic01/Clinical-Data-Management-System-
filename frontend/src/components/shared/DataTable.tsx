import type { ReactNode } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";
import { cn } from "@/lib/utils";

type Column<T> = {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  width?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  onRowClick?: (item: T) => void;
  className?: string;
  striped?: boolean;
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  loading,
  emptyTitle = "No data",
  emptyDescription,
  emptyAction,
  onRowClick,
  className,
  striped = false,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner label="Loading data..." size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState 
        title={emptyTitle} 
        description={emptyDescription}
        action={emptyAction}
        size="md"
      />
    );
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow hoverable={false}>
          {columns.map((col) => (
            <TableHead 
              key={col.key} 
              className={cn(col.headerClassName, col.width && `w-[${col.width}]`)}
              sortable={col.sortable}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className={striped ? "[&>tr:nth-child(even)]:bg-neutral-50/50" : ""}>
        {data.map((item) => (
          <TableRow
            key={keyExtractor(item)}
            className={cn(
              onRowClick && "cursor-pointer"
            )}
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((col) => (
              <TableCell key={col.key} className={col.className}>
                {col.render ? col.render(item) : item[col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

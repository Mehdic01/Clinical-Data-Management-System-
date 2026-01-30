import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
  statusMap?: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }>;
};

const defaultStatusMap: StatusBadgeProps["statusMap"] = {
  Draft: { label: "Draft", variant: "default" },
  Active: { label: "Active", variant: "success" },
  Completed: { label: "Completed", variant: "info" },
  Cancelled: { label: "Cancelled", variant: "danger" },
  Pending: { label: "Pending", variant: "warning" },
};

export function StatusBadge({ status, statusMap = defaultStatusMap }: StatusBadgeProps) {
  const config = statusMap[status] || { label: status, variant: "default" as const };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

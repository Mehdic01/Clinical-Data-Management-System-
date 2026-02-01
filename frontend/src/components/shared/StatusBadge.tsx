import { Badge, type BadgeVariant } from "@/components/ui/badge";

type StatusConfig = { 
  label: string; 
  variant: BadgeVariant;
};

type StatusBadgeProps = {
  status: string;
  statusMap?: Record<string, StatusConfig>;
  showDot?: boolean;
  size?: "sm" | "md" | "lg";
};

// Comprehensive default status mappings
const defaultStatusMap: Record<string, StatusConfig> = {
  // General
  Draft: { label: "Draft", variant: "default" },
  Active: { label: "Active", variant: "success" },
  Inactive: { label: "Inactive", variant: "default" },
  
  // Study/Subject statuses
  Enrolled: { label: "Enrolled", variant: "info" },
  Completed: { label: "Completed", variant: "success" },
  Complete: { label: "Complete", variant: "success" },
  Withdrawn: { label: "Withdrawn", variant: "danger" },
  
  // Visit statuses
  Scheduled: { label: "Scheduled", variant: "info" },
  Missed: { label: "Missed", variant: "warning" },
  Cancelled: { label: "Cancelled", variant: "danger" },
  
  // Form statuses
  Verified: { label: "Verified", variant: "primary" },
  Pending: { label: "Pending", variant: "warning" },
  
  // Approval statuses
  Approved: { label: "Approved", variant: "success" },
  Rejected: { label: "Rejected", variant: "danger" },
  "In Review": { label: "In Review", variant: "info" },
};

export function StatusBadge({ 
  status, 
  statusMap = defaultStatusMap,
  showDot = true,
  size = "md"
}: StatusBadgeProps) {
  const config = statusMap[status] || { label: status, variant: "default" as BadgeVariant };

  return (
    <Badge 
      variant={config.variant} 
      dot={showDot}
      size={size}
    >
      {config.label}
    </Badge>
  );
}

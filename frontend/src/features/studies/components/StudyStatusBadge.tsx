import { Badge } from "@/components/ui/badge";
import type { StudyStatus } from "@/types/study.types";

type StudyStatusBadgeProps = {
  status: StudyStatus;
};

const statusVariants: Record<StudyStatus, "default" | "success"> = {
  Draft: "default",
  Active: "success",
};

export function StudyStatusBadge({ status }: StudyStatusBadgeProps) {
  return <Badge variant={statusVariants[status]}>{status}</Badge>;
}

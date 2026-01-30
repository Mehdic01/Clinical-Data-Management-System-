import { Badge } from "@/components/ui/badge";

type VisitWindowBadgeProps = {
  daysBefore: number;
  daysAfter: number;
};

export function VisitWindowBadge({ daysBefore, daysAfter }: VisitWindowBadgeProps) {
  return (
    <Badge variant="info">
      -{daysBefore} / +{daysAfter} days
    </Badge>
  );
}

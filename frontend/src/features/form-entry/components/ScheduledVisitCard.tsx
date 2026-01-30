import { useNavigate } from "react-router-dom";
import type { ScheduledVisit } from "@/types/scheduled-visit.types";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type ScheduledVisitCardProps = {
  scheduledVisit: ScheduledVisit;
  visitName?: string;
};

const statusVariants: Record<string, "default" | "success" | "warning" | "danger"> = {
  Scheduled: "info" as "default",
  Completed: "success",
  Missed: "danger",
  Cancelled: "default",
};

export function ScheduledVisitCard({
  scheduledVisit,
  visitName,
}: ScheduledVisitCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{visitName || "Visit"}</CardTitle>
          <Badge variant={statusVariants[scheduledVisit.status] || "default"}>
            {scheduledVisit.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-1 text-sm">
          <div>
            <span className="text-zinc-500">Scheduled:</span>{" "}
            {formatDate(scheduledVisit.scheduledDate)}
          </div>
          {scheduledVisit.actualDate && (
            <div>
              <span className="text-zinc-500">Actual:</span>{" "}
              {formatDate(scheduledVisit.actualDate)}
            </div>
          )}
          {scheduledVisit.notes && (
            <div>
              <span className="text-zinc-500">Notes:</span>{" "}
              {scheduledVisit.notes}
            </div>
          )}
        </div>
        <Button
          size="sm"
          onClick={() => navigate(`/scheduled-visits/${scheduledVisit.id}`)}
        >
          Enter Data
        </Button>
      </CardContent>
    </Card>
  );
}

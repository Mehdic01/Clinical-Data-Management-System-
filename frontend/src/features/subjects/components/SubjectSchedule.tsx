import type { SubjectScheduledVisit } from "@/types/subject.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type SubjectScheduleProps = {
  scheduledVisits: SubjectScheduledVisit[];
  onVisitClick?: (visit: SubjectScheduledVisit) => void;
};

const statusVariants: Record<string, "default" | "success" | "warning" | "danger"> = {
  Scheduled: "default",
  Completed: "success",
  Missed: "danger",
  Cancelled: "default",
};

export function SubjectSchedule({ scheduledVisits, onVisitClick }: SubjectScheduleProps) {
  if (scheduledVisits.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
        No scheduled visits yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scheduledVisits.map((visit) => (
        <Card
          key={visit.id}
          className={onVisitClick ? "cursor-pointer hover:shadow-md" : ""}
          onClick={() => onVisitClick?.(visit)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Visit</CardTitle>
              <Badge variant={statusVariants[visit.status] || "default"}>
                {visit.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-500">
              <span>Scheduled: {formatDate(visit.scheduledDate)}</span>
              <span className="ml-4">Window: {formatDate(visit.windowStart)} - {formatDate(visit.windowEnd)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import type { Study } from "@/types/study.types";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";

type StudyCardProps = {
  study: Study;
};

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function StudyCard({ study }: StudyCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      interactive
      onClick={() => navigate(`/studies/${study.id}`)}
      className="group"
    >
      <CardHeader noBorder className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2">{study.name}</CardTitle>
          <StatusBadge status={study.status} size="sm" />
        </div>
      </CardHeader>
      <CardContent compact>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span>{study.protocolCode}</span>
          </div>
          <ArrowRightIcon className={cn(
            "h-4 w-4 text-neutral-400",
            "transition-transform duration-200",
            "group-hover:translate-x-1 group-hover:text-primary-500"
          )} />
        </div>
      </CardContent>
    </Card>
  );
}

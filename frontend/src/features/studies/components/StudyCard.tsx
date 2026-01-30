import { useNavigate } from "react-router-dom";
import type { Study } from "@/types/study.types";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";

type StudyCardProps = {
  study: Study;
};

export function StudyCard({ study }: StudyCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition hover:shadow-md"
      onClick={() => navigate(`/studies/${study.id}`)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{study.name}</CardTitle>
          <StatusBadge status={study.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-500">Protocol: {study.protocolCode}</p>
      </CardContent>
    </Card>
  );
}

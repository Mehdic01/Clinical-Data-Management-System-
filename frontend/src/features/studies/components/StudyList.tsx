import { useNavigate } from "react-router-dom";
import type { Study } from "@/types/study.types";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";

type StudyListProps = {
  studies: Study[];
  loading?: boolean;
};

export function StudyList({ studies, loading }: StudyListProps) {
  const navigate = useNavigate();

  const columns = [
    { key: "protocolCode", header: "Protocol" },
    { key: "name", header: "Name" },
    {
      key: "status",
      header: "Status",
      render: (study: Study) => <StatusBadge status={study.status} />,
    },
  ];

  return (
    <DataTable
      data={studies}
      columns={columns}
      keyExtractor={(study) => study.id}
      loading={loading}
      emptyTitle="No studies found"
      emptyDescription="Create your first study to get started"
      onRowClick={(study) => navigate(`/studies/${study.id}`)}
    />
  );
}

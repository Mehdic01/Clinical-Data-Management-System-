import { useNavigate } from "react-router-dom";
import type { Subject } from "@/types/subject.types";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";

type SubjectListProps = {
  subjects: Subject[];
  studyId: string;
  loading?: boolean;
};

export function SubjectList({ subjects, studyId, loading }: SubjectListProps) {
  const navigate = useNavigate();

  const columns = [
    { key: "subjectNumber", header: "Subject #" },
    { key: "initials", header: "Initials" },
    {
      key: "enrollmentDate",
      header: "Enrollment Date",
      render: (subject: Subject) => formatDate(subject.enrollmentDate),
    },
    {
      key: "status",
      header: "Status",
      render: (subject: Subject) => (
        <StatusBadge
          status={subject.status}
          statusMap={{
            Enrolled: { label: "Enrolled", variant: "info" },
            Active: { label: "Active", variant: "success" },
            Completed: { label: "Completed", variant: "default" },
            Withdrawn: { label: "Withdrawn", variant: "danger" },
          }}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={subjects}
      columns={columns}
      keyExtractor={(subject) => subject.id}
      loading={loading}
      emptyTitle="No subjects enrolled"
      emptyDescription="Enroll your first subject"
      onRowClick={(subject) => navigate(`/studies/${studyId}/subjects/${subject.id}`)}
    />
  );
}

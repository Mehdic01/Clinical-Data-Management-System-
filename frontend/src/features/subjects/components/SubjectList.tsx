// NOTE: This component is deprecated. Subject cards are now rendered directly in SubjectsPage.
// Keeping this file for reference or future use if list view is needed.

import type { Subject } from "@/types/subject.types";
import { DataTable } from "@/components/shared/DataTable";
import { formatDate } from "@/lib/utils";

type SubjectListProps = {
  subjects: Subject[];
  studyId: string;
  loading?: boolean;
};

export function SubjectList({ subjects, loading }: SubjectListProps) {
  const columns = [
    { key: "subjectIdentifier", header: "Subject Identifier" },
    {
      key: "enrollmentDate",
      header: "Enrollment Date",
      render: (subject: Subject) => formatDate(subject.enrollmentDate),
    },
    {
      key: "scheduleGenerated",
      header: "Schedule Status",
      render: (subject: Subject) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            subject.scheduleGenerated
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {subject.scheduleGenerated ? "Generated" : "Pending"}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={subjects}
      columns={columns}
      keyExtractor={(subject) => String(subject.id)}
      loading={loading}
      emptyTitle="No subjects enrolled"
      emptyDescription="Enroll your first subject"
    />
  );
}

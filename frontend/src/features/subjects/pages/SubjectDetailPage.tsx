import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SubjectSchedule } from "../components/SubjectSchedule";
import { useSubject } from "../hooks/useSubjects";
import { toApiError } from "@/api/axios";
import { formatDate } from "@/lib/utils";

export function SubjectDetailPage() {
  const { studyId, subjectId } = useParams<{ studyId: string; subjectId: string }>();
  const { data: subject, isLoading, isError, error, refetch } = useSubject(
    studyId!,
    subjectId!
  );

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner label="Loading subject..." />
      </PageContainer>
    );
  }

  if (isError) {
    const e = toApiError(error);
    return (
      <PageContainer>
        <ErrorMessage
          title="Failed to load subject"
          message={e.message}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  if (!subject) {
    return (
      <PageContainer>
        <ErrorMessage title="Subject not found" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Subject: ${subject.subjectNumber}`}
      description={`Enrolled: ${formatDate(subject.enrollmentDate)}`}
      actions={
        <StatusBadge
          status={subject.status}
          statusMap={{
            Enrolled: { label: "Enrolled", variant: "info" },
            Active: { label: "Active", variant: "success" },
            Completed: { label: "Completed", variant: "default" },
            Withdrawn: { label: "Withdrawn", variant: "danger" },
          }}
        />
      }
    >
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Subject Information</h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-zinc-500">Subject Number</dt>
              <dd className="font-medium">{subject.subjectNumber}</dd>
            </div>
            {subject.initials && (
              <div>
                <dt className="text-zinc-500">Initials</dt>
                <dd className="font-medium">{subject.initials}</dd>
              </div>
            )}
            <div>
              <dt className="text-zinc-500">Enrollment Date</dt>
              <dd className="font-medium">{formatDate(subject.enrollmentDate)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Status</dt>
              <dd className="font-medium">{subject.status}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-medium">Scheduled Visits</h3>
          <SubjectSchedule scheduledVisits={[]} />
        </div>
      </div>
    </PageContainer>
  );
}

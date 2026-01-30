import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Button } from "@/components/ui/button";
import { useSubject, useGenerateSchedule } from "../hooks/useSubjects";
import { toApiError } from "@/api/axios";
import { formatDate } from "@/lib/utils";

export function SubjectDetailPage() {
  const { studyId, subjectId } = useParams<{ studyId: string; subjectId: string }>();
  const { data: subject, isLoading, isError, error, refetch } = useSubject(
    subjectId!
  );
  
  const generateScheduleMutation = useGenerateSchedule(subjectId!, studyId!);

  const handleGenerateSchedule = async () => {
    await generateScheduleMutation.mutateAsync();
  };

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
      title={`Subject: ${subject.subjectIdentifier}`}
      description={`Enrolled: ${formatDate(subject.enrollmentDate)}`}
      actions={
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            subject.scheduleGenerated
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {subject.scheduleGenerated ? "Schedule Generated" : "Pending Schedule"}
        </span>
      }
    >
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Subject Information</h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-zinc-500">Subject Identifier</dt>
              <dd className="font-medium">{subject.subjectIdentifier}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Study ID</dt>
              <dd className="font-medium">{subject.studyId}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Enrollment Date</dt>
              <dd className="font-medium">{formatDate(subject.enrollmentDate)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Schedule Status</dt>
              <dd className="font-medium">
                {subject.scheduleGenerated ? "Generated" : "Pending"}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Scheduled Visits</h3>
            {!subject.scheduleGenerated && (
              <Button
                onClick={handleGenerateSchedule}
                disabled={generateScheduleMutation.isPending}
              >
                {generateScheduleMutation.isPending ? "Generating..." : "Generate Visit Schedule"}
              </Button>
            )}
          </div>

          {subject.scheduleGenerated && subject.scheduledVisits && subject.scheduledVisits.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Visit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Scheduled Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Window Start
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Window End
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {subject.scheduledVisits.map((visit, index) => (
                    <tr key={visit.id} className="hover:bg-zinc-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-900">
                        Visit {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">
                        {formatDate(visit.scheduledDate)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">
                        {formatDate(visit.windowStart)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">
                        {formatDate(visit.windowEnd)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            visit.status === "Done"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {visit.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : subject.scheduleGenerated ? (
            <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
              No scheduled visits found.
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
              <p>No schedule generated yet.</p>
              <p className="mt-1 text-sm">Click "Generate Visit Schedule" to create visit schedule based on visit templates.</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

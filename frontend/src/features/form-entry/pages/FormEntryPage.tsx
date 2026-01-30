import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { useFormEntries } from "../hooks/useFormEntry";
import { toApiError } from "@/api/axios";

export function FormEntryPage() {
  const { scheduledVisitId } = useParams<{ scheduledVisitId: string }>();
  const { data, isLoading, isError, error, refetch } = useFormEntries(
    scheduledVisitId!
  );

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner label="Loading forms..." />
      </PageContainer>
    );
  }

  if (isError) {
    const e = toApiError(error);
    return (
      <PageContainer>
        <ErrorMessage
          title="Failed to load forms"
          message={e.message}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Form Entry">
      <div className="space-y-4">
        {data?.map((entry) => (
          <div key={entry.id} className="rounded-lg border p-4">
            <div className="font-medium">Form: {entry.formTemplateId}</div>
            <div className="text-sm text-zinc-500">Status: {entry.status}</div>
          </div>
        ))}

        {data?.length === 0 && (
          <div className="text-zinc-500">No forms to complete for this visit.</div>
        )}
      </div>
    </PageContainer>
  );
}

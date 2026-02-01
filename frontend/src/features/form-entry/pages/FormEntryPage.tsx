/**
 * FormEntryPage
 * Seçilen scheduled visit için form girişini yönetir ve ilgili verileri gösterir.
 * Form şablonunu ve mevcut form girişini çeker, yüklenme/hata durumlarını ele alır.
 */
import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { useFormEntry } from "../hooks/useFormEntry";
import { toApiError } from "@/api/axios";
import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export function FormEntryPage() {
  const { scheduledVisitId } = useParams<{ scheduledVisitId: string }>();
  const { data, isLoading, isError, error, refetch } = useFormEntry(
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

  const entries = Array.isArray(data) ? data : [];

  return (
    <PageContainer title="Form Entry">
      <div className="space-y-4">
        {entries.map((entry: { id: Key | null | undefined; formTemplateId: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
          <div key={entry.id} className="rounded-lg border p-4">
            <div className="font-medium">Form: {entry.formTemplateId}</div>
            <div className="text-sm text-zinc-500">Status: {entry.status}</div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-zinc-500">No forms to complete for this visit.</div>
        )}
      </div>
    </PageContainer>
  );
}

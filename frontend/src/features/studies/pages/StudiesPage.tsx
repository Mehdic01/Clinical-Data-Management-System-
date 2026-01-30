import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { StudyList } from "../components/StudyList";
import { StudyForm } from "../components/StudyForm";
import { useStudies, useCreateStudy } from "../hooks/useStudies";
import { toApiError } from "@/api/axios";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import type { StudyFormValues } from "@/lib/validation";

export function StudiesPage() {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: studies, isLoading, isError, error, refetch } = useStudies();
  const createMutation = useCreateStudy();

  const handleCreate = async (values: StudyFormValues) => {
    try {
      const created = await createMutation.mutateAsync(values);
      setShowCreateDialog(false);
      navigate(`/studies/${created.id}`);
    } catch (err) {
      // Error handled by mutation state
    }
  };

  if (isError) {
    const e = toApiError(error);
    return (
      <PageContainer title="Studies">
        <ErrorMessage
          title="Failed to load studies"
          message={e.message}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title=""
      actions={null}
    >
      {/* Custom Header */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-slate-800">Studies</h1>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="px-6 py-3 text-lg"
        >
          New Study
        </Button>
      </div>

      <StudyList studies={studies ?? []} loading={isLoading} />

      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
        <DialogHeader>
          <DialogTitle>Create New Study</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <StudyForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateDialog(false)}
            loading={createMutation.isPending}
            submitLabel="Create Study"
          />
          {createMutation.isError && (
            <div className="mt-4">
              <ErrorMessage
                title="Failed to create study"
                message={toApiError(createMutation.error).message}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

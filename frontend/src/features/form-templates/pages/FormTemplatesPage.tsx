/**
 * FormTemplatesPage
 * Çalışmaya ait form şablonlarını listeleyen ana yönetim sayfası.
 * Oluşturma, düzenleme ve silme işlemleri için üst seviye akışı sağlar.
 */
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { FormTemplateList } from "../components/FormTemplateList";
import { FormBuilder } from "../components/FormBuilder";
import {
  useFormTemplates,
  useFormTemplate,
  useCreateFormTemplate,
  useUpdateFormTemplate,
  useDeleteFormTemplate,
} from "../hooks/useFormTemplates";
import { toApiError } from "@/api/axios";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import type { FormTemplateFormValues } from "@/lib/validation";
import type { FormTemplate } from "@/types/form-template.types";

export function FormTemplatesPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<FormTemplate | null>(null);

  const { data, isLoading, isError, error, refetch } = useFormTemplates(studyId!);
  const createMutation = useCreateFormTemplate(studyId!);
  const updateMutation = useUpdateFormTemplate(studyId!);
  const deleteMutation = useDeleteFormTemplate(studyId!);

  // Fetch form template detail when editing
  const { 
    data: editingTemplate, 
    isLoading: isLoadingEditTemplate 
  } = useFormTemplate(studyId!, String(editingTemplateId ?? ""));

  const handleCreate = async (values: FormTemplateFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      setShowCreateDialog(false);
    } catch (err) {
      // Error handled by mutation state
    }
  };

  const handleEdit = async (values: FormTemplateFormValues) => {
    if (!editingTemplateId) return;
    try {
      await updateMutation.mutateAsync({
        id: String(editingTemplateId),
        input: values,
      });
      setEditingTemplateId(null);
    } catch (err) {
      // Error handled by mutation state
    }
  };

  const handleDelete = async () => {
    if (!deletingTemplate) return;
    try {
      await deleteMutation.mutateAsync(String(deletingTemplate.id));
      setDeletingTemplate(null);
    } catch (err) {
      // Error handled by mutation state
    }
  };

  if (isError) {
    const e = toApiError(error);
    return (
      <ErrorMessage
        title="Failed to load form templates"
        message={e.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Define the forms to collect data in this study
        </p>
        <Button onClick={() => setShowCreateDialog(true)}>
          Create Form
        </Button>
      </div>

      <FormTemplateList
        formTemplates={data ?? []}
        studyId={studyId!}
        loading={isLoading}
        onEdit={(ft) => setEditingTemplateId(ft.id)}
        onDelete={(ft) => setDeletingTemplate(ft)}
      />

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} size="full">
        <DialogHeader>
          <DialogTitle>Create Form Template</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <FormBuilder
            onSubmit={handleCreate}
            onCancel={() => setShowCreateDialog(false)}
            loading={createMutation.isPending}
            submitLabel="Create"
          />
          {createMutation.isError && (
            <div className="mt-4">
              <ErrorMessage
                title="Failed to create form template"
                message={toApiError(createMutation.error).message}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingTemplateId} onClose={() => setEditingTemplateId(null)} size="full">
        <DialogHeader>
          <DialogTitle>Edit Form Template</DialogTitle>
        </DialogHeader>
        <DialogContent>
          {isLoadingEditTemplate ? (
            <LoadingSpinner label="Loading form template..." />
          ) : editingTemplate ? (
            <FormBuilder
              defaultValues={{
                name: editingTemplate.name,
                code: editingTemplate.code,
                fields: editingTemplate.fields?.map((f) => ({
                  label: f.label,
                  key: f.key,
                  type: f.type,
                  required: f.required,
                  order: f.order,
                })) ?? [],
              }}
              onSubmit={handleEdit}
              onCancel={() => setEditingTemplateId(null)}
              loading={updateMutation.isPending}
              submitLabel="Save Changes"
            />
          ) : null}
          {updateMutation.isError && (
            <div className="mt-4">
              <ErrorMessage
                title="Failed to update form template"
                message={toApiError(updateMutation.error).message}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingTemplate} onClose={() => setDeletingTemplate(null)}>
        <DialogHeader>
          <DialogTitle>Delete Form Template</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-zinc-600 mb-6">
            Are you sure you want to delete <strong>{deletingTemplate?.name}</strong>?
            This will also delete all associated fields. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeletingTemplate(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
          {deleteMutation.isError && (
            <div className="mt-4">
              <ErrorMessage
                title="Failed to delete form template"
                message={toApiError(deleteMutation.error).message}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { VisitTemplateList } from "../components/VisitTemplateList";
import { VisitTemplateForm } from "../components/VisitTemplateForm";
import {
  useVisitTemplates,
  useVisitTemplate,
  useCreateVisitTemplate,
  useUpdateVisitTemplate,
  useDeleteVisitTemplate,
  useReplaceAttachedForms,
} from "../hooks/useVisitTemplates";
import { useFormTemplates } from "@/features/form-templates/hooks/useFormTemplates";
import { toApiError } from "@/api/axios";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import type { VisitTemplateFormValues } from "@/lib/validation";
import type { VisitTemplate } from "@/types/visit-template.types";

export function VisitTemplatesPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<VisitTemplate | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<VisitTemplate | null>(null);
  const [managingFormsTemplateId, setManagingFormsTemplateId] = useState<number | null>(null);
  const [selectedFormIds, setSelectedFormIds] = useState<number[]>([]);
  
  const { data, isLoading, isError, error, refetch } = useVisitTemplates(studyId!);
  const createMutation = useCreateVisitTemplate(studyId!);
  const updateMutation = useUpdateVisitTemplate(studyId!);
  const deleteMutation = useDeleteVisitTemplate(studyId!);
  const replaceFormsMutation = useReplaceAttachedForms(studyId!);

  // Fetch visit template detail for forms dialog
  const { data: visitTemplateDetail, isLoading: isLoadingDetail } = useVisitTemplate(
    studyId!,
    String(managingFormsTemplateId ?? "")
  );

  // Fetch all form templates for the study
  const { data: allFormTemplates, isLoading: isLoadingForms } = useFormTemplates(studyId!);

  // Initialize selected forms when visit template detail is loaded
  useEffect(() => {
    if (visitTemplateDetail?.attachedForms) {
      setSelectedFormIds(visitTemplateDetail.attachedForms.map((f) => f.id));
    }
  }, [visitTemplateDetail]);

  const handleCreate = async (values: VisitTemplateFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      setShowCreateDialog(false);
    } catch (err) {
      // Error handled by mutation state
    }
  };

  const handleEdit = async (values: VisitTemplateFormValues) => {
    if (!editingTemplate) return;
    try {
      await updateMutation.mutateAsync({
        id: String(editingTemplate.id),
        input: values,
      });
      setEditingTemplate(null);
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

  const handleToggleForm = (formId: number) => {
    setSelectedFormIds((prev) =>
      prev.includes(formId)
        ? prev.filter((id) => id !== formId)
        : [...prev, formId]
    );
  };

  const handleAttachForms = async () => {
    if (!managingFormsTemplateId) return;
    try {
      await replaceFormsMutation.mutateAsync({
        id: String(managingFormsTemplateId),
        formTemplateIds: selectedFormIds,
      });
      setManagingFormsTemplateId(null);
      setSelectedFormIds([]);
    } catch (err) {
      // Error handled by mutation state
    }
  };

  const handleCloseFormsDialog = () => {
    setManagingFormsTemplateId(null);
    setSelectedFormIds([]);
  };

  if (isError) {
    const e = toApiError(error);
    return (
      <ErrorMessage
        title="Failed to load visit templates"
        message={e.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Define the visit schedule for this study
        </p>
        <Button onClick={() => setShowCreateDialog(true)}>
          Add Visit Template
        </Button>
      </div>

      <VisitTemplateList
        visitTemplates={data ?? []}
        loading={isLoading}
        onEdit={(vt) => setEditingTemplate(vt)}
        onDelete={(vt) => setDeletingTemplate(vt)}
        onManageForms={(vt) => setManagingFormsTemplateId(vt.id)}
      />

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
        <DialogHeader>
          <DialogTitle>Add Visit Template</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <VisitTemplateForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateDialog(false)}
            loading={createMutation.isPending}
            submitLabel="Create"
          />
          {createMutation.isError && (
            <div className="mt-4">
              <ErrorMessage
                title="Failed to create visit template"
                message={toApiError(createMutation.error).message}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingTemplate} onClose={() => setEditingTemplate(null)}>
        <DialogHeader>
          <DialogTitle>Edit Visit Template</DialogTitle>
        </DialogHeader>
        <DialogContent>
          {editingTemplate && (
            <VisitTemplateForm
              defaultValues={{
                name: editingTemplate.name,
                code: editingTemplate.code,
                day: editingTemplate.day,
                windowBefore: editingTemplate.windowBefore,
                windowAfter: editingTemplate.windowAfter,
              }}
              onSubmit={handleEdit}
              onCancel={() => setEditingTemplate(null)}
              loading={updateMutation.isPending}
              submitLabel="Save Changes"
            />
          )}
          {updateMutation.isError && (
            <div className="mt-4">
              <ErrorMessage
                title="Failed to update visit template"
                message={toApiError(updateMutation.error).message}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingTemplate} onClose={() => setDeletingTemplate(null)}>
        <DialogHeader>
          <DialogTitle>Delete Visit Template</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-zinc-600 mb-6">
            Are you sure you want to delete <strong>{deletingTemplate?.name}</strong>?
            This action cannot be undone.
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
                title="Failed to delete visit template"
                message={toApiError(deleteMutation.error).message}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Forms Dialog */}
      <Dialog open={!!managingFormsTemplateId} onClose={handleCloseFormsDialog}>
        <DialogHeader>
          <DialogTitle>
            Manage Forms - {visitTemplateDetail?.name}
          </DialogTitle>
        </DialogHeader>
        <DialogContent>
          {isLoadingDetail || isLoadingForms ? (
            <LoadingSpinner label="Loading forms..." />
          ) : (
            <div>
              <p className="text-sm text-zinc-500 mb-4">
                Select the forms that should be collected during this visit.
              </p>
              
              {allFormTemplates && allFormTemplates.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {allFormTemplates.map((form) => (
                    <label
                      key={form.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 hover:border-amber-300 hover:bg-amber-50 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFormIds.includes(form.id)}
                        onChange={() => handleToggleForm(form.id)}
                        className="h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                            {form.code}
                          </span>
                          <span className="font-medium text-zinc-900">{form.name}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  No form templates available. Create form templates first.
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button variant="secondary" onClick={handleCloseFormsDialog}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAttachForms}
                  disabled={replaceFormsMutation.isPending}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {replaceFormsMutation.isPending ? "Saving..." : "Attach Selected Forms"}
                </Button>
              </div>

              {replaceFormsMutation.isError && (
                <div className="mt-4">
                  <ErrorMessage
                    title="Failed to attach forms"
                    message={toApiError(replaceFormsMutation.error).message}
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
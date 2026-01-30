import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useSubject, useGenerateSchedule } from "../hooks/useSubjects";
import { useScheduledVisitForms, useCreateFormEntry, useFormEntry } from "@/features/form-entry/hooks/useFormEntry";
import { useFormTemplate } from "@/features/form-templates/hooks/useFormTemplates";
import { toApiError } from "@/api/axios";
import { formatDate } from "@/lib/utils";
import type { SubjectScheduledVisit } from "@/types/subject.types";
import type { ScheduledVisitForm, FieldValueInput } from "@/types/form-entry.types";

// Expandable Visit Row Component
function ExpandableVisitRow({
  visit,
  index,
  studyId,
}: {
  visit: SubjectScheduledVisit;
  index: number;
  studyId: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFillFormDialog, setShowFillFormDialog] = useState(false);
  const [showViewFormDialog, setShowViewFormDialog] = useState(false);
  const [selectedForm, setSelectedForm] = useState<ScheduledVisitForm | null>(null);

  const { data: forms, isLoading: formsLoading } = useScheduledVisitForms(
    isExpanded ? String(visit.id) : ""
  );

  const handleFillForm = (form: ScheduledVisitForm) => {
    setSelectedForm(form);
    setShowFillFormDialog(true);
  };

  const handleViewForm = (form: ScheduledVisitForm) => {
    setSelectedForm(form);
    setShowViewFormDialog(true);
  };

  return (
    <>
      <tr
        className="cursor-pointer hover:bg-zinc-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-900">
          <span className="mr-2">{isExpanded ? "▼" : "▶"}</span>
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

      {isExpanded && (
        <tr>
          <td colSpan={5} className="bg-zinc-50 px-4 py-4">
            <div className="ml-6">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-700">
                📋 Attached Forms:
              </h4>

              {formsLoading ? (
                <div className="text-sm text-zinc-500">Loading forms...</div>
              ) : forms && forms.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                  <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase text-zinc-500">
                          Form Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase text-zinc-500">
                          Fields
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase text-zinc-500">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase text-zinc-500">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {forms.map((form) => (
                        <tr key={form.formTemplateId}>
                          <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-zinc-900">
                            {form.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-zinc-600">
                            {form.fieldCount}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm">
                            {form.entry ? (
                              <span className="inline-flex items-center gap-1 text-green-600">
                                ✅ Submitted
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-600">
                                ⏳ Not Filled
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm">
                            {form.entry ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewForm(form);
                                }}
                              >
                                View
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFillForm(form);
                                }}
                              >
                                Fill Form
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-zinc-500">No forms attached to this visit.</div>
              )}
            </div>
          </td>
        </tr>
      )}

      {/* Fill Form Dialog */}
      {selectedForm && (
        <FillFormDialog
          open={showFillFormDialog}
          onClose={() => {
            setShowFillFormDialog(false);
            setSelectedForm(null);
          }}
          scheduledVisitId={String(visit.id)}
          studyId={studyId}
          form={selectedForm}
        />
      )}

      {/* View Form Dialog */}
      {selectedForm?.entry && (
        <ViewFormDialog
          open={showViewFormDialog}
          onClose={() => {
            setShowViewFormDialog(false);
            setSelectedForm(null);
          }}
          studyId={studyId}
          form={selectedForm}
        />
      )}
    </>
  );
}

// Fill Form Dialog Component
function FillFormDialog({
  open,
  onClose,
  scheduledVisitId,
  studyId,
  form,
}: {
  open: boolean;
  onClose: () => void;
  scheduledVisitId: string;
  studyId: string;
  form: ScheduledVisitForm;
}) {
  const [formValues, setFormValues] = useState<Record<number, string>>({});

  const { data: formTemplate, isLoading: templateLoading } = useFormTemplate(
    studyId,
    String(form.formTemplateId)
  );

  const createMutation = useCreateFormEntry(scheduledVisitId);

  const handleSubmit = async () => {
    if (!formTemplate) return;

    const fieldValues: FieldValueInput[] = formTemplate.fields?.map((field) => ({
      fieldId: field.id,
      value: formValues[field.id] || "",
    })) || [];

    await createMutation.mutateAsync({
      formTemplateId: form.formTemplateId,
      fieldValues,
    });

    onClose();
  };

  const handleFieldChange = (fieldId: number, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const sortedFields = formTemplate?.fields
    ? [...formTemplate.fields].sort((a, b) => a.order - b.order)
    : [];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Fill Form: {form.name}</DialogTitle>
        <DialogDescription>
          Complete the form fields below and submit.
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        {templateLoading ? (
          <div className="py-4 text-center text-zinc-500">Loading form...</div>
        ) : (
          <div className="space-y-4">
            {sortedFields.map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">
                  {field.label}
                  {field.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                <input
                  type={field.type === "Number" ? "number" : field.type === "Date" ? "date" : "text"}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formValues[field.id] || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  required={field.required}
                />
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={createMutation.isPending || templateLoading}
        >
          {createMutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

// View Form Dialog Component
function ViewFormDialog({
  open,
  onClose,
  studyId,
  form,
}: {
  open: boolean;
  onClose: () => void;
  studyId: string;
  form: ScheduledVisitForm;
}) {
  const { data: formTemplate } = useFormTemplate(studyId, String(form.formTemplateId));
  const { data: formEntry, isLoading: entryLoading } = useFormEntry(
    form.entry ? String(form.entry.id) : ""
  );

  const sortedFields = formTemplate?.fields
    ? [...formTemplate.fields].sort((a, b) => a.order - b.order)
    : [];

  const getFieldValue = (fieldId: number) => {
    return formEntry?.fieldValues?.find((fv) => fv.fieldId === fieldId)?.value || "-";
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>View Form: {form.name}</DialogTitle>
        <DialogDescription>
          Submitted on {form.entry?.submittedAt ? formatDate(form.entry.submittedAt) : "N/A"}
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        {entryLoading ? (
          <div className="py-4 text-center text-zinc-500">Loading form data...</div>
        ) : (
          <div className="space-y-4">
            {sortedFields.map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="text-sm font-medium text-zinc-500">
                  {field.label}
                </label>
                <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">
                  {getFieldValue(field.id)}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </Dialog>
  );
}

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
                    <ExpandableVisitRow
                      key={visit.id}
                      visit={visit}
                      index={index}
                      studyId={studyId!}
                    />
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

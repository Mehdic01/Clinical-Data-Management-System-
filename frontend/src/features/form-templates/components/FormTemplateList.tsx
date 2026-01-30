import type { FormTemplate } from "@/types/form-template.types";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useFormTemplateFieldCount } from "../hooks/useFormTemplates";

type FormTemplateListProps = {
  formTemplates: FormTemplate[];
  studyId: string;
  loading?: boolean;
  onSelect?: (formTemplate: FormTemplate) => void;
  onEdit?: (formTemplate: FormTemplate) => void;
  onDelete?: (formTemplate: FormTemplate) => void;
};

// Form icon component
function FormIcon() {
  return (
    <svg
      className="h-10 w-10 text-indigo-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
      />
    </svg>
  );
}

// Individual card component that fetches its own field count
function FormTemplateCard({
  formTemplate,
  studyId,
  onSelect,
  onEdit,
  onDelete,
}: {
  formTemplate: FormTemplate;
  studyId: string;
  onSelect?: (formTemplate: FormTemplate) => void;
  onEdit?: (formTemplate: FormTemplate) => void;
  onDelete?: (formTemplate: FormTemplate) => void;
}) {
  const { data: fieldCountData } = useFormTemplateFieldCount(studyId, String(formTemplate.id));
  const fieldCount = fieldCountData?.count ?? 0;

  return (
    <div
      className="group relative rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md cursor-pointer"
      onClick={() => onSelect?.(formTemplate)}
    >
      {/* Icon */}
      <div className="mb-4">
        <FormIcon />
      </div>

      {/* Code Badge */}
      <div className="mb-2">
        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
          {formTemplate.code}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-indigo-600 transition">
        {formTemplate.name}
      </h3>

      {/* Field Count */}
      <p className="mt-1 text-sm text-zinc-500">
        {fieldCount} field{fieldCount !== 1 ? "s" : ""}
      </p>

      {/* Actions */}
      <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit?.(formTemplate)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete?.(formTemplate)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export function FormTemplateList({
  formTemplates,
  studyId,
  loading,
  onSelect,
  onEdit,
  onDelete,
}: FormTemplateListProps) {
  if (loading) {
    return <LoadingSpinner label="Loading forms..." />;
  }

  if (formTemplates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center">
        <div className="flex justify-center">
          <FormIcon />
        </div>
        <h3 className="mt-4 text-lg font-medium text-zinc-900">No form templates</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Create your first form template to start collecting data
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {formTemplates.map((ft) => (
        <FormTemplateCard
          key={ft.id}
          formTemplate={ft}
          studyId={studyId}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

import { useForm, Controller } from "react-hook-form";
import type { FormTemplate } from "@/types/form-template.types";
import { Button } from "@/components/ui/button";
import { FieldRenderer } from "./FieldRenderer";

type DynamicFormProps = {
  formTemplate: FormTemplate;
  defaultValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  onCancel?: () => void;
  loading?: boolean;
  readOnly?: boolean;
};

export function DynamicForm({
  formTemplate,
  defaultValues = {},
  onSubmit,
  onCancel,
  loading,
  readOnly,
}: DynamicFormProps) {
  const { control, handleSubmit } = useForm({
    defaultValues,
  });

  const sortedFields = [...(formTemplate.fields || [])].sort(
    (a, b) => a.order - b.order
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {sortedFields.map((field) => (
        <Controller
          key={field.id}
          name={field.key}
          control={control}
          rules={{ required: field.required }}
          render={({ field: formField, fieldState }) => (
            <FieldRenderer
              fieldConfig={field}
              value={formField.value}
              onChange={formField.onChange}
              error={fieldState.error?.message}
              readOnly={readOnly}
            />
          )}
        />
      ))}

      {!readOnly && (
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </form>
  );
}

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formTemplateSchema, type FormTemplateFormValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FieldEditor } from "./FieldEditor";

type FormBuilderProps = {
  defaultValues?: Partial<FormTemplateFormValues>;
  onSubmit: (values: FormTemplateFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
};

export function FormBuilder({
  defaultValues,
  onSubmit,
  onCancel,
  loading,
  submitLabel = "Save Form",
}: FormBuilderProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormTemplateFormValues>({
    resolver: zodResolver(formTemplateSchema),
    defaultValues: {
      fields: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "fields",
  });

  const addField = () => {
    append({
      key: "",
      label: "",
      type: "Text",
      required: false,
      order: fields.length,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" required>
            Form Name
          </Label>
          <Input 
            id="name" 
            {...register("name")} 
            error={!!errors.name}
            placeholder="e.g., Demographics Form"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="code" required>
            Form Code
          </Label>
          <Input 
            id="code" 
            {...register("code")} 
            error={!!errors.code}
            placeholder="e.g., DM, VS, AE"
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <Label>Fields</Label>
          <Button type="button" variant="secondary" size="sm" onClick={addField}>
            Add Field
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-4">
                <FieldEditor
                  index={index}
                  control={control}
                  register={register}
                  errors={errors}
                  onRemove={() => remove(index)}
                  onMoveUp={() => index > 0 && move(index, index - 1)}
                  onMoveDown={() => index < fields.length - 1 && move(index, index + 1)}
                />
              </CardContent>
            </Card>
          ))}

          {fields.length === 0 && (
            <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
              No fields added yet. Click "Add Field" to get started.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

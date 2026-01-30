import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { FormTemplateFormValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FIELD_TYPES } from "@/lib/constants";

type FieldEditorProps = {
  index: number;
  control: Control<FormTemplateFormValues>;
  register: UseFormRegister<FormTemplateFormValues>;
  errors: FieldErrors<FormTemplateFormValues>;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export function FieldEditor({
  index,
  register,
  errors,
  onRemove,
  onMoveUp,
  onMoveDown,
}: FieldEditorProps) {
  const fieldErrors = errors.fields?.[index];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500">Field #{index + 1}</span>
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={onMoveUp}>
            ↑
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onMoveDown}>
            ↓
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            ✕
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`fields.${index}.key`} required>
            Field Key
          </Label>
          <Input
            id={`fields.${index}.key`}
            {...register(`fields.${index}.key`)}
            error={!!fieldErrors?.key}
            placeholder="field_key"
          />
        </div>

        <div>
          <Label htmlFor={`fields.${index}.label`} required>
            Label
          </Label>
          <Input
            id={`fields.${index}.label`}
            {...register(`fields.${index}.label`)}
            error={!!fieldErrors?.label}
            placeholder="Field Label"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`fields.${index}.type`} required>
            Type
          </Label>
          <Select
            id={`fields.${index}.type`}
            {...register(`fields.${index}.type`)}
          >
            {FIELD_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register(`fields.${index}.required`)}
              className="h-4 w-4 rounded border-zinc-300"
            />
            Required field
          </label>
        </div>
      </div>
    </div>
  );
}

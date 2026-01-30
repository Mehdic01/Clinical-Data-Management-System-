import { Select } from "@/components/ui/select";
import { FIELD_TYPES } from "@/lib/constants";
import type { FieldType } from "@/types/form-template.types";

type FieldTypeSelectProps = {
  value: FieldType;
  onChange: (value: FieldType) => void;
};

export function FieldTypeSelect({ value, onChange }: FieldTypeSelectProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as FieldType)}
    >
      {FIELD_TYPES.map((type) => (
        <option key={type.value} value={type.value}>
          {type.label}
        </option>
      ))}
    </Select>
  );
}

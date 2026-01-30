import type { FormField } from "@/types/form-template.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FieldRendererProps = {
  fieldConfig: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  readOnly?: boolean;
};

export function FieldRenderer({
  fieldConfig,
  value,
  onChange,
  error,
  readOnly,
}: FieldRendererProps) {
  const { type, label, key, required } = fieldConfig;

  const renderField = () => {
    switch (type) {
      case "Text":
        return (
          <Input
            id={key}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            disabled={readOnly}
          />
        );

      case "Number":
        return (
          <Input
            id={key}
            type="number"
            value={value || ""}
            onChange={(e) => onChange(e.target.valueAsNumber || null)}
            error={!!error}
            disabled={readOnly}
          />
        );

      case "Date":
        return (
          <Input
            id={key}
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            disabled={readOnly}
          />
        );

      default:
        return (
          <Input
            id={key}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            disabled={readOnly}
          />
        );
    }
  };

  return (
    <div>
      <Label htmlFor={key} required={required}>
        {label}
      </Label>
      {renderField()}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

import type { FormEntry } from "@/types/form-entry.types";
import type { FormTemplate } from "@/types/form-template.types";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type FormEntryViewProps = {
  formEntry: FormEntry;
  formTemplate: FormTemplate;
};

const statusVariants: Record<string, "default" | "success" | "info"> = {
  Draft: "default",
  Complete: "success",
  Verified: "info",
};

export function FormEntryView({ formEntry, formTemplate }: FormEntryViewProps) {
  const getFieldLabel = (fieldId: string) => {
    const field = formTemplate.fields?.find((f) => String(f.id) === fieldId);
    return field?.label || fieldId;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{formTemplate.name}</CardTitle>
          <Badge variant={statusVariants[formEntry.status] || "default"}>
            {formEntry.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3">
          {formEntry.values.map((entry) => (
            <div key={entry.fieldId}>
              <dt className="text-sm text-zinc-500">
                {getFieldLabel(entry.fieldId)}
              </dt>
              <dd className="font-medium">
                {entry.value !== null && entry.value !== undefined
                  ? String(entry.value)
                  : "-"}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

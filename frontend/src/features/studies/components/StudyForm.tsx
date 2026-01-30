import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studySchema, type StudyFormValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { STUDY_STATUSES } from "@/lib/constants";

type StudyFormProps = {
  defaultValues?: Partial<StudyFormValues>;
  onSubmit: (values: StudyFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
};

export function StudyForm({
  defaultValues,
  onSubmit,
  onCancel,
  loading,
  submitLabel = "Save",
}: StudyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudyFormValues>({
    resolver: zodResolver(studySchema),
    defaultValues: {
      status: "Draft",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name" required>
          Name
        </Label>
        <Input id="name" {...register("name")} error={!!errors.name} />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="protocolCode" required>
          Protocol Code
        </Label>
        <Input
          id="protocolCode"
          {...register("protocolCode")}
          error={!!errors.protocolCode}
        />
        {errors.protocolCode && (
          <p className="mt-1 text-sm text-red-500">
            {errors.protocolCode.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="status" required>
          Status
        </Label>
        <Select id="status" {...register("status")} error={!!errors.status}>
          {STUDY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
        )}
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

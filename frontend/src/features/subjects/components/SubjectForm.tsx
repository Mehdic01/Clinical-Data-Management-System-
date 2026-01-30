import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subjectSchema, type SubjectFormValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SUBJECT_STATUSES } from "@/lib/constants";
import { toIsoDate } from "@/lib/utils";

type SubjectFormProps = {
  defaultValues?: Partial<SubjectFormValues>;
  onSubmit: (values: SubjectFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
};

export function SubjectForm({
  defaultValues,
  onSubmit,
  onCancel,
  loading,
  submitLabel = "Save",
}: SubjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      enrollmentDate: toIsoDate(new Date()),
      status: "Enrolled",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="subjectNumber" required>
          Subject Number
        </Label>
        <Input
          id="subjectNumber"
          {...register("subjectNumber")}
          error={!!errors.subjectNumber}
        />
        {errors.subjectNumber && (
          <p className="mt-1 text-sm text-red-500">
            {errors.subjectNumber.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="initials">Initials</Label>
        <Input
          id="initials"
          {...register("initials")}
          maxLength={4}
          placeholder="e.g., JD"
        />
        {errors.initials && (
          <p className="mt-1 text-sm text-red-500">{errors.initials.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="enrollmentDate" required>
          Enrollment Date
        </Label>
        <Input
          id="enrollmentDate"
          type="date"
          {...register("enrollmentDate")}
          error={!!errors.enrollmentDate}
        />
        {errors.enrollmentDate && (
          <p className="mt-1 text-sm text-red-500">
            {errors.enrollmentDate.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select id="status" {...register("status")}>
          {SUBJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
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

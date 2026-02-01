import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studySchema, type StudyFormValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { STUDY_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name Field */}
      <div>
        <Label htmlFor="name" required>
          Name
        </Label>
        <Input 
          id="name" 
          {...register("name")} 
          error={!!errors.name}
          placeholder="Enter study name"
        />
        {errors.name && (
          <p className={cn(
            "mt-1.5 text-sm text-danger-600",
            "flex items-center gap-1"
          )}>
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Protocol Code Field */}
      <div>
        <Label htmlFor="protocolCode" required>
          Protocol Code
        </Label>
        <Input
          id="protocolCode"
          {...register("protocolCode")}
          error={!!errors.protocolCode}
          placeholder="e.g., STUDY-001"
        />
        {errors.protocolCode && (
          <p className="mt-1.5 text-sm text-danger-600 flex items-center gap-1">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.protocolCode.message}
          </p>
        )}
      </div>

      {/* Status Field */}
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
          <p className="mt-1.5 text-sm text-danger-600 flex items-center gap-1">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.status.message}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          loading={loading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

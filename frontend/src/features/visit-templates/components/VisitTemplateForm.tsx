import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { visitTemplateSchema, type VisitTemplateFormValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VisitTemplateFormProps = {
  defaultValues?: Partial<VisitTemplateFormValues>;
  onSubmit: (values: VisitTemplateFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
};

export function VisitTemplateForm({
  defaultValues,
  onSubmit,
  onCancel,
  loading,
  submitLabel = "Save",
}: VisitTemplateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VisitTemplateFormValues>({
    resolver: zodResolver(visitTemplateSchema),
    defaultValues: {
      day: 0,
      windowBefore: 0,
      windowAfter: 0,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name" required>
          Visit Name
        </Label>
        <Input 
          id="name" 
          {...register("name")} 
          error={!!errors.name}
          placeholder="e.g., Screening Visit"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="code" required>
          Visit Code
        </Label>
        <Input
          id="code"
          {...register("code")}
          error={!!errors.code}
          placeholder="e.g., V1, SCR"
        />
        {errors.code && (
          <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="day" required>
          Study Day
        </Label>
        <Input
          id="day"
          type="number"
          {...register("day", { valueAsNumber: true })}
          error={!!errors.day}
          placeholder="Day number relative to enrollment (0 = enrollment)"
        />
        {errors.day && (
          <p className="mt-1 text-sm text-red-500">{errors.day.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="windowBefore">Window Before (days)</Label>
          <Input
            id="windowBefore"
            type="number"
            {...register("windowBefore", { valueAsNumber: true })}
            error={!!errors.windowBefore}
          />
          {errors.windowBefore && (
            <p className="mt-1 text-sm text-red-500">
              {errors.windowBefore.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="windowAfter">Window After (days)</Label>
          <Input
            id="windowAfter"
            type="number"
            {...register("windowAfter", { valueAsNumber: true })}
            error={!!errors.windowAfter}
          />
          {errors.windowAfter && (
            <p className="mt-1 text-sm text-red-500">
              {errors.windowAfter.message}
            </p>
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

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    const baseStyles = cn(
      "w-full rounded-lg border bg-white text-sm text-neutral-900",
      "px-3.5 py-2.5",
      "transition-all duration-200",
      "focus:outline-none",
      "disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed",
      "appearance-none",
      // Custom dropdown arrow
      "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236B7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]",
      "bg-[length:1.25rem_1.25rem]",
      "bg-[position:right_0.75rem_center]",
      "bg-no-repeat",
      "pr-10"
    );

    const stateStyles = error
      ? "border-danger-500 hover:border-danger-600 focus:border-danger-500 focus:ring-4 focus:ring-danger-500/10"
      : "border-neutral-300 hover:border-neutral-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10";

    return (
      <select
        ref={ref}
        className={cn(baseStyles, stateStyles, className)}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

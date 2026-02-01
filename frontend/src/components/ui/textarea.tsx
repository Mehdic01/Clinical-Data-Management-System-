import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, resize = "vertical", ...props }, ref) => {
    const baseStyles = cn(
      "w-full rounded-lg border bg-white text-sm text-neutral-900",
      "px-3.5 py-2.5",
      "placeholder:text-neutral-400",
      "transition-all duration-200",
      "focus:outline-none",
      "disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed",
      "min-h-[80px]"
    );

    const stateStyles = error
      ? "border-danger-500 hover:border-danger-600 focus:border-danger-500 focus:ring-4 focus:ring-danger-500/10"
      : "border-neutral-300 hover:border-neutral-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10";

    const resizeStyles = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    return (
      <textarea
        ref={ref}
        className={cn(baseStyles, stateStyles, resizeStyles[resize], className)}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

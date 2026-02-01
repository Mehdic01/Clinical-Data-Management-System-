import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
  required?: boolean;
  optional?: boolean;
  description?: string;
};

export function Label({ 
  children, 
  required, 
  optional,
  description,
  className, 
  ...props 
}: LabelProps) {
  return (
    <div className="mb-1.5">
      <label
        className={cn(
          "block text-sm font-medium text-neutral-700",
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-danger-500" aria-label="required">*</span>
        )}
        {optional && (
          <span className="ml-1.5 text-xs font-normal text-neutral-400">(optional)</span>
        )}
      </label>
      {description && (
        <p className="mt-0.5 text-xs text-neutral-500">{description}</p>
      )}
    </div>
  );
}

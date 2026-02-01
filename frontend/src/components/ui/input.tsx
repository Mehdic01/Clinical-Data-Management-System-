import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, ...props }, ref) => {
    const baseStyles = cn(
      "w-full rounded-lg border bg-white text-sm text-neutral-900",
      "placeholder:text-neutral-400",
      "transition-all duration-200",
      "focus:outline-none",
      "disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed"
    );

    const stateStyles = error
      ? "border-danger-500 hover:border-danger-600 focus:border-danger-500 focus:ring-4 focus:ring-danger-500/10"
      : "border-neutral-300 hover:border-neutral-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10";

    const paddingStyles = cn(
      leftIcon ? "pl-10" : "pl-3.5",
      rightIcon ? "pr-10" : "pr-3.5",
      "py-2.5"
    );

    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(baseStyles, stateStyles, paddingStyles, className)}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(baseStyles, stateStyles, "px-3.5 py-2.5", className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-primary-500 text-white",
    "hover:bg-primary-600 active:bg-primary-700",
    "focus-visible:ring-primary-500",
    "shadow-sm hover:shadow-md"
  ),
  secondary: cn(
    "bg-neutral-100 text-neutral-700",
    "hover:bg-neutral-200 active:bg-neutral-300",
    "focus-visible:ring-neutral-400",
    "border border-neutral-200"
  ),
  outline: cn(
    "border-2 border-primary-500 text-primary-600",
    "hover:bg-primary-50 active:bg-primary-100",
    "focus-visible:ring-primary-500",
    "bg-transparent"
  ),
  ghost: cn(
    "text-neutral-600",
    "hover:bg-neutral-100 active:bg-neutral-200",
    "focus-visible:ring-neutral-400",
    "bg-transparent"
  ),
  danger: cn(
    "bg-danger-500 text-white",
    "hover:bg-danger-600 active:bg-danger-700",
    "focus-visible:ring-danger-500",
    "shadow-sm hover:shadow-md"
  ),
  success: cn(
    "bg-success-500 text-white",
    "hover:bg-success-600 active:bg-success-700",
    "focus-visible:ring-success-500",
    "shadow-sm hover:shadow-md"
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs rounded-md gap-1",
  sm: "h-8 px-3 text-sm rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-11 px-5 text-base rounded-lg gap-2",
  xl: "h-12 px-6 text-base rounded-xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center",
      "font-medium",
      "transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "select-none"
    );

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <svg
            className="animate-spin -ml-1 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Left Icon */}
        {!loading && leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        
        {/* Children */}
        <span>{children}</span>
        
        {/* Right Icon */}
        {rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

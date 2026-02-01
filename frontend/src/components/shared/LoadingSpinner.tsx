import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  label?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "neutral" | "white";
  className?: string;
};

const sizeStyles = {
  xs: "h-3 w-3 border-[1.5px]",
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-6 w-6 border-2",
  xl: "h-8 w-8 border-[3px]",
};

const labelSizes = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
  xl: "text-base",
};

const variantStyles = {
  primary: "border-primary-500 border-t-transparent",
  neutral: "border-neutral-400 border-t-transparent",
  white: "border-white border-t-transparent",
};

export function LoadingSpinner({ 
  label, 
  size = "md", 
  variant = "primary",
  className 
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "animate-spin rounded-full",
          sizeStyles[size],
          variantStyles[variant]
        )}
        role="status"
        aria-label="Loading"
      />
      {label && (
        <span className={cn(
          "text-neutral-600 font-medium",
          labelSizes[size]
        )}>
          {label}
        </span>
      )}
    </div>
  );
}

// Full page loading state
export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <LoadingSpinner size="xl" />
      <p className="text-sm text-neutral-500 animate-pulse-soft">{label}</p>
    </div>
  );
}

// Skeleton loader for content placeholders
export function Skeleton({ 
  className,
  rounded = "lg"
}: { 
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}) {
  const roundedStyles = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <div 
      className={cn(
        "bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200",
        "bg-[length:200%_100%] animate-shimmer",
        roundedStyles[rounded],
        className
      )} 
    />
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";
export type BadgeSize = "sm" | "md" | "lg";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  solid?: boolean;
  dot?: boolean;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-700 ring-1 ring-inset ring-neutral-200",
  primary: "bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200",
  success: "bg-success-50 text-success-700 ring-1 ring-inset ring-success-200",
  warning: "bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-200",
  danger: "bg-danger-50 text-danger-700 ring-1 ring-inset ring-danger-200",
  info: "bg-info-50 text-info-700 ring-1 ring-inset ring-info-200",
};

const solidVariantStyles: Record<BadgeVariant, string> = {
  default: "bg-neutral-600 text-white ring-0",
  primary: "bg-primary-500 text-white ring-0",
  success: "bg-success-500 text-white ring-0",
  warning: "bg-warning-500 text-white ring-0",
  danger: "bg-danger-500 text-white ring-0",
  info: "bg-info-500 text-white ring-0",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs rounded-md",
  md: "px-2.5 py-1 text-xs rounded-lg",
  lg: "px-3 py-1.5 text-sm rounded-lg",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-neutral-500",
  primary: "bg-primary-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
  info: "bg-info-500",
};

export function Badge({ 
  children, 
  variant = "default", 
  size = "md",
  solid = false,
  dot = false,
  className 
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors",
        sizeStyles[size],
        solid ? solidVariantStyles[variant] : variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span 
          className={cn(
            "mr-1.5 h-1.5 w-1.5 rounded-full",
            solid ? "bg-white/80" : dotColors[variant]
          )} 
        />
      )}
      {children}
    </span>
  );
}

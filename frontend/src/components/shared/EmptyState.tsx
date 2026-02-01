import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  };
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeStyles = {
  sm: {
    wrapper: "py-8",
    iconWrapper: "h-12 w-12 mb-3",
    icon: "h-6 w-6",
    title: "text-base",
    description: "text-xs",
  },
  md: {
    wrapper: "py-12",
    iconWrapper: "h-16 w-16 mb-4",
    icon: "h-8 w-8",
    title: "text-lg",
    description: "text-sm",
  },
  lg: {
    wrapper: "py-16",
    iconWrapper: "h-20 w-20 mb-5",
    icon: "h-10 w-10",
    title: "text-xl",
    description: "text-base",
  },
};

// Default empty state icon
function DefaultEmptyIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <circle cx="18" cy="18" r="3" />
      <path d="M18 16.5v3" />
      <path d="M18 16.5v3" />
    </svg>
  );
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  action,
  className,
  size = "md"
}: EmptyStateProps) {
  const styles = sizeStyles[size];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      styles.wrapper,
      className
    )}>
      {/* Icon */}
      <div className={cn(
        "flex items-center justify-center rounded-2xl",
        "bg-neutral-100",
        styles.iconWrapper
      )}>
        {icon || <DefaultEmptyIcon className={cn(styles.icon, "text-neutral-400")} />}
      </div>

      {/* Title */}
      <h3 className={cn(
        "font-semibold text-neutral-900",
        styles.title
      )}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={cn(
          "mt-1.5 max-w-sm text-neutral-500",
          styles.description
        )}>
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <div className="mt-5">
          <Button 
            onClick={action.onClick}
            variant={action.variant || "primary"}
            size={size === "sm" ? "sm" : "md"}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

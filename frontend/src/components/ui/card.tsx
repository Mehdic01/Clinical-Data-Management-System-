import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "elevated" | "outlined" | "ghost";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: CardVariant;
  interactive?: boolean;
  className?: string;
};

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white border border-neutral-200/80 shadow-card",
  elevated: "bg-white shadow-elevated border-0",
  outlined: "bg-white border-2 border-neutral-200 shadow-none",
  ghost: "bg-neutral-50/50 border-0 shadow-none",
};

export function Card({ 
  children, 
  variant = "default",
  interactive = false,
  className, 
  ...props 
}: CardProps) {
  return (
    <div 
      className={cn(
        "rounded-xl transition-all duration-200",
        variantStyles[variant],
        interactive && [
          "cursor-pointer",
          "hover:shadow-card-hover hover:border-neutral-300",
          "active:scale-[0.99]",
        ],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  noBorder = false,
}: {
  children: ReactNode;
  className?: string;
  noBorder?: boolean;
}) {
  return (
    <div 
      className={cn(
        "px-6 py-4",
        !noBorder && "border-b border-neutral-100",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
  compact = false,
}: {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn(
      compact ? "px-4 py-3" : "px-6 py-5",
      className
    )}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div 
      className={cn(
        "border-t border-neutral-100 px-6 py-4 bg-neutral-50/50",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  as: Component = "h3",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  return (
    <Component 
      className={cn(
        "text-lg font-semibold text-neutral-900 tracking-tight",
        className
      )}
    >
      {children}
    </Component>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-1 text-sm text-neutral-500", className)}>
      {children}
    </p>
  );
}

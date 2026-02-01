import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorMessageProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: "default" | "inline" | "banner";
  className?: string;
};

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path 
        fillRule="evenodd" 
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
        clipRule="evenodd" 
      />
    </svg>
  );
}

export function ErrorMessage({
  title = "Something went wrong",
  message = "Please try again.",
  onRetry,
  variant = "default",
  className,
}: ErrorMessageProps) {
  if (variant === "inline") {
    return (
      <p className={cn("text-sm text-danger-600 flex items-center gap-1", className)}>
        <ErrorIcon className="h-4 w-4 flex-shrink-0" />
        {message}
      </p>
    );
  }

  if (variant === "banner") {
    return (
      <div className={cn(
        "rounded-xl bg-danger-50 border border-danger-200 p-4",
        "flex items-start gap-3",
        className
      )}>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-danger-100">
          <ErrorIcon className="h-5 w-5 text-danger-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-danger-800">{title}</h3>
          <p className="mt-1 text-sm text-danger-600">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button variant="secondary" size="sm" onClick={onRetry}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl border border-danger-200 bg-danger-50 p-4",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-danger-100">
          <ErrorIcon className="h-4 w-4 text-danger-600" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-danger-800">{title}</div>
          <div className="mt-1 text-sm text-danger-700">{message}</div>
          {onRetry && (
            <div className="mt-3">
              <Button variant="secondary" size="sm" onClick={onRetry}>
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

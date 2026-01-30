import { Button } from "@/components/ui/button";

type ErrorMessageProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorMessage({
  title = "Something went wrong",
  message = "Please try again.",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4">
      <div className="font-semibold text-red-800">{title}</div>
      <div className="mt-1 text-sm text-red-700">{message}</div>
      {onRetry && (
        <div className="mt-3">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCloseButton,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary" | "warning";
  loading?: boolean;
  icon?: "danger" | "warning" | "info";
};

const iconStyles = {
  danger: {
    bg: "bg-danger-100",
    icon: "text-danger-600",
  },
  warning: {
    bg: "bg-warning-100",
    icon: "text-warning-600",
  },
  info: {
    bg: "bg-info-100",
    icon: "text-info-600",
  },
};

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading = false,
  icon,
}: ConfirmDialogProps) {
  const iconType = icon || (variant === "danger" ? "danger" : variant === "warning" ? "warning" : undefined);

  return (
    <Dialog open={open} onClose={onClose} size="sm">
      <DialogCloseButton onClose={onClose} />
      
      <DialogHeader className="text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Icon */}
          {iconType && (
            <div className={cn(
              "mx-auto sm:mx-0 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full",
              iconStyles[iconType].bg
            )}>
              <WarningIcon className={cn("h-6 w-6", iconStyles[iconType].icon)} />
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1">
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </div>
        </div>
      </DialogHeader>

      <DialogFooter>
        <Button 
          variant="secondary" 
          onClick={onClose} 
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button 
          variant={variant === "warning" ? "primary" : variant} 
          onClick={onConfirm} 
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: DialogSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
};

const sizeStyles: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

export function Dialog({ 
  open, 
  onClose, 
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: DialogProps) {
  // Handle escape key
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose, closeOnEscape]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-neutral-950/60 backdrop-blur-sm",
          "animate-fade-in"
        )}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Dialog Panel */}
      <div 
        className={cn(
          "relative z-50 w-full rounded-2xl bg-white shadow-dialog",
          "ring-1 ring-neutral-950/5",
          "animate-scale-in",
          "max-h-[90vh] flex flex-col",
          sizeStyles[size]
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 pt-6 pb-4", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-lg font-semibold text-neutral-900 tracking-tight", className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-2 text-sm text-neutral-500 leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function DialogContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-4 overflow-y-auto flex-1 min-h-0", className)}>
      {children}
    </div>
  );
}

export function DialogFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div 
      className={cn(
        "flex items-center justify-end gap-3",
        "px-6 py-4",
        "border-t border-neutral-100 bg-neutral-50/50 rounded-b-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}

// Close button for dialogs
export function DialogCloseButton({ 
  onClose,
  className,
}: { 
  onClose: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={cn(
        "absolute right-4 top-4 p-1.5 rounded-lg",
        "text-neutral-400 hover:text-neutral-600",
        "hover:bg-neutral-100 transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        className
      )}
      aria-label="Close dialog"
    >
      <svg 
        className="h-5 w-5" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
          clipRule="evenodd" 
        />
      </svg>
    </button>
  );
}

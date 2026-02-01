import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className={cn(
      "flex h-16 items-center justify-between",
      "border-b border-neutral-200/80 bg-white",
      "px-6",
      "sticky top-0 z-40"
    )}>
      {/* Left: Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">
          Clinical Data Management System
        </h1>
        <span className={cn(
          "hidden sm:inline-flex items-center",
          "px-2 py-0.5 rounded-md",
          "bg-primary-50 text-primary-600",
          "text-xs font-medium"
        )}>
          CDMS
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* User Menu */}
        <button
          type="button"
          className={cn(
            "flex items-center gap-3 rounded-lg px-2 py-1.5",
            "hover:bg-neutral-100",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          )}
        >
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            "bg-gradient-to-br from-primary-500 to-primary-600",
            "text-white text-sm font-medium",
            "ring-2 ring-white"
          )}>
            U
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-neutral-900">User</p>
            <p className="text-xs text-neutral-500">Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}

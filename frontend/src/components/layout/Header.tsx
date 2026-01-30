export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-6">
      <div className="text-sm font-medium text-zinc-600">
        Clinical Data Management System
      </div>
      <div className="flex items-center gap-4">
        {/* Future: User menu, notifications, etc. */}
      </div>
    </header>
  );
}

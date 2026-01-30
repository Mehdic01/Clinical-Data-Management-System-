function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left: Title */}
      <div className="text-lg font-semibold text-slate-800">
        Clinical Data Management System
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Notification */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100">
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User Avatar */}
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
          U
        </button>
      </div>
    </header>
  );
}

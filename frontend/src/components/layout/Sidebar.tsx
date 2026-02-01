import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

// SVG Icons with consistent styling
function LogoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function StudiesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

const navItems = [
  { to: "/", icon: DashboardIcon, label: "Dashboard", end: true },
  { to: "/studies", icon: StudiesIcon, label: "Studies" },
];

export function Sidebar() {
  return (
    <aside className="flex w-[72px] flex-shrink-0 flex-col items-center bg-sidebar-bg py-5">
      {/* Logo */}
      <div className="mb-8">
        <div className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl",
          "bg-gradient-to-br from-primary-500 to-primary-600",
          "shadow-lg shadow-primary-500/25",
          "ring-1 ring-white/10"
        )}>
          <LogoIcon className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-1 flex-col items-center justify-center gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={item.label}
            className={({ isActive }) =>
              cn(
                "group relative flex h-11 w-11 items-center justify-center rounded-xl",
                "transition-all duration-200",
                isActive
                  ? [
                      "bg-primary-500 text-white",
                      "shadow-lg shadow-primary-500/30",
                    ]
                  : [
                      "text-sidebar-text",
                      "hover:bg-sidebar-hover hover:text-sidebar-textActive",
                    ]
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-5 w-5" />
                {/* Tooltip */}
                <span className={cn(
                  "absolute left-full ml-3 px-2.5 py-1.5 rounded-lg",
                  "bg-neutral-900 text-white text-xs font-medium",
                  "opacity-0 pointer-events-none",
                  "group-hover:opacity-100",
                  "transition-opacity duration-200",
                  "whitespace-nowrap",
                  "shadow-lg"
                )}>
                  {item.label}
                  {/* Arrow */}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900" />
                </span>
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section - User/Settings placeholder */}
      <div className="mt-auto pt-4">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          "bg-gradient-to-br from-neutral-600 to-neutral-700",
          "text-white text-sm font-medium",
          "ring-2 ring-white/10",
          "cursor-pointer hover:ring-white/20 transition-all"
        )}>
          U
        </div>
      </div>
    </aside>
  );
}

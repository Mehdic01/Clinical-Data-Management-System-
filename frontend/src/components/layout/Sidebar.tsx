import { NavLink } from "react-router-dom";

// SVG Icons
function LogoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
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
    <aside className="flex w-20 flex-shrink-0 flex-col items-center bg-[#0f172a] py-4">
      {/* Logo */}
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e293b]">
        <LogoIcon className="h-6 w-6 text-white" />
      </div>

      {/* Navigation Items - Centered */}
      <nav className="flex flex-1 flex-col items-center justify-center gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={item.label}
            className={({ isActive }) =>
              `flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-[#1e293b] hover:text-white"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

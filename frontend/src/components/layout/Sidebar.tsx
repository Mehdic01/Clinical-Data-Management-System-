import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/studies", label: "Studies" },
];

export function Sidebar() {
  const linkBase =
    "rounded-md px-3 py-2 text-sm font-medium transition hover:bg-zinc-100";
  const linkActive = "bg-zinc-200";

  return (
    <aside className="w-60 border-r border-zinc-200 p-4">
      <h3 className="text-lg font-semibold">CDMS</h3>

      <nav className="mt-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

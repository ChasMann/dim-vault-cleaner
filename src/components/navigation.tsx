/**
 * Primary navigation for the DIM Vault Toolkit screens.
 */
import Link from "next/link";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/search", label: "Search Builder" },
  { href: "/templates", label: "Templates & Favorites" },
  { href: "/armor", label: "Armor Tracker" },
  { href: "/wishlist", label: "Wishlist Builder" },
  { href: "/settings", label: "Settings" },
  { href: "/logs", label: "Error Logs" }
];

/**
 * Renders the sidebar-style navigation for desktop and mobile.
 */
export const Navigation = () => {
  return (
    <nav className="flex flex-wrap gap-3 text-sm text-slate-200">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-md border border-panel-border bg-panel px-3 py-2 transition hover:bg-slate-800"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

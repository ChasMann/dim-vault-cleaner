/**
 * Dashboard landing page for quick access to toolkit features.
 */
import Link from "next/link";
import { Card } from "@/ui/card";

const features = [
  {
    href: "/search",
    title: "Search Builder",
    description: "Craft DIM search queries from templates and copy them fast."
  },
  {
    href: "/templates",
    title: "Templates & Favorites",
    description: "Manage template rules and save favorites for repeat use."
  },
  {
    href: "/armor",
    title: "Armor Set Tracker",
    description: "Track armor sets with checkbox grids and progress."
  },
  {
    href: "/wishlist",
    title: "Wishlist Builder",
    description: "Build DIM wishlist text files with notes and trashlist support."
  },
  {
    href: "/settings",
    title: "Settings",
    description: "Configure defaults, backups, and logging options."
  },
  {
    href: "/logs",
    title: "Error Logs",
    description: "Review captured errors and copy details for debugging."
  }
];

/**
 * Renders the dashboard grid of feature cards.
 */
export default function HomePage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {features.map((feature) => (
        <Link key={feature.href} href={feature.href}>
          <Card className="transition hover:border-accent">
            <h2 className="text-lg font-semibold text-slate-100">{feature.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}

/**
 * Root layout with dark mode styling and navigation.
 */
import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "DIM Vault Toolkit",
  description: "Self-hosted DIM tooling for searches, armor tracking, and wishlists."
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Defines the app shell with navigation and page content.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <Providers>
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
            <header className="flex flex-col gap-3">
              <h1 className="text-2xl font-semibold">DIM Vault Toolkit</h1>
              <Navigation />
            </header>
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

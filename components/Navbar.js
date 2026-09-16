"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();

  const links = [{ href: "/", label: "Home" ,}];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
            FF
          </span>
          <span className="font-bold text-ink text-lg">FinFeasibility</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}

          {loading ? (
            <div className="w-20 h-8" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-white bg-primary px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/idea-check"
                className="text-sm font-semibold text-white bg-primary px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
              >
                Check Idea
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-white bg-primary px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink" />
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {open && (
        <div className="md:hidden border-t border-gray-100 px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-ink"
            >
              {l.label}
            </Link>
          ))}

          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-ink"
              >
                Dashboard
              </Link>
              <Link
                href="/idea-check"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-primary"
              >
                Check Idea
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-primary text-left"
              >
                Logout
              </button>
            </>
          ) : (
            !loading && (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold text-primary"
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>
      )}
    </header>
  );
}
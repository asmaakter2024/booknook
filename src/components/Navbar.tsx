"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, LogIn, LogOut, Menu, UserPlus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b1712] text-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="BookNook home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="grid size-8 place-items-center rounded-md bg-[#8fd3a7] text-[#0b1712]">
            <BookOpen className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight">
            BookNook
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-white/65 transition-colors hover:text-[#a8e1b9]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* [AUTH UI]: ইউজার লগইন থাকলে নাম ও লগআউট বাটন, না থাকলে লগইন ও রেজিস্টার বাটন */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 sm:flex">
                <span className="grid size-8 place-items-center rounded-full bg-[#d5c6ab] text-xs font-semibold text-[#26352d]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[120px] truncate text-xs text-white/80">
                  {user.name}
                </span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 gap-1 border border-white/10 px-2.5 text-xs text-red-300 hover:bg-red-500/10 hover:text-red-200"
              >
                <LogOut className="size-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex h-8 items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-2.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
              >
                <LogIn className="size-3.5" />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                className="flex h-8 items-center gap-1.5 rounded-lg bg-[#8fd3a7] px-2.5 text-xs font-medium text-[#102016] transition-colors hover:bg-[#a4e3b8]"
              >
                <UserPlus className="size-3.5" />
                <span>Register</span>
              </Link>
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="size-9 text-white hover:bg-white/10 md:hidden"
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-white/10 bg-[#0b1712] px-4 py-3 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-[#a8e1b9]"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-2 border-t border-white/10 pt-2">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs text-white/70">
                  Logged in as <strong className="text-white">{user.name}</strong>
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-xs font-medium text-red-400 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-1 py-1">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md border border-white/20 bg-white/5 px-3 py-2 text-center text-xs font-semibold text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md bg-[#8fd3a7] px-3 py-2 text-center text-xs font-semibold text-[#102016]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

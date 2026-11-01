"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Menu, UserRound, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/books/add" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            aria-label="My profile"
            className="hidden size-8 items-center justify-center rounded-full bg-[#d5c6ab] text-[#26352d] sm:flex"
          >
            <UserRound className="size-4" aria-hidden="true" />
          </Link>

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
              className="block rounded-md px-3 py-3 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-[#a8e1b9]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

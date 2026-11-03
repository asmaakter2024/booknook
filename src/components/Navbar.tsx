"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, LogIn, LogOut, Menu, User, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const publicNavLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
];

const privateNavLinks = [
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const {
    data: session,
    isPending,
    error: sessionError,
    refetch,
  } = authClient.useSession();
  const user = session?.user;
  const navLinks = user
    ? [...publicNavLinks, ...privateNavLinks]
    : publicNavLinks;

  const handleLogout = async () => {
    setLogoutError("");

    try {
      const result = await authClient.signOut();
      if (result.error) {
        setLogoutError(
          result.error.message || "Could not sign out. Please try again.",
        );
        return;
      }

      setMenuOpen(false);
      setProfileOpen(false);
      router.replace("/");
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Could not sign out. Please try again.",
      );
    }
  };

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

        <div className="flex items-center gap-2.5">
          {isPending ? (
            <span className="text-xs text-white/60">Checking session...</span>
          ) : user ? (
            <Popover open={profileOpen} onOpenChange={setProfileOpen}>
              <PopoverTrigger
                aria-label="Open profile menu"
                className="flex items-center gap-2 rounded-full outline-none ring-offset-2 ring-offset-[#0b1712] focus-visible:ring-2 focus-visible:ring-[#8fd3a7]"
              >
                <Avatar className="size-9 ring-1 ring-white/20">
                  <AvatarImage
                    src={user.image || undefined}
                    alt={`${user.name || "User"} profile`}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback className="bg-[#d5c6ab] font-semibold text-[#26352d]">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[120px] truncate text-xs text-white/80 sm:inline">
                  {user.name || user.email}
                </span>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-72 border border-white/10 bg-[#142119] p-4 text-white"
              >
                <div className="flex items-center gap-3">
                  <Avatar size="lg" className="ring-1 ring-white/15">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={`${user.name || "User"} profile`}
                      referrerPolicy="no-referrer"
                    />
                    <AvatarFallback className="bg-[#d5c6ab] font-semibold text-[#26352d]">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user.name || "BookNook reader"}
                    </p>
                    <p className="truncate text-xs text-white/60">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="my-3 border-t border-white/10" />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                >
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          ) : sessionError ? (
            <span className="text-xs text-red-300" role="alert">
              Session check failed
            </span>
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

      {(sessionError || logoutError) && (
        <div
          role="alert"
          className="flex items-center justify-center gap-3 border-t border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-xs text-red-300"
        >
          <span>
            {logoutError ||
              `Could not check your session: ${sessionError?.message}`}
          </span>
          {sessionError && (
            <button
              type="button"
              onClick={() => void refetch()}
              className="font-semibold underline"
            >
              Retry
            </button>
          )}
        </div>
      )}

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
            {isPending ? (
              <p className="px-3 py-2 text-xs text-white/60">
                Checking session...
              </p>
            ) : user ? (
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-white/70">
                <User className="size-3.5" />
                Profile options are available from your avatar.
              </div>
            ) : sessionError ? (
              <p className="px-3 py-2 text-xs text-red-300" role="alert">
                Could not verify your session.
              </p>
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

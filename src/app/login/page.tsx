"use client";

import { useState, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, LogIn, Sparkles } from "lucide-react";

// [LOGIN FORM COMPONENT]:
function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // ইউজারকে লগইন করানো
    login(email, name);
    // পূর্বে যে পেজটি দেখতে চেয়েছিল সেখানে নিয়ে যাওয়া
    router.push(redirectUrl);
  };

  // ১-ক্লিক ডেমো লগইন (পরীক্ষা বা টেস্টের জন্য দ্রুত লগইন করার বাটন)
  const handleDemoLogin = () => {
    login("reader@booknook.app", "John Reader");
    router.push(redirectUrl);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#142119] p-8 shadow-2xl">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-[#8fd3a7] text-[#0b1712]">
          <BookOpen className="size-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-white">
          Welcome to BookNook
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Sign in to access private routes and borrow books
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-name">Your Name</Label>
          <Input
            id="login-name"
            placeholder="e.g. Tanvir Hasan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-white/15 bg-white/[0.045] text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email Address</Label>
          <Input
            id="login-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-white/15 bg-white/[0.045] text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-white/15 bg-white/[0.045] text-white"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#8fd3a7] font-semibold text-[#102016] hover:bg-[#a4e3b8]"
        >
          <LogIn className="mr-2 size-4" />
          Sign In
        </Button>
      </form>

      <div className="relative my-6 text-center text-xs text-white/40">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <span className="relative bg-[#142119] px-3">or continue with</span>
      </div>

      {/* কুইক ডেমো লগইন বাটন */}
      <Button
        type="button"
        variant="outline"
        onClick={handleDemoLogin}
        className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
      >
        <Sparkles className="mr-2 size-4 text-amber-300" />
        Quick Demo Login
      </Button>

      {/* [NEW LINK]: রেজিস্টার পেজের লিংক */}
      <div className="mt-6 text-center text-xs text-white/60">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
          className="font-medium text-[#8fd3a7] hover:underline"
        >
          Register Now
        </Link>
      </div>
    </div>
  );
}

// [LOGIN PAGE]:
export default function LoginPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#0b1510] px-4 py-12 text-[#edf2ed]">
      <Suspense
        fallback={
          <div className="text-white/60">Loading login form...</div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}

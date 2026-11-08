"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, LogIn } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedRedirect = searchParams.get("redirect");
  const redirectUrl =
    requestedRedirect?.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(
          result.error.message || "Could not sign in. Please try again.",
        );
        return;
      }

      router.push(redirectUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
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

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-xs text-red-400"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email Address</Label>
          <Input
            id="login-email"
            type="email"
            required
            autoComplete="email"
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
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-white/15 bg-white/[0.045] text-white"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#8fd3a7] font-semibold text-[#102016] hover:bg-[#a4e3b8]"
        >
          <LogIn className="mr-2 size-4" />
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

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

export default function LoginPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#0b1510] px-4 py-12 text-[#edf2ed]">
      <Suspense
        fallback={<div className="text-white/60">Loading login form...</div>}
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}

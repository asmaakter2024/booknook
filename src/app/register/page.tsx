"use client";

import { useState, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, UserPlus } from "lucide-react";

// [REGISTER FORM COMPONENT]:
function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // ইউজারকে রেজিস্টার করানো
    register(name, email, password, photoURL);

    // রিডাইরেক্ট করা
    router.push(redirectUrl);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#142119] p-8 shadow-2xl">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-[#8fd3a7] text-[#0b1712]">
          <BookOpen className="size-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-white">
          Create an Account
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Join BookNook to borrow and share books
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-xs text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="register-name">Full Name</Label>
          <Input
            id="register-name"
            required
            placeholder="e.g. Tanvir Hasan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-white/15 bg-white/[0.045] text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-email">Email Address</Label>
          <Input
            id="register-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-white/15 bg-white/[0.045] text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-photo">Profile Photo URL (Optional)</Label>
          <Input
            id="register-photo"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="border-white/15 bg-white/[0.045] text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            required
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-white/15 bg-white/[0.045] text-white"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#8fd3a7] font-semibold text-[#102016] hover:bg-[#a4e3b8]"
        >
          <UserPlus className="mr-2 size-4" />
          Register Now
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-white/60">
        Already have an account?{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
          className="font-medium text-[#8fd3a7] hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

// [REGISTER PAGE]:
export default function RegisterPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#0b1510] px-4 py-12 text-[#edf2ed]">
      <Suspense fallback={<div className="text-white/60">Loading registration form...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

// [PRIVATE ROUTE WRAPPER]:
// শুধুমাত্র লগইন করা ইউজাররা এই রুটে ঢুকতে পারবে।
// লগইন না থাকলে এটি অটোমেটিক /login পেজে রিডাইরেক্ট করে নিয়ে যাবে।
export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // লগইন না থাকলে /login পেজে পাঠানো হচ্ছে, সাথে ফেরত আসার জন্য redirect প্যারামিটার
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  // লগইন চেক হওয়া পর্যন্ত লোডিং স্পিনার দেখানো
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#0b1510] text-[#edf2ed]">
        <Loader2 className="size-8 animate-spin text-[#8fd3a7]" />
        <p className="mt-4 text-sm text-white/60">Checking authorization...</p>
      </div>
    );
  }

  // ইউজার না থাকলে কিছু দেখাবে না (রিডাইরেক্ট হওয়া পর্যন্ত)
  if (!user) {
    return null;
  }

  // ইউজার লগইন থাকলে পেজটি রেন্ডার হবে
  return <>{children}</>;
}

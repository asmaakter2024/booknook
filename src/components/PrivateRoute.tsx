"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const user = session?.user;

  useEffect(() => {
    if (!isPending && !error && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isPending, error, router, pathname]);

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#0b1510] text-[#edf2ed]">
        <Loader2 className="size-8 animate-spin text-[#8fd3a7]" />
        <p className="mt-4 text-sm text-white/60">Checking authorization...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#0b1510] px-4 text-center text-[#edf2ed]">
        <p role="alert" className="text-sm text-red-300">
          Could not verify your session: {error.message}
        </p>
        <Button
          type="button"
          onClick={() => void refetch()}
          className="bg-[#8fd3a7] font-semibold text-[#102016] hover:bg-[#a4e3b8]"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CheckCircle, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface IBorrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage?: string;
  userName: string;
  userEmail: string;
  borrowDate: string | Date;
  returnDate?: string | Date;
  status?: string;
}

// তারিখ সুন্দর ফরম্যাট করার হেল্পার ফাংশন (যেমন: Oct 28, 2026)
function formatDate(dateInput?: string | Date) {
  if (!dateInput) return "N/A";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(dateInput);
  }
}

function MyBorrowsContent() {
  const { data: session } = authClient.useSession();
  const userEmail = session?.user.email;
  const [borrows, setBorrows] = useState<IBorrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returningId, setReturningId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // [FIX]: ইউজারের ধার করা বইগুলো ফেচ করা (React 19 / useEffect নিয়ম অনুযায়ী)
  useEffect(() => {
    let ignore = false;
    if (!userEmail) return;

    async function loadBorrows(email: string) {
      try {
        const res = await fetch(
          `${API_URL}/borrows?email=${encodeURIComponent(email)}`,
        );
        if (!res.ok) throw new Error("Failed to fetch borrowed books.");
        const data = await res.json();
        if (!ignore) {
          setBorrows(Array.isArray(data) ? data : []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Error loading borrowed books",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadBorrows(userEmail);

    return () => {
      ignore = true;
    };
  }, [userEmail]);

  // বই ফেরত দেওয়া (Return Book)
  const handleReturn = async (borrowId: string, title: string) => {
    const confirmReturn = window.confirm(
      `Are you sure you want to return "${title}"?`,
    );
    if (!confirmReturn) return;

    try {
      setReturningId(borrowId);
      setSuccessMessage("");

      const res = await fetch(`${API_URL}/borrows/${borrowId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to return book.");
      }

      // টেবিল থেকে ধার নেওয়ার রেকর্ডটি সরিয়ে দেওয়া
      setBorrows((prev) => prev.filter((item) => item._id !== borrowId));
      setSuccessMessage(`"${title}" has been successfully returned!`);
      window.setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error returning book.");
    } finally {
      setReturningId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b1510] px-4 py-12 text-[#edf2ed] sm:px-6 lg:px-8">
      {/* হেডার সেকশন (Image 1 অনুযায়ী) */}
      <div className="mx-auto mb-10 max-w-5xl text-center">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          My Borrows
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Books you are reading right now.
        </p>
      </div>

      {successMessage && (
        <div className="mx-auto mb-6 flex max-w-5xl items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
          <CheckCircle className="size-4" />
          {successMessage}
        </div>
      )}

      <div className="mx-auto max-w-5xl">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center text-white/60">
            <Loader2 className="size-8 animate-spin text-[#8fd3a7]" />
            <p className="mt-3 text-sm">Loading your borrowed books...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
            {error}
          </div>
        ) : borrows.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#142119] p-12 text-center">
            <BookOpen className="mx-auto size-12 text-white/30" />
            <h3 className="mt-4 font-serif text-lg font-medium text-white">
              No borrowed books
            </h3>
            <p className="mt-1 text-sm text-white/60">
              You haven&apos;t borrowed any books from the library yet.
            </p>
            <Link
              href="/books"
              className="mt-5 inline-block rounded-lg bg-[#8fd3a7] px-4 py-2 text-sm font-semibold text-[#102016] hover:bg-[#a4e3b8]"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          /* টেবিল ভিউ (Image 1 অনুযায়ী) */
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121f17]/90 shadow-2xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-white/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Image</th>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Borrow Date</th>
                    <th className="px-6 py-4 font-medium">Return Date</th>
                    <th className="px-6 py-4 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {borrows.map((item) => {
                    const imageUrl = item.bookImage?.trim();
                    const isReturning = returningId === item._id;

                    return (
                      <tr
                        key={item._id}
                        className="transition-colors hover:bg-white/[0.02]"
                      >
                        {/* Image Column */}
                        <td className="px-6 py-4">
                          <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded border border-white/15 bg-black/40">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={item.bookTitle}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
                                📖
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Title */}
                        <td className="px-6 py-4 font-medium text-white">
                          {item.bookTitle}
                        </td>

                        {/* Borrow Date */}
                        <td className="px-6 py-4 text-white/70">
                          {formatDate(item.borrowDate)}
                        </td>

                        {/* Return Date */}
                        <td className="px-6 py-4 text-white/70">
                          {formatDate(item.returnDate)}
                        </td>

                        {/* Action: Return Book button */}
                        <td className="px-6 py-4 text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isReturning}
                            onClick={() =>
                              handleReturn(item._id, item.bookTitle)
                            }
                            className="h-8 border-white/15 bg-white/5 text-xs text-white hover:bg-white/15 disabled:opacity-50"
                          >
                            {isReturning ? (
                              <>
                                <Loader2 className="mr-1 size-3 animate-spin" />
                                Returning...
                              </>
                            ) : (
                              "Return Book"
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// [PRIVATE ROUTE]: My Borrows পেজ শুধুমাত্র লগইন করা ইউজারদের জন্য
export default function MyBorrowsPage() {
  return <MyBorrowsContent />;
}

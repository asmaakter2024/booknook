"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Edit2, Loader2, Trash2, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface IBook {
  _id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  image?: string;
  description?: string;
  userName?: string;
  userEmail?: string;
}

function MyBooksContent() {
  const { data: session } = authClient.useSession();
  const userEmail = session?.user.email;
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // এডিটিং স্টেট
  const [editingBook, setEditingBook] = useState<IBook | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // [FIX]: ইউজারের বইগুলো নিরাপদে ফেচ করা (React 19 / useEffect নিয়ম অনুযায়ী)
  useEffect(() => {
    let ignore = false;
    if (!userEmail) return;

    async function loadBooks(email: string) {
      try {
        const res = await fetch(
          `${API_URL}/my-books?email=${encodeURIComponent(email)}`,
        );
        if (!res.ok) throw new Error("Failed to fetch your books.");
        const data = await res.json();
        if (!ignore) {
          setBooks(Array.isArray(data) ? data : []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error loading books");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadBooks(userEmail);

    return () => {
      ignore = true;
    };
  }, [userEmail]);

  // বই ডিলিট করা
  const handleDelete = async (bookId: string, title: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"?`,
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete book.");
      }

      setBooks((prev) => prev.filter((book) => book._id !== bookId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting book.");
    }
  };

  // বই আপডেট / এডিট করা
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    try {
      setIsUpdating(true);
      const res = await fetch(`${API_URL}/books/${editingBook._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingBook),
      });

      if (!res.ok) {
        throw new Error("Failed to update book.");
      }

      setBooks((prev) =>
        prev.map((b) => (b._id === editingBook._id ? editingBook : b)),
      );
      setEditingBook(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating book.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b1510] px-4 py-12 text-[#edf2ed] sm:px-6 lg:px-8">
      {/* হেডার সেকশন (Image 2 অনুযায়ী) */}
      <div className="mx-auto mb-10 max-w-5xl text-center">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          My Books
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Books you added to the library.
        </p>
      </div>

      <div className="mx-auto max-w-5xl">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center text-white/60">
            <Loader2 className="size-8 animate-spin text-[#8fd3a7]" />
            <p className="mt-3 text-sm">Loading your books...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
            {error}
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#142119] p-12 text-center">
            <BookOpen className="mx-auto size-12 text-white/30" />
            <h3 className="mt-4 font-serif text-lg font-medium text-white">
              No books added yet
            </h3>
            <p className="mt-1 text-sm text-white/60">
              You have not added any books to the library yet.
            </p>
            <Link
              href="/add-book"
              className="mt-5 inline-block rounded-lg bg-[#8fd3a7] px-4 py-2 text-sm font-semibold text-[#102016] hover:bg-[#a4e3b8]"
            >
              Add a Book
            </Link>
          </div>
        ) : (
          /* টেবিল ভিউ (Image 2 অনুযায়ী) */
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121f17]/90 shadow-2xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-white/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Book</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Copies</th>
                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {books.map((book) => {
                    const imageUrl = book.image?.trim();

                    return (
                      <tr
                        key={book._id}
                        className="transition-colors hover:bg-white/[0.02]"
                      >
                        {/* Book Column: Cover + Title + Author */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded border border-white/15 bg-black/40">
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={book.title}
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
                            <div>
                              <p className="font-medium text-white">
                                {book.title}
                              </p>
                              <p className="text-xs text-white/50">
                                {book.author}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 text-white/70">
                          <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs">
                            {book.category}
                          </span>
                        </td>

                        {/* Copies */}
                        <td className="px-6 py-4 font-medium text-white/90">
                          {book.totalCopies}
                        </td>

                        {/* Actions (Edit + Delete) */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingBook(book)}
                              className="h-8 border-white/15 bg-white/5 text-xs text-white hover:bg-white/15"
                            >
                              <Edit2 className="mr-1 size-3" />
                              Edit
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(book._id, book.title)}
                              className="h-8 border-red-500/30 bg-red-950/20 text-xs text-red-300 hover:bg-red-900/40 hover:text-red-200"
                            >
                              <Trash2 className="mr-1 size-3" />
                              Delete
                            </Button>
                          </div>
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

      {/* এডিট বুক মোডাল ডায়ালগ */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#142119] p-6 text-white shadow-2xl">
            <button
              onClick={() => setEditingBook(null)}
              className="absolute right-4 top-4 text-white/60 hover:text-white"
            >
              <X className="size-5" />
            </button>

            <h2 className="font-serif text-xl font-bold">Edit Book</h2>
            <p className="text-xs text-white/50">
              Update details for {editingBook.title}
            </p>

            <form onSubmit={handleUpdate} className="mt-4 space-y-3.5">
              <div>
                <Label htmlFor="edit-title" className="text-xs">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editingBook.title}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, title: e.target.value })
                  }
                  required
                  className="mt-1 h-9 border-white/15 bg-white/5 text-white"
                />
              </div>

              <div>
                <Label htmlFor="edit-author" className="text-xs">
                  Author
                </Label>
                <Input
                  id="edit-author"
                  value={editingBook.author}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, author: e.target.value })
                  }
                  required
                  className="mt-1 h-9 border-white/15 bg-white/5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="edit-category" className="text-xs">
                    Category
                  </Label>
                  <Input
                    id="edit-category"
                    value={editingBook.category}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        category: e.target.value,
                      })
                    }
                    required
                    className="mt-1 h-9 border-white/15 bg-white/5 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-copies" className="text-xs">
                    Total Copies
                  </Label>
                  <Input
                    id="edit-copies"
                    type="number"
                    min={0}
                    value={editingBook.totalCopies}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        totalCopies: Number(e.target.value),
                      })
                    }
                    required
                    className="mt-1 h-9 border-white/15 bg-white/5 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-image" className="text-xs">
                  Cover Image URL
                </Label>
                <Input
                  id="edit-image"
                  type="url"
                  value={editingBook.image || ""}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, image: e.target.value })
                  }
                  placeholder="https://..."
                  className="mt-1 h-9 border-white/15 bg-white/5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingBook(null)}
                  className="border border-white/10 text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isUpdating}
                  className="bg-[#8fd3a7] font-semibold text-[#102016] hover:bg-[#a4e3b8]"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

// [PRIVATE ROUTE]: My Books পেজ শুধুমাত্র লগইন করা ইউজারদের জন্য
export default function MyBooksPage() {
  return <MyBooksContent />;
}

"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import "./books-details.css";
import Image from "next/image";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
// [TOAST]: টোস্ট নোটিফিকেশন দেখানোর জন্য toast ইমপোর্ট করা হলো
import { toast } from "@/components/ui/toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface IBookDetails {
  _id?: string;
  title?: string;
  author?: string;
  image?: string;
  category?: string;
  totalCopies?: number;
  description?: string;
  userName?: string;
  userEmail?: string;
}

function BooksDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [book, setBook] = useState<IBookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // [FIX]: ডায়ালগ ওপেন করার সময় ইউজারের নাম ও ইমেইল সেট করা হবে (useEffect এর পরিবর্তে)

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function loadBook() {
      try {
        setLoading(true);
        setPageError("");

        const res = await fetch(`${API_URL}/books/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "Book not found."
              : "Could not load book details.",
          );
        }

        const data: IBookDetails = await res.json();
        setBook(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") {
            setPageError(err.message || "Could not connect to the books server.");
          }
        } else {
          setPageError("Could not connect to the books server.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => controller.abort();
  }, [id]);

  async function handleBorrow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const currentUserName = (user?.name || userName || "").trim();
      const currentUserEmail = (user?.email || userEmail || "").trim();

      const res = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book?._id || id,
          userName: currentUserName,
          userEmail: currentUserEmail,
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          result.message || "Borrow request failed. Please try again.",
        );
      }

      // [TOAST]: সফলভাবে borrow হলে success toast দেখানো হবে
      toast.add({
        title: "Book borrowed successfully!",
        description: `You can keep "${(book?.title || "this book").trim()}" for 7 days.`,
        type: "success",
      });

      setBook((prev) =>
        prev
          ? {
              ...prev,
              totalCopies: Math.max(0, Number(prev.totalCopies || 1) - 1),
            }
          : prev
      );

      window.setTimeout(() => setDialogOpen(false), 800);
    } catch (err: unknown) {
      // [NO DOUBLE BORROW]: ডুপ্লিকেট borrow বা অন্য error হলে error toast দেখানো হবে
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      toast.add({
        title: "Borrow Failed",
        description: errorMsg,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="book-page">
        <p className="book-status">Loading book details…</p>
      </main>
    );
  }

  if (pageError || !book) {
    return (
      <main className="book-page">
        <p className="book-status book-error">
          {pageError || "Book not found."}
        </p>
        <button className="book-back" onClick={() => router.back()}>
          Go back
        </button>
      </main>
    );
  }

  const title = (book.title || "Untitled").trim();
  const author = (book.author || "Unknown author").trim();
  const image = (book.image || "").trim();
  const available = Number(book.totalCopies || 0);

  return (
    <main className="book-page">
      <section className="book-layout">
        <div className="book-cover-wrap">
          {image ? (
            <Image
              className="book-cover"
              src={image}
              alt={`Cover of ${title}`}
              width={300}
              height={450}
              unoptimized
            />
          ) : (
            <div className="book-cover-placeholder">{title}</div>
          )}
        </div>

        <div className="book-info">
          <span className="book-category">{book.category || "Book"}</span>
          <h1>{title}</h1>
          <p className="book-author">by {author}</p>

          <p className="book-description">
            {(book.description || "No description available.").trim()}
          </p>

          <div className="book-meta">
            <div>
              <span className="meta-label">Added by</span>
              {/* [FIX]: লগইন করা ইউজারের নাম ও ইমেইল দিয়ে Added by অংশ দেখানো হচ্ছে */}
              <strong>
                {(user?.name || book.userName || "Library").trim()}
              </strong>
              <span className="meta-sub">
                {(user?.email || book.userEmail || "").trim()}
              </span>
            </div>

            <div>
              <span className="meta-label">Copies left</span>
              <strong>{available}</strong>
            </div>
          </div>

          <div className="book-actions">
            <button
              className="borrow-button"
              disabled={available < 1}
              onClick={() => {
                setMessage("");
                if (user) {
                  setUserName(user.name);
                  setUserEmail(user.email);
                }
                setDialogOpen(true);
              }}
            >
              {available < 1 ? "Not Available" : "Borrow This Book"}
            </button>

            <button className="book-back" onClick={() => router.push("/books")}>
              Back to all books
            </button>
          </div>
        </div>
      </section>

      {dialogOpen && (
        <div
          className="borrow-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !submitting) {
              setDialogOpen(false);
            }
          }}
        >
          <section
            className="borrow-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="borrow-title"
          >
            <button
              className="dialog-close"
              aria-label="Close dialog"
              disabled={submitting}
              onClick={() => setDialogOpen(false)}
            >
              ×
            </button>

            <h2 id="borrow-title">Borrow “{title}”</h2>
            <p className="dialog-note">You can keep this book for 7 days.</p>

            <form onSubmit={handleBorrow}>
              {/* [FIX]: পপ-আপে লগইন করা ইউজারের নাম readOnly হিসেবে বসানো হলো (এডিট করা যাবে না) */}
              <label htmlFor="borrow-name">User Name</label>
              <input
                id="borrow-name"
                readOnly
                value={user?.name || userName}
                className="cursor-not-allowed opacity-80"
              />

              {/* [FIX]: পপ-আপে লগইন করা ইউজারের ইমেইল readOnly হিসেবে বসানো হলো (এডিট করা যাবে না) */}
              <label htmlFor="borrow-email">User Email</label>
              <input
                id="borrow-email"
                type="email"
                readOnly
                value={user?.email || userEmail}
                className="cursor-not-allowed opacity-80"
              />

              {message && (
                <p
                  className={`borrow-feedback${
                    message.includes("successfully") ? " success" : ""
                  }`}
                  role="status"
                >
                  {message}
                </p>
              )}

              <div className="dialog-actions">
                <button
                  className="borrow-button"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Processing…" : "Confirm Borrow"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

// [PRIVATE ROUTE]: বইয়ের ডিটেইলস পেজটি PrivateRoute দিয়ে সুরক্ষিত করা হলো
// ইউজার লগইন না থাকলে স্বয়ংক্রিয়ভাবে লগইন পেজে চলে যাবে
export default function BooksDetailsPage() {
  return (
    <PrivateRoute>
      <BooksDetailsContent />
    </PrivateRoute>
  );
}

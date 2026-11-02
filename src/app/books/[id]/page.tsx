// const BooksDetailsPage = async ({ params }) => {
//   const { id } = await params;

//   const res = await fetch(`http://localhost:8000/books/${id}`);
//   const data = await res.json();
//   console.log(data);
//   //console.log(id);

//   return (
//   <div>
//     BooksDetailsPage
//   </div>
//   );
// };

// export default BooksDetailsPage;

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "./books-details.css";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const BooksDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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

        const data = await res.json();
        setBook(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setPageError(err.message || "Could not connect to the books server.");
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

  async function handleBorrow(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book._id || id,
          userName: userName.trim(),
          userEmail: userEmail.trim(),
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          result.message || "Borrow request failed. Please try again.",
        );
      }

      setMessage("Book borrowed successfully!");
      window.setTimeout(() => setDialogOpen(false), 900);
    } catch (err) {
      setMessage(err.message || "Something went wrong. Please try again.");
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
              <strong>
                {(book.userName || "Library").trim() || "Library"}
              </strong>
              <span className="meta-sub">{(book.userEmail || "").trim()}</span>
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
                setDialogOpen(true);
              }}
            >
              {available < 1 ? "No Copies Available" : "Borrow This Book"}
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
              <label htmlFor="borrow-name">User Name</label>
              <input
                id="borrow-name"
                autoFocus
                required
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                placeholder="Enter your name"
              />

              <label htmlFor="borrow-email">User Email</label>
              <input
                id="borrow-email"
                type="email"
                required
                value={userEmail}
                onChange={(event) => setUserEmail(event.target.value)}
                placeholder="you@example.com"
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
};

export default BooksDetailsPage;

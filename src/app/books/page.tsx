import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

type IBook = {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  image?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function AllBooks() {
  let books: IBook[] = [];
  let fetchError = "";

  // [FIX 1]: fetch-কে try...catch-এর ভেতরে নেওয়া হয়েছে
  // যাতে ব্যাকএন্ড সার্ভার অফ থাকলে পুরো Next.js পেজ ক্র্যাশ না করে মার্জিত মেসেজ দেখায়
  try {
    const res = await fetch(`${API_URL}/books`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Server returned status: ${res.status}`);
    }

    const data = await res.json();
    books = Array.isArray(data) ? data : (data.books ?? []);
  } catch (err) {
    console.error("Could not fetch books:", err);
    fetchError = "Could not load books from the server. Please check if booknook-server is running.";
  }

  return (
    <section className="w-full bg-background px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold">All Books</h1>
          <p className="mt-3 text-muted-foreground">
            Every book on the BookNook shelf.
          </p>
        </div>

        {/* [FIX 2]: সার্ভার অফ থাকলে সুন্দর এরর ব্যানার দেখানো */}
        {fetchError && (
          <div className="mx-auto mt-8 max-w-md rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
            {fetchError}
          </div>
        )}

        {/* বই না থাকলে মেসেজ */}
        {!fetchError && books.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            No books found on the shelf yet.{" "}
            <Link href="/add-book" className="text-primary underline">
              Add your first book!
            </Link>
          </div>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book, index) => {
            const bookId = book._id ?? book.id ?? book.title;
            const imageUrl = book.image?.trim();

            return (
              <article
                className="overflow-hidden rounded-lg border border-border bg-card"
                key={bookId}
              >
                {/* [FIX 3]: ইমেজ না থাকলে 404 placeholder-book.png না ডেকে ফ্লেক্সিবল ফলব্যাক রেন্ডার করা */}
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`Cover of ${book.title}`}
                    width={300}
                    height={450}
                    unoptimized
                    loading={index < 2 ? "eager" : "lazy"}
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-72 w-full flex-col items-center justify-center bg-muted text-muted-foreground">
                    <BookOpen className="size-12 opacity-40" />
                    <span className="mt-2 text-xs font-medium">No cover image</span>
                  </div>
                )}

                <div className="flex min-h-44 flex-col items-start p-4">
                  <span className="mb-3 rounded-full border border-border px-3 py-1 text-xs">
                    {book.category}
                  </span>

                  <h2 className="text-xl font-semibold">{book.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    by {book.author}
                  </p>

                  <Link
                    className="mt-auto w-full rounded-md bg-primary px-4 py-2 text-center text-primary-foreground hover:opacity-90"
                    href={`/books/${book._id ?? book.id}`}
                  >
                    View Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AllBooksSkeleton() {
  return (
    <section className="w-full px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto h-12 w-64 animate-pulse rounded-md bg-muted" />
        <div className="mx-auto mt-4 h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-lg border border-border bg-muted/50"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AllBooksPage() {
  return (
    <main>
      <Suspense fallback={<AllBooksSkeleton />}>
        <AllBooks />
      </Suspense>
    </main>
  );
}

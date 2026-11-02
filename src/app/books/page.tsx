import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

type IBook = {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  image?: string;
};

async function AllBooks() {
  // const res = await fetch("http://localhost:8000/books", {
  //   cache: "no-store",
  // });
  const res = await fetch("http://127.0.0.1:8000/books", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load books");
  }

  const data = await res.json();
  const books: IBook[] = Array.isArray(data) ? data : (data.books ?? []);

  return (
    <section className="w-full bg-background px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold">All Books</h1>
          <p className="mt-3 text-muted-foreground">
            Every book on the BookNook shelf.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book, index) => {
            const bookId = book._id ?? book.id ?? book.title;
            const imageUrl = book.image?.trim() || "/placeholder-book.png";

            return (
              <article
                className="overflow-hidden rounded-lg border border-border bg-card"
                key={bookId}
              >
                <Image
                  src={imageUrl}
                  alt={`Cover of ${book.title}`}
                  width={300}
                  height={450}
                  unoptimized
                  //loading={index === 0 ? "eager" : "lazy"}
                  loading={index < 2 ? "eager" : "lazy"}
                  className="h-72 w-full object-cover"
                />

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

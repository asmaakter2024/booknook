// import Image from "next/image";
// import Link from "next/link";

// const AllBooksPage = async () => {
//   const res = await fetch("http://localhost:8000/books");

//   if (!res.ok) {
//     throw new Error("Failed to load books");
//   }

//   const data = await res.json();
//   const books = Array.isArray(data) ? data : (data.books ?? []);

//   return (
//     <main className="books-page">
//       <header className="books-header">
//         <h1>All Books</h1>
//         <p>Every book on the BookNook shelf.</p>
//       </header>

//       <section className="book-grid">
//         {books.map((book) => (
//           <article
//             className="book-card"
//             key={book._id ?? book.id ?? book.title}
//           >
//             <Image
//               className="book-image"
//               src={book.image?.trim() || "/placeholder-book.png"}
//               alt={`Cover of ${book.title}`}
//               width={300}
//               height={450}
//             />

//             <div className="book-info">
//               <span className="book-category">{book.category}</span>
//               <h2>{book.title}</h2>
//               <p className="book-author">by {book.author}</p>

//               <Link className="details-button" href={`/books/${book._id}`}>
//                 View Details
//               </Link>
//             </div>
//           </article>
//         ))}
//       </section>

//       <style>{`
//         .books-page {
//           min-height: 100vh;
//           background: #0c1510;
//           color: #f1f2e9;
//           padding-bottom: 48px;
//         }

//         .books-header {
//           padding: 38px 20px;
//           text-align: center;
//           background: #18241c;
//           border-bottom: 1px solid #26352b;
//         }

//         .books-header h1 {
//           margin: 0;
//           font: 700 2.4rem Georgia, serif;
//         }

//         .books-header p {
//           margin: 10px 0 0;
//           color: #a2afa5;
//         }

//         .book-grid {
//           width: min(1120px, calc(100% - 40px));
//           margin: 36px auto;
//           display: grid;
//           grid-template-columns: repeat(3, minmax(0, 1fr));
//           gap: 22px;
//         }

//         .book-card {
//           overflow: hidden;
//           display: flex;
//           flex-direction: column;
//           background: #18231c;
//           border: 1px solid #26352b;
//           border-radius: 10px;
//         }

//         .book-image {
//           display: block;
//           width: 100%;
//           height: 300px;
//           object-fit: cover;
//           background: #24342a;
//         }

//         .book-info {
//           display: flex;
//           flex: 1;
//           flex-direction: column;
//           align-items: flex-start;
//           padding: 15px;
//         }

//         .book-category {
//           margin-bottom: 9px;
//           padding: 4px 9px;
//           border: 1px solid #34453a;
//           border-radius: 999px;
//           color: #d2e8d7;
//           font-size: 12px;
//         }

//         .book-info h2 {
//           margin: 0;
//           font: 700 1.15rem Georgia, serif;
//         }

//         .book-author {
//           margin: 8px 0 16px;
//           color: #a2afa5;
//           font-size: 14px;
//         }

//         .details-button {
//           width: 100%;
//           min-height: 40px;
//           margin-top: auto;
//           border: 0;
//           border-radius: 6px;
//           background: #8fd0a1;
//           color: #102016;
//           font-weight: 600;
//           cursor: pointer;
//         }

//         .details-button:hover {
//           background: #a5dfb3;
//         }

//         @media (max-width: 760px) {
//           .book-grid {
//             grid-template-columns: repeat(2, minmax(0, 1fr));
//             gap: 16px;
//           }
//         }

//         @media (max-width: 500px) {
//           .book-grid {
//             width: calc(100% - 28px);
//             grid-template-columns: 1fr;
//             margin-top: 24px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// };

// export default AllBooksPage;

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
  const res = await fetch("http://localhost:8000/books", {
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
                  loading={index === 0 ? "eager" : "lazy"}
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

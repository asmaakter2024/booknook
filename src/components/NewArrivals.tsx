import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IBook {
  _id: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  image?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// [NEW COMPONENT]: New Arrivals (Dynamic)
// ব্যাকএন্ড থেকে সর্বশেষ ৬টি বই লোড করে ৩-কলাম গ্রিডে কার্ড হিসেবে প্রদর্শন করে
export default async function NewArrivals() {
  let books: IBook[] = [];

  try {
    const res = await fetch(`${API_URL}/latest-books`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      books = Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error("Failed to load new arrivals:", err);
  }

  // যদি ডাটাবেজে এখনো কোনো বই না থাকে
  if (books.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#0b1510] px-4 py-16 text-[#edf2ed] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* সেকশন হেডার (ইউজারের স্ক্রিনশট অনুযায়ী) */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            New Arrivals
          </h2>
          <p className="mt-2 text-sm text-white/55">
            The latest books added by our readers.
          </p>
        </div>

        {/* ৩-কলাম গ্রিড (AllBooks এর মতো) */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book, index) => {
            const bookId = book._id || book.id || "";
            const imageUrl = book.image?.trim();

            return (
              <article
                key={bookId || index}
                className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#121f17]/90 shadow-lg transition-transform hover:-translate-y-1"
              >
                {/* Book Cover Image */}
                <div className="relative h-72 w-full overflow-hidden bg-black/40">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`Cover of ${book.title}`}
                      fill
                      unoptimized
                      loading={index < 3 ? "eager" : "lazy"}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-white/40">
                      <BookOpen className="size-10 opacity-40" />
                      <span className="mt-2 text-xs">No image available</span>
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="flex flex-1 flex-col p-5">
                  <span className="mb-2.5 w-fit rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/70">
                    {book.category || "Book"}
                  </span>

                  <h3 className="line-clamp-1 font-serif text-lg font-semibold text-white">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/55">
                    by {book.author || "Unknown"}
                  </p>

                  <div className="mt-auto pt-5">
                    <Link
                      href={`/books/${bookId}`}
                      className="block w-full rounded-lg bg-[#8fd3a7] py-2 text-center text-xs font-semibold text-[#102016] transition-colors hover:bg-[#a4e3b8]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* See All Books Button (কার্ডগুলোর নিচে কেন্দ্রস্থ বাটন) */}
        <div className="mt-12 text-center">
          <Link
            href="/books"
            className={cn(
              buttonVariants(),
              "border border-white/15 bg-white/5 px-6 text-sm text-white transition-colors hover:bg-white/10"
            )}
          >
            See All Books <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

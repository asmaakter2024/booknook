import { Star } from "lucide-react";

const reviews = [
  {
    name: "Ayesha Rahman",
    initials: "AR",
    book: "The Midnight Library",
    review:
      "A thoughtful, comforting read. I found myself thinking about it long after I finished.",
    rating: 5,
  },
  {
    name: "Tanvir Hasan",
    initials: "TH",
    book: "Atomic Habits",
    review:
      "Easy to follow and full of practical ideas. Borrowing it from the library was simple.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    initials: "NJ",
    book: "The Alchemist",
    review:
      "A lovely story about following your dreams. This is one I would happily read again.",
    rating: 4,
  },
];

export default function ReaderReviews() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-sm font-semibold text-emerald-700">
          Notes from our readers
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Reader reviews
        </h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          A few words from readers about the books they have enjoyed.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.name}
            className="flex h-full flex-col rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div
              className="flex gap-1 text-amber-500"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  aria-hidden="true"
                  className={`size-4 ${
                    index < review.rating ? "fill-current" : "text-stone-300"
                  }`}
                />
              ))}
            </div>

            <blockquote className="mt-5 flex-1 text-sm leading-7 text-stone-700">
              “{review.review}”
            </blockquote>

            <div className="mt-6 border-t border-stone-100 pt-5">
              <p className="text-sm font-semibold text-stone-900">
                {review.name}
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Read <span className="font-medium">{review.book}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

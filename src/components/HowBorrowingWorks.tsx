import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Choose a book",
    description: "Browse the library and find a book you’d like to read.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Request to borrow",
    description: "Open the book page and send your borrowing request.",
    icon: CheckCircle2,
  },
  {
    number: "03",
    title: "Enjoy your read",
    description: "Keep track of your borrowed books and return them on time.",
    icon: Clock3,
  },
];

export default function HowBorrowingWorks() {
  return (
    <section className="bg-[#f5f3ed]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16 lg:py-20">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            Simple from start to finish
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            How borrowing works
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-stone-600">
            Find something you love, request it from the library, and enjoy
            reading at your own pace.
          </p>

          <Button asChild className="mt-6 bg-[#315b43] hover:bg-[#254834]">
            <Link href="/books">
              Browse books <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <article
              key={number}
              className="flex gap-4 rounded-xl border border-stone-200 bg-white p-5 sm:gap-5 sm:p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-800">
                <Icon className="size-5" aria-hidden="true" />
              </span>

              <div>
                <p className="text-xs font-semibold tracking-wider text-emerald-700">
                  STEP {number}
                </p>
                <h3 className="mt-1 font-serif text-lg font-semibold text-stone-900">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
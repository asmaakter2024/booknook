import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-[#0b1712] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
        {/* Brand and description */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-[#8fd3a7] text-[#0b1712]">
              <BookOpen className="size-[18px]" aria-hidden="true" />
            </span>
            <span className="font-serif text-xl font-semibold">BookNook</span>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
            A small neighbourhood library on the web. Share the books on your
            shelf and borrow the ones you have been meaning to read.
          </p>
        </div>

        {/* Contact details */}
        <div>
          <h2 className="font-serif text-lg font-semibold">Contact</h2>

          <address className="mt-4 space-y-3 not-italic text-sm text-white/60">
            <a
              href="mailto:hello@booknook.app"
              className="flex items-center gap-2 transition-colors hover:text-[#a8e1b9]"
            >
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              hello@booknook.app
            </a>

            <a
              href="tel:+8801700000000"
              className="flex items-center gap-2 transition-colors hover:text-[#a8e1b9]"
            >
              <Phone className="size-4 shrink-0" aria-hidden="true" />
              +880 1700 000 000
            </a>

            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              12 Reading Lane, Dhaka
            </p>
          </address>
        </div>

        {/* Social links */}
        <div>
          <h2 className="font-serif text-lg font-semibold">Follow us</h2>

          <div className="mt-4 flex gap-3">
            <a
              href="https://x.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="BookNook on X"
              className="grid size-9 place-items-center rounded-full bg-black/25 text-white/70 transition-colors hover:bg-[#8fd3a7] hover:text-[#0b1712]"
            >
              <span className="text-sm font-semibold" aria-hidden="true">
                𝕏
              </span>
            </a>

            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="BookNook on Facebook"
              className="grid size-9 place-items-center rounded-full bg-black/25 text-white/70 transition-colors hover:bg-[#8fd3a7] hover:text-[#0b1712]"
            >
              <span aria-hidden="true" className="text-sm font-bold">
                f
              </span>
            </a>

            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="BookNook on Instagram"
              className="grid size-9 place-items-center rounded-full bg-black/25 text-white/70 transition-colors hover:bg-[#8fd3a7] hover:text-[#0b1712]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-4"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="18"
                  cy="6"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/45">
        © {currentYear} BookNook. All rights reserved.
      </div>
    </footer>
  );
}

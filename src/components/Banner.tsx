"use client";

import Link from "next/link";
import { useSwiper } from "swiper/react";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const slides = [
  {
    image: "/images/banner1.jpg",
    alt: "A reader exploring a library full of books",
    eyebrow: "For every kind of curious",
    title: "A world waiting on every shelf.",
    description:
      "Find the book that feels like it was waiting for you—from stories that stay with you to ideas that change your view.",
  },
  {
    image: "/images/banner2.jpg",
    alt: "Young readers sharing a book in a library",
    eyebrow: "Little readers, big imaginations",
    title: "Big stories for growing minds.",
    description:
      "Make room for wonder, laughter, and one-more-chapter nights with books young readers will love.",
  },
  {
    image: "/images/banner3.jpg",
    alt: "A reader relaxing with an open book",
    eyebrow: "Slow down, turn a page",
    title: "Make room for a new favorite.",
    description:
      "Settle into a fresh story, meet a new perspective, and let a good book take you somewhere unexpected.",
  },
];

function SlideControls() {
  const swiper = useSwiper();

  return (
    <div className="absolute bottom-6 right-6 z-20 flex gap-2 sm:bottom-8 sm:right-10">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Previous slide"
        className="rounded-full border-white/50 bg-black/20 text-white hover:bg-white hover:text-black"
        onClick={() => swiper.slidePrev()}
      >
        <span aria-hidden="true">←</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Next slide"
        className="rounded-full border-white/50 bg-black/20 text-white hover:bg-white hover:text-black"
        onClick={() => swiper.slideNext()}
      >
        <span aria-hidden="true">→</span>
      </Button>
    </div>
  );
}

export default function Banner() {
  return (
    <section aria-label="Featured books" className="px-3 py-4 sm:px-6">
      <Swiper
        modules={[A11y, Autoplay, Pagination]}
        loop
        speed={700}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        className="book-banner overflow-hidden rounded-xl"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.image}>
            <div className="relative flex min-h-[570px] items-center sm:min-h-[620px]">
              <Image
                src={slide.image}
                alt={slide.alt}
                width={500}
                height={500}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/10" />

              <div className="relative z-10 max-w-2xl px-7 py-20 text-white sm:px-14 lg:px-24">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">
                  {slide.eyebrow}
                </p>

                <h1 className="font-serif text-4xl leading-tight sm:text-6xl">
                  {slide.title}
                </h1>

                <p className="mt-5 max-w-lg text-sm leading-7 text-white/85 sm:text-base">
                  {slide.description}
                </p>

                <Button className="mt-7 bg-amber-100 text-stone-900 hover:bg-white">
                  <Link href="/books">
                    Browse Books <span aria-hidden="true">→</span>
                  </Link>
                </Button>
              </div>

              <SlideControls />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .book-banner .swiper-pagination {
          bottom: 2rem !important;
          left: 2rem !important;
          width: auto !important;
          text-align: left;
        }

        .book-banner .swiper-pagination-bullet {
          width: 24px;
          height: 3px;
          border-radius: 2px;
          background: white;
          opacity: 0.55;
        }

        .book-banner .swiper-pagination-bullet-active {
          width: 40px;
          background: #fef3c7;
          opacity: 1;
        }

        @media (max-width: 640px) {
          .book-banner .swiper-pagination {
            bottom: 1.75rem !important;
            left: 1.75rem !important;
          }
        }
      `}</style>
    </section>
  );
}

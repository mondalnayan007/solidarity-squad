import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "../data/catalog";

export default function ShopBySport() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // ম্যানুয়াল এবং অটো স্ক্রল ফাংশন
  const handleScroll = (direction = "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = 320; // প্রতিবার কতটুকু স্লাইড হবে
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (direction === "right") {
      if (el.scrollLeft >= maxScroll - 10) {
        // একদম শেষে চলে গেলে স্মুথলি শুরুতে ফিরে আসবে
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    } else {
      if (el.scrollLeft <= 10) {
        el.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  // প্রতি ৩.৫ সেকেন্ড পরপর অটো-স্লাইড হবে
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleScroll("right");
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      className="mx-auto mt-10 max-w-7xl px-4 lg:px-8"
      aria-label="Shop by sport"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header + Controls */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">
            Explore Disciplines
          </span>
          <h2 className="font-display mt-0.5 text-3xl font-extrabold leading-none">
            Shop by <span className="text-brand">sport</span>
          </h2>
          <p className="mt-1 text-xs text-mut">
            26+ categories, one squad — tailored for match day &amp; training.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Slider Prev / Next Arrows */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
              className="grid h-8 w-8 place-items-center rounded-full border border-line bg-surf text-ink transition hover:border-brand hover:bg-brand hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
              className="grid h-8 w-8 place-items-center rounded-full border border-line bg-surf text-ink transition hover:border-brand hover:bg-brand hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Link
            to="/shop"
            className="flex items-center gap-1 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-extrabold text-brand transition-all hover:gap-2 hover:bg-brand hover:text-white"
          >
            All 27 disciplines <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Auto-Sliding Category Rail */}
      <div
        ref={scrollRef}
        className="nice-scroll -mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 py-2 scroll-smooth"
      >
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to={`/shop?cat=${c.id}`}
            className="group relative flex w-28 shrink-0 snap-start flex-col items-center gap-2.5 rounded-2xl border border-line bg-surf p-3.5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-md sm:w-32"
          >
            {/* Emoji Badge */}
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-bg text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand/10">
              {c.emoji}
            </div>

            {/* Category Name */}
            <span className="line-clamp-1 text-xs font-extrabold tracking-tight text-ink transition-colors group-hover:text-brand">
              {c.name}
            </span>

            {/* Subtle Bottom Accent Bar on Hover */}
            <span className="absolute bottom-0 h-1 w-0 rounded-full bg-brand transition-all duration-300 group-hover:w-10" />
          </Link>
        ))}
      </div>
    </section>
  );
}
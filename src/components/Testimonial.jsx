import { useEffect, useRef, useState } from "react";
import { Star, ChevronRight, ChevronLeft, Quote } from "lucide-react";
import { TESTIMONIALS } from "../data/catalog";

export default function Testimonial() {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 420, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gray-50/70 py-20 lg:py-28 dark:bg-[#0b130e]">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        
        {/* ── Header & Manual Navigation Controls ── */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 mb-3">
              ⭐ Client Reviews
            </span>
            <h2 className="font-display text-4xl font-black tracking-tight text-gray-900 md:text-5xl dark:text-white">
              What Our <span className="text-emerald-600 dark:text-emerald-400">Clients Say</span>
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Real feedback from sports enthusiasts and verified buyers across Bangladesh.
            </p>
          </div>

          <div className="hidden gap-3 md:flex">
            <button 
              onClick={() => scroll("left")}
              aria-label="Previous slide"
              className="grid h-12 w-12 place-items-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white dark:border-white/10 dark:bg-[#16251e] dark:text-gray-200 dark:hover:bg-emerald-500 dark:hover:border-emerald-500"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scroll("right")}
              aria-label="Next slide"
              className="grid h-12 w-12 place-items-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white dark:border-white/10 dark:bg-[#16251e] dark:text-gray-200 dark:hover:bg-emerald-500 dark:hover:border-emerald-500"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Scrolling Container ── */}
        <div 
          className="relative -mx-4 px-4 lg:-mx-8 lg:px-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div 
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-8 overflow-x-auto pb-14 pt-14 pl-4 pr-12 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TESTIMONIALS.map((review) => (
              <div 
                key={review.id}
                className="relative flex w-[340px] shrink-0 snap-start sm:w-[410px]"
              >
                {/* ── Main Card Wrapper ── */}
                <div className="relative w-full transition-transform duration-500  hover:-translate-y-1.5">
                  
                  {/* Premium Speech Bubble Card with Distinct Light/Dark Backgrounds */}
                  <div className="relative min-h-[220px] w-full rounded-[2.5rem] border shadow-2xl border-gray-200/90 bg-white p-8 pl-[130px]  shadow-gray-400/60 backdrop-blur-md sm:pl-[145px] sm:py-9 sm:px-8 dark:border-white/10 dark:bg-[#15231c] dark:shadow-none">
                    
                    {/* Watermark Quote Icon */}
                    <Quote className="absolute right-6 top-6 h-10 w-10 text-emerald-500/10 dark:text-emerald-400/10 pointer-events-none" />

                    <h3 className="font-display text-xs font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                      Verified Review
                    </h3>
                    
                    <p className="mt-3 text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                      "{review.text}"
                    </p>
                    
                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/10">
                      <span className="text-xs font-extrabold text-gray-400">
                        Solidarity Squad Customer
                      </span>
                      <span className="text-sm font-black text-gray-900 dark:text-white">
                        @{review.name.replace(/\s+/g, '').toLowerCase()}
                      </span>
                    </div>
                  </div>

                  {/* Speech Bubble Tail */}
                  <div 
                    className="absolute -bottom-4 left-14 h-7 w-7 bg-white border-b border-r border-gray-200/90 dark:bg-[#15231c] dark:border-white/10"
                    style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                  />

                  {/* Overlapping Rating Stars Pill (Bottom Right) */}
                  <div className="absolute -bottom-4 right-8 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 shadow-lg shadow-emerald-600/25">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                          i < review.rating ? 'fill-amber-300 text-amber-300' : 'fill-white/30 text-white/30'
                        }`} 
                      />
                    ))}
                  </div>

                </div>

                {/* ── Overlapping Modern Arch Avatar (Top Left) ── */}
                <div className="absolute -left-3 -top-8 z-10 h-[145px] w-[105px] overflow-hidden rounded-t-[4rem] rounded-b-2xl border-4 border-white bg-gray-100 shadow-xl sm:h-[165px] sm:w-[115px] dark:border-[#111c17]">
                  <img 
                    src={review.avatar} 
                    alt={review.name} 
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  {/* Subtle Gradient Overlay on Avatar */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
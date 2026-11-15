import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    tag: "Cricket Season 2026",
    title: "OWN THE\nCREASE",
    sub: "English willow bats, leather balls & full kits from trusted brands. New stock every week.",
    cta: "Shop cricket",
    cat: "cricket",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Football, all in",
    title: "FULL TIME\nFEVER",
    sub: "Match balls, turf boots, goalkeeper gloves and BD team kits — pitch and street ready.",
    cta: "Shop football",
    cat: "football",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "BD Tigers Zone",
    title: "WEAR THE\nGREEN & RED",
    sub: "2026 home & away jerseys, flags, scarves. Free name printing on pre-orders.",
    cta: "Visit BD Tigers Zone",
    cat: "",
    href: "/bd-tigers",
    image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function HeroSlider() {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const s = SLIDES[slide];

  return (
    <div
      className="hero-beam relative min-h-[340px] overflow-hidden rounded-3xl p-6 text-white sm:min-h-[400px] sm:p-9 lg:col-span-2"
      role="region"
      aria-label="Featured campaigns"
    >
      {/* Background Unsplash Image + Gradient Overlay for text readability */}
      <img
        src={s.image}
        alt={s.tag}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-all duration-700"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />

      <div className="relative flex h-full min-h-[290px] max-w-md flex-col justify-end">
        <span className="mb-2 w-max rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gold backdrop-blur">
          {s.tag}
        </span>
        <h1 className="font-display whitespace-pre-line text-6xl font-extrabold leading-[0.95] drop-shadow-[0_4px_0_rgba(0,0,0,0.18)] sm:text-7xl">
          {s.title}
        </h1>
        <p className="mt-3 max-w-sm text-sm text-white/90 sm:text-base">{s.sub}</p>
        <div className="mt-5">
          <button onClick={() => navigate(s.href ?? `/shop?cat=${s.cat}`)} className="btn-squad">
            {s.cta} <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 flex items-center gap-4">
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-gold" : "w-3 bg-white/40"}`}
              />
            ))}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setSlide((slide + SLIDES.length - 1) % SLIDES.length)}
              className="grid h-8 w-8 place-items-center rounded-full border border-white/25 hover:bg-white/10"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSlide((slide + 1) % SLIDES.length)}
              className="grid h-8 w-8 place-items-center rounded-full border border-white/25 hover:bg-white/10"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Flag, Shirt, Users, CalendarDays, Trophy } from "lucide-react";
import { PRODUCTS } from "../data/catalog";
import ProductCard from "../components/ProductCard";

export default function BDTigers() {
  useEffect(() => {
    document.title = "BD Tigers Zone — National Team Jerseys & Fan Gear | Solidarity Squad";
  }, []);

  const tigers = PRODUCTS.filter((p) => p.brand === "BD Tigers");
  const jerseys = tigers.filter((p) => p.cat === "jerseys");
  const fanGear = tigers.filter((p) => p.cat !== "jerseys");

  return (
    <div className="bg-deep text-white">
      {/* ── Zone hero (With Background Image) ── */}
      <div className="relative overflow-hidden bg-[#04120b]">
        {/* Background Image & Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://wallpapers.com/images/hd/bangladesh-cricket-team-tigers-poster-0pq86uqebgdq9zn9.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04120b] via-[#04120b]/80 to-transparent" />
        
        {/* Faint Tiger Emoji in background */}
        <span className="pointer-events-none absolute -right-6 top-1/2 z-0 -translate-y-1/2 select-none text-[160px] opacity-[0.08] sm:text-[240px]">🐯</span>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.25em] text-gold backdrop-blur-sm">
            <Flame className="h-4 w-4" /> Official fan destination
          </span>
          <h1 className="font-display mt-4 text-6xl font-extrabold leading-[0.9] sm:text-8xl">
            BD <span className="text-gold">TIGERS</span><br />ZONE
          </h1>
          <p className="mt-4 max-w-md text-sm text-white/85 sm:text-base">
            Home of the tricolor — jerseys, fan kits, training wear and match-day content for every Bangladesh supporter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold text-white/90">
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 backdrop-blur-md">
              <Shirt className="h-4 w-4 text-gold" />Players &amp; fan editions
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 backdrop-blur-md">
              <Flag className="h-4 w-4 text-gold" />Flags, scarves &amp; combos
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 backdrop-blur-md">
              <Users className="h-4 w-4 text-gold" />Club &amp; academy bulk orders
            </span>
          </div>
        </div>
      </div>

      {/* ── Squad snapshot strip ── */}
      <div className="border-y border-white/10 bg-[#062b1c]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-3 text-center text-[11px] text-white/80 lg:px-8">
          <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4 text-gold" />ICC rankings: top-10 ODI side</span>
          <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-gold" />Next series: New Zealand tour · Dec 2026</span>
          <span className="flex items-center gap-1.5"><Flame className="h-4 w-4 text-gold" />World Cup pre-order: FREE name printing</span>
        </div>
      </div>

      {/* ── Jerseys ── */}
      <div className="bg-bg text-ink">
        <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-extrabold">TEAM <span className="text-brand">JERSEYS</span></h2>
            <Link to="/shop?cat=jerseys&sub=BD%20Tigers%20Jerseys" className="flex items-center gap-1 text-xs font-extrabold text-brand transition-all hover:gap-2">
              All jerseys <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
            {jerseys.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* ── Fan gear ── */}
        <section className="mx-auto max-w-7xl border-t border-line px-4 py-10 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-extrabold">FAN <span className="text-accent">GEAR</span></h2>
            <Link to="/shop?cat=accessories&sub=Caps%20%26%20Scarves" className="flex items-center gap-1 text-xs font-extrabold text-brand transition-all hover:gap-2">
              All fan gear <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
            {fanGear.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* ── Campaign content ── */}
      <section className="mx-auto max-w-7xl border-t border-line px-4 py-10 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-5">
            
            {/* ── Match-day ritual card with Background Image ── */}
            <div 
              className="relative flex flex-col justify-center overflow-hidden rounded-3xl p-6 text-white shadow-lg lg:col-span-3 sm:p-8"
              style={{
                backgroundImage: "linear-gradient(to right, rgba(4, 18, 11, 0.95) 0%, rgba(4, 18, 11, 0.6) 60%, rgba(4, 18, 11, 0.1) 100%), url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2000')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="relative z-10">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-gold drop-shadow-md">
                  Match-day ritual
                </p>
                <h3 className="font-display mt-2 text-4xl font-extrabold leading-none drop-shadow-lg sm:text-5xl">
                  GET TO THE<br />STADIUM EARLY.<br />SING LOUD.
                </h3>
                <p className="mt-3 max-w-sm text-sm font-medium text-white/95 drop-shadow-md">
                  Pick up your flag and scarf combo before gates open — the tricolor wave when the anthem plays.
                </p>
                <Link to="/campaign/world-cup" className="btn-squad mt-5 inline-flex items-center gap-2 !px-5 !py-2.5 text-xs shadow-md">
                  World Cup pre-order <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* ── Right side cards ── */}
            <div className="grid gap-4 lg:col-span-2">
              <div className="rounded-3xl border border-line bg-surf p-5">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-accent">Latest from the camp</p>
                <h3 className="mt-1 text-base font-extrabold">Training under lights — jersey testing notes</h3>
                <p className="mt-1 text-xs text-mut">How the 2026 kit handles a 90-minute sweat session at the Shere Bangla turf.</p>
                <Link to="/blog/jersey-care-tips" className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold text-brand hover:gap-2 transition-all">
                  Read article <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              
              <div className="rounded-3xl border border-gold/40 bg-[#fffbe8] p-5 dark:border-gold/20 dark:bg-[#2a2508]">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#8a6d00] dark:text-gold">Bulk &amp; academy</p>
                <h3 className="mt-1 text-base font-extrabold text-ink">Kits for your club or school?</h3>
                <p className="mt-1 text-xs text-mut">11+ pieces, full sublimation, free mock-up approval, 7–10 day delivery anywhere in Bangladesh.</p>
                <Link to="/contact" className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold text-brand hover:gap-2 transition-all">
                  Get a team quote <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            
          </div>
        </section>
      </div>
    </div>
  );
}
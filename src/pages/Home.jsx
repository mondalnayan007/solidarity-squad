import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Flame, Truck, ShieldCheck, BadgeCheck,
  Banknote, Zap, Star,
} from "lucide-react";
import { CATEGORIES, PRODUCTS } from "../data/catalog";
import ProductCard from "../components/ProductCard";
import HeroSlider from "../components/HeroSlider";
import FeatureBanner from "../components/FeatureBanner";
import ShopBySport from "../components/ShopBySport";
import FlashSaleBanner from "../components/FlashSaleBanner";

export default function Home() {
  const [tab, setTab] = useState("best");
  const [campaignEnd] = useState(() => Date.now() + 37 * 24 * 3600 * 1000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => { document.title = "Solidarity Squad | Cricket, Football & BD Tigers Gear in Bangladesh"; }, []);
  useEffect(() => {
    const id = setInterval(() => { setNow(Date.now()); }, 6000);
    return () => clearInterval(id);
  }, []);

  const cd = useMemo(() => {
    const d = Math.max(0, campaignEnd - now);
    return { days: Math.floor(d / 86400000), hrs: Math.floor((d % 86400000) / 3600000), mins: Math.floor((d % 3600000) / 60000) };
  }, [campaignEnd, now]);

  const shown = useMemo(() => {
    const list = tab === "new" ? PRODUCTS.filter((p) => p.isNew) : [...PRODUCTS].sort((a, b) => b.sold - a.sold);
    return list.slice(0, 8);
  }, [tab]);

  return (
    <>
      {/* ═══ HERO + campaign tiles ═══ */}
      <div className="mx-auto max-w-7xl px-4 pt-5 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Hero slider */}
          <HeroSlider />

          {/* Side tiles */}
          <div className="grid gap-4">
            <Link
              to="/campaign/world-cup"
              className="group relative flex min-h-[190px] flex-col justify-end overflow-hidden rounded-3xl p-6 text-white transition hover:-translate-y-0.5"
            >
              <img
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80"
                alt="World Cup Edition Fan Kits"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-amber-500/25" />

              <span className="relative text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold">
                World Cup Edition · Pre-order
              </span>
              <span className="font-display relative mt-1 text-3xl font-extrabold leading-none">
                UP TO 30% OFF
                <br />
                FAN KITS
              </span>
              <span className="relative mt-2 flex items-center gap-1 text-xs font-extrabold text-white">
                Grab the offer{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              to="/bd-tigers"
              className="group relative flex min-h-[190px] flex-col justify-end overflow-hidden rounded-3xl p-6 text-white transition hover:-translate-y-0.5"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCXYJSJ0FzyCV6H0dZkOALC2qR9KZHyeMIyHJqG6Z4LA&s=10"
                alt="Bangladesh Tigers Cricket Team"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06301f]/95 via-[#06301f]/55 to-[#b3231a]/30" />

              <span className="relative text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/85">
                BD Tigers 2026
              </span>
              <span className="font-display relative mt-1 text-3xl font-extrabold leading-none">
                JERSEYS
                <br />
                ARE IN
              </span>
              <span className="relative mt-2 flex items-center gap-1 text-xs font-extrabold text-gold">
                Shop the zone{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ Trust strip ═══ */}
      <div className="mx-auto mt-4 max-w-7xl px-4 lg:px-8">
        <FeatureBanner></FeatureBanner>
      </div>

      {/* ═══ Shop by sport rail ═══ */}
     <div>
      <ShopBySport></ShopBySport>
     </div>
        
      

      {/* ═══ Best sellers / New arrivals ═══ */}
      <section className="mx-auto mt-8 max-w-7xl px-4 lg:px-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-3xl font-extrabold leading-none">{tab === "best" ? "Best" : "New"} <span className="text-accent">{tab === "best" ? "sellers" : "arrivals"}</span></h2>
            <Flame className="h-6 w-6 text-accent" />
          </div>
          <div className="flex gap-2" role="tablist">
            <button role="tab" aria-selected={tab === "best"} onClick={() => setTab("best")} className={`chip ${tab === "best" ? "on" : ""}`}>🔥 Best sellers</button>
            <button role="tab" aria-selected={tab === "new"} onClick={() => setTab("new")} className={`chip ${tab === "new" ? "on" : ""}`}>✨ New arrivals</button>
            <Link to="/shop" className="chip">View all →</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 sm:gap-4 [&>*:nth-child(n+5)]:hidden sm:[&>*:nth-child(n+5)]:flex xl:[&>*]:flex">
          {shown.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ═══ World Cup campaign countdown ═══ */}
     <section className="mx-auto mt-10 max-w-7xl px-4 lg:px-8">
  <div 
    className="group relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-3xl bg-gray-950 p-6 text-white shadow-2xl sm:p-10 lg:flex-row lg:items-center lg:p-12"
    style={{
      backgroundImage: `linear-gradient(to right, rgba(11, 19, 14, 0.92) 0%, rgba(11, 19, 14, 0.75) 50%, rgba(11, 19, 14, 0.4) 100%), url('https://img1.hscicdn.com/image/upload/f_auto,t_ds_wide_w_800,q_50/lsci/db/PICTURES/CMS/414700/414715.6.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Ambient Glow Accent */}
    <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

    {/* Left Content Area */}
    <div className="relative z-10 max-w-xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-md border border-white/15 mb-4">
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
        <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-amber-400">
          World Cup Edition · Limited Pre-order
        </span>
      </div>

      <h2 className="font-display text-5xl font-black tracking-tight leading-[0.95] sm:text-6xl lg:text-7xl">
        WEAR THE <br />
        <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
          ROAR
        </span>
      </h2>

      <p className="mt-4 text-sm font-medium leading-relaxed text-gray-200 sm:text-base max-w-lg">
        Official-style jerseys, flags and fan kits. Pre-order now — get free name printing and free delivery anywhere in Bangladesh.
      </p>

      <div className="mt-6">
        <Link 
          to="/campaign/world-cup" 
          className="group/btn inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-7 py-4 text-sm font-extrabold text-gray-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/40 active:scale-95"
        >
          <span>Pre-order Now</span>
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
        </Link>
      </div>
    </div>

    {/* Right Countdown Timer Area */}
    <div 
      className="relative z-10 flex items-center gap-3.5 sm:gap-4 self-center lg:self-center" 
      aria-label="Campaign countdown"
    >
      {[[cd.days, "Days"], [cd.hrs, "Hrs"], [cd.mins, "Min"]].map(([v, label]) => (
        <div 
          key={label} 
          className="flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center backdrop-blur-md shadow-lg transition-transform duration-300 hover:scale-105 sm:px-7 sm:py-5"
        >
          <div className="font-display text-3xl font-black tabular-nums tracking-tight text-white sm:text-5xl">
            {String(v).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-300 sm:text-xs">
            {label}
          </div>
        </div>
      ))}
    </div>

  </div>
</section>

      {/* ═══ BD Tigers Zone ═══ */}
      
        <FlashSaleBanner></FlashSaleBanner>
  

      {/* ═══ From the blog ═══ */}
      <section className="mx-auto mt-10 max-w-7xl px-4 lg:px-8">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-3xl font-extrabold leading-none">From the <span className="text-accent">blog</span></h2>
          <Link to="/blog" className="flex items-center gap-1 text-xs font-extrabold text-brand hover:gap-2 transition-all">All articles <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { slug: "how-to-pick-cricket-bat", tag: "Buying guide", title: "How to pick the right cricket bat", excerpt: "Willow grades, weight and pick-up explained in plain words." },
            { slug: "home-gym-starter-plan", tag: "Fitness", title: "A 4-week home gym starter plan", excerpt: "Dumbbells, bands and a simple weekly schedule for beginners." },
            { slug: "world-cup-2026-preview", tag: "Campaign", title: "World Cup 2026: kit preview", excerpt: "Home, away and third kits — and how pre-order pricing works." },
          ].map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="card-surface group p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent">{post.tag}</span>
              <h3 className="mt-1.5 text-base font-extrabold leading-snug group-hover:text-brand">{post.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-xs text-mut">{post.excerpt}</p>
              <span className="mt-3 flex items-center gap-1 text-[11px] font-extrabold text-brand">Read article <ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ Payment & delivery partners ═══ */}
      <div className="mx-auto mt-10 max-w-7xl px-4 pb-4 lg:px-8">
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surf p-4 text-center">
          <div className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-widest text-mut"><Star className="h-4 w-4 fill-gold text-gold" /> Trusted by 25,000+ players across Bangladesh</div>
          <div className="flex flex-wrap justify-center gap-2 text-[10px] font-bold text-ink">
            {["SSLCommerz IPN verified", "bKash & Nagad", "Pathao · Steadfast", "COD available"].map((x) => <span key={x} className="rounded-full bg-bg px-3 py-1">{x}</span>)}
          </div>
        </div>
      </div>
    </>
  );
}
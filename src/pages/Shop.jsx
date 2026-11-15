import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X, SearchX } from "lucide-react";
import { CATEGORIES, BRANDS, GRADES, PRODUCTS, discountPercent } from "../data/catalog";
import ProductCard from "../components/ProductCard";
import { useStore } from "../context/StoreContext";

const PER_PAGE = 12;
const PRICE_BANDS = [
  { id: "", label: "All prices" },
  { id: "0-1000", label: "Under ৳1,000" },
  { id: "1000-3000", label: "৳1,000 – ৳3,000" },
  { id: "3000-6000", label: "৳3,000 – ৳6,000" },
  { id: "6000-1000000", label: "Above ৳6,000" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang } = useStore();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "";
  const sub = searchParams.get("sub") || "";
  const brand = searchParams.get("brand") || "";
  const band = searchParams.get("price") || "";
  const variant = searchParams.get("variant") || "";
  const onSale = searchParams.get("sale") === "1";
  const minRating = Number(searchParams.get("rating") || 0);
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, Number(searchParams.get("page") || 1));

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next, { replace: true });
  };
  const clearAll = () => setSearchParams({}, { replace: true });

  const catObj = CATEGORIES.find((c) => c.id === cat);
  useEffect(() => { document.title = `${q ? `Search: ${q}` : catObj?.name ?? "Shop All Gear"} | Solidarity Squad`; }, [q, catObj?.name]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (cat && p.cat !== cat) return false;
      if (sub && (p.sub !== sub && !p.name.toLowerCase().includes(sub.toLowerCase()))) return false;
      if (brand && p.brand !== brand) return false;
      if (onSale && !p.mrp) return false;
      if (minRating && p.rating < minRating) return false;
      if (variant && !p.variants?.includes(variant)) return false;
      if (band) { const [lo, hi] = band.split("-").map(Number); if (p.price < lo || p.price > hi) return false; }
      if (q) {
        const hay = `${p.name} ${p.brand} ${p.cat} ${p.sub ?? ""}`.toLowerCase();
        if (!q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "popular": list = [...list].sort((a, b) => b.sold - a.sold); break;
      case "discount": list = [...list].sort((a, b) => discountPercent(b) - discountPercent(a)); break;
      default: list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.id - a.id);
    }
    return list;
  }, [cat, sub, brand, band, variant, onSale, minRating, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const curPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((curPage - 1) * PER_PAGE, curPage * PER_PAGE);

  const allVariants = useMemo(() => [...new Set(PRODUCTS.flatMap((p) => p.variants ?? []))].sort(), []);
  const activeCount = [cat, sub, brand, band, variant, onSale ? "1" : "", minRating ? "1" : ""].filter(Boolean).length;

  const FilterPanel = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-ink"><SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] text-white">{activeCount}</span>}</h2>
        {activeCount > 0 && <button onClick={clearAll} className="flex items-center gap-1 text-xs font-bold text-accent hover:underline"><X className="h-3.5 w-3.5" />Clear all</button>}
      </div>

      {/* Category */}
      <fieldset>
        <legend className="mb-1.5 text-xs font-extrabold text-ink">Sport / Category</legend>
        <div className="max-h-56 space-y-1 overflow-y-auto nice-scroll pr-1">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-bg">
            <input type="radio" name="cat" checked={!cat} onChange={() => setParam("cat", "")} className="accent-[#0b5d3b]" /> All sports
          </label>
          {CATEGORIES.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-bg">
              <input type="radio" name="cat" checked={cat === c.id} onChange={() => setParam("cat", c.id)} className="accent-[#0b5d3b]" />
              <span>{c.emoji}</span><span className="flex-1">{c.name}</span>
              <span className="text-[10px] text-mut">{PRODUCTS.filter((p) => p.cat === c.id).length}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Sub-category (when a category is active) */}
      {catObj && (
        <fieldset>
          <legend className="mb-1.5 text-xs font-extrabold text-ink">Sub-category</legend>
          <div className="flex flex-wrap gap-1.5">
            {catObj.subs.map((s) => (
              <button key={s} onClick={() => setParam("sub", sub === s ? "" : s)} className={`chip !px-2.5 !py-1 !text-[11px] ${sub === s ? "on" : ""}`}>{s}</button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Brand */}
      <fieldset>
        <legend className="mb-1.5 text-xs font-extrabold text-ink">Brand</legend>
        <select className="field" value={brand} onChange={(e) => setParam("brand", e.target.value)} aria-label="Brand">
          <option value="">All brands</option>
          {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </fieldset>

      {/* Price band */}
      <fieldset>
        <legend className="mb-1.5 text-xs font-extrabold text-ink">Price range</legend>
        <div className="space-y-1">
          {PRICE_BANDS.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-bg">
              <input type="radio" name="price" checked={band === b.id} onChange={() => setParam("price", b.id)} className="accent-[#0b5d3b]" />{b.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Variant / Size / Grade */}
      <fieldset>
        <legend className="mb-1.5 text-xs font-extrabold text-ink">Size / Grade / Variant</legend>
        <select className="field" value={variant} onChange={(e) => setParam("variant", e.target.value)} aria-label="Size, grade or variant">
          <option value="">All sizes &amp; grades</option>
          {(cat ? [...new Set(PRODUCTS.filter((p) => p.cat === cat).flatMap((p) => p.variants ?? []))].sort() : [...allVariants, ...GRADES]).map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </fieldset>

      {/* Rating & Sale */}
      <fieldset>
        <legend className="mb-1.5 text-xs font-extrabold text-ink">More</legend>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-bg">
          <input type="radio" name="rating" checked={minRating === 4} onChange={() => setParam("rating", minRating === 4 ? "" : "4")} className="accent-[#0b5d3b]" />★ 4+ rating
        </label>
        <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-bg">
          <input type="checkbox" checked={onSale} onChange={(e) => setParam("sale", e.target.checked ? "1" : "")} className="accent-[#0b5d3b]" />On sale only
        </label>
      </fieldset>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
      {/* Breadcrumb + heading */}
      <nav className="mb-2 flex items-center gap-1.5 text-[11px] text-mut" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand">Home</Link><ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-ink">{q ? `Search: “${q}”` : catObj ? catObj.name : "Shop All Gear"}</span>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-none">
            {q ? <>Results for <span className="text-brand">“{q}”</span></> : catObj ? <>{catObj.emoji} {catObj.name}</> : "Shop All Gear"}
          </h1>
          <p className="mt-1 text-xs text-mut">{filtered.length} product{filtered.length === 1 ? "" : "s"}{catObj ? ` in ${catObj.name}` : " across 27 disciplines"}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFiltersOpen((v) => !v)} className="btn-ghost !py-2 text-xs lg:hidden" aria-expanded={filtersOpen}>
            <SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          <label className="sr-only" htmlFor="sort">Sort</label>
          <select id="sort" value={sort} onChange={(e) => setParam("sort", e.target.value)} className="field !w-auto !py-2 text-xs font-bold">
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top rated</option>
            <option value="popular">Most popular</option>
            <option value="discount">Biggest discount</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden self-start rounded-2xl border border-line bg-surf p-4 lg:block">{FilterPanel}</aside>
        {/* Mobile filter sheet */}
        {filtersOpen && (
          <div className="rounded-2xl border border-line bg-surf p-4 lg:hidden">
            {FilterPanel}
            <button onClick={() => setFiltersOpen(false)} className="btn-brand mt-3 w-full">Show {filtered.length} results</button>
          </div>
        )}

        {/* Grid */}
        <section>
          {pageItems.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-20 text-center">
              <SearchX className="h-12 w-12 text-mut" />
              <h2 className="font-display text-2xl font-bold">Nothing matches</h2>
              <p className="max-w-xs text-sm text-mut">Try a different keyword, or clear some filters to see more gear.</p>
              <button onClick={clearAll} className="btn-brand mt-1">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 sm:gap-4">
              {pageItems.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Pagination">
              <button onClick={() => setParam("page", String(curPage - 1))} disabled={curPage === 1} className="btn-ghost !px-3 disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-5 w-5" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setParam("page", String(n))} aria-current={n === curPage ? "page" : undefined}
                  className={`h-10 w-10 rounded-xl text-sm font-extrabold transition ${n === curPage ? "bg-brand text-white dark:text-[#04120b]" : "border border-line bg-surf hover:border-brand"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setParam("page", String(curPage + 1))} disabled={curPage === totalPages} className="btn-ghost !px-3 disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-5 w-5" /></button>
            </nav>
          )}
        </section>
      </div>
      {lang === "bn" && <p className="mt-6 text-center text-xs text-mut">বাংলা সাপোর্ট — প্রোডাক্ট, দাম ও রিভিউ ইংরেজিতে দেখানো হচ্ছে।</p>}
    </div>
  );
}

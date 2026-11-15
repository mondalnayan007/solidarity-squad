import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight, Star, Truck, ShieldCheck, RotateCcw, Minus, Plus, ShoppingCart,
  Zap, Heart, BadgeCheck, Package, ChevronDown,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { productById, relatedProducts, formatBDT, discountPercent, REVIEWS_POOL } from "../data/catalog";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const p = productById(id);
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist, viewProduct, recentlyViewed, toast } = useStore();
  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [activeThumb, setActiveThumb] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const [review, setReview] = useState({ rating: 5, text: "" });
  const [userReviews, setUserReviews] = useState([]);
  const galleryRef = useRef(null);

  // Reset per-product UI when the route id changes (adjust-during-render)
  const [prevId, setPrevId] = useState(p?.id);
  if (p?.id !== prevId) {
    setPrevId(p?.id);
    setVariant(p?.variants?.[0] ?? null);
    setQty(1);
    setTab("desc");
    setActiveThumb(0);
    setUserReviews([]);
  }

  useEffect(() => {
    if (p) {
      viewProduct(p.id);
      document.title = `${p.name} | Solidarity Squad`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p?.id]);

  const related = useMemo(() => (p ? relatedProducts(p, 4) : []), [p]);
  const recent = useMemo(
    () => recentlyViewed.filter((x) => x !== p?.id).map(productById).filter(Boolean).slice(0, 4),
    [recentlyViewed, p?.id]
  );
  const [deliveryEta] = useState(() =>
    new Date(Date.now() + 2 * 86400000).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })
  );

  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-extrabold">Product not found</h1>
        <p className="mt-2 text-mut">This product may have been removed or the link is broken.</p>
        <Link to="/shop" className="btn-brand mt-5">Browse all gear</Link>
      </div>
    );
  }

  const off = discountPercent(p);
  const wished = wishlist.includes(p.id);
  const reviews = [...userReviews, ...REVIEWS_POOL];
  const avgRating = p.rating;

  const onMouseMove = (e) => {
    const rect = galleryRef.current.getBoundingClientRect();
    setZoom({
      on: true,
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (review.text.trim().length < 10) return toast("Review must be at least 10 characters");
    setUserReviews((r) => [
      { author: "You · Verified buyer", rating: review.rating, date: new Date().toISOString().slice(0, 10), text: review.text.trim(), verified: true },
      ...r,
    ]);
    setReview({ rating: 5, text: "" });
    toast("Review submitted — pending moderation");
  };

  // থাম্বনেইল ভিউগুলোর জন্য হালকা ভ্যারিয়েশন (Zoom/Crop অ্যাঙ্গেল)
  const thumbAngles = [
    "object-center scale-100",
    "object-top scale-125",
    "object-bottom scale-125",
    "object-center scale-150",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
      <nav className="mb-3 flex flex-wrap items-center gap-1 text-[11px] text-mut" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand">Home</Link><ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-brand">Shop</Link><ChevronRight className="h-3 w-3" />
        <Link to={`/shop?cat=${p.cat}`} className="hover:text-brand capitalize">{p.cat}</Link><ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-ink">{p.sub}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Gallery with hover zoom ── */}
        <div>
          <div
            ref={galleryRef}
            onMouseMove={onMouseMove}
            onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
            className="relative aspect-square overflow-hidden rounded-3xl border border-line"
            style={{ background: p.bg }}
            role="img"
            aria-label={p.name}
          >
            {off > 0 && <span className="badge-sale z-10 !text-sm">−{off}%</span>}
            <img
              src={p.image}
              alt={p.name}
              className={`h-full w-full object-cover transition-transform duration-150 ${!zoom.on ? thumbAngles[activeThumb] : ""}`}
              style={zoom.on ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : {}}
            />
            <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur">
              Hover to zoom
            </span>
          </div>

          {/* 4 Thumbnail views */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {thumbAngles.map((angleClass, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveThumb(i)}
                className={`aspect-square overflow-hidden rounded-2xl border-2 transition ${
                  activeThumb === i ? "border-brand ring-2 ring-brand/30" : "border-line opacity-75 hover:border-brand hover:opacity-100"
                }`}
                style={{ background: p.bg }}
                aria-label={`View angle ${i + 1}`}
              >
                <img
                  src={p.image}
                  alt={`${p.name} view ${i + 1}`}
                  className={`h-full w-full object-cover ${angleClass}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── Purchase panel ── */}
        <div className="flex flex-col">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-mut">{p.brand} · {p.sub}</span>
          <h1 className="font-display mt-1 text-4xl font-extrabold leading-[1.02] sm:text-5xl">{p.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1 font-bold text-ink">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? "fill-gold text-gold" : "text-line"}`} />
              ))}{" "}
              {avgRating}
            </span>
            <span className="text-mut">·</span>
            <span className="text-mut underline underline-offset-2">{p.reviews + userReviews.length} reviews</span>
            <span className="text-mut">·</span>
            <span className="text-mut">{p.sold.toLocaleString()} sold</span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="font-display text-5xl font-extrabold text-brand">{formatBDT(p.price)}</span>
            {p.mrp && <span className="pb-1.5 text-lg font-semibold text-mut line-through">{formatBDT(p.mrp)}</span>}
            {off > 0 && <span className="mb-1.5 rounded-full bg-accentsoft px-2.5 py-1 text-xs font-extrabold text-accent">SAVE {formatBDT(p.mrp - p.price)}</span>}
          </div>
          <p className="mt-0.5 text-[11px] text-mut">Inclusive of VAT · Price in BDT · EMI available on cards</p>

          {/* Stock status */}
          <div className="mt-3">
            {p.stock > 10 ? (
              <span className="flex w-max items-center gap-2 rounded-full bg-brandsoft px-3 py-1.5 text-xs font-bold text-good"><Package className="h-4 w-4" /> In stock · ships in 24 hours</span>
            ) : p.stock > 0 ? (
              <span className="flex w-max items-center gap-2 rounded-full bg-[#fde9c4] px-3 py-1.5 text-xs font-bold text-warn"><Package className="h-4 w-4" /> Only {p.stock} left — order soon</span>
            ) : (
              <span className="flex w-max items-center gap-2 rounded-full bg-accentsoft px-3 py-1.5 text-xs font-bold text-accent">Out of stock — notify me</span>
            )}
          </div>

          {/* Variants */}
          {p.variants?.length > 0 && (
            <fieldset className="mt-4">
              <legend className="mb-1.5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink">
                {p.grade ? "Grade / Size" : "Size / Variant"} <ChevronDown className="h-4 w-4" />
                <span className="normal-case text-mut">— selected: <b className="text-brand">{variant}</b></span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {p.variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    aria-pressed={variant === v}
                    className={`min-w-14 rounded-xl border px-4 py-2 text-sm font-bold transition ${
                      variant === v ? "border-brand bg-brand text-white dark:text-[#04120b]" : "border-line bg-surf hover:border-brand"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {p.grade && <p className="mt-1.5 text-[11px] text-mut">Grade: <b>{p.grade}</b></p>}
            </fieldset>
          )}

          {/* Qty + CTA */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center rounded-xl border border-line" aria-label="Quantity">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-full w-11 place-items-center" aria-label="Decrease quantity"><Minus className="h-5 w-5" /></button>
              <input
                type="number"
                min={1}
                max={p.stock}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(p.stock, Number(e.target.value) || 1)))}
                className="h-full w-14 border-0 bg-transparent text-center font-bold outline-none"
                aria-label="Quantity"
              />
              <button onClick={() => setQty((q) => Math.min(p.stock, q + 1))} className="grid h-full w-11 place-items-center" aria-label="Increase quantity"><Plus className="h-5 w-5" /></button>
            </div>
            <button onClick={() => addToCart(p.id, variant, qty)} disabled={p.stock === 0} className="btn-brand h-12 !px-6 text-base disabled:opacity-40">
              <ShoppingCart className="h-5 w-5" /> Add to Cart
            </button>
            <button onClick={() => { addToCart(p.id, variant, qty); navigate("/checkout"); }} disabled={p.stock === 0} className="btn-red h-12 disabled:opacity-40">
              <Zap className="h-5 w-5" /> Buy Now
            </button>
            <button onClick={() => toggleWishlist(p.id)} aria-pressed={wished} aria-label="Toggle wishlist" className="grid h-12 w-12 place-items-center rounded-xl border border-line hover:border-accent">
              <Heart className={`h-6 w-6 ${wished ? "fill-accent text-accent" : ""}`} />
            </button>
          </div>

          {/* Delivery promise */}
          <div className="mt-5 grid gap-2 rounded-2xl border border-line bg-bg p-4 text-xs">
            <p className="flex items-center gap-2"><Truck className="h-4 w-4 shrink-0 text-brand" /><span><b>Order today, get by {deliveryEta}</b> — Express in Dhaka, 2–4 days nationwide. FREE over ৳5,000.</span></p>
            <p className="flex items-center gap-2"><RotateCcw className="h-4 w-4 shrink-0 text-brand" /><span><b>7-day easy return</b> — change of mind accepted on unused items with tags.</span></p>
            <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-brand" /><span><b>100% authentic</b> — authorised dealer, official warranty on all bats &amp; gear.</span></p>
          </div>
        </div>
      </div>

      {/* ═══ Tabs: Description / Specs / Reviews ═══ */}
      <div className="mt-8 rounded-3xl border border-line bg-surf">
        <div role="tablist" className="flex border-b border-line">
          {[["desc", "Description"], ["specs", "Specification"], ["reviews", `Reviews (${p.reviews + userReviews.length})`]].map(([k, label]) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={`px-5 py-4 text-sm font-extrabold transition ${tab === k ? "border-b-2 border-brand text-brand" : "text-mut hover:text-ink"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="p-5">
          {tab === "desc" && (
            <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-ink">
              <p>{p.desc}</p>
              <p>Every unit is stocked from our Dhaka warehouse with quality checks before dispatch. Need bulk quantity for a club or academy? <Link to="/contact" className="font-bold text-brand hover:underline">Get a team discount →</Link></p>
            </div>
          )}
          {tab === "specs" && (
            <div className="max-w-2xl overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(p.specs ?? { Material: "—" }).map(([k, v]) => (
                    <tr key={k} className="border-b border-line last:border-0">
                      <th className="w-1/3 bg-bg px-4 py-2.5 text-left align-top text-xs font-extrabold uppercase text-mut">{k}</th>
                      <td className="px-4 py-2.5 font-medium">{v}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-line"><th className="w-1/3 bg-bg px-4 py-2.5 text-left text-xs font-extrabold uppercase text-mut">SKU</th><td className="px-4 py-2.5 font-mono text-xs">SS-{String(p.id).padStart(5, "0")}</td></tr>
                </tbody>
              </table>
            </div>
          )}
          {tab === "reviews" && (
            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              {/* Summary + write review */}
              <div className="rounded-2xl border border-line bg-bg p-5">
                <div className="flex items-center gap-4">
                  <div className="font-display text-6xl font-extrabold text-brand">{avgRating}</div>
                  <div>
                    <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`h-5 w-5 ${s <= Math.round(avgRating) ? "fill-gold text-gold" : "text-line"}`} />)}</div>
                    <p className="mt-1 text-xs font-semibold text-mut">{p.reviews + userReviews.length} verified reviews</p>
                  </div>
                </div>
                <form onSubmit={submitReview} className="mt-4 border-t border-line pt-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-ink">Write a review</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setReview((r) => ({ ...r, rating: s }))} aria-label={`${s} star`}>
                        <Star className={`h-6 w-6 ${s <= review.rating ? "fill-gold text-gold" : "text-line"}`} />
                      </button>
                    ))}
                  </div>
                  <textarea value={review.text} onChange={(e) => setReview((r) => ({ ...r, text: e.target.value }))} rows={3} placeholder="How was the quality and delivery?" className="field mt-2" />
                  <button type="submit" className="btn-brand mt-2 w-full">Submit review</button>
                  <p className="mt-1.5 text-[10px] text-mut">Reviews are published after admin moderation. Verified buyers get a ✓ badge.</p>
                </form>
              </div>
              {/* Review list */}
              <ul className="space-y-3">
                {reviews.map((r, i) => (
                  <li key={i} className="rounded-2xl border border-line p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-brandsoft text-sm font-extrabold text-brand">{r.author[0]}</span>
                      <div>
                        <p className="flex items-center gap-1.5 text-sm font-bold">{r.author}{r.verified && <BadgeCheck className="h-4 w-4 text-good" aria-label="Verified purchase" />}</p>
                        <div className="flex items-center gap-2 text-[11px] text-mut">
                          <span className="flex gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-gold text-gold" : "text-line"}`} />)}</span>
                          <span>{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{r.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Related products ═══ */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-3xl font-extrabold">Related <span className="text-brand">products</span></h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
        </section>
      )}

      {/* ═══ Recently viewed ═══ */}
      {recent.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-3xl font-extrabold">Recently <span className="text-accent">viewed</span></h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">{recent.map((r) => <ProductCard key={r.id} product={r} />)}</div>
        </section>
      )}
    </div>
  );
}
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, Tag, Truck, ArrowRight, ShoppingBag } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { COUPONS, DISTRICTS, FREE_DELIVERY_ABOVE, deliveryFee, formatBDT, productById } from "../data/catalog";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, toast, t } = useStore();
  const [district, setDistrict] = useState("Dhaka");
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);
  const navigate = useNavigate();

  const lines = useMemo(() => cart.map((l) => {
    const p = productById(l.id);
    return p ? { ...l, product: p } : null;
  }).filter(Boolean), [cart]);

  const subtotal = lines.reduce((a, l) => a + l.product.price * l.qty, 0);
  const activeCoupon = applied ? COUPONS.find((c) => c.code === applied) : null;
  const freeShip = activeCoupon?.code === "FREESHIP";
  const delivery = subtotal === 0 ? 0 : freeShip || subtotal >= FREE_DELIVERY_ABOVE ? 0 : deliveryFee(district, subtotal);
  const discount = activeCoupon ? (activeCoupon.type === "percent" ? Math.round(subtotal * activeCoupon.value / 100) : Math.min(activeCoupon.value, subtotal)) : 0;
  const total = Math.max(0, subtotal + delivery - discount);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code === code);
    if (!found || found.status !== "Active") { setApplied(null); toast("Invalid or paused coupon code"); return; }
    if (subtotal < (found.min || 0)) { toast(`Minimum order ${formatBDT(found.min)} for ${code}`); return; }
    setApplied(code);
    toast(`Coupon applied: ${code}`);
  };

  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={() => setCartOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surf shadow-2xl">
        <div className="flex items-center justify-between border-b border-line p-4">
          <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><ShoppingBag className="h-6 w-6 text-brand" /> {t.cart} <span className="text-mut">({lines.length})</span></h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="grid h-10 w-10 place-items-center rounded-xl hover:bg-bg"><X className="h-6 w-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 nice-scroll">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="text-6xl">🛒</span>
              <p className="font-bold">Your cart is empty</p>
              <p className="text-sm text-mut">Add bats, jerseys or gym gear to get started.</p>
              <button onClick={() => { setCartOpen(false); navigate("/shop"); }} className="btn-brand mt-2">Browse gear <ArrowRight className="h-4 w-4" /></button>
            </div>
          ) : lines.map((l) => (
            <div key={`${l.id}-${l.variant}`} className="mb-3 flex gap-3 rounded-2xl border border-line p-2.5">
              <Link to={`/product/${l.product.id}`} onClick={() => setCartOpen(false)}
                className="grid h-20 w-20 shrink-0 place-items-center rounded-xl text-4xl" style={{ background: l.product.bg }}>
                {l.product.emoji}
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${l.product.id}`} onClick={() => setCartOpen(false)} className="line-clamp-2 text-sm font-bold hover:text-brand">{l.product.name}</Link>
                <p className="mt-0.5 text-[11px] text-mut">{l.variant} · {formatBDT(l.product.price)}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-line">
                    <button onClick={() => updateQty(l.id, l.variant, l.qty - 1)} className="grid h-7 w-7 place-items-center" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-7 text-center text-sm font-bold">{l.qty}</span>
                    <button onClick={() => updateQty(l.id, l.variant, l.qty + 1)} className="grid h-7 w-7 place-items-center" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <span className="text-sm font-extrabold text-ink">{formatBDT(l.product.price * l.qty)}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(l.id, l.variant)} aria-label="Remove" className="self-start rounded-lg p-1.5 text-mut hover:bg-accentsoft hover:text-accent"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}

          {lines.length > 0 && (
            <>
              <div className="mt-2">
                <label className="mb-1 block text-[11px] font-bold uppercase text-mut">Delivery district (64 districts)</label>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className="field">
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-mut"><Truck className="h-3.5 w-3.5" /> Dhaka ৳60 · Near-Dhaka ৳90 · Elsewhere ৳130 · Free over ৳5,000</p>
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-bold uppercase text-mut">Coupon code</label>
                <div className="flex gap-2">
                  <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Try SQUAD10, TIGERS15, WORLDCUP20" className="field flex-1" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())} />
                  <button onClick={applyCoupon} className="btn-ghost !px-3 text-xs"><Tag className="h-4 w-4" />{t.apply}</button>
                </div>
                {applied && <p className="mt-1 text-[11px] font-bold text-good">✓ {applied} applied</p>}
              </div>
            </>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-line p-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-mut"><span>{t.subtotal}</span><span>{formatBDT(subtotal)}</span></div>
              <div className="flex justify-between text-mut"><span>{t.delivery} ({district})</span><span>{delivery === 0 ? "FREE" : formatBDT(delivery)}</span></div>
              {discount > 0 && <div className="flex justify-between font-semibold text-good"><span>{t.discount}</span><span>−{formatBDT(discount)}</span></div>}
              <div className="flex justify-between border-t border-line pt-2 font-display text-2xl font-extrabold"><span>{t.total}</span><span>{formatBDT(total)}</span></div>
            </div>
            <button onClick={() => { setCartOpen(false); navigate(`/checkout?district=${encodeURIComponent(district)}${applied ? `&coupon=${applied}` : ""}`); }}
              className="btn-red mt-3 w-full !py-3 text-base">
              {t.checkout} <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

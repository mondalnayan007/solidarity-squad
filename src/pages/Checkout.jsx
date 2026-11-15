import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Lock, User, Phone, MapPin, CreditCard, Banknote, Smartphone, ShieldCheck,
  Loader2, Tag, Truck, ChevronDown, CheckCircle2, Home, Briefcase,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { COUPONS, DISTRICTS, FREE_DELIVERY_ABOVE, deliveryFee, formatBDT, productById } from "../data/catalog";

const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay when the parcel arrives", icon: Banknote, tag: "Most popular" },
  { id: "bkash", label: "bKash", desc: "Instant payment via bKash app", icon: Smartphone, tag: "Instant" },
  { id: "nagad", label: "Nagad", desc: "Pay with Nagad wallet", icon: Smartphone, tag: "Instant" },
  { id: "sslcommerz", label: "SSLCommerz", desc: "Cards · Net banking · Rocket", icon: CreditCard, tag: "Cards" },
];

export default function Checkout() {
  const { cart, user, addresses, placeOrder, toast, t } = useStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(() => {
    const def = addresses.find((a) => a.default) ?? addresses[0] ?? null;
    return {
      name: user?.name ?? def?.name ?? "",
      phone: user?.phone ?? def?.phone ?? "",
      email: user?.email ?? "",
      address: def?.address ?? "",
      district: searchParams.get("district") || def?.district || "Dhaka",
      note: "",
    };
  });
  const [useSaved, setUseSaved] = useState(() => addresses.find((a) => a.default)?.id ?? null);
  const [payment, setPayment] = useState("cod");
  const [coupon, setCoupon] = useState(searchParams.get("coupon") || "");
  const [appliedCode, setAppliedCode] = useState(searchParams.get("coupon") || "");
  const [placing, setPlacing] = useState(null); // null | 'verifying' | 'confirming'
  const [errors, setErrors] = useState({});

  useEffect(() => { document.title = "Checkout | Solidarity Squad"; }, []);

  // Apply saved address during render (adjust-state-during-render)
  const [prevSaved, setPrevSaved] = useState(useSaved);
  if (useSaved !== prevSaved) {
    setPrevSaved(useSaved);
    if (useSaved) {
      const a = addresses.find((x) => x.id === useSaved);
      if (a) setForm((f) => ({ ...f, name: a.name, phone: a.phone, address: a.address, district: a.district }));
    }
  }

  const lines = useMemo(() => cart.map((l) => {
    const p = productById(l.id); return p ? { ...l, product: p } : null;
  }).filter(Boolean), [cart]);

  const subtotal = lines.reduce((a, l) => a + l.product.price * l.qty, 0);
  const activeCoupon = appliedCode ? COUPONS.find((c) => c.code === appliedCode) : null;
  const freeShip = activeCoupon?.code === "FREESHIP";
  const delivery = lines.length === 0 || subtotal >= FREE_DELIVERY_ABOVE || freeShip ? 0 : deliveryFee(form.district, subtotal);
  const discount = activeCoupon ? (activeCoupon.type === "percent" ? Math.round(subtotal * activeCoupon.value / 100) : Math.min(activeCoupon.value, subtotal)) : 0;
  const total = Math.max(0, subtotal + delivery - discount);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code === code);
    if (!found || found.status !== "Active") return toast("Invalid or paused coupon");
    if (subtotal < (found.min || 0)) return toast(`Minimum order ${formatBDT(found.min)} for ${code}`);
    setAppliedCode(code); toast(`${code} applied`);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^01[0-9]{9}$/.test(form.phone.replace(/-/g, ""))) e.phone = "Enter a valid 11-digit mobile (01XXXXXXXXX)";
    if (form.address.trim().length < 8) e.address = "Enter full address (house, road, area)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (lines.length === 0) return toast("Your cart is empty");
    if (!validate()) { toast("Please fix the highlighted fields"); return; }
    setPlacing(payment === "cod" ? "confirming" : "verifying");
    // Simulate gateway IPN verification round-trip
    setTimeout(() => {
      const order = {
        id: `SS-${10493 + Math.floor(Math.random() * 899)}`,
        date: new Date().toISOString(),
        customer: { ...form },
        guest: !user,
        payment: PAYMENT_METHODS.find((m) => m.id === payment)?.label ?? payment,
        paymentId: payment === "cod" ? "—" : `${payment.toUpperCase()}-${Date.now().toString().slice(-8)}`,
        items: lines.map((l) => ({ id: l.id, name: l.product.name, variant: l.variant, qty: l.qty, price: l.product.price, emoji: l.product.emoji })),
        subtotal, delivery, discount, coupon: appliedCode || null, total,
        status: payment === "cod" ? "Pending" : "Confirmed",
        timeline: [{ label: "Order placed", at: new Date().toISOString(), done: true }],
      };
      placeOrder(order);
      navigate(`/order-success/${order.id}`);
    }, payment === "cod" ? 1200 : 2200);
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="font-display mt-3 text-4xl font-extrabold">Cart is empty</h1>
        <p className="mt-1 text-sm text-mut">Add some gear before checking out.</p>
        <Link to="/shop" className="btn-brand mt-5">Browse gear</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      <h1 className="font-display text-4xl font-extrabold">Checkout</h1>
      <p className="mt-1 text-sm text-mut">{user ? `Signed in as ${user.name}` : <>Guest checkout — or <Link to="/login?next=/checkout" className="font-bold text-brand hover:underline">log in</Link> for saved addresses &amp; order history.</>}</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* ── Left: form ── */}
        <div className="space-y-5">
          {/* Contact & address */}
          <section className="card-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><MapPin className="h-5 w-5 text-brand" /> Delivery details</h2>

            {addresses.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wider text-mut">Saved addresses</p>
                <div className="flex flex-wrap gap-2">
                  {addresses.map((a) => (
                    <button key={a.id} onClick={() => setUseSaved(a.id)} aria-pressed={useSaved === a.id}
                      className={`flex items-start gap-2 rounded-2xl border p-2.5 text-left text-xs transition ${useSaved === a.id ? "border-brand ring-2 ring-brand/30" : "border-line hover:border-brand"}`}>
                      {a.id % 2 ? <Home className="mt-0.5 h-4 w-4 text-brand" /> : <Briefcase className="mt-0.5 h-4 w-4 text-brand" />}
                      <span><b>{a.label}</b> — {a.name}<br />{a.address}, {a.district}<br />{a.phone}</span>
                    </button>
                  ))}
                  <button onClick={() => setUseSaved(null)} className={`rounded-2xl border border-dashed p-2.5 text-xs font-bold ${!useSaved ? "border-brand text-brand" : "border-line text-mut"}`}>+ New address</button>
                </div>
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 flex items-center gap-1 text-[11px] font-extrabold uppercase text-mut" htmlFor="co-name"><User className="h-3.5 w-3.5" />Full name *</label>
                <input id="co-name" className={`field ${errors.name ? "!border-accent" : ""}`} value={form.name} onChange={set("name")} placeholder="e.g. Rafi Ahmed" />
                {errors.name && <p className="mt-1 text-[11px] font-semibold text-accent">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-[11px] font-extrabold uppercase text-mut" htmlFor="co-phone"><Phone className="h-3.5 w-3.5" />Phone *</label>
                <input id="co-phone" className={`field ${errors.phone ? "!border-accent" : ""}`} value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" inputMode="numeric" />
                {errors.phone && <p className="mt-1 text-[11px] font-semibold text-accent">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 flex items-center gap-1 text-[11px] font-extrabold uppercase text-mut" htmlFor="co-email">Email (for invoice &amp; updates)</label>
                <input id="co-email" type="email" className="field" value={form.email} onChange={set("email")} placeholder="you@example.com" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 flex items-center gap-1 text-[11px] font-extrabold uppercase text-mut" htmlFor="co-address"><MapPin className="h-3.5 w-3.5" />Full address *</label>
                <input id="co-address" className={`field ${errors.address ? "!border-accent" : ""}`} value={form.address} onChange={set("address")} placeholder="House, road, area, thana" />
                {errors.address && <p className="mt-1 text-[11px] font-semibold text-accent">{errors.address}</p>}
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-[11px] font-extrabold uppercase text-mut" htmlFor="co-district">District * <ChevronDown className="h-3 w-3" /></label>
                <select id="co-district" className="field" value={form.district} onChange={set("district")}>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-extrabold uppercase text-mut" htmlFor="co-note">Order note (optional)</label>
                <input id="co-note" className="field" value={form.note} onChange={set("note")} placeholder="e.g. call before delivery" />
              </div>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-mut"><Truck className="h-4 w-4 text-brand" />Delivery to <b>{form.district}</b>: {subtotal >= FREE_DELIVERY_ABOVE ? "FREE (over ৳5,000)" : formatBDT(deliveryFee(form.district, subtotal))} · Dhaka ৳60 · Near-Dhaka ৳90 · Other districts ৳130</p>
          </section>

          {/* Payment methods */}
          <section className="card-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><CreditCard className="h-5 w-5 text-brand" /> Payment method</h2>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
              {PAYMENT_METHODS.map((m) => {
                const Icon = m.icon;
                const active = payment === m.id;
                return (
                  <button key={m.id} role="radio" aria-checked={active} onClick={() => setPayment(m.id)}
                    className={`relative flex items-center gap-3 rounded-2xl border p-3 text-left transition ${active ? "border-brand bg-brandsoft ring-2 ring-brand/30" : "border-line hover:border-brand"}`}>
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-surf"><Icon className="h-6 w-6 text-brand" /></span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-sm font-extrabold">{m.label}{active && <CheckCircle2 className="h-4 w-4 text-good" />}</span>
                      <span className="block text-[11px] text-mut">{m.desc}</span>
                    </span>
                    <span className="absolute right-2 top-2 rounded-full bg-gold/70 px-1.5 py-0.5 text-[9px] font-extrabold text-[#5c4300]">{m.tag}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-mut"><ShieldCheck className="h-4 w-4 text-good" />Payments are verified via gateway IPN / callback before the order is confirmed. Transaction ID is logged.</p>
          </section>
        </div>

        {/* ── Right: order summary ── */}
        <aside className="h-fit space-y-4">
          <div className="card-surface p-5">
            <h2 className="font-display text-2xl font-extrabold">Order summary <span className="text-base text-mut">({lines.length} items)</span></h2>
            <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto nice-scroll">
              {lines.map((l) => (
                <li key={`${l.id}-${l.variant}`} className="flex items-center gap-2 text-xs">
                  <span className="grid h-11 w-11 place-items-center rounded-lg text-xl" style={{ background: l.product.bg }}>{l.product.emoji}</span>
                  <span className="min-w-0 flex-1"><span className="line-clamp-1 font-bold">{l.product.name}</span><span className="text-mut">{l.variant} × {l.qty}</span></span>
                  <span className="font-bold">{formatBDT(l.product.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <label className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-mut" htmlFor="co-coupon">Coupon</label>
              <div className="flex gap-2">
                <input id="co-coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="SQUAD10 · TIGERS15 · WORLDCUP20" className="field flex-1 !py-2 text-xs" />
                <button onClick={applyCoupon} className="btn-ghost !px-3 text-xs"><Tag className="h-4 w-4" />Apply</button>
              </div>
              {appliedCode && <p className="mt-1 text-[11px] font-bold text-good">✓ {appliedCode} applied</p>}
            </div>
            <div className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm">
              <div className="flex justify-between text-mut"><span>{t.subtotal}</span><span>{formatBDT(subtotal)}</span></div>
              <div className="flex justify-between text-mut"><span>{t.delivery}</span><span>{delivery === 0 ? "FREE" : formatBDT(delivery)}</span></div>
              {discount > 0 && <div className="flex justify-between font-semibold text-good"><span>{t.discount}</span><span>−{formatBDT(discount)}</span></div>}
              <div className="flex justify-between border-t border-line pt-2 font-display text-2xl font-extrabold"><span>{t.total}</span><span>{formatBDT(total)}</span></div>
            </div>
            <button onClick={submit} disabled={!!placing} className="btn-red mt-4 w-full !py-4 text-base disabled:opacity-70">
              {placing ? (<><Loader2 className="h-5 w-5 animate-spin" />{placing === "verifying" ? "Verifying payment with gateway…" : "Confirming your order…"}</>) : (<><Lock className="h-5 w-5" />{payment === "cod" ? "Place order — pay on delivery" : `Pay ${formatBDT(total)} now`}</>)}
            </button>
            {placing && <p className="mt-2 text-center text-[11px] font-semibold text-mut">{placing === "verifying" ? "Contacting gateway & verifying IPN signature…" : "Reserving stock and creating your order…"}</p>}
          </div>
          <div className="rounded-2xl border border-line bg-deep p-4 text-[11px] leading-relaxed text-[#bfe3cf]">
            <p className="font-extrabold uppercase tracking-wider text-gold">Why shop with us</p>
            <ul className="mt-1.5 space-y-1">
              <li>✓ 100% authentic, authorised dealer</li>
              <li>✓ 7-day hassle-free returns</li>
              <li>✓ SSLCommerz · bKash · Nagad · COD</li>
              <li>✓ Pathao &amp; Steadfast tracked delivery</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

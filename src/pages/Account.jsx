import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  User, MapPin, Package, RotateCcw, Heart, Plus, Trash2, Star, Truck,
  Printer, LogOut, ShoppingBag, CheckCircle2, ChevronRight, Home, Briefcase,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { DISTRICTS, formatBDT, productById, statusClass } from "../data/catalog";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "returns", label: "Returns", icon: RotateCcw },
];

export default function Account() {
  const { user, logout, addresses, setAddresses, orders, wishlist, toggleWishlist, returns, addToCart, toast } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "profile";
  const setTab = (t) => setSearchParams({ tab: t }, { replace: true });

  const [profile, setProfile] = useState({ name: user?.name ?? "", email: user?.email ?? "" });
  const [newAddr, setNewAddr] = useState({ label: "Home", address: "", district: "Dhaka", phone: user?.phone ?? "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => { document.title = "My Account | Solidarity Squad"; }, []);

  // Sync profile from signed-in user (adjust-state-during-render)
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    setProfile({ name: user?.name ?? "", email: user?.email ?? "" });
  }

  const wishedProducts = useMemo(() => wishlist.map(productById).filter(Boolean), [wishlist]);

  const reorder = (order) => {
    order.items.forEach((l) => addToCart(l.id, l.variant, l.qty));
    toast("Items added to cart — ready to check out");
  };

  const saveProfile = () => {
    // In a real app this PUTs to /api/me; here we just keep it local.
    toast("Profile updated");
  };

  const addAddress = () => {
    if (newAddr.address.trim().length < 8) return toast("Enter full address");
    setAddresses((a) => [...a, { id: Date.now(), name: profile.name || "Me", phone: newAddr.phone, ...newAddr, default: a.length === 0 }]);
    setNewAddr({ label: "Home", address: "", district: "Dhaka", phone: user?.phone ?? "" });
    setAdding(false);
    toast("Address saved");
  };
  const removeAddress = (id) => setAddresses((a) => a.filter((x) => x.id !== id));
  const makeDefault = (id) => setAddresses((a) => a.map((x) => ({ ...x, default: x.id === id })));

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <User className="mx-auto h-16 w-16 text-mut" strokeWidth={1.2} />
        <h1 className="font-display mt-3 text-4xl font-extrabold">Sign in first</h1>
        <p className="mt-1 text-sm text-mut">Log in with your phone OTP to view orders, addresses and wishlist.</p>
        <Link to="/login?next=/account" className="btn-brand mt-5">Login / Register <ChevronRight className="h-5 w-5" /></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      {/* Header card */}
      <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-deep p-5 text-white sm:p-6">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gold font-display text-3xl font-extrabold text-[#1a1a1a]">{profile.name?.[0]?.toUpperCase() ?? "S"}</span>
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-extrabold leading-none">{profile.name || "Squad Member"}</h1>
          <p className="mt-1 text-xs text-white/80">{user.phone}{profile.email ? ` · ${profile.email}` : ""}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/shop" className="btn-squad !px-4 !py-2 text-xs"><ShoppingBag className="h-4 w-4" />Re-order fast</Link>
          <button onClick={logout} className="flex h-10 items-center gap-1.5 rounded-xl border border-white/25 px-3 text-xs font-bold hover:bg-white/10"><LogOut className="h-4 w-4" />Sign out</button>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Tabs */}
        <nav className="flex gap-1 overflow-x-auto nice-scroll lg:flex-col" aria-label="Account sections">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${tab === id ? "bg-brand text-white dark:text-[#04120b]" : "bg-surf text-ink hover:bg-bg"}`}>
              <Icon className="h-5 w-5" /> {label}
              {id === "orders" && <span className="ml-auto rounded-full bg-black/15 px-2 text-[11px]">{orders.length}</span>}
              {id === "wishlist" && <span className="ml-auto rounded-full bg-black/15 px-2 text-[11px]">{wishedProducts.length}</span>}
            </button>
          ))}
        </nav>

        <div>
          {/* ── Profile ── */}
          {tab === "profile" && (
            <section className="card-surface p-6">
              <h2 className="font-display text-3xl font-extrabold">My profile</h2>
              <div className="mt-4 grid max-w-lg gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[11px] font-extrabold uppercase text-mut" htmlFor="pf-name">Full name</label>
                  <input id="pf-name" className="field" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-extrabold uppercase text-mut">Mobile (locked)</label>
                  <input className="field opacity-60" value={user.phone} disabled />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-extrabold uppercase text-mut" htmlFor="pf-email">Email</label>
                  <input id="pf-email" type="email" className="field" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} placeholder="you@example.com" />
                </div>
              </div>
              <button onClick={saveProfile} className="btn-brand mt-4">Save changes</button>
              <p className="mt-3 text-[11px] text-mut">Mobile number is your login ID. To change it, contact support with NID.</p>
            </section>
          )}

          {/* ── Orders ── */}
          {tab === "orders" && (
            <section>
              <h2 className="font-display text-3xl font-extrabold">My orders <span className="text-lg text-mut">({orders.length})</span></h2>
              {orders.length === 0 ? (
                <div className="card-surface mt-4 p-10 text-center">
                  <Package className="mx-auto h-12 w-12 text-mut" />
                  <p className="mt-2 font-bold">No orders yet</p>
                  <Link to="/shop" className="btn-brand mt-4">Start shopping</Link>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {orders.map((o) => (
                    <details key={o.id} className="card-surface overflow-hidden">
                      <summary className="flex cursor-pointer flex-wrap items-center gap-3 p-4 marker:hidden">
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-sm font-extrabold">{o.id}</p>
                          <p className="text-[11px] text-mut">{new Date(o.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {o.items.length} item(s) · {o.payment}</p>
                        </div>
                        <span className={`status ${statusClass(o.status)}`}>{o.status}</span>
                        <span className="font-display text-xl font-extrabold">{formatBDT(o.total)}</span>
                      </summary>
                      <div className="border-t border-line p-4">
                        <ul className="space-y-2">
                          {o.items.map((l, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs">
                              <span className="grid h-10 w-10 place-items-center rounded-lg bg-bg text-lg">{l.emoji}</span>
                              <span className="min-w-0 flex-1 truncate font-semibold">{l.name} <span className="text-mut">({l.variant})</span></span>
                              <span className="text-mut">×{l.qty}</span>
                              <span className="font-bold">{formatBDT(l.price * l.qty)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                          <button onClick={() => reorder(o)} className="btn-brand !py-2 text-xs"><ShoppingBag className="h-4 w-4" />Re-order</button>
                          <Link to={`/order-success/${o.id}`} className="btn-ghost !py-2 text-xs"><Printer className="h-4 w-4" />Invoice</Link>
                          <Link to={`/track-order?order=${o.id}`} className="btn-ghost !py-2 text-xs"><Truck className="h-4 w-4" />Track</Link>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Addresses ── */}
          {tab === "addresses" && (
            <section>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-3xl font-extrabold">My addresses</h2>
                <button onClick={() => setAdding((v) => !v)} className="btn-brand !py-2 text-xs"><Plus className="h-4 w-4" />Add new</button>
              </div>
              {adding && (
                <div className="card-surface mt-3 grid gap-2 p-4 sm:grid-cols-2">
                  <select className="field" value={newAddr.label} onChange={(e) => setNewAddr((a) => ({ ...a, label: e.target.value }))} aria-label="Label">
                    <option>Home</option><option>Office</option><option>Other</option>
                  </select>
                  <input className="field" placeholder="Phone" value={newAddr.phone} onChange={(e) => setNewAddr((a) => ({ ...a, phone: e.target.value }))} />
                  <input className="field sm:col-span-2" placeholder="Full address — house, road, area" value={newAddr.address} onChange={(e) => setNewAddr((a) => ({ ...a, address: e.target.value }))} autoFocus />
                  <select className="field" value={newAddr.district} onChange={(e) => setNewAddr((a) => ({ ...a, district: e.target.value }))}>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}</select>
                  <div className="flex gap-2"><button onClick={addAddress} className="btn-brand flex-1">Save</button><button onClick={() => setAdding(false)} className="btn-ghost">Cancel</button></div>
                </div>
              )}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <div key={a.id} className={`card-surface relative p-4 text-sm ${a.default ? "ring-2 ring-brand" : ""}`}>
                    {a.default && <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-brandsoft px-2 py-0.5 text-[10px] font-extrabold text-good"><CheckCircle2 className="h-3.5 w-3.5" />DEFAULT</span>}
                    <p className="flex items-center gap-1.5 font-extrabold">{a.label === "Office" ? <Briefcase className="h-4 w-4 text-brand" /> : <Home className="h-4 w-4 text-brand" />}{a.label}</p>
                    <p className="mt-1.5 font-semibold">{a.name}</p>
                    <p className="text-mut">{a.address}</p>
                    <p className="text-mut">{a.district} · {a.phone}</p>
                    <div className="mt-2 flex gap-2 border-t border-line pt-2 text-[11px] font-bold">
                      {!a.default && <button onClick={() => makeDefault(a.id)} className="text-brand hover:underline">Set default</button>}
                      <button onClick={() => removeAddress(a.id)} className="ml-auto flex items-center gap-1 text-accent hover:underline"><Trash2 className="h-3.5 w-3.5" />Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Wishlist ── */}
          {tab === "wishlist" && (
            <section>
              <h2 className="font-display text-3xl font-extrabold">My wishlist</h2>
              {wishedProducts.length === 0 ? (
                <div className="card-surface mt-4 p-10 text-center">
                  <Heart className="mx-auto h-12 w-12 text-mut" />
                  <p className="mt-2 font-bold">Nothing saved yet</p>
                  <p className="text-sm text-mut">Tap the ♥ on any product to save it here.</p>
                  <Link to="/shop" className="btn-brand mt-4">Explore gear</Link>
                </div>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {wishedProducts.map((p) => (
                    <div key={p.id} className="card-surface flex gap-3 p-3">
                      <Link to={`/product/${p.id}`} className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl text-5xl" style={{ background: p.bg }}>{p.emoji}</Link>
                      <div className="min-w-0">
                        <Link to={`/product/${p.id}`} className="line-clamp-2 text-sm font-bold hover:text-brand">{p.name}</Link>
                        <p className="mt-1 flex items-center gap-1 text-xs text-mut"><Star className="h-3 w-3 fill-gold text-gold" />{p.rating} · {p.brand}</p>
                        <p className="font-display mt-1 text-xl font-extrabold text-brand">{formatBDT(p.price)}</p>
                        <div className="mt-1 flex gap-2">
                          <button onClick={() => addToCart(p.id, p.variants?.[0], 1)} className="btn-brand !px-3 !py-1.5 text-[11px]">Move to cart</button>
                          <button onClick={() => toggleWishlist(p.id)} className="btn-ghost !px-3 !py-1.5 text-[11px]">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Returns ── */}
          {tab === "returns" && (
            <section>
              <h2 className="font-display text-3xl font-extrabold">Returns &amp; refunds</h2>
              <p className="mt-1 text-xs text-mut">7-day window from delivery. Approved refunds go back to the original payment method within 3–5 working days. Exchanges are shipped after pickup.</p>
              {returns.length === 0 ? (
                <div className="card-surface mt-4 p-10 text-center">
                  <RotateCcw className="mx-auto h-12 w-12 text-mut" />
                  <p className="mt-2 font-bold">No return requests</p>
                  <p className="text-sm text-mut">Delivered something wrong? Use Track Order → Request return.</p>
                  <Link to="/track-order" className="btn-brand mt-4">Track my order</Link>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {returns.map((r) => (
                    <div key={r.id} className="card-surface flex flex-wrap items-center gap-3 p-4 text-sm">
                      <span className="font-mono font-extrabold">{r.id}</span>
                      <span className="text-mut">Order {r.orderId} · {new Date(r.date).toLocaleDateString("en-GB")}</span>
                      <span className="ml-auto status status-warn">{r.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

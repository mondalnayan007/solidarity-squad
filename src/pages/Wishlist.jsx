import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { productById, formatBDT } from "../data/catalog";

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const items = wishlist.map(productById).filter(Boolean);
  useEffect(() => { document.title = "Wishlist | Solidarity Squad"; }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <h1 className="font-display flex items-center gap-3 text-5xl font-extrabold"><Heart className="h-10 w-10 fill-accent text-accent" /> MY <span className="text-accent">WISHLIST</span></h1>
      <p className="mt-1 text-sm text-mut">{items.length} saved item{items.length === 1 ? "" : "s"} — prices refresh live.</p>

      {items.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-20 text-center">
          <span className="text-6xl">🤍</span>
          <h2 className="font-display text-2xl font-bold">Nothing saved yet</h2>
          <p className="max-w-xs text-sm text-mut">Tap the heart on any product — we&apos;ll keep it here for you.</p>
          <Link to="/shop" className="btn-brand mt-2">Browse gear <ArrowRight className="h-4 w-4" /></Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div key={p.id} className="card-surface flex gap-4 p-4">
              <Link to={`/product/${p.id}`} className="grid h-28 w-28 shrink-0 place-items-center rounded-2xl text-6xl" style={{ background: p.bg }}>{p.emoji}</Link>
              <div className="flex min-w-0 flex-col">
                <Link to={`/product/${p.id}`} className="line-clamp-2 text-sm font-bold leading-snug hover:text-brand">{p.name}</Link>
                <p className="font-display mt-1 text-2xl font-extrabold text-brand">{formatBDT(p.price)}</p>
                <div className="mt-auto flex gap-2 pt-2">
                  <button onClick={() => addToCart(p.id, p.variants?.[0], 1)} className="btn-brand flex-1 !py-2 text-xs"><ShoppingCart className="h-4 w-4" />Add to cart</button>
                  <button onClick={() => toggleWishlist(p.id)} className="btn-ghost !px-3 !py-2 text-xs text-accent" aria-label="Remove from wishlist">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

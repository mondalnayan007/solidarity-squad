import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  Sparkles,
} from "lucide-react";

import * as LottieModule from "lottie-react";
import cartAnimation from "../assets/Cart.json";

import { useStore } from "../context/StoreContext";
import { formatBDT, discountPercent } from "../data/catalog";

const Lottie =
  LottieModule.default?.default ??
  LottieModule.default ??
  LottieModule.LottiePlayer;

export default function ProductCard({ product: p }) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const [isCartHovered, setIsCartHovered] = useState(false);

  const wished = wishlist.includes(p.id);
  const navigate = useNavigate();

  const off = discountPercent(p);
  const lowStock = p.stock > 0 && p.stock <= 10;
  const isOutOfStock = p.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(p.id, p.variants?.[0], 1);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-2.5 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-emerald-300/80 hover:shadow-[0_22px_45px_-15px_rgba(16,185,129,0.2)] dark:border-white/10 dark:bg-[#111c17] dark:hover:border-emerald-500/30">
      
      {/* Product Image Container */}
      <div
        className="relative h-48 cursor-pointer overflow-hidden rounded-2xl sm:h-52"
        style={{ background: p.bg }}
        onClick={() => navigate(`/product/${p.id}`)}
        role="link"
        aria-label={p.name}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") navigate(`/product/${p.id}`);
        }}
      >
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-80" />

        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5">
          {off > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-white shadow-md">
              -{off}% OFF
            </span>
          )}
          {lowStock && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/95 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
              <Sparkles className="h-2.5 w-2.5" />
              Only {p.stock} left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(p.id);
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="absolute right-2.5 top-2.5 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-gray-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white active:scale-90 dark:bg-black/50 dark:text-gray-200 dark:hover:bg-black/80"
        >
          <Heart
            className={`h-4 w-4 transition-all duration-300 ${
              wished
                ? "scale-110 fill-rose-500 text-rose-500"
                : "hover:text-rose-500"
            }`}
          />
        </button>

        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isOutOfStock ? "grayscale opacity-70" : ""
          }`}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${p.id}`);
          }}
          aria-label="Quick view product"
          className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 translate-y-4 items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-gray-800 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-emerald-600 hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Eye className="h-3.5 w-3.5" />
          Quick View
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-black/80 px-4 py-1.5 text-xs font-extrabold tracking-widest text-white shadow-lg">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col px-1.5 pt-3 pb-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
            {p.brand}
          </span>

          <div className="flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-xs dark:bg-amber-500/10">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {p.rating}
            </span>
            <span className="text-[11px] text-gray-400">({p.reviews})</span>
          </div>
        </div>

        <Link
          to={`/product/${p.id}`}
          className="mt-1.5 line-clamp-2 min-h-[2.6em] text-[15px] font-bold leading-snug text-gray-800 transition-colors duration-200 hover:text-emerald-600 dark:text-gray-100 dark:hover:text-emerald-400"
        >
          {p.name}
        </Link>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-xl font-black tracking-tight text-gray-900 dark:text-white">
            {formatBDT(p.price)}
          </span>
          {p.mrp && (
            <span className="text-xs font-medium text-gray-400 line-through">
              {formatBDT(p.mrp)}
            </span>
          )}
        </div>

        {/* Full-Width Bottom Add to Cart Button with Hover Lottie Swap */}
        <div className="mt-auto pt-3.5">
          <button
            type="button"
            onClick={handleAddToCart}
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
            onFocus={() => setIsCartHovered(true)}
            onBlur={() => setIsCartHovered(false)}
            disabled={isOutOfStock}
            aria-label={`Add ${p.name} to cart`}
            className="group/cart relative flex h-11 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all duration-300 hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-50 disabled:shadow-none"
          >
            {isCartHovered && !isOutOfStock ? (
              /* Hover State: Full Button Lottie Animation */
              <div className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer bg-emerald-600">
                <Lottie
                  key="cart-animation"
                  animationData={cartAnimation}
                  autoplay={true}
                  loop={true}
                  style={{
                    width: "150px",
                    height: "150px",
                    
                  }}
                />
              </div>
            ) : (
              /* Default State: Icon + Text */
              <div className="relative z-10 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover/cart:-rotate-6" />
                <span className="tracking-wide">
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </span>
              </div>
            )}
          </button>
        </div>

      </div>
    </article>
  );
}
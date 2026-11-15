import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import { productById } from "../data/catalog";

const StoreContext = createContext(null);
const load = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};

const STR = {
  en: {
    home: "Home", shopAll: "Shop All Gear", categories: "Sports Categories", bdTigers: "BD Tigers Zone",
    track: "Track Order", search: "Search bats, boots, jerseys…", addToCart: "Add to Cart", buyNow: "Buy Now",
    cart: "Cart", wishlist: "Wishlist", account: "Account", blog: "Blog", contact: "Contact",
    checkout: "Checkout", login: "Login / Register", subtotal: "Subtotal", delivery: "Delivery",
    discount: "Discount", total: "Total", apply: "Apply", freeAbove: "Free over ৳5,000",
    promo: "FREE EXPRESS DELIVERY ON ORDERS ABOVE ৳5,000 • 64 DISTRICTS COVERAGE",
  },
  bn: {
    home: "হোম", shopAll: "সব গিয়ার কিনুন", categories: "স্পোর্টস ক্যাটাগরি", bdTigers: "বিডি টাইগার্স জোন",
    track: "অর্ডার ট্র্যাকিং", search: "ব্যাট, বুট, জার্সি খুঁজুন…", addToCart: "কার্টে যোগ করুন", buyNow: "এখনই কিনুন",
    cart: "কার্ট", wishlist: "উইশলিস্ট", account: "অ্যাকাউন্ট", blog: "ব্লগ", contact: "যোগাযোগ",
    checkout: "চেকআউট", login: "লগইন / রেজিস্ট্রেশন", subtotal: "সাবটোটাল", delivery: "ডেলিভারি",
    discount: "ছাড়", total: "মোট", apply: "প্রয়োগ", freeAbove: "৳৫,০০০+ এ ফ্রি",
    promo: "৳৫,০০০+ অর্ডারে ফ্রি এক্সপ্রেস ডেলিভারি • দেশের ৬৪ জেলায় হোম ডেলিভারি",
  },
};

export function StoreProvider({ children }) {
  const [lang, setLang] = useState(() => load("ss-lang", "en"));
  const [dark, setDark] = useState(() => load("ss-dark", false));
  const [cart, setCart] = useState(() => load("ss-cart", [])); // [{id, variant, qty}]
  const [wishlist, setWishlist] = useState(() => load("ss-wishlist", [])); // [ids]
  const [user, setUser] = useState(() => load("ss-user", null)); // {name, phone, email}
  const [addresses, setAddresses] = useState(() => load("ss-addresses", [
    { id: 1, label: "Home", name: "Dulal Ahmed", phone: "01711-000111", address: "House 12, Road 5, Dhanmondi", district: "Dhaka", default: true },
  ]));
  const [orders, setOrders] = useState(() => load("ss-my-orders", [
    {
      id: "SS-10484", date: "2026-11-10T10:24:00.000Z", guest: false,
      customer: { name: "Dulal Ahmed", phone: "01711-000111", email: "dulal@example.com", address: "House 12, Road 5, Dhanmondi", district: "Dhaka", note: "" },
      payment: "bKash", paymentId: "BKASH-88213477",
      items: [
        { id: 11, name: "BD Tigers Home Jersey 2026 · Players Edition", variant: "L", qty: 1, price: 1450, emoji: "👕" },
        { id: 7, name: "Pro Match Football Size 5 · FIFA Quality", variant: "Size 5", qty: 1, price: 2200, emoji: "⚽" },
      ],
      subtotal: 3650, delivery: 60, discount: 0, coupon: null, total: 3710, status: "Delivered",
      timeline: [],
    },
  ])); // customer-placed orders
  const [returns, setReturns] = useState(() => load("ss-returns", []));
  const [recentlyViewed, setRecentlyViewed] = useState(() => load("ss-recent", []));
  const [toastMsg, setToastMsg] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const t = STR[lang];
  const toggleLang = useCallback(() => setLang((l) => (l === "en" ? "bn" : "en")), []);
  const toggleDark = useCallback(() => setDark((d) => !d), []);

  useEffect(() => { document.documentElement.classList.toggle("dark", dark); localStorage.setItem("ss-dark", JSON.stringify(dark)); }, [dark]);
  useEffect(() => { localStorage.setItem("ss-lang", JSON.stringify(lang)); }, [lang]);
  useEffect(() => { localStorage.setItem("ss-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("ss-wishlist", JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem("ss-user", JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem("ss-addresses", JSON.stringify(addresses)); }, [addresses]);
  useEffect(() => { localStorage.setItem("ss-my-orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("ss-returns", JSON.stringify(returns)); }, [returns]);
  useEffect(() => { localStorage.setItem("ss-recent", JSON.stringify(recentlyViewed)); }, [recentlyViewed]);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    window.clearTimeout(window.__ssToast);
    window.__ssToast = window.setTimeout(() => setToastMsg(null), 2600);
  }, []);

  // ── Cart ops (with stock validation against catalog) ──────────
  const addToCart = useCallback((productId, variant, qty = 1) => {
    const p = productById(productId);
    const lim = p?.stock ?? Infinity;
    setCart((c) => {
      const i = c.findIndex((x) => x.id === productId && x.variant === variant);
      const cur = i >= 0 ? c[i].qty : 0;
      if (cur + qty > lim) { toast(`Only ${lim} in stock`); return c; }
      if (i >= 0) { const next = [...c]; next[i] = { ...next[i], qty: cur + qty }; return next; }
      toast("Added to cart");
      return [...c, { id: productId, variant, qty }];
    });
    setCartOpen(true);
  }, [toast]);

  const updateQty = useCallback((id, variant, qty) => {
    setCart((c) => qty <= 0 ? c.filter((x) => !(x.id === id && x.variant === variant)) : c.map((x) => (x.id === id && x.variant === variant ? { ...x, qty } : x)));
  }, []);
  const removeFromCart = useCallback((id, variant) => setCart((c) => c.filter((x) => !(x.id === id && x.variant === variant))), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id) => {
    setWishlist((w) => {
      const on = w.includes(id);
      toast(on ? "Removed from wishlist" : "Saved to wishlist");
      return on ? w.filter((x) => x !== id) : [...w, id];
    });
  }, [toast]);

  const viewProduct = useCallback((id) => {
    setRecentlyViewed((r) => [id, ...r.filter((x) => x !== id)].slice(0, 10));
  }, []);

  const login = useCallback((name, phone, email = "") => {
    setUser({ name, phone, email });
    toast(`Welcome, ${name.split(" ")[0]}!`);
  }, [toast]);
  const logout = useCallback(() => { setUser(null); toast("Signed out"); }, [toast]);

  const placeOrder = useCallback((order) => {
    setOrders((o) => [order, ...o]);
    clearCart();
  }, [clearCart]);

  const cartCount = cart.reduce((a, x) => a + x.qty, 0);

  const value = useMemo(() => ({
    lang, t, toggleLang, dark, toggleDark,
    cart, cartCount, cartOpen, setCartOpen, addToCart, updateQty, removeFromCart, clearCart,
    wishlist, toggleWishlist,
    user, login, logout, addresses, setAddresses,
    orders, placeOrder, returns, setReturns,
    recentlyViewed, viewProduct,
    toast, toastMsg, setToastMsg,
  }), [lang, t, toggleLang, dark, toggleDark, cart, cartCount, cartOpen, addToCart, updateQty, removeFromCart, clearCart,
       wishlist, toggleWishlist, user, login, logout, addresses, orders, placeOrder, returns, recentlyViewed, viewProduct, toast, toastMsg]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
};

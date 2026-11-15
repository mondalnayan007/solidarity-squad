import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export function Toaster() {
  const { toastMsg } = useStore();
  if (!toastMsg) return null;
  return (
    <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg shadow-xl">
      <CheckCircle2 className="h-5 w-5 text-gold" /> {toastMsg}
    </div>
  );
}

export function FloatingChat() {
  const { cartOpen } = useStore();
  if (cartOpen) return null; // keep clear of the cart drawer's totals
  return (
    <div className="no-print fixed bottom-5 right-4 z-[70] flex flex-col gap-2">
      <a href="https://wa.me/8801700000000?text=Hi%20Solidarity%20Squad%2C%20I%20need%20help" target="_blank" rel="noreferrer"
         aria-label="Chat on WhatsApp"
         className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-900/30 transition hover:scale-110">
        <MessageCircle className="h-7 w-7" fill="currentColor" strokeWidth={0} />
      </a>
      <a href="https://m.me/solidaritysquad" target="_blank" rel="noreferrer"
         aria-label="Chat on Messenger"
         className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#00B2FF] to-[#A334FA] text-white shadow-lg transition hover:scale-110">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17V22l3.88-2.14c1.06.3 2.18.44 3.3.44 5.64 0 9.68-4.13 9.68-9.7S17.64 2 12 2zm6.03 7.99l-2.93 4.7a1.86 1.86 0 0 1-2.39.76l-2.37-1.76a.75.75 0 0 0-.89.12l-3.2 3.15c-.42.41-1.05-.18-.73-.6l2.93-4.7a1.86 1.86 0 0 1 2.39-.76l2.37 1.76c.28.2.65.06.89-.13l3.2-3.13c.42-.4 1.05.18.73.59z"/></svg>
      </a>
    </div>
  );
}

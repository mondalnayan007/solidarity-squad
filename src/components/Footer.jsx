import { Link } from "react-router-dom";
import { Trophy, ShieldCheck, Truck } from "lucide-react";

export default function Footer() {
  const cats = [["Cricket", "cricket"], ["Football", "football"], ["Jerseys", "jerseys"], ["Gym & Fitness", "gym"], ["Footwear", "footwear"], ["Badminton", "badminton"]];
  return (
    <footer className="no-print mt-12 bg-deep text-[#cfe3d8]">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent"><Trophy className="h-5 w-5" /></span>
              <span className="font-display text-2xl font-extrabold">SOLIDARITY <span className="text-gold">SQUAD</span></span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#a9c8b8]">
              Bangladesh&apos;s sports gear destination — cricket, football, jerseys and gym equipment, delivered to 64 districts.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1"><ShieldCheck className="h-3.5 w-3.5 text-gold" />100% authentic</span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1"><Truck className="h-3.5 w-3.5 text-gold" />64 districts</span>
            </div>
          </div>
          <nav aria-label="Shop">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-gold">Shop</h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {cats.map(([label, id]) => <li key={id}><Link to={`/shop?cat=${id}`} className="hover:text-white">{label}</Link></li>)}
              <li><Link to="/shop" className="font-bold text-white hover:text-gold">View all 26+ categories →</Link></li>
            </ul>
          </nav>
          <nav aria-label="Support">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-gold">Support</h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li><Link to="/track-order" className="hover:text-white">Track order</Link></li>
              <li><Link to="/page/returns" className="hover:text-white">Returns &amp; refunds</Link></li>
              <li><Link to="/page/shipping" className="hover:text-white">Shipping &amp; delivery</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact &amp; FAQ</Link></li>
              <li><Link to="/page/about" className="hover:text-white">About us</Link></li>
              <li><Link to="/account" className="hover:text-white">My account</Link></li>
            </ul>
          </nav>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-gold">We accept</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-ink">
              {["SSLCommerz", "bKash", "Nagad", "Rocket", "Visa · Mastercard", "COD"].map((p) => (
                <span key={p} className="rounded-lg bg-white px-2.5 py-1.5">{p}</span>
              ))}
            </div>
            <h3 className="mt-4 text-xs font-extrabold uppercase tracking-widest text-gold">Delivery by</h3>
            <p className="mt-2 text-sm text-[#a9c8b8]">Pathao · Steadfast — express in Dhaka, 2–5 days elsewhere.</p>
            <a href="https://wa.me/8801700000000" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-extrabold text-[#0b3b1e] hover:brightness-105">
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-4 text-[11px] text-[#8fb5a3] sm:flex-row">
          <p>© 2026 Solidarity Squad Sports Ltd · Dhaka, Bangladesh</p>
          <div className="flex gap-4">
            <Link to="/page/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/page/terms" className="hover:text-white">Terms</Link>
            <Link to="/page/about" className="hover:text-white">About</Link>
            <Link to="/admin" className="hover:text-white">Admin panel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

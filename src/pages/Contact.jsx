import { useEffect, useState } from "react";
import {
  MessageCircle, Phone, Mail, MapPin, Clock, ChevronDown, Send, CheckCircle2, Loader2,
} from "lucide-react";
import { useStore } from "../context/StoreContext";

const FAQS = [
  { q: "How long does delivery take?", a: "Dhaka: same-day / next-day express. Near-Dhaka (Gazipur, Narayanganj, Munshiganj, Manikganj, Narsingdi): 1–2 days. All other districts: 2–5 working days via Pathao or Steadfast. Free delivery over ৳5,000; otherwise ৳60 / ৳90 / ৳130 by zone." },
  { q: "Cash on Delivery available?", a: "Yes — COD is available in all 64 districts. For bKash/Nagad/SSLCommerz orders, payment is verified via IPN/callback before dispatch and a transaction ID is shared with you." },
  { q: "Can I return or exchange?", a: "Within 7 days of delivery, unused items with tags and invoice are eligible. Log in → Track Order → Request return, or message us on WhatsApp. Approved refunds return to the original payment method in 3–5 working days." },
  { q: "Are your products authentic?", a: "We are authorised dealers for SS Ton, SG, Yonex, Nivia and more. Every bat ships with a manufacturer warranty card. Counterfeits are not tolerated — 100% authentic, always." },
  { q: "Do you do bulk / club orders?", a: "Yes! For 11+ pieces (custom jerseys, kits, trophies) we give team pricing with free mock-up approval. Fill the form with 'Bulk order' in the subject or WhatsApp us." },
  { q: "How do I track my order?", a: "Use the Track Order page with your order ID (SS-XXXXX) from the SMS, or log in → My Orders. Status updates come via SMS at every stage: Pending → Confirmed → Packed → Shipped → Delivered." },
];

export default function Contact() {
  const { toast, user } = useStore();
  const [form, setForm] = useState({ name: user?.name ?? "", phone: user?.phone ?? "", subject: "Bulk order", message: "" });
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(0);

  useEffect(() => { document.title = "Contact & FAQ | Solidarity Squad"; }, []);

  const submit = (e) => {
    e.preventDefault();
    if (form.message.trim().length < 10) return toast("Please write a bit more (min 10 characters)");
    setSending(true);
    setTimeout(() => { setSending(false); setForm((f) => ({ ...f, message: "" })); toast("Message received — we reply within 1 working hour (10am–10pm)"); }, 900);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-5xl font-extrabold">TALK TO THE <span className="text-brand">SQUAD</span></h1>
      <p className="mt-1 text-sm text-mut">We reply fast — 10am to 10pm, every day.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Support channels + form */}
        <div className="space-y-4 lg:col-span-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { href: "https://wa.me/8801700000000", label: "WhatsApp", sub: "Fastest reply", icon: MessageCircle, bg: "#25D366" },
              { href: "tel:+8801700000000", label: "Call us", sub: "+880 1700-000000", icon: Phone, bg: "#0b5d3b" },
              { href: "mailto:support@solidaritysquad.com.bd", label: "Email", sub: "support@ss.com.bd", icon: Mail, bg: "#16417e" },
              { href: "https://m.me/solidaritysquad", label: "Messenger", sub: "m.me/solidaritysquad", icon: MessageCircle, bg: "#a334fa" },
            ].map(({ href, label, sub, icon: Icon, bg }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="card-surface flex flex-col items-center gap-1.5 p-4 text-center transition hover:-translate-y-1 hover:shadow-lg">
                <span className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: bg }}><Icon className="h-6 w-6 text-white" /></span>
                <span className="text-xs font-extrabold">{label}</span>
                <span className="text-[10px] leading-tight text-mut">{sub}</span>
              </a>
            ))}
          </div>

          <form onSubmit={submit} className="card-surface p-6">
            <h2 className="font-display text-2xl font-extrabold">Send us a message</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input className="field" placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} aria-label="Name" />
              <input className="field" placeholder="01XXXXXXXXX" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} aria-label="Phone" inputMode="numeric" />
            </div>
            <select className="field mt-3" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} aria-label="Subject">
              {["Bulk order", "Order issue", "Return / exchange", "Payment problem", "Product question", "Partnership", "Other"].map((s) => <option key={s}>{s}</option>)}
            </select>
            <textarea className="field mt-3" rows={4} placeholder="Tell us everything — order ID helps!" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} aria-label="Message" />
            <button type="submit" disabled={sending} className="btn-brand mt-3 w-full sm:w-auto">
              {sending ? <><Loader2 className="h-5 w-5 animate-spin" />Sending…</> : <>Send message <Send className="h-4 w-4" /></>}
            </button>
          </form>

          {/* Map placeholder styled as a card */}
          <div className="card-surface flex items-center gap-4 overflow-hidden">
            <div className="grid h-36 w-36 shrink-0 place-items-center bg-brandsoft"><MapPin className="h-10 w-10 text-brand" /></div>
            <div className="p-4 text-xs">
              <p className="font-extrabold uppercase tracking-wider text-mut">Flagship store &amp; warehouse</p>
              <p className="mt-1 font-bold text-ink">House 24, Road 8, Dhanmondi, Dhaka 1209</p>
              <p className="mt-1 flex items-center gap-1.5 text-mut"><Clock className="h-4 w-4" />Sat–Thu 10:00–20:30 · Fri 14:00–21:00</p>
            </div>
          </div>
        </div>

        {/* FAQ accordion */}
        <section className="lg:col-span-2" aria-label="Frequently asked questions">
          <h2 className="font-display text-3xl font-extrabold">FAQ</h2>
          <div className="mt-3 space-y-2">
            {FAQS.map((item, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-line bg-surf">
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-3 p-4 text-left text-sm font-extrabold">
                  {item.q}
                  <ChevronDown className={`h-5 w-5 shrink-0 text-mut transition-transform ${open === i ? "rotate-180 text-brand" : ""}`} />
                </button>
                {open === i && <div className="border-t border-line p-4 text-xs leading-relaxed text-mut">{item.a}</div>}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-good/30 bg-brandsoft p-3 text-[11px] font-semibold text-good">
            <CheckCircle2 className="h-5 w-5 shrink-0" /> Average first-response time today: 18 minutes
          </div>
        </section>
      </div>
    </div>
  );
}

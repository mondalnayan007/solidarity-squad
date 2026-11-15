import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

const PAGES = {
  about: { title: "About Solidarity Squad", body: [
    "Solidarity Squad is Bangladesh's dedicated sports gear destination — built by players, for players. Since 2019 we've served 25,000+ customers across all 64 districts with authentic cricket, football, badminton and gym equipment.",
    "We are authorised dealers for SS Ton, SG, CA Plus, Yonex, Nivia, Cosco and BD Tigers official merchandise. Every order ships from our Dhanmondi warehouse with quality checks.",
    "Our mission: put proper gear in the hands of every player in Bangladesh — from gully cricket in Old Dhaka to district-level clubs.",
  ] },
  shipping: { title: "Shipping & Delivery", body: [
    "Dhaka: same-day or next-day express delivery. Near-Dhaka districts (Gazipur, Narayanganj, Munshiganj, Manikganj, Narsingdi): 1–2 working days. All other districts: 2–5 working days.",
    "Delivery charge: ৳60 in Dhaka, ৳90 in near-Dhaka, ৳130 elsewhere. FREE on orders above ৳5,000, or with code FREESHIP.",
    "Deliveries are handled by Pathao and Steadfast with SMS tracking. For COD, please keep exact change ready — our couriers often cannot break large notes.",
  ] },
  returns: { title: "Returns & Refunds", body: [
    "7-day easy returns from the delivery date. Items must be unused, with original tags and invoice.",
    "To start a return: log in → My Orders → Request return, or Track Order → Request return. Our team reviews within 24 hours and arranges courier pickup.",
    "Refunds go to the original payment method (bKash/Nagad/card) in 3–5 working days. COD orders are refunded to bKash/Nagad. Exchanges ship after pickup is scanned.",
    "Non-returnable: worn sportswear, grip items (gloves/shin pads) and custom-printed jerseys.",
  ] },
  privacy: { title: "Privacy Policy", body: [
    "We collect your name, phone, address and order history to process orders and deliveries. Phone number is used for OTP login and order updates only.",
    "We never sell your data. Analytics are privacy-friendly; Facebook Pixel is used only to measure campaign effectiveness and may be opted out of in your browser.",
    "You may request deletion of your account and data anytime by writing to privacy@solidaritysquad.com.bd.",
  ] },
  terms: { title: "Terms & Conditions", body: [
    "Prices are in BDT and include VAT. Stock is real-time but confirmed at order placement; if an item sells out, we refund immediately or offer a swap.",
    "Warranty claims are handled with the manufacturer — bring your invoice. We facilitate the process but don't guarantee outcomes beyond the published warranty.",
    "Badminton shuttlecocks and leather balls are considered consumables and are final sale.",
    "Disputes are governed by the laws of Bangladesh; jurisdiction: Dhaka courts.",
  ] },
};

export default function StaticPage() {
  const { slug } = useParams();
  const page = PAGES[slug] ?? PAGES.about;
  useEffect(() => { document.title = `${page.title} | Solidarity Squad`; }, [page.title]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="flex items-center gap-1 text-xs font-bold text-mut hover:text-ink"><ArrowLeft className="h-4 w-4" />Back to home</Link>
      <div className="mt-4 flex items-center gap-3">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brandsoft"><FileText className="h-7 w-7 text-brand" /></span>
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{page.title.toUpperCase()}</h1>
      </div>
      <div className="mt-5 space-y-4 leading-relaxed text-ink">
        {page.body.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <p className="mt-8 border-t border-line pt-4 text-[11px] text-mut">Questions? <Link to="/contact" className="font-bold text-brand hover:underline">Contact the squad →</Link></p>
    </div>
  );
}

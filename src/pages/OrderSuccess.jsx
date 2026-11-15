import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Printer, PackageCheck, MessageCircle, ArrowRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { formatBDT } from "../data/catalog";

export default function OrderSuccess() {
  const { id } = useParams();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id);

  useEffect(() => { document.title = `Order ${id ?? ""} confirmed | Solidarity Squad`; }, [id]);

  const waText = encodeURIComponent(`Hi Solidarity Squad! I just placed order ${id}. Please confirm.`);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-center">
      <CheckCircle2 className="mx-auto h-20 w-20 text-good" strokeWidth={1.5} />
      <h1 className="font-display mt-4 text-5xl font-extrabold">ORDER <span className="text-brand">CONFIRMED</span></h1>
      <p className="mt-2 text-mut">Order <b className="text-ink">{id}</b> has been received. A confirmation SMS &amp; email is on its way.</p>

      <div className="no-print mt-6 flex flex-wrap justify-center gap-2">
        <Link to="/track-order" className="btn-brand"><PackageCheck className="h-5 w-5" />Track my order</Link>
        <button onClick={() => window.print()} className="btn-ghost"><Printer className="h-5 w-5" />Download / print invoice</button>
        <a href={`https://wa.me/8801700000000?text=${waText}`} target="_blank" rel="noreferrer" className="btn-ghost"><MessageCircle className="h-5 w-5 text-[#25D366]" />Share on WhatsApp</a>
      </div>
      <div className="no-print mt-3">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-bold text-brand hover:gap-2 transition-all">Continue shopping <ArrowRight className="h-4 w-4" /></Link>
      </div>

      {/* ── Printable invoice ── */}
      {order && (
        <div className="print-area card-surface mt-8 p-6 text-left">
          <div className="flex items-start justify-between border-b border-line pb-4">
            <div>
              <p className="font-display text-2xl font-extrabold text-brand">SOLIDARITY SQUAD</p>
              <p className="text-[11px] text-mut">Pro Sports &amp; Gear · Dhaka, Bangladesh<br />+880 1700-000000 · support@solidaritysquad.com.bd</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-display text-2xl font-extrabold">INVOICE</p>
              <p className="text-mut">{order.id}</p>
              <p className="text-mut">{new Date(order.date).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-b border-line py-4 text-xs">
            <div>
              <p className="font-extrabold uppercase text-mut">Bill to</p>
              <p className="mt-1 font-bold">{order.customer.name}</p>
              <p>{order.customer.address}</p>
              <p>{order.customer.district} · {order.customer.phone}</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold uppercase text-mut">Payment</p>
              <p className="mt-1 font-bold">{order.payment}</p>
              <p className="text-mut">Txn: {order.paymentId}</p>
              <p className="mt-1 inline-block rounded-full bg-brandsoft px-2 py-0.5 font-bold text-good">{order.status === "Pending" ? "COD · Pending collection" : "PAID"}</p>
            </div>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-mut"><th className="py-2">Item</th><th>Variant</th><th className="text-right">Qty</th><th className="text-right">Price</th><th className="text-right">Amount</th></tr>
            </thead>
            <tbody>
              {order.items.map((l, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="py-2 font-semibold">{l.name}</td>
                  <td className="text-mut">{l.variant}</td>
                  <td className="text-right">{l.qty}</td>
                  <td className="text-right">{formatBDT(l.price)}</td>
                  <td className="text-right font-bold">{formatBDT(l.price * l.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ml-auto mt-3 w-56 space-y-1 border-t border-line pt-3 text-xs">
            <div className="flex justify-between text-mut"><span>Subtotal</span><span>{formatBDT(order.subtotal)}</span></div>
            <div className="flex justify-between text-mut"><span>Delivery</span><span>{order.delivery === 0 ? "FREE" : formatBDT(order.delivery)}</span></div>
            {order.discount > 0 && <div className="flex justify-between font-semibold text-good"><span>Discount {order.coupon && `(${order.coupon})`}</span><span>−{formatBDT(order.discount)}</span></div>}
            <div className="flex justify-between border-t border-line pt-2 font-display text-xl font-extrabold"><span>Total</span><span>{formatBDT(order.total)}</span></div>
          </div>
          <p className="mt-4 border-t border-line pt-3 text-center text-[10px] text-mut">Thank you for shopping with Solidarity Squad · Returns accepted within 7 days with invoice · www.solidaritysquad.com.bd</p>
        </div>
      )}
    </div>
  );
}

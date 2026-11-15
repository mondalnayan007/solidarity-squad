import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Package, CheckCircle2, Circle, Truck, Phone, XCircle, RotateCcw, Loader2 } from "lucide-react";
import { ADMIN_ORDERS, formatBDT, ORDER_STATUS_FLOW } from "../data/catalog";
import { useStore } from "../context/StoreContext";

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const { orders: myOrders, toast, setReturns } = useStore();
  const [query, setQuery] = useState(searchParams.get("order") || "");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = "Track Order | Solidarity Squad"; }, []);

  const search = (e) => {
    e?.preventDefault();
    const q = query.trim().toUpperCase();
    if (!q) return;
    setBusy(true); setNotFound(false); setResult(null);
    setTimeout(() => {
      const mine = myOrders.find((o) => o.id === q);
      const base = ADMIN_ORDERS.find((o) => o.id === q);
      if (mine) {
        setResult({
          id: mine.id, customer: mine.customer.name, district: mine.customer.district,
          payment: mine.payment, total: mine.total, status: mine.status, date: mine.date,
          eta: "1–2 days", courier: "Pathao", tracking: "Will be assigned on confirmation",
          stepsDone: 1,
        });
      } else if (base) {
        const idx = ORDER_STATUS_FLOW.indexOf(base.status);
        setResult({
          id: base.id, customer: base.customer, district: base.district, payment: base.payment,
          total: base.total, status: base.status, date: base.date,
          eta: base.status === "Delivered" ? "Delivered" : "2–4 days",
          courier: base.courier || "Pending assignment", tracking: base.tracking || "—",
          stepsDone: base.status === "Cancelled" || base.status === "Returned" ? 0 : (idx < 0 ? 1 : idx + 1),
        });
      } else {
        setNotFound(true);
      }
      setBusy(false);
    }, 700);
  };

  const cancelOrder = () => {
    toast("Cancellation request sent — our team will confirm via SMS shortly.");
    setResult((r) => ({ ...r, status: "Cancelled", stepsDone: 0 }));
  };
  const requestReturn = () => {
    setReturns((r) => [{ id: `RT-${Date.now().toString().slice(-5)}`, orderId: result.id, date: new Date().toISOString(), status: "Pending approval", reason: "Customer request" }, ...r]);
    toast("Return request submitted — admin will review within 24h.");
  };

  const terminal = result && ["Cancelled", "Returned"].includes(result.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-5xl font-extrabold text-center">TRACK <span className="text-brand">ORDER</span></h1>
      <p className="mt-1 text-center text-sm text-mut">Enter your order ID (e.g. <button className="font-bold text-brand hover:underline" onClick={() => setQuery("SS-10492")}>SS-10492</button>) to see live status.</p>

      <form onSubmit={search} className="mt-6 flex gap-2" role="search">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mut" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Order ID — SS-10492" aria-label="Order ID"
            className="h-13 w-full rounded-2xl border border-line bg-surf py-4 pl-12 pr-4 font-mono text-lg uppercase outline-none focus:border-brand focus:ring-2 focus:ring-brand/25" />
        </div>
        <button type="submit" className="btn-brand !rounded-2xl !px-6" disabled={busy}>{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Track"}</button>
      </form>

      {notFound && (
        <div className="mt-6 rounded-2xl border border-accent/40 bg-accentsoft p-4 text-sm">
          <p className="font-extrabold text-accent">Order not found</p>
          <p className="mt-1 text-mut">Check the ID from your SMS/email, or <Link to="/contact" className="font-bold text-brand hover:underline">contact support</Link> with your phone number.</p>
        </div>
      )}

      {result && (
        <div className="card-surface mt-6 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
            <div>
              <p className="font-mono text-lg font-extrabold">{result.id}</p>
              <p className="text-xs text-mut">{result.customer} · {result.district} · {new Date(result.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
              <p className="mt-1 text-xs text-mut">Payment: <b className="text-ink">{result.payment}</b> · Total: <b className="text-ink">{formatBDT(result.total)}</b></p>
            </div>
            <span className={`status ${result.status === "Delivered" ? "status-ok" : terminal ? "status-bad" : "status-warn"}`}>{result.status}</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-4 text-xs text-mut">
            <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-brand" />Courier: <b className="text-ink">{result.courier}</b></span>
            <span className="flex items-center gap-1.5"><Package className="h-4 w-4 text-brand" />Tracking: <b className="text-ink">{result.tracking}</b></span>
            <span>ETA: <b className="text-ink">{result.eta}</b></span>
          </div>

          {/* Timeline */}
          <ol className="mt-6">
            {ORDER_STATUS_FLOW.map((step, i) => {
              const done = !terminal && i < result.stepsDone;
              const current = !terminal && i === result.stepsDone - 1;
              return (
                <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < ORDER_STATUS_FLOW.length - 1 && <span className={`absolute left-[15px] top-8 h-full w-0.5 ${done && i < result.stepsDone - 1 ? "bg-brand" : "bg-line"}`} aria-hidden="true" />}
                  <span className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 ${done ? "border-brand bg-brand text-white dark:text-[#04120b]" : "border-line bg-surf text-mut"} ${current ? "ring-4 ring-brand/25" : ""}`}>
                    {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </span>
                  <div className="pt-1">
                    <p className={`text-sm font-extrabold ${done ? "text-ink" : "text-mut"}`}>{step}</p>
                    {current && <p className="text-[11px] font-semibold text-brand">Current stage — updated by courier webhook</p>}
                  </div>
                </li>
              );
            })}
          </ol>

          {terminal && (
            <p className="mt-2 flex items-center gap-2 rounded-xl bg-accentsoft p-3 text-sm font-bold text-accent"><XCircle className="h-5 w-5" />This order was {result.status.toLowerCase()}.</p>
          )}

          <div className="no-print mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
            {result.status === "Pending" && <button onClick={cancelOrder} className="btn-ghost !text-accent"><XCircle className="h-5 w-5" />Cancel order</button>}
            {result.status === "Delivered" && <button onClick={requestReturn} className="btn-ghost"><RotateCcw className="h-5 w-5" />Request return / exchange</button>}
            <a href="https://wa.me/8801700000000" target="_blank" rel="noreferrer" className="btn-ghost"><Phone className="h-5 w-5" />Help on WhatsApp</a>
          </div>
        </div>
      )}
    </div>
  );
}

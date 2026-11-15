import { useEffect, useMemo, useState } from "react";
import {
  Search, Truck, Printer, Download, X, PackageCheck, CheckSquare, Square, Loader2,
} from "lucide-react";
import { ORDER_STATUSES, formatBDT, statusClass } from "../data/catalog";
import { useAdminOrders, csvDownload, printPage } from "./adminUtils";
import { useStore } from "../context/StoreContext";

export default function Orders() {
  const [orders, setOrders] = useAdminOrders();
  const { toast } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(new Set());
  const [booking, setBooking] = useState(null); // order or 'bulk'
  const [courier, setCourier] = useState("Pathao");
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = "Orders | Solidarity Squad Admin"; }, []);

  const FILTERS = ["All", "Pending", "Processing", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

  const filtered = useMemo(() => orders.filter((o) => {
    if (filter !== "All" && o.status !== filter) return false;
    if (query) {
      const hay = `${o.id} ${o.customer} ${o.district} ${o.phone}`.toLowerCase();
      if (!query.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }), [orders, filter, query]);

  const toggle = (id) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected((s) => (s.size === filtered.length ? new Set() : new Set(filtered.map((o) => o.id))));

  const fee = (district) => (district === "Dhaka" ? 60 : ["Gazipur", "Narayanganj", "Munshiganj", "Manikganj", "Narsingdi"].includes(district) ? 90 : 130);

  const confirmBooking = () => {
    setBusy(true);
    setTimeout(() => {
      const trackPrefix = courier === "Pathao" ? "PT" : "SF";
      const ids = booking === "bulk" ? [...selected] : [booking.id];
      setOrders((os) => os.map((o) => ids.includes(o.id) && !o.tracking
        ? { ...o, courier, tracking: `${trackPrefix}-${Math.floor(10000 + Math.random() * 89999)}`, status: o.status === "Pending" ? "Confirmed" : o.status }
        : o));
      setBusy(false);
      setBooking(null);
      toast(`${ids.length} parcel(s) booked via ${courier}. Tracking numbers saved; webhook will sync status.`);
      setSelected(new Set());
    }, 1100);
  };

  const setStatus = (id, status) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    toast(`Order ${id} → ${status}`);
  };

  const totals = useMemo(() => ({
    cod: filtered.filter((o) => o.payment === "COD").reduce((a, o) => a + o.total, 0),
    paid: filtered.filter((o) => o.payStatus === "Paid").reduce((a, o) => a + o.total, 0),
  }), [filtered]);

  const bookingOrders = booking === "bulk" ? orders.filter((o) => selected.has(o.id)) : booking ? [booking] : [];
  const bookingCod = bookingOrders.filter((o) => o.payment === "COD").reduce((a, o) => a + o.total, 0);
  const bookingFee = bookingOrders.reduce((a, o) => a + fee(o.district), 0);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-none">ORDERS</h1>
          <p className="mt-1 text-xs text-mut">{filtered.length} shown · COD to collect {formatBDT(totals.cod)} · Paid {formatBDT(totals.paid)}</p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <button onClick={printPage} className="btn-ghost !py-2 text-xs"><Printer className="h-4 w-4" />Print invoices</button>
          <button onClick={() => csvDownload("orders.csv", [["Order", "Customer", "District", "Payment", "Pay status", "Total", "Status", "Courier", "Tracking", "Date"], ...filtered.map((o) => [o.id, o.customer, o.district, o.payment, o.payStatus, o.total, o.status, o.courier, o.tracking, o.date])])} className="btn-ghost !py-2 text-xs"><Download className="h-4 w-4" />Excel</button>
          {selected.size > 0 && (
            <button onClick={() => setBooking("bulk")} className="btn-brand !py-2 text-xs"><Truck className="h-4 w-4" />Bulk book courier ({selected.size})</button>
          )}
        </div>
      </div>

      {/* Search + status pills */}
      <div className="no-print mt-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mut" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order ID, customer, phone, district…" className="field !pl-9" aria-label="Search orders" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => <button key={f} onClick={() => setFilter(f)} className={`chip !py-1.5 ${filter === f ? "on" : ""}`}>{f}</button>)}
        </div>
      </div>

      {/* Table */}
      <div className="card-surface mt-3 overflow-x-auto nice-scroll">
        <table className="w-full min-w-[980px] text-xs [&_th]:px-2">
          <thead>
            <tr className="text-left text-mut">
              <th className="p-3"><button onClick={toggleAll} aria-label="Select all">{selected.size === filtered.length && filtered.length > 0 ? <CheckSquare className="h-4 w-4 text-brand" /> : <Square className="h-4 w-4" />}</button></th>
              <th>Order</th><th>Customer</th><th>District</th><th>Payment</th><th className="text-right">Total</th><th>Status</th><th>Courier / Tracking</th><th className="no-print">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-line hover:bg-bg">
                <td className="p-3"><button onClick={() => toggle(o.id)} aria-label={`Select ${o.id}`} aria-pressed={selected.has(o.id)}>{selected.has(o.id) ? <CheckSquare className="h-4 w-4 text-brand" /> : <Square className="h-4 w-4 text-mut" />}</button></td>
                <td className="p-2 font-mono font-bold">{o.id}{o.mine && <span className="ml-1 rounded bg-brandsoft px-1 text-[9px] text-brand">STORE</span>}<br /><span className="text-[10px] font-normal text-mut">{o.date}</span></td>
                <td className="p-2"><b>{o.customer}</b><br /><span className="text-[10px] text-mut">{o.phone}</span></td>
                <td className="p-2 text-mut">{o.district}</td>
                <td className="p-2">{o.payment}<br /><span className={`status mt-0.5 ${statusClass(o.payStatus)}`}>{o.payStatus}</span></td>
                <td className="p-2 text-right font-bold tabular-nums">{formatBDT(o.total)}</td>
                <td className="p-2">
                  <label className="sr-only" htmlFor={`st-${o.id}`}>Status</label>
                  <select id={`st-${o.id}`} value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className={`status border-0 outline-none ${statusClass(o.status)} cursor-pointer`}>
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-2">{o.tracking ? <><b>{o.courier}</b><br /><span className="font-mono text-[10px] text-mut">{o.tracking}</span></> : <button onClick={() => setBooking(o)} className="btn-ghost !px-2.5 !py-1.5 text-[10px] text-brand"><Truck className="h-4 w-4" />Book courier</button>}</td>
                <td className="no-print p-2"><button onClick={printPage} className="rounded-lg p-2 hover:bg-bg" aria-label="Print invoice"><Printer className="h-4 w-4 text-mut" /></button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={9} className="p-10 text-center text-mut">No orders match “{query}” with filter {filter}.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* ── Courier booking modal ── */}
      {booking && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-label="Book courier">
          <div className="w-full max-w-md rounded-3xl bg-surf p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold">BOOK COURIER</h2>
              <button onClick={() => setBooking(null)} className="rounded-lg p-2 hover:bg-bg" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <p className="mt-1 text-xs text-mut">{booking === "bulk" ? `${bookingOrders.length} selected parcels` : `${booking.id} · ${booking.customer} · ${booking.district}`}</p>
            <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Courier service">
              {["Pathao", "Steadfast"].map((c) => (
                <button key={c} role="radio" aria-checked={courier === c} onClick={() => setCourier(c)}
                  className={`rounded-2xl border p-4 text-left transition ${courier === c ? "border-brand bg-brandsoft ring-2 ring-brand/30" : "border-line hover:border-brand"}`}>
                  <Truck className="h-6 w-6 text-brand" />
                  <span className="mt-1 block text-sm font-extrabold">{c}</span>
                  <span className="text-[10px] text-mut">{c === "Pathao" ? "Same/next-day · urban" : "2–4 days · nationwide"}</span>
                </button>
              ))}
            </div>
            <dl className="mt-4 space-y-1.5 rounded-2xl border border-line bg-bg p-4 text-xs">
              <div className="flex justify-between"><dt className="text-mut">Parcels</dt><dd className="font-bold">{bookingOrders.length}</dd></div>
              <div className="flex justify-between"><dt className="text-mut">Delivery charges</dt><dd className="font-bold">{formatBDT(bookingFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-mut">COD to collect</dt><dd className="font-bold text-warn">{formatBDT(bookingCod)}</dd></div>
              <div className="flex justify-between border-t border-line pt-1.5"><dt className="font-extrabold">Net settlement (est.)</dt><dd className="font-extrabold text-good">{formatBDT(bookingCod - bookingFee)}</dd></div>
            </dl>
            <button onClick={confirmBooking} disabled={busy} className="btn-brand mt-4 h-12 w-full disabled:opacity-70">
              {busy ? <><Loader2 className="h-5 w-5 animate-spin" />Booking via API…</> : <><PackageCheck className="h-5 w-5" />Confirm booking</>}
            </button>
            <p className="mt-2 text-center text-[10px] text-mut">Tracking numbers are written back to orders automatically; status syncs via {courier} webhook. COD is reconciled nightly.</p>
          </div>
        </div>
      )}
    </div>
  );
}

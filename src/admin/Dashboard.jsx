import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp, ShoppingCart, AlertTriangle, PackageCheck, Download, Truck,
} from "lucide-react";
import { PRODUCTS, SALES_7D, formatBDT, statusClass } from "../data/catalog";
import { useAdminOrders, csvDownload, printPage } from "./adminUtils";

// Single-series sequential green — no categorical palette needed (one measure over time).
const BAR = "#0b5d3b";
const BAR_PEAK = "#ffc93c";

export default function Dashboard() {
  const [orders] = useAdminOrders();
  useEffect(() => { document.title = "Dashboard | Solidarity Squad Admin"; }, []);

  const lowStock = useMemo(() => PRODUCTS.filter((p) => p.stock < 10), []);
  const pending = orders.filter((o) => ["Pending", "Processing", "Packed", "Confirmed"].includes(o.status)).length;
  const maxSales = Math.max(...SALES_7D.map((d) => d.sales));
  const totalWeek = SALES_7D.reduce((a, d) => a + d.sales, 0);

  const kpis = [
    { label: "Sales this week", value: formatBDT(totalWeek), delta: "▲ 12.4%", good: true },
    { label: "Orders this week", value: String(orders.length * 26 + 120), delta: "▲ 8.1%", good: true },
    { label: "Low-stock items", value: String(lowStock.length), delta: "Reorder soon", good: false },
    { label: "Pending fulfilment", value: String(pending), delta: "Needs action", good: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-none">DASHBOARD</h1>
          <p className="mt-1 text-xs text-mut">Friday, 14 Nov 2026 · store overview · Dhaka warehouse</p>
        </div>
        <div className="no-print flex gap-2">
          <button onClick={() => csvDownload("solidarity-squad-weekly.csv", [["Day", "Sales (BDT)"], ...SALES_7D.map((d) => [d.day, d.sales])])} className="btn-ghost !py-2 text-xs"><Download className="h-4 w-4" />Excel</button>
          <button onClick={printPage} className="btn-ghost !py-2 text-xs"><Download className="h-4 w-4" />PDF</button>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <div key={k.label} className={`card-surface border-t-4 p-4 ${i === 2 || i === 3 ? "border-t-accent" : "border-t-brand"}`}>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-mut">{k.label}</p>
            <p className="font-display mt-1 text-4xl font-extrabold leading-none">{k.value}</p>
            <p className={`mt-1 flex items-center gap-1 text-[11px] font-bold ${k.good ? "text-good" : "text-warn"}`}>
              {k.good ? <TrendingUp className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}{k.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {/* ── Sales chart (single series, sequential brand green) ── */}
        <section className="card-surface p-5 xl:col-span-2" aria-label="Sales, last 7 days">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold">SALES · LAST 7 DAYS</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-mut">BDT · Dhaka</span>
          </div>
          {/* Chart: bars, recessive baseline, 4px rounded tops */}
          <div className="mt-4 flex h-44 items-end gap-2 border-b-2 border-line pb-px sm:gap-4" role="img"
               aria-label={`Bar chart of sales per day. Peak ${formatBDT(maxSales)} on Friday.`}>
            {SALES_7D.map((d) => {
              const peak = d.sales === maxSales;
              return (
                <div key={d.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-[9px] font-bold tabular-nums text-mut opacity-0 transition group-hover:opacity-100 sm:text-[10px]">{(d.sales / 1000).toFixed(1)}K</span>
                  <div
                    title={`${d.day}: ${formatBDT(d.sales)}`}
                    className="w-full rounded-t-[4px] transition-all duration-150 group-hover:brightness-125"
                    style={{ height: `${(d.sales / maxSales) * 100}%`, background: peak ? BAR_PEAK : BAR, minWidth: 12 }}
                  />
                  <span className="text-[10px] font-bold text-mut">{d.day}</span>
                </div>
              );
            })}
          </div>
          {/* Exact values as a table (accessibility / print) */}
          <details className="mt-3 text-xs">
            <summary className="cursor-pointer font-bold text-mut hover:text-ink">Table view of chart data</summary>
            <table className="mt-2 w-full">
              <thead><tr className="text-left text-mut"><th>Day</th><th className="text-right">Sales</th></tr></thead>
              <tbody>{SALES_7D.map((d) => <tr key={d.day} className="border-t border-line"><td>{d.day}</td><td className="text-right tabular-nums">{formatBDT(d.sales)}</td></tr>)}</tbody>
            </table>
          </details>
        </section>

        {/* Integrations status */}
        <section className="card-surface p-5">
          <h2 className="font-display text-2xl font-extrabold">INTEGRATIONS</h2>
          <p className="text-[11px] text-mut">Live gateway &amp; courier health</p>
          <ul className="mt-3 space-y-2 text-xs font-semibold">
            {[
              ["SSLCommerz IPN webhook", "ok"], ["bKash / Nagad callbacks", "ok"],
              ["Rocket (via SSLCommerz)", "ok"], ["Pathao webhook (status + COD)", "ok"],
              ["Steadfast webhook", "ok"], ["SMS gateway (BulkSMS BD)", "ok"], ["Facebook Pixel + GA4", "warn"],
            ].map(([name, s]) => (
              <li key={name} className="flex items-center gap-2 rounded-xl border border-line px-3 py-2">
                <span className={`h-2.5 w-2.5 rounded-full ${s === "ok" ? "bg-good" : "bg-warn"}`} aria-hidden="true" />
                <span className="flex-1">{name}</span>
                <span className={s === "ok" ? "text-good" : "text-warn"}>{s === "ok" ? "Live" : "Check"}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-2xl border border-gold/40 bg-[#fffbe8] p-3 text-[11px] dark:bg-[#2a2508] dark:border-gold/20">
            <p className="font-extrabold uppercase text-[#8a6d00] dark:text-gold">Low stock alert</p>
            <p className="mt-0.5 text-ink">{lowStock.slice(0, 3).map((p) => p.name.split(" ").slice(0, 3).join(" ")).join(" · ")}…</p>
            <Link to="/admin/inventory" className="mt-1 inline-flex items-center gap-1 font-extrabold text-brand">Restock now →</Link>
          </div>
        </section>
      </div>

      {/* Latest orders */}
      <section className="card-surface mt-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-extrabold">LATEST ORDERS</h2>
          <Link to="/admin/orders" className="flex items-center gap-1 text-xs font-extrabold text-brand hover:gap-2 transition-all"><ShoppingCart className="h-4 w-4" />Process orders →</Link>
        </div>
        <div className="mt-2 overflow-x-auto nice-scroll">
          <table className="w-full text-xs [&_td]:px-2 [&_th]:px-2">
            <thead><tr className="text-left text-mut"><th className="py-2">Order</th><th>Customer</th><th>District</th><th>Payment</th><th className="text-right">Total</th><th>Status</th><th>Courier</th></tr></thead>
            <tbody>
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id} className="border-t border-line hover:bg-bg">
                  <td className="py-2 font-mono font-bold">{o.id}{o.mine && <span className="ml-1 rounded bg-brandsoft px-1 text-[9px] text-brand">NEW</span>}</td>
                  <td>{o.customer}</td>
                  <td className="text-mut">{o.district}</td>
                  <td>{o.payment} <span className={`status ml-1 ${statusClass(o.payStatus)}`}>{o.payStatus}</span></td>
                  <td className="text-right font-bold tabular-nums">{formatBDT(o.total)}</td>
                  <td><span className={`status ${statusClass(o.status)}`}>{o.status}</span></td>
                  <td className="text-mut">{o.tracking || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-mut"><PackageCheck className="h-4 w-4" />Status syncs automatically via courier webhooks · COD reconciliation every evening.</p>
        <p className="mt-1 flex items-center gap-1.5 text-[10px] text-mut"><Truck className="h-4 w-4" />Booked parcels appear in Pathao / Steadfast with tracking numbers copied back to the order.</p>
      </section>
    </div>
  );
}

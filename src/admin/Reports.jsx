import { useEffect, useMemo, useState } from "react";
import { Download, Printer, TrendingUp, Package, MapPin, CreditCard, TicketPercent, Boxes, BarChart3 } from "lucide-react";
import { SALES_7D, CATEGORY_SALES, DISTRICT_SALES, COUPONS, PRODUCTS, formatBDT } from "../data/catalog";
import { csvDownload, printPage, useAdminOrders } from "./adminUtils";

const REPORTS = [
  { id: "sales", label: "Sales", icon: TrendingUp },
  { id: "product", label: "Product-wise", icon: Package },
  { id: "district", label: "District-wise", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "coupon", label: "Coupon usage", icon: TicketPercent },
  { id: "stock", label: "Stock / value", icon: Boxes },
];

// Horizontal bars, single sequential green — one measure, no legend needed.
function HBars({ rows, unit = "%" }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3 text-xs">
          <span className="w-32 truncate text-mut" title={r.label}>{r.label}</span>
          <div className="h-5 flex-1 overflow-hidden rounded-[4px] bg-surf2">
            <div className="h-full rounded-[4px] bg-brand transition-all duration-300" style={{ width: `${(r.value / max) * 100}%` }} title={`${r.label}: ${r.display ?? r.value + unit}`} />
          </div>
          <span className="w-20 text-right font-bold tabular-nums">{r.display ?? `${r.value}${unit}`}</span>
        </div>
      ))}
    </div>
  );
}

export default function Reports() {
  const [report, setReport] = useState("sales");
  const [orders] = useAdminOrders();
  useEffect(() => { document.title = "Reports | Solidarity Squad Admin"; }, []);

  const paymentRows = useMemo(() => {
    const acc = {};
    for (const o of orders) {
      const k = String(o.payment).replace(/ \(.*\)/, "");
      acc[k] = acc[k] ?? { label: k, count: 0, value: 0 };
      acc[k].count += 1; acc[k].value += o.total;
    }
    return Object.values(acc).sort((a, b) => b.value - a.value);
  }, [orders]);

  const stockValue = PRODUCTS.reduce((a, p) => a + p.stock * p.price, 0);
  const stockRows = [...PRODUCTS].sort((a, b) => a.stock - b.stock).slice(0, 8)
    .map((p) => ({ label: p.name, value: p.stock, display: `${p.stock} units` }));

  const productRows = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 8)
    .map((p) => ({ label: p.name, value: p.sold, display: `${p.sold.toLocaleString()} sold` }));

  const active = REPORTS.find((r) => r.id === report);

  const exportCsv = () => {
    switch (report) {
      case "sales": return csvDownload("sales-report.csv", [["Day", "Sales (BDT)"], ...SALES_7D.map((d) => [d.day, d.sales])]);
      case "product": return csvDownload("product-sales.csv", [["Product", "Category", "Units sold", "Revenue (BDT)"], ...[...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 50).map((p) => [p.name, p.cat, p.sold, p.sold * p.price])]);
      case "district": return csvDownload("district-sales.csv", [["District", "Share %", "Orders"], ...DISTRICT_SALES.map((d) => [d.district, d.pct, d.orders])]);
      case "payment": return csvDownload("payment-report.csv", [["Method", "Transactions", "Volume (BDT)"], ...paymentRows.map((p) => [p.label, p.count, p.value])]);
      case "coupon": return csvDownload("coupon-report.csv", [["Code", "Type", "Value", "Applies", "Status", "Used"], ...COUPONS.map((c) => [c.code, c.type, c.value, c.applies, c.status, c.used])]);
      case "stock": return csvDownload("stock-report.csv", [["Product", "Stock", "Unit price", "Stock value"], ...[...PRODUCTS].sort((a, b) => a.stock - b.stock).map((p) => [p.name, p.stock, p.price, p.stock * p.price])]);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-none">REPORTS</h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-mut"><BarChart3 className="h-4 w-4" />{active?.label} report · FY 2026–27 · exportable as Excel / PDF</p>
        </div>
        <div className="no-print flex gap-2">
          <button onClick={exportCsv} className="btn-ghost !py-2 text-xs"><Download className="h-4 w-4" />Excel</button>
          <button onClick={printPage} className="btn-ghost !py-2 text-xs"><Printer className="h-4 w-4" />PDF</button>
        </div>
      </div>

      {/* Report switcher */}
      <div className="no-print mt-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Report type">
        {REPORTS.map(({ id, label, icon: Icon }) => (
          <button key={id} role="tab" aria-selected={report === id} onClick={() => setReport(id)} className={`chip ${report === id ? "on" : ""}`}><Icon className="h-4 w-4" />{label}</button>
        ))}
      </div>

      <div className="print-area mt-4">
        {/* ── SALES ── */}
        {report === "sales" && (
          <div className="grid gap-4 lg:grid-cols-5">
            <section className="card-surface p-5 lg:col-span-3">
              <h2 className="font-display text-2xl font-extrabold">SALES · LAST 7 DAYS</h2>
              <div className="mt-3 flex h-52 items-end gap-2 border-b-2 border-line sm:gap-3" role="img" aria-label="Sales per day bar chart">
                {SALES_7D.map((d) => {
                  const max = Math.max(...SALES_7D.map((x) => x.sales));
                  return (
                    <div key={d.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-1">
                      <span className="text-[9px] font-bold tabular-nums text-mut opacity-0 transition group-hover:opacity-100">{(d.sales / 1000).toFixed(1)}K</span>
                      <div className="w-full rounded-t-[4px] bg-brand transition-all group-hover:brightness-125" style={{ height: `${(d.sales / max) * 100}%`, minWidth: 14 }} title={`${d.day}: ${formatBDT(d.sales)}`} />
                      <span className="text-[10px] font-bold text-mut">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </section>
            <section className="card-surface p-5 lg:col-span-2">
              <h2 className="font-display text-2xl font-extrabold">BY CATEGORY · THIS MONTH</h2>
              <div className="mt-3"><HBars rows={CATEGORY_SALES.map((c) => ({ label: c.cat, value: c.pct, display: `${c.pct}%` }))} /></div>
              <p className="mt-3 text-xs text-mut">Total revenue this week: <b className="text-ink">{formatBDT(SALES_7D.reduce((a, d) => a + d.sales, 0))}</b></p>
            </section>
          </div>
        )}

        {/* ── PRODUCT ── */}
        {report === "product" && (
          <section className="card-surface p-5">
            <h2 className="font-display text-2xl font-extrabold">PRODUCT-WISE · TOP 8 BY UNITS SOLD</h2>
            <div className="mt-3"><HBars rows={productRows} /></div>
            <div className="mt-4 overflow-x-auto nice-scroll">
              <table className="w-full text-xs"><thead><tr className="text-left text-mut"><th className="py-2">Product</th><th>Category</th><th className="text-right">Units</th><th className="text-right">Revenue</th></tr></thead>
                <tbody>{[...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 10).map((p) => (
                  <tr key={p.id} className="border-t border-line"><td className="py-1.5">{p.name}</td><td className="capitalize text-mut">{p.cat}</td><td className="text-right tabular-nums">{p.sold.toLocaleString()}</td><td className="text-right tabular-nums">{formatBDT(p.sold * p.price)}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── DISTRICT ── */}
        {report === "district" && (
          <section className="card-surface p-5">
            <h2 className="font-display text-2xl font-extrabold">DISTRICT-WISE · ALL 64 DISTRICTS</h2>
            <p className="text-[11px] text-mut">Top 8 by order volume — full 64-district breakdown in the Excel export.</p>
            <div className="mt-3"><HBars rows={DISTRICT_SALES.map((d) => ({ label: d.district, value: d.orders, display: `${d.orders} orders` }))} /></div>
          </section>
        )}

        {/* ── PAYMENT ── */}
        {report === "payment" && (
          <section className="card-surface p-5">
            <h2 className="font-display text-2xl font-extrabold">PAYMENT METHODS · SETTLEMENT</h2>
            <div className="mt-3 overflow-x-auto nice-scroll">
              <table className="w-full text-xs"><thead><tr className="text-left text-mut"><th className="py-2">Method</th><th className="text-right">Transactions</th><th className="text-right">Volume</th><th className="text-right">Share</th></tr></thead>
                <tbody>{paymentRows.map((p) => {
                  const total = paymentRows.reduce((a, x) => a + x.value, 0);
                  return <tr key={p.label} className="border-t border-line"><td className="py-1.5 font-bold">{p.label}</td><td className="text-right tabular-nums">{p.count}</td><td className="text-right tabular-nums">{formatBDT(p.value)}</td><td className="text-right tabular-nums">{Math.round((p.value / total) * 100)}%</td></tr>;
                })}</tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-mut">SSLCommerz settles T+1 · bKash/Nagad instant via IPN · COD reconciled nightly against courier remittance reports.</p>
          </section>
        )}

        {/* ── COUPON ── */}
        {report === "coupon" && (
          <section className="card-surface p-5">
            <h2 className="font-display text-2xl font-extrabold">COUPON USAGE</h2>
            <div className="mt-3 overflow-x-auto nice-scroll">
              <table className="w-full text-xs"><thead><tr className="text-left text-mut"><th className="py-2">Code</th><th>Discount</th><th>Applies</th><th>Status</th><th className="text-right">Redemptions</th></tr></thead>
                <tbody>{COUPONS.map((c) => (
                  <tr key={c.code} className="border-t border-line"><td className="py-1.5 font-mono font-extrabold">{c.code}</td><td>{c.type === "percent" ? `${c.value}%` : formatBDT(c.value)}</td><td className="text-mut">{c.applies}</td><td>{c.status}</td><td className="text-right tabular-nums">{c.used}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── STOCK ── */}
        {report === "stock" && (
          <section className="card-surface p-5">
            <h2 className="font-display text-2xl font-extrabold">STOCK &amp; VALUE</h2>
            <p className="text-xs text-mut">Total stock value: <b className="text-ink">{formatBDT(stockValue)}</b> · showing 8 lowest-stock items</p>
            <div className="mt-3"><HBars rows={stockRows} /></div>
          </section>
        )}
      </div>
    </div>
  );
}

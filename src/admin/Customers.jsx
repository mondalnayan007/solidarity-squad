import { useEffect, useMemo, useState } from "react";
import { Search, Ban, ShieldCheck, Download, X, UserRound, Package } from "lucide-react";
import { ADMIN_CUSTOMERS, ADMIN_ORDERS, formatBDT, statusClass } from "../data/catalog";
import { csvDownload } from "./adminUtils";
import { useStore } from "../context/StoreContext";

export default function Customers() {
  const { toast } = useStore();
  const [customers, setCustomers] = useState(() => ADMIN_CUSTOMERS.map((c) => ({ ...c })));
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null); // customer detail modal

  useEffect(() => { document.title = "Customers | Solidarity Squad Admin"; }, []);

  const filtered = useMemo(() => customers.filter((c) =>
    !query || `${c.name} ${c.phone} ${c.district}`.toLowerCase().includes(query.toLowerCase())
  ), [customers, query]);

  const toggleBlock = (id) => {
    setCustomers((list) => list.map((c) => (c.id === id ? { ...c, blocked: !c.blocked } : c)));
    const c = customers.find((x) => x.id === id);
    toast(c?.blocked ? `${c.name} unblocked` : `${c.name} blocked — they cannot place orders`);
  };

  const ordersFor = (name) => ADMIN_ORDERS.filter((o) => o.customer === name);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-none">CUSTOMERS</h1>
          <p className="mt-1 text-xs text-mut">{customers.length} registered · {customers.filter((c) => c.blocked).length} blocked</p>
        </div>
        <button onClick={() => csvDownload("customers.csv", [["ID", "Name", "Phone", "District", "Orders", "Spent (BDT)", "Joined", "Blocked"], ...filtered.map((c) => [c.id, c.name, c.phone, c.district, c.orders, c.spent, c.joined, c.blocked ? "yes" : "no"])])} className="btn-ghost !py-2 text-xs"><Download className="h-4 w-4" />Export</button>
      </div>

      <div className="relative mt-4 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mut" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, phone, district…" className="field !pl-9" aria-label="Search customers" />
      </div>

      <div className="card-surface mt-3 overflow-x-auto nice-scroll">
        <table className="w-full min-w-[760px] text-xs">
          <thead><tr className="text-left text-mut"><th className="p-3">Customer</th><th>Phone</th><th>District</th><th className="text-right">Orders</th><th className="text-right">Spent</th><th>Since</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-line hover:bg-bg">
                <td className="flex items-center gap-2 p-2"><span className="grid h-9 w-9 place-items-center rounded-full bg-brandsoft text-sm font-extrabold text-brand">{c.name[0]}</span><button className="font-bold hover:text-brand" onClick={() => setSelected(c)}>{c.name}</button></td>
                <td className="p-2 font-mono text-[11px]">{c.phone}</td>
                <td className="p-2 text-mut">{c.district}</td>
                <td className="p-2 text-right tabular-nums">{c.orders}</td>
                <td className="p-2 text-right font-bold tabular-nums">{formatBDT(c.spent)}</td>
                <td className="p-2 text-mut">{c.joined}</td>
                <td className="p-2"><span className={`status ${c.blocked ? "status-bad" : "status-ok"}`}>{c.blocked ? "Blocked" : "Active"}</span></td>
                <td className="p-2 text-right">
                  <button onClick={() => toggleBlock(c.id)} className={`rounded-lg p-2 hover:bg-bg ${c.blocked ? "text-good" : "text-accent"}`} title={c.blocked ? "Unblock" : "Block"} aria-label={c.blocked ? `Unblock ${c.name}` : `Block ${c.name}`}>
                    {c.blocked ? <ShieldCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="p-10 text-center text-mut">No customers match “{query}”.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Customer detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-label="Customer details">
          <div className="w-full max-w-md rounded-3xl bg-surf p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brandsoft"><UserRound className="h-7 w-7 text-brand" /></span>
                <div><h2 className="font-display text-2xl font-extrabold leading-none">{selected.name}</h2><p className="mt-1 font-mono text-[11px] text-mut">{selected.id} · {selected.phone}</p></div>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 hover:bg-bg" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              {[["Orders", selected.orders], ["Lifetime", formatBDT(selected.spent)], ["Since", selected.joined.slice(0, 7)]].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-line bg-bg p-3"><dt className="text-[10px] font-bold uppercase text-mut">{k}</dt><dd className="mt-0.5 font-display text-lg font-extrabold">{v}</dd></div>
              ))}
            </dl>
            <h3 className="mt-4 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-mut"><Package className="h-4 w-4" />Recent orders</h3>
            <div className="mt-1.5 max-h-48 space-y-1.5 overflow-y-auto nice-scroll">
              {ordersFor(selected.name).slice(0, 6).map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-2 rounded-xl border border-line px-3 py-2 text-xs">
                  <span className="font-mono font-bold">{o.id}</span>
                  <span className="text-mut">{o.district}</span>
                  <span className="font-bold">{formatBDT(o.total)}</span>
                  <span className={`status ${statusClass(o.status)}`}>{o.status}</span>
                </div>
              ))}
              {ordersFor(selected.name).length === 0 && <p className="p-4 text-center text-mut">No recorded orders in the demo dataset.</p>}
            </div>
            <button onClick={() => { toggleBlock(selected.id); setSelected(null); }} className={`mt-4 h-11 w-full rounded-xl font-bold ${selected.blocked ? "bg-good text-white" : "bg-accent text-white"}`}>
              {selected.blocked ? "Unblock customer" : "Block customer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

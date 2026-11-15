import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Download, Boxes, Minus, Plus, Search } from "lucide-react";
import { PRODUCTS, formatBDT } from "../data/catalog";
import { csvDownload } from "./adminUtils";
import { useStore } from "../context/StoreContext";

export default function Inventory() {
  const { toast } = useStore();
  const [items, setItems] = useState(() => PRODUCTS.map((p) => ({ id: p.id, name: p.name, cat: p.cat, price: p.price, stock: p.stock, emoji: p.emoji, bg: p.bg })));
  const [query, setQuery] = useState("");
  const [lowOnly, setLowOnly] = useState(false);

  useEffect(() => { document.title = "Inventory | Solidarity Squad Admin"; }, []);

  const filtered = useMemo(() => items.filter((p) => {
    if (lowOnly && p.stock >= 10) return false;
    if (query && !`${p.name} ${p.cat}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }).sort((a, b) => a.stock - b.stock), [items, query, lowOnly]);

  const lowCount = items.filter((p) => p.stock < 10).length;
  const outCount = items.filter((p) => p.stock === 0).length;
  const stockValue = items.reduce((a, p) => a + p.stock * p.price, 0);

  const adjust = (id, delta) => {
    setItems((list) => list.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)));
    const p = items.find((x) => x.id === id);
    toast(`Stock ${delta > 0 ? "+" : ""}${delta} — ${p?.name.slice(0, 30)}`);
  };

  const barColor = (s) => (s === 0 ? "#e5392b" : s < 10 ? "#f59e0b" : "#0b5d3b");

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-none">INVENTORY</h1>
          <p className="mt-1 flex items-center gap-2 text-xs text-mut"><Boxes className="h-4 w-4" />{items.length} SKUs · stock value <b className="text-ink">{formatBDT(stockValue)}</b> · <span className="font-bold text-accent">{lowCount} low</span> · {outCount} out</p>
        </div>
        <button onClick={() => csvDownload("inventory.csv", [["ID", "Product", "Category", "Price", "Stock"], ...filtered.map((p) => [p.id, p.name, p.cat, p.price, p.stock])])} className="btn-ghost !py-2 text-xs"><Download className="h-4 w-4" />Export stock</button>
      </div>

      {lowCount > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-warn/40 bg-[#fde9c4] p-3 text-xs font-semibold text-warn dark:bg-[#2a210a]">
          <AlertTriangle className="h-5 w-5 shrink-0" /> {lowCount} item(s) below reorder level — highlighted in amber below.
          <button onClick={() => setLowOnly((v) => !v)} className="ml-auto whitespace-nowrap font-extrabold underline">{lowOnly ? "Show all" : "Show low only"}</button>
        </div>
      )}

      <div className="relative mt-3 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mut" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stock…" className="field !pl-9" aria-label="Search inventory" />
      </div>

      <div className="card-surface mt-3 overflow-x-auto nice-scroll">
        <table className="w-full min-w-[720px] text-xs">
          <thead><tr className="text-left text-mut"><th className="p-3">Product</th><th>Category</th><th className="text-right">Unit price</th><th className="w-56">Level</th><th className="text-right">Qty</th><th className="text-right">Adjust</th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-line hover:bg-bg">
                <td className="flex items-center gap-2 p-2"><span className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: p.bg }}>{p.emoji}</span><b className="max-w-56 line-clamp-1">{p.name}</b></td>
                <td className="p-2 capitalize text-mut">{p.cat}</td>
                <td className="p-2 text-right tabular-nums">{formatBDT(p.price)}</td>
                <td className="p-2"><div className="h-2.5 min-w-24 overflow-hidden rounded-full bg-surf2"><div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, p.stock * 2.5)}%`, background: barColor(p.stock) }} /></div></td>
                <td className="p-2 text-right text-sm font-extrabold tabular-nums">{p.stock}</td>
                <td className="p-2 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button onClick={() => adjust(p.id, -10)} className="grid h-7 w-7 place-items-center rounded-lg border border-line hover:border-accent hover:text-accent" aria-label="Remove 10 units"><Minus className="h-4 w-4" /></button>
                    <button onClick={() => adjust(p.id, -1)} className="grid h-7 w-7 place-items-center rounded-lg border border-line hover:border-accent hover:text-accent text-[10px] font-extrabold" aria-label="Remove 1 unit">1</button>
                    <button onClick={() => adjust(p.id, +1)} className="grid h-7 w-7 place-items-center rounded-lg border border-line hover:border-brand hover:text-brand text-[10px] font-extrabold" aria-label="Add 1 unit">1</button>
                    <button onClick={() => adjust(p.id, +20)} className="grid h-7 w-7 place-items-center rounded-lg border border-line hover:border-brand hover:text-brand" aria-label="Add 20 units"><Plus className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

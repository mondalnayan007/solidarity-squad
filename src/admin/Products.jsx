import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search, Plus, Pencil, Trash2, X, Download, Upload, Loader2, Tags,
} from "lucide-react";
import { CATEGORIES, BRANDS, PRODUCTS, formatBDT } from "../data/catalog";
import { csvDownload } from "./adminUtils";
import { useStore } from "../context/StoreContext";

const EMPTY = { name: "", cat: "cricket", brand: BRANDS[0], price: "", mrp: "", stock: "", variants: "Standard", emoji: "🏏", desc: "" };

export default function Products() {
  const { toast } = useStore();
  const [items, setItems] = useState(() => PRODUCTS.map((p) => ({ ...p })));
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [modal, setModal] = useState(null); // null | {mode:'add'|'edit', data}
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { document.title = "Products | Solidarity Squad Admin"; }, []);

  const filtered = useMemo(() => items.filter((p) => {
    if (cat && p.cat !== cat) return false;
    if (query) { const hay = `${p.name} ${p.brand} ${p.sub ?? ""}`.toLowerCase(); if (!query.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false; }
    return true;
  }), [items, query, cat]);

  const openAdd = () => setModal({ mode: "add", data: { ...EMPTY } });
  const openEdit = (p) => setModal({ mode: "edit", data: { ...p, variants: (p.variants ?? []).join(", "), price: String(p.price), mrp: p.mrp ? String(p.mrp) : "", stock: String(p.stock) } });

  const save = () => {
    const d = modal.data;
    if (d.name.trim().length < 3) return toast("Product name too short");
    setBusy(true);
    setTimeout(() => {
      const payload = {
        ...d,
        price: Number(d.price) || 0,
        mrp: d.mrp ? Number(d.mrp) : undefined,
        stock: Number(d.stock) || 0,
        variants: String(d.variants).split(",").map((v) => v.trim()).filter(Boolean),
        rating: d.rating ?? 4.5, reviews: d.reviews ?? 0, sold: d.sold ?? 0,
      };
      if (modal.mode === "add") setItems((list) => [{ id: Math.max(...list.map((p) => p.id)) + 1, ...payload, bg: "linear-gradient(150deg,#eef6ec,#cde8d6)" }, ...list]);
      else setItems((list) => list.map((p) => (p.id === d.id ? { ...p, ...payload } : p)));
      setBusy(false); setModal(null);
      toast(modal.mode === "add" ? "Product added to catalog" : "Product updated");
    }, 500);
  };

  const remove = (p) => { setItems((list) => list.filter((x) => x.id !== p.id)); toast(`Deleted “${p.name.slice(0, 32)}…”`); };

  const exportCsv = () => csvDownload("products.csv", [
    ["ID", "Name", "Category", "Brand", "Price (BDT)", "MRP", "Stock", "Sold", "Rating"],
    ...filtered.map((p) => [p.id, p.name, p.cat, p.brand, p.price, p.mrp ?? "", p.stock, p.sold ?? 0, p.rating ?? ""]),
  ]);

  const importCsv = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const lines = String(reader.result).split(/\r?\n/).filter((l) => l.trim());
        const rows = lines.slice(1).map((l) => l.split(",").map((c) => c.replace(/^"|"$/g, "").trim()));
        const imported = rows.map((r, i) => ({
          id: Date.now() + i, name: r[0] || "Imported product", cat: CATEGORIES.some((c) => c.id === r[1]) ? r[1] : "accessories",
          brand: r[2] || "Solidarity Squad", price: Number(r[3]) || 0, mrp: Number(r[4]) || undefined, stock: Number(r[5]) || 0,
          sold: 0, rating: 4.5, reviews: 0, variants: ["Standard"], emoji: "📦", desc: "Imported via bulk upload",
          bg: "linear-gradient(150deg,#eef6ec,#cde8d6)",
        }));
        setItems((list) => [...imported, ...list]);
        toast(`${imported.length} product(s) imported from CSV`);
      } catch { toast("Could not parse that CSV — expected: Name,Category,Brand,Price,MRP,Stock"); }
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-none">PRODUCTS</h1>
          <p className="mt-1 text-xs text-mut">{filtered.length} of {items.length} shown · catalog, variants &amp; bulk tools</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={importCsv} className="hidden" aria-hidden="true" tabIndex={-1} />
          <button onClick={() => fileRef.current?.click()} className="btn-ghost !py-2 text-xs"><Upload className="h-4 w-4" />Import CSV</button>
          <button onClick={exportCsv} className="btn-ghost !py-2 text-xs"><Download className="h-4 w-4" />Export</button>
          <button onClick={openAdd} className="btn-brand !py-2 text-xs"><Plus className="h-4 w-4" />Add product</button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mut" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, brands…" className="field !pl-9" aria-label="Search products" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="field !w-auto" aria-label="Filter by category">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="card-surface mt-3 overflow-x-auto nice-scroll">
        <table className="w-full min-w-[760px] text-xs">
          <thead><tr className="text-left text-mut"><th className="p-3">Product</th><th>Category</th><th>Brand</th><th className="text-right">Price</th><th className="text-right">Stock</th><th>State</th><th className="text-right">Actions</th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-line hover:bg-bg">
                <td className="flex items-center gap-2 p-2"><span className="grid h-10 w-10 place-items-center rounded-lg text-lg" style={{ background: p.bg }}>{p.emoji}</span><span className="max-w-64"><b className="line-clamp-1">{p.name}</b><br /><span className="text-[10px] text-mut">{p.sub ?? p.cat}</span></span></td>
                <td className="p-2 text-mut">{p.cat}</td>
                <td className="p-2">{p.brand}</td>
                <td className="p-2 text-right font-bold tabular-nums">{formatBDT(p.price)}{p.mrp && <><br /><s className="text-[10px] font-normal text-mut">{formatBDT(p.mrp)}</s></>}</td>
                <td className="p-2 text-right tabular-nums">{p.stock}</td>
                <td className="p-2"><span className={`status ${p.stock === 0 ? "status-bad" : p.stock < 10 ? "status-warn" : "status-ok"}`}>{p.stock === 0 ? "Out" : p.stock < 10 ? "Low" : "In stock"}</span></td>
                <td className="p-2 text-right">
                  <button onClick={() => openEdit(p)} className="rounded-lg p-2 hover:bg-bg" aria-label="Edit"><Pencil className="h-4 w-4 text-mut" /></button>
                  <button onClick={() => remove(p)} className="rounded-lg p-2 hover:bg-accentsoft" aria-label="Delete"><Trash2 className="h-4 w-4 text-accent" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-mut">Nothing matches. Try clearing the filter.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[10px] text-mut"><Tags className="h-4 w-4" />Prices include VAT · variants &amp; images are managed per product · categories sync with the storefront mega menu.</p>

      {/* ── Add/Edit modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-label={modal.mode === "add" ? "Add product" : "Edit product"}>
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-surf p-6 nice-scroll">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold">{modal.mode === "add" ? "ADD PRODUCT" : "EDIT PRODUCT"}</h2>
              <button onClick={() => setModal(null)} className="rounded-lg p-2 hover:bg-bg" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input className="field sm:col-span-2" placeholder="Product name *" value={modal.data.name} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, name: e.target.value } }))} autoFocus />
              <select className="field" value={modal.data.cat} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, cat: e.target.value } }))} aria-label="Category">{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
              <select className="field" value={modal.data.brand} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, brand: e.target.value } }))} aria-label="Brand">{BRANDS.map((b) => <option key={b}>{b}</option>)}</select>
              <input className="field" type="number" placeholder="Sale price (BDT) *" value={modal.data.price} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, price: e.target.value } }))} />
              <input className="field" type="number" placeholder="MRP (optional)" value={modal.data.mrp} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, mrp: e.target.value } }))} />
              <input className="field" type="number" placeholder="Stock *" value={modal.data.stock} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, stock: e.target.value } }))} />
              <input className="field" placeholder="Emoji (e.g. 🏏)" value={modal.data.emoji} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, emoji: e.target.value } }))} />
              <input className="field sm:col-span-2" placeholder="Variants / sizes — comma separated (S, M, L)" value={modal.data.variants} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, variants: e.target.value } }))} />
              <textarea className="field sm:col-span-2" rows={2} placeholder="Short description" value={modal.data.desc} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, desc: e.target.value } }))} />
            </div>
            <button onClick={save} disabled={busy} className="btn-brand mt-4 h-12 w-full disabled:opacity-70">
              {busy ? <><Loader2 className="h-5 w-5 animate-spin" />Saving…</> : (modal.mode === "add" ? "Save product" : "Update product")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

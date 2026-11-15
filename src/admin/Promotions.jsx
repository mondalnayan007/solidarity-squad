import { useEffect, useState } from "react";
import {
  TicketPercent, Plus, Pencil, Trash2, X, ChevronUp, ChevronDown, Loader2, Megaphone, Eye, EyeOff,
} from "lucide-react";
import { COUPONS, formatBDT, statusClass } from "../data/catalog";
import { csvDownload } from "./adminUtils";
import { useStore } from "../context/StoreContext";

const EMPTY_COUPON = { code: "", type: "percent", value: "10", applies: "Storewide", min: "0", status: "Active", desc: "" };

const HOME_SECTIONS = ["Hero banner", "Countdown campaign (World Cup)", "Shop by sport rail", "Best sellers / New arrivals", "BD Tigers Zone", "Blog preview", "Trust strip"];

const BANNERS = [
  { id: 1, name: "Cricket season is here", placement: "Homepage hero · slide 1", status: "Live" },
  { id: 2, name: "Football, all in", placement: "Homepage hero · slide 2", status: "Live" },
  { id: 3, name: "BD Tigers 2026 jerseys", placement: "Homepage hero · slide 3", status: "Live" },
  { id: 4, name: "World Cup pre-order", placement: "Countdown band + campaign page", status: "Scheduled" },
  { id: 5, name: "Free delivery over ৳5,000", placement: "Top announcement strip", status: "Live" },
];

export default function Promotions() {
  const { toast } = useStore();
  const [coupons, setCoupons] = useState(() => COUPONS.map((c) => ({ ...c })));
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [banners, setBanners] = useState(BANNERS);
  const [sections, setSections] = useState(HOME_SECTIONS);

  useEffect(() => { document.title = "Promotions | Solidarity Squad Admin"; }, []);

  const totalRedemptions = coupons.reduce((a, c) => a + c.used, 0);

  const saveCoupon = () => {
    const d = modal.data;
    if (!d.code.trim()) return toast("Code required");
    setBusy(true);
    setTimeout(() => {
      const payload = { ...d, code: d.code.trim().toUpperCase(), value: Number(d.value) || 0, min: Number(d.min) || 0, used: d.used ?? 0 };
      setCoupons((list) => modal.mode === "add" ? [payload, ...list] : list.map((c) => (c.code === modal.original ? payload : c)));
      setBusy(false); setModal(null);
      toast(modal.mode === "add" ? `Coupon ${payload.code} created` : `Coupon ${payload.code} updated`);
    }, 400);
  };
  const removeCoupon = (code) => { setCoupons((l) => l.filter((c) => c.code !== code)); toast(`${code} deleted`); };
  const toggleStatus = (code) => setCoupons((l) => l.map((c) => (c.code === code ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c)));

  const toggleBanner = (id) => setBanners((l) => l.map((b) => (b.id === id ? { ...b, status: b.status === "Live" ? "Paused" : "Live" } : b)));
  const moveSection = (i, dir) => setSections((s) => { const n = [...s]; const j = i + dir; if (j < 0 || j >= n.length) return s; [n[i], n[j]] = [n[j], n[i]]; toast("Homepage section order updated"); return n; });

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-none">PROMOTIONS</h1>
          <p className="mt-1 text-xs text-mut">{coupons.length} coupons · {totalRedemptions} redemptions · {banners.filter((b) => b.status === "Live").length} banners live</p>
        </div>
        <button onClick={() => setModal({ mode: "add", data: { ...EMPTY_COUPON } })} className="btn-brand !py-2 text-xs"><Plus className="h-4 w-4" />New coupon</button>
      </div>

      {/* ── Coupons ── */}
      <section className="card-surface mt-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><TicketPercent className="h-6 w-6 text-brand" />COUPONS</h2>
          <button onClick={() => csvDownload("coupons.csv", [["Code", "Type", "Value", "Applies", "Min order", "Status", "Used"], ...coupons.map((c) => [c.code, c.type, c.value, c.applies, c.min, c.status, c.used])])} className="text-xs font-extrabold text-brand hover:underline">Export CSV</button>
        </div>
        <div className="mt-2 overflow-x-auto nice-scroll">
          <table className="w-full min-w-[720px] text-xs">
            <thead><tr className="text-left text-mut"><th className="py-2">Code</th><th>Discount</th><th>Applies to</th><th className="text-right">Min order</th><th>Status</th><th className="text-right">Used</th><th className="text-right">Actions</th></tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.code} className="border-t border-line hover:bg-bg">
                  <td className="py-2 font-mono font-extrabold">{c.code}<br /><span className="text-[9px] font-normal text-mut">{c.desc}</span></td>
                  <td className="py-2"><b>{c.type === "percent" ? `${c.value}%` : formatBDT(c.value)}</b>{c.code === "FREESHIP" ? " · free delivery" : ""}</td>
                  <td className="py-2 text-mut">{c.applies}</td>
                  <td className="py-2 text-right tabular-nums">{formatBDT(c.min)}</td>
                  <td className="py-2"><button onClick={() => toggleStatus(c.code)} title="Click to toggle"><span className={`status ${statusClass(c.status)}`}>{c.status}</span></button></td>
                  <td className="py-2 text-right tabular-nums">{c.used}</td>
                  <td className="py-2 text-right">
                    <button onClick={() => setModal({ mode: "edit", original: c.code, data: { ...c, value: String(c.value), min: String(c.min) } })} className="rounded-lg p-2 hover:bg-bg" aria-label="Edit"><Pencil className="h-4 w-4 text-mut" /></button>
                    <button onClick={() => removeCoupon(c.code)} className="rounded-lg p-2 hover:bg-accentsoft" aria-label="Delete"><Trash2 className="h-4 w-4 text-accent" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* ── Banners / campaigns ── */}
        <section className="card-surface p-5">
          <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><Megaphone className="h-6 w-6 text-brand" />BANNERS &amp; CAMPAIGNS</h2>
          <ul className="mt-2 divide-y divide-line">
            {banners.map((b) => (
              <li key={b.id} className="flex items-center gap-3 py-2.5 text-xs">
                <span className="min-w-0 flex-1"><b>{b.name}</b><br /><span className="text-mut">{b.placement}</span></span>
                <span className={`status ${b.status === "Live" ? "status-ok" : b.status === "Scheduled" ? "status-info" : "status-warn"}`}>{b.status}</span>
                <button onClick={() => toggleBanner(b.id)} className="rounded-lg p-2 hover:bg-bg" aria-label={b.status === "Live" ? "Pause banner" : "Activate banner"}>
                  {b.status === "Live" ? <EyeOff className="h-4 w-4 text-mut" /> : <Eye className="h-4 w-4 text-brand" />}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Homepage section ordering ── */}
        <section className="card-surface p-5">
          <h2 className="font-display text-2xl font-extrabold">HOMEPAGE SECTIONS</h2>
          <p className="text-[11px] text-mut">Control what shoppers see, top to bottom. Changes apply on next deploy of the storefront build.</p>
          <ol className="mt-2 space-y-1.5">
            {sections.map((s, i) => (
              <li key={s} className="flex items-center gap-2 rounded-xl border border-line bg-bg px-3 py-2 text-xs font-bold">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-surf font-mono text-[10px] text-mut">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate">{s}</span>
                <button onClick={() => moveSection(i, -1)} disabled={i === 0} className="rounded-lg p-1.5 hover:bg-surf disabled:opacity-30" aria-label="Move up"><ChevronUp className="h-4 w-4" /></button>
                <button onClick={() => moveSection(i, 1)} disabled={i === sections.length - 1} className="rounded-lg p-1.5 hover:bg-surf disabled:opacity-30" aria-label="Move down"><ChevronDown className="h-4 w-4" /></button>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* ── Coupon modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-label={modal.mode === "add" ? "New coupon" : "Edit coupon"}>
          <div className="w-full max-w-md rounded-3xl bg-surf p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold">{modal.mode === "add" ? "NEW COUPON" : "EDIT COUPON"}</h2>
              <button onClick={() => setModal(null)} className="rounded-lg p-2 hover:bg-bg" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 grid gap-3">
              <input className="field font-mono uppercase" placeholder="CODE — e.g. TIGERS15" value={modal.data.code} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, code: e.target.value } }))} autoFocus />
              <div className="grid grid-cols-3 gap-2">
                <select className="field col-span-1" value={modal.data.type} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, type: e.target.value } }))} aria-label="Discount type"><option value="percent">% Percent</option><option value="fixed">৳ Fixed</option></select>
                <input className="field col-span-1" type="number" placeholder="Value" value={modal.data.value} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, value: e.target.value } }))} aria-label="Value" />
                <input className="field col-span-1" type="number" placeholder="Min order" value={modal.data.min} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, min: e.target.value } }))} aria-label="Minimum order" />
              </div>
              <input className="field" placeholder="Applies to — e.g. Jerseys, Storewide" value={modal.data.applies} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, applies: e.target.value } }))} />
              <input className="field" placeholder="Short description shown to shoppers" value={modal.data.desc} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, desc: e.target.value } }))} />
              <select className="field" value={modal.data.status} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, status: e.target.value } }))} aria-label="Status"><option>Active</option><option>Paused</option></select>
            </div>
            <button onClick={saveCoupon} disabled={busy} className="btn-brand mt-4 h-12 w-full disabled:opacity-70">
              {busy ? <><Loader2 className="h-5 w-5 animate-spin" />Saving…</> : "Save coupon"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

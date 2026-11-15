import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Newspaper, Flame, FileText, Plus, Pencil, Trash2, X, ExternalLink, Save, Loader2,
} from "lucide-react";
import { BLOG_POSTS } from "../data/catalog";
import { useStore } from "../context/StoreContext";

const EMPTY_POST = { title: "", tag: "Buying guide", excerpt: "", body: "", read: "5 min" };

export default function Content() {
  const { toast } = useStore();
  const [tab, setTab] = useState("blog");
  const [posts, setPosts] = useState(() => BLOG_POSTS.map((p) => ({ ...p })));
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [zone, setZone] = useState(() => {
    try { return { headline: "BD TIGERS ZONE", blurb: "The fan destination — 2026 jerseys, fan gear and behind-the-scenes content.", campaign: "World Cup 2026 pre-order — FREE name printing", ...JSON.parse(localStorage.getItem("ss-zone-content") || "{}") }; }
    catch { return { headline: "BD TIGERS ZONE", blurb: "", campaign: "" }; }
  });

  useEffect(() => { document.title = "Content & Blog | Solidarity Squad Admin"; }, []);

  const savePost = () => {
    const d = modal.data;
    if (d.title.trim().length < 5) return toast("Title must be at least 5 characters");
    setBusy(true);
    setTimeout(() => {
      const slugBase = d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
      if (modal.mode === "add") {
        setPosts((list) => [{ slug: `${slugBase}-${Date.now().toString().slice(-4)}`, author: "Solidarity Squad Team", date: new Date().toISOString().slice(0, 10), ...d, body: d.body.split(/\n\n+/).filter(Boolean) }, ...list]);
      } else {
        setPosts((list) => list.map((p) => (p.slug === modal.original ? { ...p, ...d, body: Array.isArray(d.body) ? d.body : d.body.split(/\n\n+/).filter(Boolean) } : p)));
      }
      setBusy(false); setModal(null);
      toast(modal.mode === "add" ? "Post published" : "Post updated");
    }, 400);
  };
  const deletePost = (slug) => { setPosts((l) => l.filter((p) => p.slug !== slug)); toast("Post deleted"); };

  const saveZone = () => { localStorage.setItem("ss-zone-content", JSON.stringify(zone)); toast("BD Tigers Zone content published"); };

  const staticPages = [
    ["About us", "/page/about"], ["Shipping & delivery", "/page/shipping"], ["Returns & refunds", "/page/returns"],
    ["Privacy policy", "/page/privacy"], ["Terms & conditions", "/page/terms"],
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-extrabold leading-none">CONTENT &amp; <span className="text-brand">BLOG</span></h1>
        <div className="flex gap-1.5" role="tablist">
          {[["blog", "Blog posts", Newspaper], ["zone", "BD Tigers Zone", Flame], ["pages", "Static pages", FileText]].map(([id, label, Icon]) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`chip ${tab === id ? "on" : ""}`}><Icon className="h-4 w-4" />{label}</button>
          ))}
        </div>
      </div>

      {/* ── Blog ── */}
      {tab === "blog" && (
        <section className="card-surface mt-4 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-mut">{posts.length} posts · visible at <Link to="/blog" className="inline-flex items-center gap-0.5 font-bold text-brand hover:underline">/blog<ExternalLink className="h-3 w-3" /></Link></p>
            <button onClick={() => setModal({ mode: "add", data: { ...EMPTY_POST } })} className="btn-brand !py-2 text-xs"><Plus className="h-4 w-4" />New post</button>
          </div>
          <ul className="mt-2 divide-y divide-line">
            {posts.map((p) => (
              <li key={p.slug} className="flex flex-wrap items-center gap-3 py-3 text-xs">
                <span className="min-w-0 flex-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent">{p.tag}</span>
                  <b className="block truncate text-sm">{p.title}</b>
                  <span className="text-mut">{p.date} · {p.read} read</span>
                </span>
                <Link to={`/blog/${p.slug}`} className="rounded-lg p-2 hover:bg-bg" aria-label="Preview"><ExternalLink className="h-4 w-4 text-mut" /></Link>
                <button onClick={() => setModal({ mode: "edit", original: p.slug, data: { ...p, body: Array.isArray(p.body) ? p.body.join("\n\n") : p.body } })} className="rounded-lg p-2 hover:bg-bg" aria-label="Edit"><Pencil className="h-4 w-4 text-mut" /></button>
                <button onClick={() => deletePost(p.slug)} className="rounded-lg p-2 hover:bg-accentsoft" aria-label="Delete"><Trash2 className="h-4 w-4 text-accent" /></button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── BD Tigers Zone editor ── */}
      {tab === "zone" && (
        <section className="card-surface mt-4 max-w-2xl p-6">
          <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><Flame className="h-6 w-6 text-accent" />BD TIGERS ZONE CONTENT</h2>
          <p className="mt-0.5 text-xs text-mut">Edits here publish to <Link to="/bd-tigers" className="font-bold text-brand hover:underline">/bd-tigers</Link> instantly.</p>
          <label className="mt-4 mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-mut" htmlFor="zone-headline">Zone headline</label>
          <input id="zone-headline" className="field font-display text-lg font-extrabold" value={zone.headline} onChange={(e) => setZone((z) => ({ ...z, headline: e.target.value }))} />
          <label className="mt-3 mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-mut" htmlFor="zone-blurb">Hero blurb</label>
          <textarea id="zone-blurb" rows={2} className="field" value={zone.blurb} onChange={(e) => setZone((z) => ({ ...z, blurb: e.target.value }))} />
          <label className="mt-3 mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-mut" htmlFor="zone-campaign">Campaign strip</label>
          <input id="zone-campaign" className="field" value={zone.campaign} onChange={(e) => setZone((z) => ({ ...z, campaign: e.target.value }))} />
          <button onClick={saveZone} className="btn-brand mt-4"><Save className="h-5 w-5" />Publish zone content</button>
        </section>
      )}

      {/* ── Static pages ── */}
      {tab === "pages" && (
        <section className="card-surface mt-4 max-w-2xl p-6">
          <h2 className="font-display text-2xl font-extrabold">STATIC PAGES &amp; MENU</h2>
          <p className="mt-0.5 text-xs text-mut">Footer and menu links are managed in the theme; page copy is versioned with the storefront.</p>
          <ul className="mt-3 divide-y divide-line">
            {staticPages.map(([label, path]) => (
              <li key={path} className="flex items-center justify-between gap-3 py-3 text-sm font-bold">
                {label}
                <Link to={path} className="flex items-center gap-1 text-xs font-extrabold text-brand hover:underline">View page <ExternalLink className="h-3.5 w-3.5" /></Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-mut">Menu &amp; footer structure: Home · Shop All Gear · BD Tigers Zone · World Cup · Blog · Contact. Admin route is hidden from customers and accessible at /admin.</p>
        </section>
      )}

      {/* ── Post modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-label={modal.mode === "add" ? "New post" : "Edit post"}>
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-surf p-6 nice-scroll">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold">{modal.mode === "add" ? "NEW POST" : "EDIT POST"}</h2>
              <button onClick={() => setModal(null)} className="rounded-lg p-2 hover:bg-bg" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 grid gap-3">
              <input className="field font-bold" placeholder="Post title *" value={modal.data.title} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, title: e.target.value } }))} autoFocus />
              <div className="grid grid-cols-2 gap-2">
                <select className="field" value={modal.data.tag} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, tag: e.target.value } }))} aria-label="Tag">
                  {["Buying guide", "Fitness", "Fan zone", "Campaign"].map((t) => <option key={t}>{t}</option>)}
                </select>
                <input className="field" placeholder="Read time — e.g. 6 min" value={modal.data.read} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, read: e.target.value } }))} aria-label="Read time" />
              </div>
              <textarea className="field" rows={2} placeholder="Excerpt (shown in listings & SEO description)" value={modal.data.excerpt} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, excerpt: e.target.value } }))} />
              <textarea className="field font-mono text-xs" rows={8} placeholder="Body — separate paragraphs with a blank line" value={modal.data.body} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, body: e.target.value } }))} />
            </div>
            <button onClick={savePost} disabled={busy} className="btn-brand mt-4 h-12 w-full disabled:opacity-70">
              {busy ? <><Loader2 className="h-5 w-5 animate-spin" />Publishing…</> : "Publish post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

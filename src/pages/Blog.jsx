import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CalendarDays, Clock, UserRound, ArrowLeft, ArrowRight, Tag, Share2 } from "lucide-react";
import { BLOG_POSTS } from "../data/catalog";
import { useStore } from "../context/StoreContext";

export function BlogList() {
  const [tag, setTag] = useState("All");
  const tags = ["All", ...new Set(BLOG_POSTS.map((p) => p.tag))];
  const shown = BLOG_POSTS.filter((p) => tag === "All" || p.tag === tag);
  useEffect(() => { document.title = "Blog — Gear Guides & Fan Zone | Solidarity Squad"; }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-5xl font-extrabold">FROM THE <span className="text-brand">BLOG</span></h1>
      <p className="mt-1 text-sm text-mut">Buying guides, training plans and fan-zone stories — SEO-ready content from bd.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => <button key={t} onClick={() => setTag(t)} className={`chip ${tag === t ? "on" : ""}`}>{t}</button>)}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <Link key={p.slug} to={`/blog/${p.slug}`} className="card-surface group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-36 items-end bg-gradient-to-br from-brand to-deep p-4">
              <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-gold backdrop-blur">{p.tag}</span>
            </div>
            <div className="p-5">
              <h2 className="text-lg font-extrabold leading-snug group-hover:text-brand">{p.title}</h2>
              <p className="mt-1.5 line-clamp-2 text-xs text-mut">{p.excerpt}</p>
              <div className="mt-3 flex items-center gap-3 text-[10px] font-semibold text-mut">
                <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{p.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{p.read} read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const { toast } = useStore();
  const navigate = useNavigate();
  useEffect(() => { document.title = post ? `${post.title} | Solidarity Squad Blog` : "Blog | Solidarity Squad"; }, [post]);

  if (!post) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-extrabold">Article not found</h1>
        <Link to="/blog" className="btn-brand mt-5">← Back to blog</Link>
      </div>
    );
  }
  const others = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-bold text-mut hover:text-ink"><ArrowLeft className="h-4 w-4" /> Back</button>
      <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-accentsoft px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-accent"><Tag className="h-3 w-3" />{post.tag}</span>
      <h1 className="font-display mt-2 text-4xl font-extrabold leading-[1.02] sm:text-5xl">{post.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-4 border-b border-line pb-4 text-xs text-mut">
        <span className="flex items-center gap-1.5"><UserRound className="h-4 w-4" />{post.author}</span>
        <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{post.date}</span>
        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.read} read</span>
        <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast("Link copied"); }} className="ml-auto flex items-center gap-1 font-bold text-brand hover:underline"><Share2 className="h-4 w-4" />Share</button>
      </div>
      <div className="prose-sm mt-6 space-y-4 text-[15px] leading-relaxed text-ink">
        {post.body.map((para, i) => <p key={i}>{para}</p>)}
      </div>
      <div className="mt-8 rounded-2xl border border-line bg-deep p-5 text-center text-white">
        <p className="font-display text-2xl font-extrabold">READY TO PLAY?</p>
        <p className="mt-1 text-xs text-white/80">Gear up with the collection mentioned in this guide.</p>
        <Link to="/shop" className="btn-squad mt-3 !px-5 !py-2 text-xs">Shop the gear <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="mt-8">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-mut">More from the blog</h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {others.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="card-surface p-4 transition hover:border-brand">
              <span className="text-[10px] font-extrabold uppercase text-accent">{p.tag}</span>
              <p className="mt-1 text-sm font-bold leading-snug">{p.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

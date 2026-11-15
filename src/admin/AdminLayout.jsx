import { useState } from "react";
import { Outlet, Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, Tags, Warehouse, Users, TicketPercent, Newspaper,
  ChartBar, ShieldCheck, Trophy, ExternalLink, LogOut, Lock, Menu, X, ChevronDown,
} from "lucide-react";
import { ADMIN_NAV, ROLES, roleLabel } from "./adminUtils";
import { useStore } from "../context/StoreContext";
import { Toaster } from "../components/Chrome";

const ICONS = { LayoutDashboard, Package, Tags, Warehouse, Users, TicketPercent, Newspaper, ChartBar, ShieldCheck };

export default function AdminLayout() {
  const [role, setRole] = useState(() => localStorage.getItem("ss-admin-role") || "Super Admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useStore();

  const allowed = ROLES[role];
  const activeNav = ADMIN_NAV.find((n) => location.pathname === n.path || (n.path !== "/admin" && location.pathname.startsWith(n.path)));
  const hasAccess = activeNav ? allowed.includes(activeNav.id) : true;

  const changeRole = (r) => {
    setRole(r);
    localStorage.setItem("ss-admin-role", r);
    toast(`Switched to ${r}`);
    if (activeNav && !ROLES[r].includes(activeNav.id)) navigate("/admin");
  };

  const navFor = (n) => allowed.includes(n.id);

  return (
    <div className="flex min-h-screen bg-bg font-body text-ink">
      {/* ── Sidebar ── */}
      <aside className={`no-print fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-deep text-[#cfe3d8] transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <Link to="/admin" className="flex items-center gap-2 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent"><Trophy className="h-5 w-5" /></span>
            <span className="font-display text-xl font-extrabold leading-none">SOLIDARITY<br /><span className="text-gold">SQUAD</span> <span className="text-[10px] font-body font-bold align-middle text-[#8fd3ad]">ADMIN</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 hover:bg-white/10 lg:hidden" aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3 nice-scroll" aria-label="Admin modules">
          <p className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6fae8d]">Modules</p>
          {ADMIN_NAV.map((n) => {
            const Icon = ICONS[n.icon];
            const ok = navFor(n);
            if (!ok) return (
              <span key={n.id} title="Your role has no access" className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#4d7362]">
                <Icon className="h-5 w-5" />{n.label}<Lock className="ml-auto h-3.5 w-3.5" />
              </span>
            );
            return (
              <NavLink key={n.id} to={n.path} end={n.path === "/admin"} onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-gold text-[#1a1a1a]" : "hover:bg-white/10"}`}>
                <Icon className="h-5 w-5" />{n.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <label className="px-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6fae8d]" htmlFor="admin-role">Signed in as</label>
          <div className="relative mt-1">
            <select id="admin-role" value={role} onChange={(e) => changeRole(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/15 bg-deep2 px-3 py-2.5 pr-8 text-xs font-bold text-white outline-none focus:border-gold">
              {Object.keys(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
          </div>
          <p className="mt-1 px-1 text-[10px] leading-snug text-[#6fae8d]">{roleLabel(role)}</p>
          <Link to="/" className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-gold hover:bg-white/5"><ExternalLink className="h-4 w-4" />View storefront</Link>
          <Link to="/login" className="mt-0.5 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[#cfe3d8] hover:bg-white/5"><LogOut className="h-4 w-4" />Sign out of admin</Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      {/* ── Content ── */}
      <div className="min-w-0 flex-1">
        <div className="no-print sticky top-0 z-20 flex items-center justify-between border-b border-line bg-surf/90 px-4 py-2 backdrop-blur lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-xl border border-line p-2" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <span className="text-xs font-extrabold uppercase tracking-widest text-mut">{activeNav?.label ?? "Admin"} · {role}</span>
          <span className="h-2 w-2 rounded-full bg-good" title="All integrations live" />
        </div>

        {hasAccess ? <Outlet /> : (
          <div className="mx-auto max-w-md px-6 py-28 text-center">
            <Lock className="mx-auto h-16 w-16 text-mut" strokeWidth={1.2} />
            <h1 className="font-display mt-4 text-4xl font-extrabold">ACCESS <span className="text-accent">RESTRICTED</span></h1>
            <p className="mt-1 text-sm text-mut">The <b>{role}</b> role cannot open this module. Ask a Super Admin to grant access, or switch role.</p>
            <button onClick={() => changeRole("Super Admin")} className="btn-brand mt-5">Switch to Super Admin</button>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

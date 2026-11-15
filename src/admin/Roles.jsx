import { useEffect, useState } from "react";
import { ShieldCheck, Check, Save, Info } from "lucide-react";
import { ROLES } from "./adminUtils";
import { useStore } from "../context/StoreContext";

const MODULES = [
  { id: "dashboard", label: "Dashboard & analytics" },
  { id: "orders", label: "Order processing & courier booking" },
  { id: "products", label: "Product catalog & variants" },
  { id: "inventory", label: "Inventory & stock adjustments" },
  { id: "customers", label: "Customer management & blocking" },
  { id: "promotions", label: "Coupons, banners, campaigns" },
  { id: "content", label: "Blog, pages, BD Tigers Zone" },
  { id: "reports", label: "Reports & exports" },
  { id: "roles", label: "Roles & permissions" },
];

export default function Roles() {
  const { toast } = useStore();
  const [matrix, setMatrix] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ss-role-matrix") || "null") ?? Object.fromEntries(Object.entries(ROLES).map(([r, list]) => [r, MODULES.map((m) => list.includes(m.id))])); }
    catch { return Object.fromEntries(Object.entries(ROLES).map(([r, list]) => [r, MODULES.map((m) => list.includes(m.id))])); }
  });

  useEffect(() => { document.title = "Roles & Access | Solidarity Squad Admin"; }, []);

  const toggle = (role, idx) => {
    if (role === "Super Admin") return toast("Super Admin always has full access");
    setMatrix((m) => ({ ...m, [role]: m[role].map((v, i) => (i === idx ? !v : v)) }));
  };
  const save = () => { localStorage.setItem("ss-role-matrix", JSON.stringify(matrix)); toast("Role permissions saved — effective immediately"); };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-none">ROLES &amp; <span className="text-brand">ACCESS</span></h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-mut"><Info className="h-4 w-4" />Four built-in roles. Toggle modules per role — Super Admin is always full access.</p>
        </div>
        <button onClick={save} className="btn-brand !py-2 text-xs"><Save className="h-4 w-4" />Save matrix</button>
      </div>

      <div className="card-surface mt-4 overflow-x-auto nice-scroll">
        <table className="w-full min-w-[760px] text-xs">
          <thead>
            <tr className="text-left text-mut">
              <th className="p-4">Module / permission</th>
              {Object.keys(matrix).map((role) => (
                <th key={role} className="p-4 text-center">
                  <span className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink">
                    <ShieldCheck className={`h-4 w-4 ${role === "Super Admin" ? "text-gold" : "text-brand"}`} />{role}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((mod, i) => (
              <tr key={mod.id} className="border-t border-line hover:bg-bg">
                <td className="p-4 font-semibold">{mod.label}</td>
                {Object.entries(matrix).map(([role, perms]) => (
                  <td key={role} className="p-4 text-center">
                    <button onClick={() => toggle(role, i)}
                      role="checkbox" aria-checked={perms[i]} aria-label={`${role} — ${mod.label}`}
                      className={`mx-auto grid h-7 w-7 place-items-center rounded-lg border transition ${perms[i] ? "border-brand bg-brand text-white dark:text-[#04120b]" : "border-line bg-surf hover:border-brand"} ${role === "Super Admin" ? "cursor-not-allowed opacity-90" : ""}`}>
                      {perms[i] && <Check className="h-4 w-4" strokeWidth={3} />}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-3 text-[11px] text-mut sm:grid-cols-4">
        {[
          ["Super Admin", "Everything, including roles & destructive actions. Reserved for owners."],
          ["Manager", "Day-to-day ops: orders, stock, customers and reports. No promotion or role changes."],
          ["Order Processor", "Fulfilment desk: process orders, book couriers, adjust stock, view customers."],
          ["Content Editor", "Marketing desk: catalog, blog, banners and coupons. No customer data or financials."],
        ].map(([role, desc]) => (
          <div key={role} className="card-surface p-4">
            <p className="flex items-center gap-1.5 font-extrabold text-ink"><ShieldCheck className="h-4 w-4 text-brand" />{role}</p>
            <p className="mt-1 leading-snug">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Shirt,
  Truck,
  Printer,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { formatBDT, DISTRICTS } from "../data/catalog";

const KITS = [
  { id: "home", name: "Home Kit 2026", price: 1450, emoji: "👕", note: "Flag green · players edition" },
  { id: "away", name: "Away Kit 2026", price: 1450, emoji: "🎽", note: "Crimson · fan edition" },
  { id: "third", name: "Third Kit 2026 · Gold", price: 1650, emoji: "🥇", note: "Sun gold · limited 2,000 units" },
  { id: "combo", name: "Full Fan Combo", price: 2650, mrp: 3100, emoji: "🏆", note: "Jersey + scarf + flag — save ৳450" },
];

export default function Campaign() {
  const { toast, user } = useStore();
  const [kit, setKit] = useState("home");
  const [size, setSize] = useState("L");
  const [name, setName] = useState(user?.name ?? "");
  const [print, setPrint] = useState("");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [district, setDistrict] = useState("Dhaka");
  const [busy, setBusy] = useState(false);
  const [end] = useState(() => Date.now() + 37 * 86400000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    document.title = "World Cup 2026 Kit Pre-Order | Solidarity Squad";
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const cd = useMemo(() => {
    const d = Math.max(0, end - now);
    return {
      days: Math.floor(d / 86400000),
      hrs: Math.floor((d % 86400000) / 3600000),
      mins: Math.floor((d % 3600000) / 60000),
      secs: Math.floor((d % 60000) / 1000),
    };
  }, [end, now]);

  const selected = KITS.find((k) => k.id === kit);

  const preorder = () => {
    if (!name.trim() || !/^01\d{9}$/.test(phone.replace(/-/g, ""))) {
      return toast("Enter your name and a valid mobile");
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast(`Pre-order confirmed for ${name.split(" ")[0]}! SMS with details sent to ${phone}.`);
    }, 1300);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Hero Side (6 Columns) */}
        <div
          className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gray-950 p-7 text-white shadow-2xl sm:p-10 lg:col-span-6"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(6, 20, 14, 0.72) 0%, rgba(6, 20, 14, 0.85) 75%, rgba(4, 15, 10, 0.96) 100%), url('https://i.guim.co.uk/img/media/6192f2868260f42578c8a2a72f1373fa2d48ae29/0_113_2000_1199/master/2000.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=5abc4ab94cf35c71cad589f2e4aebaf6')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Ambient Gold Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />

          {/* Top Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
              <CalendarClock className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-amber-300">
                World Cup 2026 · Limited Run
              </span>
            </div>

            <h1 className="font-display mt-5 text-6xl font-black tracking-tight leading-[0.9] sm:text-7xl xl:text-8xl">
              WEAR <br />
              THE <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                ROAR.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-gray-200 sm:text-base">
              Official-style Bangladesh kits — engineered breathable mesh, tricolor details, and special pre-order pricing with <span className="font-bold text-amber-300">FREE name &amp; number printing</span> (৳300 value).
            </p>
          </div>

          {/* Bottom Countdown & Perks */}
          <div className="relative z-10 mt-10">
            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              Pre-Order Window Closes In
            </p>
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3" aria-label="Time left for pre-order">
              {[
                [cd.days, "Days"],
                [cd.hrs, "Hrs"],
                [cd.mins, "Min"],
                [cd.secs, "Sec"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/10 py-3 text-center backdrop-blur-md shadow-lg sm:py-4"
                >
                  <div className="font-display text-3xl font-black tabular-nums tracking-tight text-white sm:text-4xl">
                    {String(v).padStart(2, "0")}
                  </div>
                  <div className="mt-0.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                    {l}
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Pills */}
            <div className="mt-6 grid grid-cols-1 gap-2.5 border-t border-white/15 pt-5 text-xs font-semibold text-gray-200 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-400/20 text-amber-300">
                  <Printer className="h-3.5 w-3.5" />
                </div>
                <span>Free Custom Print</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-400/20 text-amber-300">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <span>Free 64-Dist. Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-400/20 text-amber-300">
                  <Shirt className="h-3.5 w-3.5" />
                </div>
                <span>Pre-Tourney Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pre-Order Form Side (6 Columns) */}
        <div className="card-surface flex flex-col justify-between rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl sm:p-8 lg:col-span-6 dark:border-white/10 dark:bg-[#111c17]">
          <div>
            {/* Form Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4 dark:border-white/10">
              <div>
                <h2 className="font-display text-3xl font-black tracking-tight">
                  PRE-ORDER <span className="text-emerald-600 dark:text-emerald-400">YOUR KIT</span>
                </h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Cash on delivery available. Instant confirmation SMS within 1 hour.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Sparkles className="h-3 w-3" /> 2026 Drop
              </span>
            </div>

            {/* Step 1: Kit Selection */}
            <fieldset className="mt-5">
              <legend className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                1 · Choose your kit
              </legend>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {KITS.map((k) => {
                  const active = kit === k.id;
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => setKit(k.id)}
                      aria-pressed={active}
                      className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                        active
                          ? "border-emerald-500 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/25 dark:border-emerald-400 dark:bg-emerald-500/10"
                          : "border-gray-200/80 hover:border-emerald-400 dark:border-white/10 dark:hover:border-emerald-500/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
                          {k.emoji}
                        </span>
                        {active && (
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                        )}
                      </div>

                      <div className="mt-2">
                        <span className="block text-xs font-extrabold text-gray-900 dark:text-white">
                          {k.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-gray-500 dark:text-gray-400">
                          {k.note}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-baseline gap-1.5">
                        <span className="font-display text-lg font-black text-emerald-600 dark:text-emerald-400">
                          {formatBDT(k.price)}
                        </span>
                        {k.mrp && (
                          <s className="text-xs font-medium text-gray-400">
                            {formatBDT(k.mrp)}
                          </s>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Step 2 & 3: Size & Print */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <fieldset>
                <legend className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  2 · Select Size
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {["S", "M", "L", "XL", "2XL", "3XL"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      aria-pressed={size === s}
                      className={`h-10 min-w-[2.5rem] px-2 rounded-xl border text-xs font-extrabold transition-all ${
                        size === s
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                          : "border-gray-200 text-gray-700 hover:border-emerald-500 dark:border-white/10 dark:text-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label
                  className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  htmlFor="pc-print"
                >
                  3 · Name &amp; Number (Free)
                </label>
                <input
                  id="pc-print"
                  value={print}
                  onChange={(e) => setPrint(e.target.value.toUpperCase())}
                  placeholder='e.g. "MUSHFIQ 75"'
                  className="field"
                  maxLength={20}
                />
              </div>
            </div>

            {/* Customer Info */}
            <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label
                  className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  htmlFor="pc-name"
                >
                  Full Name *
                </label>
                <input
                  id="pc-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rafi Ahmed"
                  className="field"
                />
              </div>

              <div>
                <label
                  className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  htmlFor="pc-phone"
                >
                  Mobile Number *
                </label>
                <input
                  id="pc-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  inputMode="numeric"
                  className="field"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  htmlFor="pc-district"
                >
                  Delivery District *
                </label>
                <select
                  id="pc-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="field"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Order Summary & Submit Button */}
          <div className="mt-6">
            <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-gray-50/80 px-4 py-3.5 dark:border-white/10 dark:bg-white/5">
              <div className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                <div>
                  Kit: <strong className="text-gray-900 dark:text-white">{selected?.name} ({size})</strong>
                </div>
                <div>
                  Custom Print: <strong className="text-emerald-600 dark:text-emerald-400">{print || "None"}</strong>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  Payable Total
                </p>
                <p className="font-display text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatBDT(selected?.price ?? 0)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={preorder}
              disabled={busy}
              className="mt-4 flex h-13 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-rose-600/25 transition-all duration-300 hover:from-rose-500 hover:to-red-500 hover:shadow-xl hover:shadow-rose-600/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {busy ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Reserving your kit…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Confirm Pre-Order — Pay on Delivery</span>
                </>
              )}
            </button>

            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-gray-500 dark:text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              No advance payment needed. We call to confirm size before dispatch.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
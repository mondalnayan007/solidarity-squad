import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Trophy, Clock } from "lucide-react";

export default function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => time.toString().padStart(2, "0");

  const categories = [
    {
      title: "Cricket Team Jerseys",
      sub: "Home, Away & Training kits for the ultimate fans.",
      tag: "CRICKET",
      image: "https://mir-s3-cdn-cf.behance.net/projects/808/c7fa3c198768415.Y3JvcCwxMDA3LDc4OCwxOTcsMA.png",
      accent: "text-emerald-400",
      bgAccent: "bg-emerald-500",
    },
    {
      title: "Football Kits",
      sub: "National fan jerseys & tournament gears.",
      tag: "FOOTBALL",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9fRbSbbJrh4evN1jon2GHXHyqKDm-y_WdSyxD2EGgGn4jUc-hkPAO7UE&s=10",
      accent: "text-rose-400",
      bgAccent: "bg-rose-500",
    },
    {
      title: "Fan Combos",
      sub: "Flags, caps & exclusive value bundles.",
      tag: "COLLECTION",
      image: "https://m.media-amazon.com/images/I/71DGoeIEZiL._AC_UL450_SY450_QL70_.jpg",
      accent: "text-amber-400",
      bgAccent: "bg-amber-500",
    },
  ];

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 lg:px-8">
      {/* ─── Centered Header Area ─── */}
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:border-emerald-500/30 dark:text-emerald-400">
          <Trophy className="h-4 w-4" />
          <span>Official Fan Hub</span>
        </div>

        <h2 className="font-display mt-5 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl lg:text-6xl dark:text-white">
          BD <span className="text-emerald-600 dark:text-emerald-500">Tigers Zone</span>
        </h2>
        <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400">
          Equip yourself with the official national team gear. Exclusive campaign collections available for a limited time.
        </p>

        {/* Flash Sale Timer */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2.5 rounded-2xl bg-red-50 px-4 py-2.5 shadow-inner dark:bg-red-500/10">
            <Flame className="h-5 w-5 animate-pulse text-red-600 dark:text-red-500" />
            <div className="flex items-center gap-1.5 font-mono text-xl font-black text-red-600 dark:text-red-500">
              <span className="w-8 rounded bg-red-100 py-0.5 text-center dark:bg-red-500/20">{formatTime(timeLeft.hours)}</span>
              <span className="text-red-400">:</span>
              <span className="w-8 rounded bg-red-100 py-0.5 text-center dark:bg-red-500/20">{formatTime(timeLeft.minutes)}</span>
              <span className="text-red-400">:</span>
              <span className="w-8 rounded bg-red-100 py-0.5 text-center dark:bg-red-500/20">{formatTime(timeLeft.seconds)}</span>
            </div>
          </div>
          <Link
            to="/bd-tigers"
            className="group flex items-center gap-2 rounded-2xl bg-gray-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:bg-emerald-600 hover:shadow-emerald-500/30 dark:bg-white dark:text-gray-900 dark:hover:bg-emerald-500 dark:hover:text-white"
          >
            <span>Shop the sale</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* ─── Hover-Expandable Cards Layout ─── */}
      <div className="flex flex-col gap-4 md:h-[460px] md:flex-row lg:h-[500px]">
        {categories.map((z, idx) => (
          <Link
            key={z.title}
            to="/bd-tigers"
            className="group relative flex h-[280px] w-full flex-1 cursor-pointer flex-col justify-end overflow-hidden rounded-[2rem] shadow-lg transition-all duration-700 ease-in-out hover:shadow-2xl md:h-full md:hover:grow-[1.75]"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
              style={{ backgroundImage: `url('${z.image}')` }}
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

            {/* Top Tag (Always visible, fades/moves on hover on mobile) */}
            <div className="absolute left-6 top-6 z-10">
              <span className={`rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${z.accent}`}>
                {z.tag}
              </span>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 flex flex-col p-6 sm:p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-black text-white drop-shadow-md transition-all duration-500 md:text-3xl lg:text-4xl">
                    {z.title}
                  </h3>
                  {/* Subtitle - Hidden on desktop until hover, visible on mobile */}
                  <div className="grid grid-rows-[1fr] transition-all duration-500 md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr]">
                    <p className="mt-2 overflow-hidden text-sm font-medium text-gray-300 opacity-100 transition-opacity duration-500 delay-100 md:opacity-0 md:group-hover:opacity-100">
                      {z.sub}
                    </p>
                  </div>
                </div>

                {/* Arrow Action Button */}
                <div className={`shrink-0 grid h-12 w-12 translate-y-2 place-items-center rounded-full bg-white/10 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-hover:${z.bgAccent}`}>
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
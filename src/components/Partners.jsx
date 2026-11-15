import FastMarquee from "react-fast-marquee";
import { PARTNERS } from "../data/catalog";

// এখানে Vite/ESM এরর ফিক্স করা হলো:
const Marquee = FastMarquee.default || FastMarquee;

export default function Partners() {
  return (
    <section className="bg-white py-8 dark:bg-gray-950">
      <div className="mx-auto mb-10 max-w-7xl px-4 text-center lg:px-8">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Trusted By The Best
        </p>
        <h2 className="font-display mt-2 text-3xl font-black text-gray-900 sm:text-4xl dark:text-white">
          Our Official Partners
        </h2>
      </div>

      {/* ── Marquee Container ── */}
      <div className="relative mx-auto max-w-7xl overflow-hidden">
        
        {/* Fade Edges */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-white to-transparent dark:from-gray-950 sm:w-32" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-white to-transparent dark:from-gray-950 sm:w-32" />

        <Marquee 
          direction="right" 
          speed={40} 
          pauseOnHover={true} 
          gradient={false}
        >
          {PARTNERS.map((partner) => (
            <div 
              key={partner.id}
              // ডার্ক মোডে কার্ডটা যেন আরেকটু স্পষ্ট বোঝা যায় তাই dark:bg-white/10 দিয়েছি
              className="mx-4 flex h-24 w-40 cursor-pointer items-center justify-center rounded-xl bg-gray-50 p-4 transition-all duration-300 hover:bg-white hover:shadow-md sm:mx-6 sm:h-28 sm:w-48 dark:bg-white/10 dark:hover:bg-white/20"
            >
              <img 
                src={partner.logo} 
                alt={partner.name} 
                // ডার্ক মোডে কালো লোগো সাদা করার জন্য `dark:invert` এবং `dark:brightness-200` ব্যবহার করা হয়েছে
                className="max-h-full max-w-full object-contain opacity-70 transition-all duration-300 hover:opacity-100 dark:invert dark:brightness-200"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
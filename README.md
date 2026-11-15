# Solidarity Squad — Pro Sports & Gear (Frontend)

E-commerce frontend for Solidarity Squad, an online sports equipment & gear store for Bangladesh.
Built with **React 19 · Vite 8 · Tailwind CSS 4 · React Router · lucide-react**.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run lint     # ESLint
```

The app uses clean URLs (`/admin`, `/shop`, …) via BrowserRouter — no `#`. SPA fallback is preconfigured for
**Vercel** (`vercel.json`) and **Netlify**/static hosts (`public/_redirects`). On Apache/nginx, rewrite all paths to `index.html`.
`vite preview` (the `npm run preview` command) also serves the SPA fallback automatically.

## What's included

**Storefront** — home (hero campaigns, countdown, best sellers/new arrivals), 26+ category mega menu,
product listing with filters (sport, brand, price, size/grade, rating, sale) + sorting & pagination,
product details (hover-zoom gallery, variants, stock status, verified reviews, related/recently-viewed),
BD Tigers Zone, World Cup pre-order campaign, blog with SEO fields, search with auto-suggest,
EN / বাংলা language toggle, dark mode.

**Cart & checkout** — slide-out cart with stock validation, coupons (`SQUAD10`, `TIGERS15`, `WORLDCUP20`, `FREESHIP`),
district-wise delivery charge for all 64 districts (Dhaka ৳60 · near-Dhaka ৳90 · elsewhere ৳130 · free over ৳5,000),
guest/registered checkout, SSLCommerz · bKash · Nagad · COD with simulated IPN verification, printable invoice.

**Account** — phone OTP login (demo code `1971`), profile, address book, order history with re-order & invoice download,
wishlist (move-to-cart), return requests, live order tracking timeline (Pending → Confirmed → Packed → Shipped → Delivered).

**Admin portal** (`/admin`) — dashboard (KPIs, single-hue sales chart, integration health, low-stock alerts),
orders (search, bulk Pathao/Steadfast courier booking with COD settlement preview, status updates),
products (add/edit/delete, real CSV bulk import/export), inventory (levels, low-stock, adjustments),
customers (search, block/unblock, order history), promotions (coupon CRUD, banners, homepage section ordering),
content (blog editor, BD Tigers Zone editor, static pages), reports (sales/product/district/payment/coupon/stock with CSV/PDF export),
role-based access matrix (Super Admin · Manager · Order Processor · Content Editor).

## Demo credentials

- OTP login demo code: **1971** (any 11-digit `01XXXXXXXXX` phone)
- Sample order for tracking: **SS-10492**
- Admin: pick any role in the sidebar footer (Super Admin gets full access)

## Notes

Prices in BDT. Cart/wishlist/orders persist in `localStorage`. Charts are dependency-free SVG/CSS (no chart lib).
Product imagery uses emoji on brand gradients as stand-in artwork; swap in real photography before launch.
Gateway/courier integrations are simulated — wire SSLCommerz IPN, bKash/Nagad callbacks and Pathao/Steadfast
webhooks to the real APIs in the backend sprint.

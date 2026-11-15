
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Trophy,
  Flame,
  Menu,
  X,
  Truck,
  ShieldCheck,
  Phone,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

import { useStore } from "../../context/StoreContext";
import { CATEGORIES, PRODUCTS, formatBDT } from "../../data/catalog";

export default function Navbar() {
  const {
    t,
    lang,
    toggleLang,
    dark,
    toggleDark,
    cartCount,
    wishlist,
    user,
    setCartOpen,
  } = useStore();

  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES[0]?.id || null
  );

  const [submenuTop, setSubmenuTop] = useState(0);
  const [submenuMaxHeight, setSubmenuMaxHeight] = useState(500);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const megaRef = useRef(null);
  const dropdownPanelRef = useRef(null);
  const categoryListRef = useRef(null);
  const searchRef = useRef(null);

  // Close menus on navigation
  const locKey = location.pathname + location.search;
  const [lastLoc, setLastLoc] = useState(locKey);

  if (lastLoc !== locKey) {
    setLastLoc(locKey);
    setMegaOpen(false);
    setMobileOpen(false);
    setFocus(false);
  }

  // Active category data
  const activeCategoryData = CATEGORIES.find(
    (category) => category.id === activeCategory
  );

  // Calculate submenu position based on hovered category
  const updateSubmenuPosition = () => {
    const panel = dropdownPanelRef.current;

    if (!panel || !activeCategory) return;

    const activeItem = panel.querySelector(
      `[data-category-id="${activeCategory}"]`
    );

    if (!activeItem) return;

    const panelRect = panel.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    // Exact vertical position of hovered category
    const top = itemRect.top - panelRect.top;

    // Available screen height below hovered category
    const availableHeight = Math.max(
      40,
      window.innerHeight - itemRect.top - 12
    );

    setSubmenuTop(top);
    setSubmenuMaxHeight(availableHeight);
  };

  // Update submenu position whenever active category changes
  useEffect(() => {
    if (!megaOpen || !activeCategory) return;

    const update = () => updateSubmenuPosition();

    update();

    const categoryList = categoryListRef.current;

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    categoryList?.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);

      categoryList?.removeEventListener("scroll", update);
    };
  }, [megaOpen, activeCategory]);

  // Close menus on outside click and Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
        setFocus(false);
      }
    };

    const handleClickOutside = (e) => {
      if (
        megaRef.current &&
        !megaRef.current.contains(e.target)
      ) {
        setMegaOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setFocus(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search Suggestions
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (q.length < 2) return [];

    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.sub || "").toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  // Search Submit
  const submitSearch = (e) => {
    e?.preventDefault();

    if (!query.trim()) return;

    setFocus(false);
    setMobileOpen(false);

    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  // Category URLs
  const getCategoryUrl = (categoryId) => {
    return `/shop?cat=${categoryId}`;
  };

  // Subcategory URLs
  const getSubcategoryUrl = (categoryId, subcategory) => {
    return `/shop?cat=${categoryId}&sub=${encodeURIComponent(subcategory)}`;
  };

  // Open Mega Menu
  const openMegaMenu = () => {
    setMegaOpen(true);
  };

  // Change active category
  const handleCategoryHover = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const navLinkClass =
    "px-4 py-3 text-sm font-bold text-ink/90 transition-colors hover:text-brand";

  return (
    <header className="no-print sticky top-0 z-50 w-full max-w-full overflow-x-clip border-b border-line/80 bg-surf/95 backdrop-blur-xl">

      {/* Animations */}
      <style>{`
        @keyframes cascadeDropdown {
          from {
            opacity: 0;
            transform: translateY(7px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cascadeSubmenu {
          from {
            opacity: 0;
            transform: translateX(-6px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .cascade-dropdown {
          animation: cascadeDropdown 180ms ease-out both;
        }

        .cascade-submenu {
          animation: cascadeSubmenu 160ms ease-out both;
        }

        .cascade-item {
          transition:
            background-color 150ms ease,
            color 150ms ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .cascade-dropdown,
          .cascade-submenu {
            animation: none;
          }

          .cascade-item {
            transition: none;
          }
        }
      `}</style>

      {/* Announcement Bar */}
      <div className="bg-deep text-white text-[11px] font-semibold tracking-wide">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 lg:px-8">

          <div className="flex min-w-0 items-center gap-2">
            <Truck className="h-3.5 w-3.5 shrink-0 text-gold" />
            <span className="truncate">{t.promo}</span>
          </div>

          <div className="hidden items-center gap-4 text-white/85 md:flex">

            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              100% Authentic
            </span>

            <a
              href="tel:+8801700000000"
              className="flex items-center gap-1.5 hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5" />
              +880 1700-000000
            </a>

            <Link
              to="/track-order"
              className="flex items-center gap-1.5 hover:text-gold"
            >
              <PackageCheck className="h-3.5 w-3.5" />
              {t.track}
            </Link>

          </div>
        </div>
      </div>



      {/* Main Navbar */}
      <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center gap-2 overflow-hidden px-3 py-2.5 sm:gap-3 sm:px-4 lg:gap-5 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="group flex min-w-0 shrink items-center gap-2"
          aria-label="Solidarity Squad home"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand via-emerald-600 to-accent text-white shadow-lg transition-transform group-hover:scale-105 sm:h-10 sm:w-10 sm:rounded-2xl">
            <Trophy className="h-5 w-5" />
          </div>

          {/* Hide brand text on small screens */}
          <div className="hidden min-w-0 leading-none sm:block">
            <div className="whitespace-nowrap font-display text-[18px] font-extrabold tracking-tight text-ink lg:text-[22px]">
              SOLIDARITY{" "}
              <span className="text-brand dark:text-emerald-400">
                SQUAD
              </span>
            </div>

            <div className="mt-0.5 text-[9px] font-bold tracking-[0.22em] text-mut">
              PRO SPORTS &amp; GEAR
            </div>
          </div>
        </Link>

        {/* Desktop Search */}
        <div
          ref={searchRef}
          className="relative mx-auto hidden w-full max-w-xl min-w-0 md:block"
        >
          <form onSubmit={submitSearch} role="search">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mut" />

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setFocus(true);
              }}
              onFocus={() => setFocus(true)}
              placeholder={t.search}
              aria-label="Search products"
              className="h-11 w-full rounded-full border border-line bg-bg pl-10 pr-16 text-sm text-ink placeholder:text-mut outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
            />

            <button
              type="submit"
              className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-full bg-brand px-4 text-xs font-bold text-white hover:brightness-110 dark:text-[#04120b]"
            >
              {lang === "en" ? "Search" : "খুঁজুন"}
            </button>
          </form>

          {/* Search Suggestions */}
          {focus && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-surf shadow-2xl cascade-dropdown">
              <div className="flex items-center justify-between border-b border-line px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-mut">
                <span>
                  {lang === "en" ? "Suggestions" : "সাজেশন"}
                </span>

                <button
                  type="button"
                  onClick={submitSearch}
                  className="text-brand hover:underline"
                >
                  {lang === "en" ? "See all" : "সব দেখুন"}
                </button>
              </div>

              {suggestions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setFocus(false);
                    navigate(`/product/${p.id}`);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-bg"
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xl"
                    style={{ background: p.bg }}
                  >
                    {p.emoji}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {p.name}
                    </span>
                    <span className="block text-[11px] text-mut">
                      {p.brand} · {p.sub}
                    </span>
                  </span>

                  <span className="text-sm font-bold text-brand">
                    {formatBDT(p.price)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">

          {/* Language */}
          <button
            onClick={toggleLang}
            title="Switch language"
            className="flex h-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg px-2 text-[10px] font-extrabold text-ink hover:border-brand sm:h-10 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:text-xs"
          >
            <span className="h-2 w-2 rounded-full bg-good" />
            <span className="sm:hidden">
              {lang === "en" ? "BN" : "EN"}
            </span>
            <span className="hidden sm:inline">
              {lang === "en" ? "বাংলা" : "EN"}
            </span>
          </button>

          {/* Dark Mode */}
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg text-ink hover:border-brand sm:h-10 sm:w-10 sm:rounded-xl"
          >
            {dark ? (
              <Sun className="h-4 w-4 text-gold" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg text-ink hover:border-brand sm:h-10 sm:w-10 sm:rounded-xl"
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />

            {wishlist.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-white sm:h-5 sm:w-5 sm:text-[10px]">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            to={user ? "/account" : "/login"}
            aria-label="Account"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-bg text-ink hover:border-brand sm:flex"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
            className="relative flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-ink px-2 text-sm font-bold text-bg hover:opacity-90 dark:bg-gold dark:text-[#1a1a1a] sm:h-10 sm:gap-2 sm:rounded-xl sm:px-3"
          >
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />

            <span className="hidden sm:inline">
              {t.cart}
            </span>

            <span className="grid h-5 min-w-5 place-items-center rounded-md bg-white/25 px-1 text-[10px] font-extrabold dark:bg-black/15">
              {cartCount}
            </span>
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-ink hover:border-brand sm:h-10 sm:w-10 sm:rounded-xl lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

        </div>
      </div>


      {/* Desktop Navigation */}
      <nav className="hidden border-t border-line/70 lg:block">

        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 lg:px-8">

          <NavLink to="/" className={navLinkClass}>
            {t.home}
          </NavLink>

          {/* Cascading Mega Menu */}
          <div
            ref={megaRef}
            className="relative"
            onMouseEnter={openMegaMenu}
            onMouseLeave={() => setMegaOpen(false)}
          >

            {/* Categories Trigger */}
            <button
              type="button"
              onClick={() => {
                if (megaOpen) {
                  setMegaOpen(false);
                } else {
                  openMegaMenu();
                }
              }}
              onFocus={openMegaMenu}
              aria-expanded={megaOpen}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold transition-colors ${megaOpen
                  ? "text-brand"
                  : "text-ink/90 hover:text-brand"
                }`}
            >
              {t.categories}

              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* First Level Dropdown */}
            {megaOpen && (
              <div className="absolute left-0 top-full z-50 w-[280px] cascade-dropdown">

                <div
                  ref={dropdownPanelRef}
                  className="relative overflow-visible border border-line bg-surf shadow-xl"
                >

                  {/* Dropdown Header */}
                  <div className="border-b border-line bg-bg px-4 py-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-mut">
                      {lang === "en"
                        ? "Shop By Category"
                        : "ক্যাটাগরি অনুযায়ী কিনুন"}
                    </p>
                  </div>

                  {/* Category List */}
                  <div
                    ref={categoryListRef}
                    className="max-h-[min(70vh,560px)] overflow-y-auto nice-scroll py-1"
                  >

                    {CATEGORIES.map((category) => {
                      const isActive =
                        activeCategory === category.id;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          data-category-id={category.id}
                          onMouseEnter={() =>
                            handleCategoryHover(category.id)
                          }
                          onFocus={() =>
                            handleCategoryHover(category.id)
                          }
                          onClick={() =>
                            handleCategoryHover(category.id)
                          }
                          aria-expanded={isActive}
                          className={`cascade-item flex w-full items-center justify-between gap-3 px-3.5 py-[9px] text-left text-[13px] ${isActive
                              ? "bg-brand text-white"
                              : "text-ink hover:bg-bg hover:text-brand"
                            }`}
                        >

                          <span className="flex min-w-0 items-center gap-2.5">

                            <span className="flex h-6 w-6 shrink-0 items-center justify-center text-base">
                              {category.emoji}
                            </span>

                            <span className="truncate font-medium">
                              {lang === "en"
                                ? category.name
                                : category.bn}
                            </span>

                          </span>

                          <ChevronRight
                            className={`h-4 w-4 shrink-0 ${isActive
                                ? "text-white"
                                : "text-mut"
                              }`}
                          />

                        </button>
                      );
                    })}

                  </div>

                  {/* Second Level Dropdown */}
                  {activeCategoryData && (
                    <div
                      className="absolute left-full z-50 w-[275px] cascade-submenu"
                      style={{
                        top: `${submenuTop}px`,
                      }}
                    >

                      <div
                        className="overflow-y-auto nice-scroll border border-line bg-surf shadow-xl"
                        style={{
                          maxHeight: `${submenuMaxHeight}px`,
                        }}
                      >

                        {/* Subcategory Header */}
                        <div className="border-b border-line bg-bg px-4 py-3">

                          <div className="flex items-center gap-2">

                            <span className="text-xl">
                              {activeCategoryData.emoji}
                            </span>

                            <div className="min-w-0">

                              <h3 className="truncate text-sm font-extrabold text-ink">
                                {lang === "en"
                                  ? activeCategoryData.name
                                  : activeCategoryData.bn}
                              </h3>

                              <p className="mt-0.5 text-[10px] text-mut">
                                {activeCategoryData.subs.length}{" "}
                                {lang === "en"
                                  ? "Subcategories"
                                  : "টি সাবক্যাটাগরি"}
                              </p>

                            </div>

                          </div>
                        </div>

                        {/* All Category Link */}
                        <Link
                          to={getCategoryUrl(activeCategoryData.id)}
                          className="flex items-center justify-between border-b border-line px-4 py-3 text-xs font-extrabold text-brand transition-colors hover:bg-brand/10"
                        >

                          <span>
                            {lang === "en"
                              ? `All ${activeCategoryData.name}`
                              : `সকল ${activeCategoryData.bn}`}
                          </span>

                          <ArrowRight className="h-4 w-4" />

                        </Link>

                        {/* Subcategory List */}
                        <div className="py-1">

                          {activeCategoryData.subs.map(
                            (subcategory) => (
                              <Link
                                key={subcategory}
                                to={getSubcategoryUrl(
                                  activeCategoryData.id,
                                  subcategory
                                )}
                                className="cascade-item flex items-center justify-between gap-2 px-4 py-[10px] text-[12px] font-medium text-ink hover:bg-bg hover:text-brand"
                              >

                                <span>{subcategory}</span>

                                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-mut opacity-0 transition-opacity group-hover:opacity-100" />

                              </Link>
                            )
                          )}

                        </div>

                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>

          <NavLink to="/shop" className={navLinkClass}>
            {t.shopAll}
          </NavLink>

          <NavLink to="/blog" className={navLinkClass}>
            {lang === "en" ? "Blog" : "ব্লগ"}
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            {t.contact}
          </NavLink>

          <Link
            to="/bd-tigers"
            className="my-1.5 ml-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-accent px-4 py-2 text-xs font-extrabold text-white hover:opacity-95"
          >
            <Flame className="h-4 w-4 fill-gold text-gold" />
            {t.bdTigers}
          </Link>

        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-line bg-surf px-4 py-4 cascade-dropdown lg:hidden">

          {/* Mobile Search */}
          <form
            onSubmit={submitSearch}
            className="relative mb-3 md:hidden"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mut" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="h-11 w-full rounded-xl border border-line bg-bg pl-9 pr-3 text-sm text-ink"
              aria-label="Search"
            />
          </form>

          {/* Mobile Main Links */}
          <div className="grid grid-cols-2 gap-2 text-sm font-bold">

            <Link to="/" className="rounded-xl bg-bg p-3">
              {t.home}
            </Link>

            <Link to="/shop" className="rounded-xl bg-bg p-3">
              {t.shopAll}
            </Link>

            <Link
              to="/bd-tigers"
              className="rounded-xl bg-brand/10 p-3 text-brand"
            >
              {t.bdTigers}
            </Link>

            <Link to="/track-order" className="rounded-xl bg-bg p-3">
              {t.track}
            </Link>

            <Link
              to={user ? "/account" : "/login"}
              className="rounded-xl bg-bg p-3"
            >
              {t.account}
            </Link>

            <Link to="/blog" className="rounded-xl bg-bg p-3">
              {lang === "en" ? "Blog" : "ব্লগ"}
            </Link>

            <Link to="/contact" className="rounded-xl bg-bg p-3">
              {t.contact}
            </Link>

          </div>

          {/* Mobile Categories */}
          <div className="mt-4 border-t border-line pt-3">

            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-wider text-mut">
              {t.categories}
            </p>

            <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto nice-scroll">

              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  to={getCategoryUrl(category.id)}
                  className="flex items-center gap-2 rounded-lg border border-line p-2.5 text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand"
                >

                  <span>{category.emoji}</span>

                  <span className="min-w-0 truncate">
                    {lang === "en"
                      ? category.name
                      : category.bn}
                  </span>

                </Link>
              ))}

            </div>
          </div>

        </div>
      )}

    </header>
  );
}

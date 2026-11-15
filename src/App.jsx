import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { ScrollToTop, Toaster, FloatingChat } from "./components/Chrome";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import BDTigers from "./pages/BDTigers";
import Campaign from "./pages/Campaign";
import { BlogList, BlogPost } from "./pages/Blog";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import TrackOrder from "./pages/TrackOrder";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import StaticPage from "./pages/StaticPage";
import NotFound from "./pages/NotFound";

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Orders from "./admin/Orders";
import Products from "./admin/Products";
import Inventory from "./admin/Inventory";
import Customers from "./admin/Customers";
import Promotions from "./admin/Promotions";
import Content from "./admin/Content";
import Reports from "./admin/Reports";
import Roles from "./admin/Roles";

function StorefrontLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-deep focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingChat />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* ── Storefront ── */}
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:cat" element={<Navigate to="/shop" replace />} />
            <Route path="/bd-tigers" element={<BDTigers />} />
            <Route path="/campaign/world-cup" element={<Campaign />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/page/:slug" element={<StaticPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* ── Admin portal ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="customers" element={<Customers />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="content" element={<Content />} />
            <Route path="reports" element={<Reports />} />
            <Route path="roles" element={<Roles />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

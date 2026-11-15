import { useState } from "react";
import { ADMIN_ORDERS } from "../data/catalog";

// Adapt a customer-placed (localStorage) order into the admin order shape
const toAdmin = (o) => ({
  id: o.id,
  customer: o.customer?.name ?? "Guest",
  phone: o.customer?.phone ?? "",
  district: o.customer?.district ?? "",
  payment: String(o.payment ?? "").replace(/ \(.*\)/, ""),
  payStatus: o.status === "Pending" ? "Pending" : "Paid",
  total: o.total,
  status: o.status === "Confirmed" ? "Processing" : o.status,
  courier: "",
  tracking: "",
  date: (o.date ?? "").replace("T", " ").slice(0, 16),
  items: o.items?.length ?? 1,
  mine: true,
});

export function useAdminOrders() {
  const [orders, setOrders] = useState(() => {
    try {
      const mine = JSON.parse(localStorage.getItem("ss-my-orders") || "[]").map(toAdmin);
      const mineIds = new Set(mine.map((o) => o.id));
      return [...mine, ...ADMIN_ORDERS.filter((o) => !mineIds.has(o.id))];
    } catch {
      return ADMIN_ORDERS;
    }
  });
  return [orders, setOrders];
}

export const ADMIN_NAV = [
  { id: "dashboard", label: "Dashboard", path: "/admin", icon: "LayoutDashboard" },
  { id: "orders", label: "Orders", path: "/admin/orders", icon: "Package" },
  { id: "products", label: "Products", path: "/admin/products", icon: "Tags" },
  { id: "inventory", label: "Inventory", path: "/admin/inventory", icon: "Warehouse" },
  { id: "customers", label: "Customers", path: "/admin/customers", icon: "Users" },
  { id: "promotions", label: "Promotions", path: "/admin/promotions", icon: "TicketPercent" },
  { id: "content", label: "Content & Blog", path: "/admin/content", icon: "Newspaper" },
  { id: "reports", label: "Reports", path: "/admin/reports", icon: "ChartBar" },
  { id: "roles", label: "Roles & Access", path: "/admin/roles", icon: "ShieldCheck" },
];

export const ROLES = {
  "Super Admin": ["dashboard", "orders", "products", "inventory", "customers", "promotions", "content", "reports", "roles"],
  "Manager": ["dashboard", "orders", "inventory", "customers", "reports"],
  "Order Processor": ["dashboard", "orders", "inventory", "customers"],
  "Content Editor": ["products", "content", "promotions"],
};

export const roleLabel = (role) => ({
  "Super Admin": "Full access — all modules",
  "Manager": "Orders, inventory, customers, reports",
  "Order Processor": "Orders + stock only",
  "Content Editor": "Catalog, content & promotions",
}[role]);

export const csvDownload = (filename, rows) => {
  const csv = rows.map((r) => r.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

export const printPage = () => window.print();

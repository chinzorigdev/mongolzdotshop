"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Redirect to login if not authenticated or not an admin
    // But only if we're not already on the login or register page
    if (
      isClient &&
      (!isAuthenticated || !isAdmin) &&
      !pathname.includes("/admin/login") &&
      !pathname.includes("/admin/register")
    ) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isAdmin, router, isClient, pathname]);

  // Special case for login and register pages - always show them
  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return (
      <div className="min-h-screen">
        {children}
        <Toaster position="top-right" />
      </div>
    );
  }

  // Don't render admin content until client-side auth check is complete
  if (!isClient || !isAuthenticated || !isAdmin) {
    // Show a loading state instead of null
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-neutral-900 text-white p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className={`block px-4 py-2 rounded hover:bg-neutral-800 ${
              pathname === "/admin/dashboard" ? "bg-neutral-800" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className={`block px-4 py-2 rounded hover:bg-neutral-800 ${
              pathname === "/admin/products" ? "bg-neutral-800" : ""
            }`}
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className={`block px-4 py-2 rounded hover:bg-neutral-800 ${
              pathname === "/admin/orders" ? "bg-neutral-800" : ""
            }`}
          >
            Orders
          </Link>
          <Link
            href="/admin/settings"
            className={`block px-4 py-2 rounded hover:bg-neutral-800 ${
              pathname === "/admin/settings" ? "bg-neutral-800" : ""
            }`}
          >
            Settings
          </Link>{" "}
          <button
            onClick={() => {
              useAuthStore.getState().logout();
              router.push("/admin/login");
            }}
            className="block w-full text-left px-4 py-2 rounded hover:bg-neutral-800 text-red-400"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-neutral-100 p-6">{children}</div>
      <Toaster position="top-right" />
    </div>
  );
}

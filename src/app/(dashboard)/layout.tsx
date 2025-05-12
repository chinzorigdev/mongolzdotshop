export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      {/* Dashboard Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>

        <nav className="space-y-2">
          <a
            href="/dashboard"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            Dashboard Home
          </a>
          <a
            href="/dashboard/products"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            Products
          </a>
          <a
            href="/dashboard/orders"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            Orders
          </a>
          <a
            href="/dashboard/customers"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            Customers
          </a>
          <a
            href="/dashboard/settings"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Dashboard Content */}
      <main className="flex-1 p-8 bg-gray-100">{children}</main>
    </div>
  );
}

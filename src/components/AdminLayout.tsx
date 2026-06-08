import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { BarChart3, FileText, Brain, ArrowLeft, Menu, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/admin/dashboard", label: "数据看板", icon: BarChart3 },
  { path: "/admin/reports", label: "运营报表", icon: FileText },
  { path: "/admin/predictions", label: "预测建议", icon: Brain },
];

export default function AdminLayout() {
  const location = useLocation();
  const { setCurrentRole } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-eco-cream font-body">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed z-40 flex h-full w-64 flex-col bg-forest-800 text-white transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <Link to="/admin/dashboard" className="text-xl font-bold font-display tracking-wide">
            绿循管理
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-forest-700 text-white"
                    : "text-forest-200 hover:bg-forest-700/50 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-forest-700 p-3">
          <Link
            to="/user/home"
            onClick={() => setCurrentRole("user")}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-forest-300 transition-colors hover:bg-forest-700/50 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>返回用户端</span>
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center bg-white px-4 py-3 shadow-sm lg:px-6">
          <button
            className="mr-3 text-forest-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-forest-800">
            {navItems.find((i) => isActive(i.path))?.label ?? "管理后台"}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

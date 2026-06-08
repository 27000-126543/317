import { useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { Home, Recycle, ShoppingBag, Users, User, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/user/home", label: "首页", icon: Home },
  { path: "/user/recycle", label: "回收", icon: Recycle },
  { path: "/user/shop", label: "商城", icon: ShoppingBag },
  { path: "/user/community", label: "社区", icon: Users },
  { path: "/user/profile", label: "我的", icon: User },
];

const roles = [
  { value: "user" as const, label: "用户" },
  { value: "collector" as const, label: "回收员" },
  { value: "admin" as const, label: "管理员" },
];

const rolePaths: Record<string, string> = {
  user: "/user/home",
  collector: "/collector/pending",
  admin: "/admin/dashboard",
};

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, setCurrentRole, currentUser } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeTab = tabs.find((t) => location.pathname.startsWith(t.path));

  const handleRoleSwitch = (role: "user" | "collector" | "admin") => {
    setCurrentRole(role);
    setDropdownOpen(false);
    navigate(rolePaths[role]);
  };

  return (
    <div className="flex h-screen flex-col bg-eco-cream font-body">
      <header className="flex items-center justify-between bg-forest-700 px-4 py-3 text-white shadow-eco">
        <Link to="/user/home" className="text-xl font-bold tracking-wide font-display">
          绿循
        </Link>

        <div className="relative flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-8 w-8 rounded-full border-2 border-accent object-cover"
          />
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 rounded-full bg-forest-600 px-3 py-1.5 text-sm hover:bg-forest-500 transition-colors"
            >
              {roles.find((r) => r.value === currentRole)?.label}
              <ChevronDown className={cn("h-4 w-4 transition-transform", dropdownOpen && "rotate-180")} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-28 overflow-hidden rounded-lg bg-white shadow-eco-lg">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => handleRoleSwitch(role.value)}
                    className={cn(
                      "block w-full px-4 py-2 text-left text-sm transition-colors",
                      currentRole === role.value
                        ? "bg-forest-700 text-white"
                        : "text-forest-800 hover:bg-forest-50"
                    )}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="flex border-t border-forest-200 bg-white">
        {tabs.map((tab) => {
          const isActive = activeTab?.path === tab.path;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors",
                isActive
                  ? "bg-forest-700 text-white"
                  : "text-forest-600 hover:text-forest-800"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

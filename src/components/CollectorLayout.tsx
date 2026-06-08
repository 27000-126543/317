import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { ListTodo, Clock, TrendingUp, User, ArrowLeft } from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/collector/pending", label: "待接单", icon: ListTodo },
  { path: "/collector/active", label: "进行中", icon: Clock },
  { path: "/collector/performance", label: "绩效", icon: TrendingUp },
  { path: "/collector/profile", label: "我的", icon: User },
];

const statusOptions = [
  { value: "online" as const, label: "在线", dotColor: "bg-green-500" },
  { value: "busy" as const, label: "忙碌", dotColor: "bg-yellow-500" },
  { value: "offline" as const, label: "离线", dotColor: "bg-red-500" },
];

export default function CollectorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentCollector, updateCollectorStatus, setCurrentRole } = useStore();
  const activeTab = tabs.find((t) => location.pathname.startsWith(t.path));

  const currentStatus = statusOptions.find((s) => s.value === currentCollector.status);

  const cycleStatus = () => {
    const idx = statusOptions.findIndex((s) => s.value === currentCollector.status);
    const next = statusOptions[(idx + 1) % statusOptions.length];
    updateCollectorStatus(next.value);
  };

  const handleBackToUser = () => {
    setCurrentRole("user");
    navigate("/user/home");
  };

  return (
    <div className="flex h-screen flex-col bg-eco-cream font-body">
      <header className="flex items-center justify-between bg-forest-700 px-4 py-3 text-white shadow-eco">
        <h1 className="text-lg font-bold font-display">回收员工作台</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={cycleStatus}
            className="flex items-center gap-2 rounded-full bg-forest-600 px-3 py-1.5 text-sm hover:bg-forest-500 transition-colors"
          >
            <span className={cn("h-2.5 w-2.5 rounded-full", currentStatus?.dotColor)} />
            {currentStatus?.label}
          </button>

          <button
            onClick={handleBackToUser}
            className="flex items-center gap-1 rounded-full bg-forest-600 px-3 py-1.5 text-sm hover:bg-forest-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回用户端
          </button>
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

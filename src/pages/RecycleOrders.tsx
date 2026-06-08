import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/data/mockData";
import type { RecycleOrder } from "@/data/mockData";

type TabKey = "all" | "pending" | "inProgress" | "completed";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待匹配" },
  { key: "inProgress", label: "进行中" },
  { key: "completed", label: "已完成" },
];

const STATUS_CONFIG: Record<
  RecycleOrder["status"],
  { label: string; bg: string; text: string }
> = {
  pending: { label: "待匹配", bg: "bg-yellow-100", text: "text-yellow-700" },
  matched: { label: "已匹配", bg: "bg-blue-100", text: "text-blue-700" },
  accepted: { label: "已接单", bg: "bg-orange-100", text: "text-orange-700" },
  departed: { label: "已出发", bg: "bg-teal-100", text: "text-teal-700" },
  arrived: { label: "已到达", bg: "bg-purple-100", text: "text-purple-700" },
  weighing: { label: "称重中", bg: "bg-pink-100", text: "text-pink-700" },
  completed: { label: "已完成", bg: "bg-green-100", text: "text-green-700" },
  cancelled: { label: "已取消", bg: "bg-gray-100", text: "text-gray-700" },
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <AlertCircle size={14} />,
  completed: <CheckCircle size={14} />,
};

function filterOrders(orders: RecycleOrder[], tab: TabKey): RecycleOrder[] {
  if (tab === "all") return orders;
  if (tab === "pending") return orders.filter((o) => o.status === "pending");
  if (tab === "inProgress")
    return orders.filter((o) =>
      ["matched", "accepted", "departed", "arrived", "weighing"].includes(o.status)
    );
  return orders.filter((o) => o.status === "completed" || o.status === "cancelled");
}

export default function RecycleOrders() {
  const { recycleOrders, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const myOrders = recycleOrders.filter((o) => o.userId === currentUser.id);
  const filtered = filterOrders(myOrders, activeTab);

  return (
    <div className="pb-8 animate-slide-up">
      <section className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`eco-tab whitespace-nowrap ${
                activeTab === tab.key ? "eco-tab-active" : "eco-tab-inactive"
              }`}
            >
              {tab.label}
              {tab.key !== "all" && (
                <span className="ml-1 text-[10px]">
                  ({filterOrders(myOrders, tab.key).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-forest-400">
          <Package size={48} className="opacity-30 mb-3" />
          <p className="text-sm">暂无相关订单</p>
        </div>
      ) : (
        <section className="px-5 space-y-3">
          {filtered.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status];
            return (
              <Link
                key={order.id}
                to={`/recycle/order/${order.id}`}
                className="block eco-card p-4 hover:shadow-eco-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-forest-400 font-mono">{order.id}</span>
                  <span
                    className={`eco-badge ${statusCfg.bg} ${statusCfg.text} gap-1`}
                  >
                    {STATUS_ICON[order.status]}
                    {statusCfg.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  {order.categories.map((cat) => (
                    <span key={cat} className="text-lg" title={CATEGORY_LABELS[cat]}>
                      {CATEGORY_ICONS[cat]}
                    </span>
                  ))}
                  <span className="text-xs text-forest-500 ml-1">
                    {order.categories.map((c) => CATEGORY_LABELS[c]).join("、")}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-forest-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {order.scheduledTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package size={12} />
                    {order.estimatedWeight}kg
                  </span>
                  {order.pointsEarned !== null && (
                    <span className="flex items-center gap-1 text-forest-700 font-semibold">
                      <CheckCircle size={12} />
                      +{order.pointsEarned}积分
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}

import { useStore } from "@/store/useStore";
import type { PointsRecord } from "@/store/useStore";
import { ArrowLeft, Star, Recycle, CalendarDays, ShoppingBag, Filter, RotateCcw } from "lucide-react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const TYPE_CONFIG: Record<
  PointsRecord["type"],
  { label: string; icon: typeof Star; color: string; bgColor: string; linkPrefix: string }
> = {
  recycle_reward: {
    label: "回收奖励",
    icon: Recycle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    linkPrefix: "/recycle/order/",
  },
  event_checkin: {
    label: "活动签到",
    icon: CalendarDays,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    linkPrefix: "/community/event/",
  },
  exchange_deduct: {
    label: "商城兑换",
    icon: ShoppingBag,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    linkPrefix: "/mall/order/",
  },
  exchange_refund: {
    label: "取消退款",
    icon: RotateCcw,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    linkPrefix: "/mall/order/",
  },
};

type FilterType = "all" | PointsRecord["type"];

export default function PointsHistory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUser = useStore((s) => s.currentUser);
  const getUserPoints = useStore((s) => s.getUserPoints);
  const getTotalEarned = useStore((s) => s.getTotalEarned);
  const getTotalSpent = useStore((s) => s.getTotalSpent);
  const pointsHistory = useStore((s) => s.pointsHistory);

  const initialFilter = (searchParams.get("filter") as FilterType) || "all";
  const [filter, setFilter] = useState<FilterType>(initialFilter);
  const [monthFilter, setMonthFilter] = useState("all");

  useEffect(() => {
    const f = searchParams.get("filter") as FilterType;
    if (f && f !== filter) setFilter(f);
  }, [searchParams]);

  const displayPoints = getUserPoints(currentUser.id);
  const totalEarned = getTotalEarned(currentUser.id);
  const totalSpent = getTotalSpent(currentUser.id);
  const myHistory = pointsHistory.filter((r) => r.userId === currentUser.id);
  const filtered = myHistory.filter((r) => {
    if (filter !== "all" && r.type !== filter) return false;
    if (monthFilter !== "all") {
      const d = new Date(r.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (key !== monthFilter) return false;
    }
    return true;
  });

  const availableMonths = Array.from(
    new Set(
      myHistory.map((r) => {
        const d = new Date(r.createdAt);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      })
    )
  ).sort((a, b) => b.localeCompare(a));

  const groupedByDate: Record<string, PointsRecord[]> = {};
  filtered.forEach((record) => {
    const dateKey = new Date(record.createdAt).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(record);
  });

  return (
    <div className="pb-8 animate-slide-up">
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-forest-50 flex items-center justify-center text-forest-700 hover:bg-forest-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-forest-800 font-display">积分明细</h1>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-gradient-to-r from-forest-600 to-forest-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Star size={18} />
            <span className="text-sm font-medium">当前积分余额</span>
          </div>
          <p className="text-3xl font-bold">{displayPoints.toLocaleString()}</p>
          <div className="flex gap-6 mt-3 text-forest-100 text-xs">
            <span>累计获得 {totalEarned.toLocaleString()}</span>
            <span>累计消费 {totalSpent.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="px-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <Filter size={16} className="text-forest-500 flex-shrink-0" />
        {([
          { key: "all", label: "全部" },
          { key: "recycle_reward", label: "回收奖励" },
          { key: "event_checkin", label: "活动签到" },
          { key: "exchange_deduct", label: "商城兑换" },
          { key: "exchange_refund", label: "取消退款" },
        ] as { key: FilterType; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`eco-tab ${filter === tab.key ? "eco-tab-active" : "eco-tab-inactive"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {availableMonths.length > 0 && (
        <div className="px-5 mt-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setMonthFilter("all")}
            className={`eco-tab ${monthFilter === "all" ? "eco-tab-active" : "eco-tab-inactive"}`}
          >
            全部月份
          </button>
          {availableMonths.map((m) => (
            <button
              key={m}
              onClick={() => setMonthFilter(m)}
              className={`eco-tab ${monthFilter === m ? "eco-tab-active" : "eco-tab-inactive"}`}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      <div className="px-5 mt-4 space-y-5">
        {Object.entries(groupedByDate).map(([date, records]) => (
          <div key={date}>
            <p className="text-xs text-forest-400 font-medium mb-2">{date}</p>
            <div className="space-y-2">
              {records.map((record) => {
                const cfg = TYPE_CONFIG[record.type];
                const Icon = cfg.icon;
                const linkTo = `${cfg.linkPrefix}${record.sourceId}`;
                return (
                  <Link
                    key={record.id}
                    to={linkTo}
                    className="eco-card p-4 flex items-center gap-3 block hover:shadow-eco-lg transition-shadow"
                  >
                    <div className={`w-10 h-10 rounded-lg ${cfg.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-forest-800 truncate">{record.source}</p>
                      <p className="text-xs text-forest-400 mt-0.5">{cfg.label}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${record.points > 0 ? "text-green-600" : "text-amber-600"}`}>
                        {record.points > 0 ? "+" : ""}{record.points}
                      </p>
                      <p className="text-[10px] text-forest-400 mt-0.5">
                        {new Date(record.createdAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-forest-400">
            <Star size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">暂无积分记录</p>
          </div>
        )}
      </div>
    </div>
  );
}

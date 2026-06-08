import { useStore } from "@/store/useStore";
import type { PointsRecord } from "@/store/useStore";
import { ArrowLeft, Star, Recycle, CalendarDays, ShoppingBag, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const TYPE_CONFIG: Record<
  PointsRecord["type"],
  { label: string; icon: typeof Star; color: string; bgColor: string }
> = {
  recycle_reward: {
    label: "回收奖励",
    icon: Recycle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  event_checkin: {
    label: "活动签到",
    icon: CalendarDays,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  exchange_deduct: {
    label: "商城兑换",
    icon: ShoppingBag,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
};

type FilterType = "all" | PointsRecord["type"];

export default function PointsHistory() {
  const navigate = useNavigate();
  const currentUser = useStore((s) => s.currentUser);
  const getUserPoints = useStore((s) => s.getUserPoints);
  const pointsHistory = useStore((s) => s.pointsHistory);
  const [filter, setFilter] = useState<FilterType>("all");

  const displayPoints = getUserPoints(currentUser.id);
  const myHistory = pointsHistory.filter((r) => r.userId === currentUser.id);
  const filtered = filter === "all" ? myHistory : myHistory.filter((r) => r.type === filter);

  const totalEarned = myHistory.filter((r) => r.points > 0).reduce((sum, r) => sum + r.points, 0);
  const totalSpent = myHistory.filter((r) => r.points < 0).reduce((sum, r) => sum + Math.abs(r.points), 0);

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

      <div className="px-5 mt-4 space-y-5">
        {Object.entries(groupedByDate).map(([date, records]) => (
          <div key={date}>
            <p className="text-xs text-forest-400 font-medium mb-2">{date}</p>
            <div className="space-y-2">
              {records.map((record) => {
                const cfg = TYPE_CONFIG[record.type];
                const Icon = cfg.icon;
                return (
                  <div key={record.id} className="eco-card p-4 flex items-center gap-3">
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
                  </div>
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

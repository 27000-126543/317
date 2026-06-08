import { useStore } from "@/store/useStore";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Recycle, Filter } from "lucide-react";
import { useState } from "react";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/data/mockData";
import type { RecycleCategory } from "@/data/mockData";
import type { WeightRecord } from "@/store/useStore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CHART_COLORS = ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"];

type CategoryFilter = "all" | RecycleCategory;

export default function WeightHistory() {
  const navigate = useNavigate();
  const currentUser = useStore((s) => s.currentUser);
  const getUserWeight = useStore((s) => s.getUserWeight);
  const weightHistory = useStore((s) => s.weightHistory);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [monthFilter, setMonthFilter] = useState("all");

  const displayWeight = getUserWeight(currentUser.id);
  const myHistory = weightHistory.filter((r) => r.userId === currentUser.id);

  const filtered = myHistory.filter((r) => {
    if (categoryFilter !== "all" && !r.categories.includes(categoryFilter)) return false;
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

  const categoryTotals: Record<string, number> = {};
  myHistory.forEach((r) => {
    const perCat = r.weight / r.categories.length;
    r.categories.forEach((cat) => {
      categoryTotals[cat] = (categoryTotals[cat] || 0) + perCat;
    });
  });

  const pieData = Object.entries(categoryTotals).map(([cat, val]) => ({
    name: CATEGORY_LABELS[cat as RecycleCategory] || cat,
    value: Math.round(val * 10) / 10,
    cat,
  }));

  const totalFilteredWeight = filtered.reduce((sum, r) => sum + r.weight, 0);
  const totalFilteredPoints = filtered.reduce((sum, r) => sum + r.pointsEarned, 0);

  const groupedByDate: Record<string, WeightRecord[]> = {};
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
        <h1 className="text-lg font-bold text-forest-800 font-display">回收重量明细</h1>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-gradient-to-r from-forest-600 to-forest-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Recycle size={18} />
            <span className="text-sm font-medium">累计回收重量</span>
          </div>
          <p className="text-3xl font-bold">{displayWeight}kg</p>
          <div className="flex gap-6 mt-3 text-forest-100 text-xs">
            <span>筛选范围 {Math.round(totalFilteredWeight * 10) / 10}kg</span>
            <span>获得积分 {totalFilteredPoints}</span>
          </div>
        </div>
      </div>

      {pieData.length > 0 && (
        <div className="px-5 mb-4">
          <div className="eco-card p-4">
            <h3 className="text-sm font-bold text-forest-800 mb-2">品类分布</h3>
            <div className="flex items-center gap-2">
              <div className="w-32 h-32 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={55}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((_, idx) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `${value}kg`}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1.5">
                {pieData.map((item, idx) => (
                  <div key={item.cat} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                    />
                    <span className="text-xs text-forest-600 flex-1">{item.name}</span>
                    <span className="text-xs text-forest-800 font-medium">{item.value}kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <Filter size={16} className="text-forest-500 flex-shrink-0" />
        {([
          { key: "all", label: "全部品类" },
          { key: "paper", label: CATEGORY_LABELS.paper },
          { key: "plastic", label: CATEGORY_LABELS.plastic },
          { key: "metal", label: CATEGORY_LABELS.metal },
          { key: "electronics", label: CATEGORY_LABELS.electronics },
          { key: "clothes", label: CATEGORY_LABELS.clothes },
        ] as { key: CategoryFilter; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCategoryFilter(tab.key)}
            className={`eco-tab ${categoryFilter === tab.key ? "eco-tab-active" : "eco-tab-inactive"}`}
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
              {records.map((record) => (
                <Link
                  key={record.id}
                  to={`/recycle/order/${record.orderId}`}
                  className="eco-card p-4 flex items-center gap-3 block hover:shadow-eco-lg transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Recycle size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      {record.categories.map((cat) => (
                        <span key={cat} className="flex items-center gap-0.5 text-xs text-forest-600">
                          {CATEGORY_ICONS[cat]}
                          {CATEGORY_LABELS[cat]}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-forest-400 mt-0.5">
                      订单 {record.orderId}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-green-600">{record.weight}kg</p>
                    <p className="text-xs text-forest-500">+{record.pointsEarned}积分</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-forest-400">
            <Recycle size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">暂无回收记录</p>
          </div>
        )}
      </div>
    </div>
  );
}

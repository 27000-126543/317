import { useState, useMemo } from "react";
import { Recycle, Package, Users, TrendingUp, UserCheck, Clock, Star, Filter, Calendar, Download } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useStore } from "@/store/useStore";

const PIE_COLORS = ["#2D6A4F", "#52b788", "#F4A261", "#457B9D", "#E76F51"];
const cities = ["全部", "北京", "上海", "广州", "深圳"];
const months = ["1月", "2月", "3月", "4月", "5月", "6月"];
const CITY_MULTIPLIER: Record<string, number> = { "全部": 1, "北京": 1.0, "上海": 1.1, "广州": 0.85, "深圳": 0.95 };
const MONTH_MULTIPLIER: Record<string, number> = { "1月": 0.7, "2月": 0.6, "3月": 0.8, "4月": 0.95, "5月": 1.05, "6月": 1.15 };

export default function AdminDashboard() {
  const dashboardData = useStore((s) => s.dashboardData);
  const [city, setCity] = useState("全部");
  const [month, setMonth] = useState("6月");

  const m = CITY_MULTIPLIER[city] * MONTH_MULTIPLIER[month];

  const filtered = useMemo(() => ({
    totalRecycledWeight: Math.round(dashboardData.totalRecycledWeight * m * 10) / 10,
    totalOrders: Math.round(dashboardData.totalOrders * m),
    activeCollectors: Math.max(1, Math.round(dashboardData.activeCollectors * m)),
    pointsExchangeRate: Math.min(99.9, Math.round((dashboardData.pointsExchangeRate + (m - 1) * 8) * 10) / 10),
    totalUsers: Math.round(dashboardData.totalUsers * m),
    complaintResolutionTime: Math.round((dashboardData.complaintResolutionTime + (1 - m) * 1.5) * 10) / 10,
    categoryBreakdown: dashboardData.categoryBreakdown.map((c) => ({
      ...c,
      weight: Math.round(c.weight * m),
      orders: Math.round(c.orders * m),
    })),
    monthlyTrend: dashboardData.monthlyTrend.map((t) => ({
      ...t,
      weight: Math.round(t.weight * m),
      orders: Math.round(t.orders * m),
      points: Math.round(t.points * m),
    })),
    collectorPerformance: dashboardData.collectorPerformance.map((c) => ({
      ...c,
      orders: Math.round(c.orders * m),
      earnings: Math.round(c.earnings * m),
    })),
  }), [city, month, m, dashboardData]);

  const handleExport = () => {
    const lines: string[] = [];
    lines.push("═══════════════════════════════════════════");
    lines.push("       绿循平台数据看板");
    lines.push("═══════════════════════════════════════════");
    lines.push(`城市：${city === "全部" ? "全部城市" : city}    月份：${month}`);
    lines.push("");
    lines.push("【核心指标】");
    lines.push(`  总回收量：${filtered.totalRecycledWeight.toLocaleString()} kg`);
    lines.push(`  总订单量：${filtered.totalOrders.toLocaleString()}`);
    lines.push(`  活跃回收员：${filtered.activeCollectors}`);
    lines.push(`  积分兑换率：${filtered.pointsExchangeRate}%`);
    lines.push(`  总用户数：${filtered.totalUsers.toLocaleString()}`);
    lines.push(`  投诉处理时效：${filtered.complaintResolutionTime}h`);
    lines.push("");
    lines.push("【品类分布】");
    filtered.categoryBreakdown.forEach((c) => {
      lines.push(`  ${c.category}：${c.weight.toLocaleString()}kg / ${c.orders}单`);
    });
    lines.push("");
    lines.push("【回收员绩效排名】");
    filtered.collectorPerformance.forEach((c, i) => {
      lines.push(`  ${i + 1}. ${c.name} - ${c.orders}单 / 评分${c.rating} / ¥${c.earnings.toLocaleString()}`);
    });
    lines.push("");
    lines.push("═══════════════════════════════════════════");
    lines.push(`  导出时间：${new Date().toLocaleString("zh-CN")}`);
    lines.push("═══════════════════════════════════════════");

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `绿循看板_${city === "全部" ? "全部城市" : city}_${month}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const topMetrics = [
    { label: "总回收量", value: `${filtered.totalRecycledWeight.toLocaleString()} kg`, icon: Recycle, bg: "bg-forest-700" },
    { label: "总订单量", value: filtered.totalOrders.toLocaleString(), icon: Package, bg: "bg-eco-blue" },
    { label: "活跃回收员", value: filtered.activeCollectors.toString(), icon: Users, bg: "bg-amber-500" },
    { label: "积分兑换率", value: `${filtered.pointsExchangeRate}%`, icon: TrendingUp, bg: "bg-purple-600" },
  ];

  const secondMetrics = [
    { label: "总用户数", value: filtered.totalUsers.toLocaleString(), icon: UserCheck },
    { label: "投诉处理时效", value: `${filtered.complaintResolutionTime}h`, icon: Clock },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="eco-card p-4 flex flex-wrap items-center gap-3">
        <Filter size={16} className="text-forest-500" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="eco-input py-2 px-3 text-sm w-auto"
        >
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <Calendar size={16} className="text-forest-500 ml-2" />
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="eco-input py-2 px-3 text-sm w-auto"
        >
          {months.map((mo) => (
            <option key={mo} value={mo}>{mo}</option>
          ))}
        </select>
        <button className="eco-btn-primary flex items-center gap-2 ml-auto text-sm py-2 px-4" onClick={handleExport}>
          <Download size={16} />
          导出
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topMetrics.map((mt) => {
          const Icon = mt.icon;
          return (
            <div key={mt.label} className="eco-card p-5 flex items-center gap-4">
              <div className={`${mt.bg} w-12 h-12 rounded-xl flex items-center justify-center text-white`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-forest-500">{mt.label}</p>
                <p className="text-xl font-bold text-forest-800">{mt.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {secondMetrics.map((mt) => {
          const Icon = mt.icon;
          return (
            <div key={mt.label} className="eco-card p-5 flex items-center gap-4">
              <div className="bg-forest-100 w-12 h-12 rounded-xl flex items-center justify-center text-forest-700">
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-forest-500">{mt.label}</p>
                <p className="text-xl font-bold text-forest-800">{mt.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="eco-card p-5">
          <h3 className="section-title mb-4">品类分布</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={filtered.categoryBreakdown}
                dataKey="weight"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              >
                {filtered.categoryBreakdown.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} kg`, "回收量"]}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="eco-card p-5">
          <h3 className="section-title mb-4">月度趋势</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={filtered.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7e3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#74c69d" />
              <YAxis yAxisId="weight" tick={{ fontSize: 12 }} stroke="#2D6A4F" />
              <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 12 }} stroke="#457B9D" />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}
              />
              <Legend />
              <Line
                yAxisId="weight"
                type="monotone"
                dataKey="weight"
                name="回收量 (kg)"
                stroke="#2D6A4F"
                strokeWidth={2}
                dot={{ fill: "#2D6A4F", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                name="订单量"
                stroke="#457B9D"
                strokeWidth={2}
                dot={{ fill: "#457B9D", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="eco-card p-5">
        <h3 className="section-title mb-4">回收员绩效排名</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest-100">
                <th className="text-left py-3 px-4 text-forest-500 font-medium">姓名</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">接单量</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">评分</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">收入</th>
              </tr>
            </thead>
            <tbody>
              {filtered.collectorPerformance.slice(0, 5).map((c, i) => (
                <tr key={c.id} className="border-b border-forest-50 hover:bg-forest-50/50 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i < 3 ? "bg-forest-700" : "bg-forest-400"}`}>
                      {i + 1}
                    </span>
                    <span className="font-medium text-forest-800">{c.name}</span>
                  </td>
                  <td className="py-3 px-4 text-forest-700">{c.orders}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-forest-700">{c.rating}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-forest-700 font-medium">¥{c.earnings.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { Recycle, Package, Users, TrendingUp, UserCheck, Clock, Star } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useStore } from "@/store/useStore";

const PIE_COLORS = ["#2D6A4F", "#52b788", "#F4A261", "#457B9D", "#E76F51"];

export default function AdminDashboard() {
  const dashboardData = useStore((s) => s.dashboardData);

  const topMetrics = [
    { label: "总回收量", value: `${dashboardData.totalRecycledWeight.toLocaleString()} kg`, icon: Recycle, bg: "bg-forest-700" },
    { label: "总订单量", value: dashboardData.totalOrders.toLocaleString(), icon: Package, bg: "bg-eco-blue" },
    { label: "活跃回收员", value: dashboardData.activeCollectors.toString(), icon: Users, bg: "bg-amber-500" },
    { label: "积分兑换率", value: `${dashboardData.pointsExchangeRate}%`, icon: TrendingUp, bg: "bg-purple-600" },
  ];

  const secondMetrics = [
    { label: "总用户数", value: dashboardData.totalUsers.toLocaleString(), icon: UserCheck },
    { label: "投诉处理时效", value: `${dashboardData.complaintResolutionTime}h`, icon: Clock },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="eco-card p-5 flex items-center gap-4">
              <div className={`${m.bg} w-12 h-12 rounded-xl flex items-center justify-center text-white`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-forest-500">{m.label}</p>
                <p className="text-xl font-bold text-forest-800">{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {secondMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="eco-card p-5 flex items-center gap-4">
              <div className="bg-forest-100 w-12 h-12 rounded-xl flex items-center justify-center text-forest-700">
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-forest-500">{m.label}</p>
                <p className="text-xl font-bold text-forest-800">{m.value}</p>
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
                data={dashboardData.categoryBreakdown}
                dataKey="weight"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              >
                {dashboardData.categoryBreakdown.map((_, i) => (
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
            <LineChart data={dashboardData.monthlyTrend}>
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
              {dashboardData.collectorPerformance.slice(0, 5).map((c, i) => (
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

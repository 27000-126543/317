import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { ArrowLeft, Star, Recycle, ShoppingBag, TrendingUp, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AssetOverview() {
  const navigate = useNavigate();
  const currentUser = useStore((s) => s.currentUser);
  const getUserPoints = useStore((s) => s.getUserPoints);
  const getUserWeight = useStore((s) => s.getUserWeight);
  const getTotalEarned = useStore((s) => s.getTotalEarned);
  const getTotalSpent = useStore((s) => s.getTotalSpent);
  const pointsHistory = useStore((s) => s.pointsHistory);
  const weightHistory = useStore((s) => s.weightHistory);

  const displayPoints = getUserPoints(currentUser.id);
  const displayWeight = getUserWeight(currentUser.id);
  const totalEarned = getTotalEarned(currentUser.id);
  const totalSpent = getTotalSpent(currentUser.id);

  const now = new Date();
  const monthKeys: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  const monthLabels = monthKeys.map((k) => {
    const [y, m] = k.split("-");
    return `${parseInt(m)}月`;
  });

  const pointsByMonth: Record<string, { earned: number; spent: number }> = {};
  const weightByMonth: Record<string, number> = {};
  monthKeys.forEach((k) => {
    pointsByMonth[k] = { earned: 0, spent: 0 };
    weightByMonth[k] = 0;
  });

  pointsHistory
    .filter((r) => r.userId === currentUser.id)
    .forEach((r) => {
      const d = new Date(r.createdAt);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (pointsByMonth[k]) {
        if (r.points > 0) pointsByMonth[k].earned += r.points;
        else pointsByMonth[k].spent += Math.abs(r.points);
      }
    });

  weightHistory
    .filter((r) => r.userId === currentUser.id)
    .forEach((r) => {
      const d = new Date(r.createdAt);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (weightByMonth[k] !== undefined) {
        weightByMonth[k] += r.weight;
      }
    });

  const chartData = monthKeys.map((k, idx) => ({
    month: monthLabels[idx],
    earned: pointsByMonth[k].earned,
    spent: pointsByMonth[k].spent,
    weight: Math.round(weightByMonth[k] * 10) / 10,
  }));

  const cards = [
    {
      icon: Star,
      label: "积分余额",
      value: displayPoints.toLocaleString(),
      color: "text-amber-600",
      bg: "bg-amber-50",
      link: "/points/history",
    },
    {
      icon: TrendingUp,
      label: "累计获得",
      value: totalEarned.toLocaleString(),
      color: "text-green-600",
      bg: "bg-green-50",
      link: "/points/history?filter=recycle_reward",
    },
    {
      icon: ShoppingBag,
      label: "累计消费",
      value: totalSpent.toLocaleString(),
      color: "text-rose-600",
      bg: "bg-rose-50",
      link: "/points/history?filter=exchange_deduct",
    },
    {
      icon: Recycle,
      label: "回收重量",
      value: `${displayWeight}kg`,
      color: "text-forest-700",
      bg: "bg-forest-50",
      link: "/weight/history",
    },
  ];

  return (
    <div className="pb-8 animate-slide-up">
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-forest-50 flex items-center justify-center text-forest-700 hover:bg-forest-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-forest-800 font-display">资产总览</h1>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-gradient-to-r from-forest-600 to-forest-500 rounded-2xl p-6 text-white">
          <p className="text-sm text-forest-100">总资产价值</p>
          <p className="text-4xl font-bold mt-1">{displayPoints.toLocaleString()}</p>
          <p className="text-xs text-forest-200 mt-1">积分</p>
          <div className="flex gap-8 mt-4 text-forest-100 text-xs">
            <span>累计获得 {totalEarned.toLocaleString()}</span>
            <span>累计消费 {totalSpent.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="px-5 grid grid-cols-2 gap-3 mb-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="eco-card p-4 flex items-center gap-3 hover:shadow-eco-lg transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center flex-shrink-0`}>
              <card.icon size={18} className={card.color} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-forest-400">{card.label}</p>
              <p className={`text-sm font-bold ${card.color}`}>{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="px-5 mb-5">
        <div className="eco-card p-4">
          <h3 className="text-sm font-bold text-forest-800 mb-3">近6个月积分趋势</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F0E8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B8F6B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B8F6B" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(value: number, name: string) => [
                    name === "earned" ? `${value} 积分` : `${value} 积分`,
                    name === "earned" ? "获得" : "消费",
                  ]}
                />
                <Bar dataKey="earned" fill="#2D6A4F" radius={[4, 4, 0, 0]} name="earned" />
                <Bar dataKey="spent" fill="#F4A261" radius={[4, 4, 0, 0]} name="spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-forest-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-forest-700 inline-block" />
              获得
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-accent inline-block" />
              消费
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 mb-5">
        <div className="eco-card p-4">
          <h3 className="text-sm font-bold text-forest-800 mb-3">近6个月回收趋势</h3>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F0E8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B8F6B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B8F6B" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(value: number) => `${value} kg`}
                />
                <Bar dataKey="weight" fill="#52B788" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-2">
        <Link
          to="/points/history"
          className="eco-card p-4 flex items-center gap-3 hover:shadow-eco-lg transition-shadow"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Star size={18} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-forest-800">积分明细</p>
            <p className="text-xs text-forest-400">查看全部积分增减记录</p>
          </div>
          <ChevronRight size={16} className="text-forest-300" />
        </Link>
        <Link
          to="/weight/history"
          className="eco-card p-4 flex items-center gap-3 hover:shadow-eco-lg transition-shadow"
        >
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <Recycle size={18} className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-forest-800">回收重量明细</p>
            <p className="text-xs text-forest-400">按品类和月份查看</p>
          </div>
          <ChevronRight size={16} className="text-forest-300" />
        </Link>
        <Link
          to="/mall/orders"
          className="eco-card p-4 flex items-center gap-3 hover:shadow-eco-lg transition-shadow"
        >
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
            <ShoppingBag size={18} className="text-rose-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-forest-800">商城兑换记录</p>
            <p className="text-xs text-forest-400">查看兑换和物流</p>
          </div>
          <ChevronRight size={16} className="text-forest-300" />
        </Link>
      </div>
    </div>
  );
}

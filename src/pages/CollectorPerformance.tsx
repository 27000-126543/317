import { useStore } from "@/store/useStore";
import { TrendingUp, DollarSign, Star, Award, BarChart3 } from "lucide-react";

const monthlyData = [
  { month: "1月", amount: 4580 },
  { month: "2月", amount: 3920 },
  { month: "3月", amount: 5340 },
  { month: "4月", amount: 5860 },
  { month: "5月", amount: 6120 },
  { month: "6月", amount: 6580 },
];

export default function CollectorPerformance() {
  const { currentCollector } = useStore();
  const { todayOrders, todayEarnings, monthlyOrders, monthlyEarnings, rating } = currentCollector;

  const base = 3000;
  const commission = monthlyOrders * 5;
  const ratingBonus = rating >= 4.8 ? 200 : 0;
  const total = base + commission + ratingBonus;

  const maxAmount = Math.max(...monthlyData.map((d) => d.amount));

  const stats = [
    { label: "今日接单", value: todayOrders, icon: TrendingUp, color: "text-forest-600" },
    { label: "今日收入", value: `¥${todayEarnings}`, icon: DollarSign, color: "text-accent" },
    { label: "本月接单", value: monthlyOrders, icon: BarChart3, color: "text-forest-600" },
    { label: "本月收入", value: `¥${monthlyEarnings}`, icon: DollarSign, color: "text-accent" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="eco-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-sm text-forest-500">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-forest-800">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="eco-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          <span className="section-title">服务评分</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-forest-800">{rating}</span>
          <span className="text-lg text-forest-400 mb-1">/5.0</span>
          <div className="flex gap-0.5 mb-2 ml-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-forest-200"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="eco-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-forest-600" />
          <span className="section-title">近6月收入趋势</span>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
          {monthlyData.map((d) => {
            const height = (d.amount / maxAmount) * 100;
            return (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-forest-600">¥{d.amount}</span>
                <div className="w-full flex justify-center">
                  <div
                    className="w-8 rounded-t-lg bg-card-gradient"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-forest-500">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="eco-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-5 w-5 text-forest-600" />
          <span className="section-title">绩效工资计算</span>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-forest-50 px-4 py-3 text-sm text-forest-700">
            基础工资 + 订单提成(¥5/单) + 评分奖励(4.8分以上+¥200)
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-forest-600">
              <span>基础工资</span>
              <span>¥{base}</span>
            </div>
            <div className="flex justify-between text-forest-600">
              <span>订单提成 ({monthlyOrders}单 × ¥5)</span>
              <span>¥{commission}</span>
            </div>
            <div className="flex justify-between text-forest-600">
              <span>评分奖励 {ratingBonus > 0 && `(${rating}分)`}</span>
              <span>+¥{ratingBonus}</span>
            </div>
            <div className="border-t border-forest-200 pt-2 flex justify-between font-bold text-forest-800 text-base">
              <span>预计总收入</span>
              <span>¥{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

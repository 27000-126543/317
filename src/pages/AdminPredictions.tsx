import { Brain, TrendingUp, Users, DollarSign, ArrowUp, ArrowDown, Check } from "lucide-react";
import { useStore } from "@/store/useStore";

const categoryLabels: Record<string, string> = { paper: "废纸", plastic: "塑料", metal: "金属" };

export default function AdminPredictions() {
  const prediction = useStore((s) => s.dashboardData.prediction);
  const activeCollectors = useStore((s) => s.dashboardData.activeCollectors);
  const diff = prediction.suggestedStaffCount - activeCollectors;

  const handleApply = () => alert("建议已应用！");

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="bg-gradient-to-r from-forest-700 to-forest-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Brain size={24} />
          <h3 className="text-lg font-bold font-display">下月回收高峰预测</h3>
        </div>
        <p className="text-forest-100 leading-relaxed">{prediction.nextMonthPeak}</p>
      </div>

      <div className="eco-card p-5">
        <h3 className="section-title mb-4 flex items-center gap-2">
          <DollarSign size={18} className="text-accent" />
          建议价格调整
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest-100">
                <th className="text-left py-3 px-4 text-forest-500 font-medium">品类</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">建议调整</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">趋势</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(prediction.suggestedPriceAdjustment).map(([key, value]) => (
                <tr key={key} className="border-b border-forest-50 hover:bg-forest-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-forest-800">{categoryLabels[key] ?? key}</td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${value > 0 ? "text-green-600" : "text-red-500"}`}>
                      {value > 0 ? "+" : ""}{value}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {value > 0 ? (
                      <ArrowUp size={16} className="text-green-600" />
                    ) : (
                      <ArrowDown size={16} className="text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="eco-card p-5">
        <h3 className="section-title mb-4 flex items-center gap-2">
          <Users size={18} className="text-eco-blue" />
          人员配置建议
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-forest-500">当前活跃回收员</span>
            <span className="font-bold text-forest-800">{activeCollectors} 人</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-forest-500">建议配置人数</span>
            <span className="font-bold text-forest-700">{prediction.suggestedStaffCount} 人</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-forest-500">需新增</span>
            <span className="font-bold text-accent">+{diff} 人</span>
          </div>
          <div className="mt-2">
            <div className="h-3 bg-forest-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-card-gradient rounded-full transition-all duration-500"
                style={{ width: `${(activeCollectors / prediction.suggestedStaffCount) * 100}%` }}
              />
            </div>
            <p className="text-xs text-forest-400 mt-1">
              当前配置率 {((activeCollectors / prediction.suggestedStaffCount) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <button className="eco-btn-primary flex items-center gap-2 w-full justify-center" onClick={handleApply}>
        <Check size={18} />
        应用建议
      </button>
    </div>
  );
}

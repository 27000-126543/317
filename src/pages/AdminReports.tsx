import { useState, useMemo } from "react";
import { Download, Filter, Calendar, Trophy, Star, Recycle, DollarSign } from "lucide-react";
import { useStore } from "@/store/useStore";

const cities = ["全部", "北京", "上海", "广州", "深圳"];
const months = ["1月", "2月", "3月", "4月", "5月", "6月"];

const CITY_MULTIPLIER: Record<string, number> = { "全部": 1, "北京": 1.0, "上海": 1.1, "广州": 0.85, "深圳": 0.95 };
const MONTH_MULTIPLIER: Record<string, number> = { "1月": 0.7, "2月": 0.6, "3月": 0.8, "4月": 0.95, "5月": 1.05, "6月": 1.15 };

export default function AdminReports() {
  const dashboardData = useStore((s) => s.dashboardData);
  const [city, setCity] = useState("全部");
  const [month, setMonth] = useState("6月");

  const multiplier = CITY_MULTIPLIER[city] * MONTH_MULTIPLIER[month];

  const filteredData = useMemo(() => {
    const m = multiplier;
    return {
      income: Math.round(128500 * m),
      cost: Math.round(45200 * m),
      satisfaction: Math.min(99.9, Math.round((94.5 + (m - 1) * 5) * 10) / 10),
      categoryBreakdown: dashboardData.categoryBreakdown.map((c) => ({
        ...c,
        weight: Math.round(c.weight * m),
        orders: Math.round(c.orders * m),
        income: Math.round(c.weight * m * (c.category === "废纸" ? 3 : c.category === "塑料" ? 4 : c.category === "金属" ? 8 : c.category === "电子产品" ? 15 : 2)),
        cost: Math.round(c.weight * m * 1.5),
      })),
      performance: dashboardData.collectorPerformance.map((c) => ({
        ...c,
        orders: Math.round(c.orders * m),
        earnings: Math.round(c.earnings * m),
      })),
    };
  }, [city, month, multiplier, dashboardData]);

  const handleExport = () => {
    const lines: string[] = [];
    lines.push("═══════════════════════════════════════════");
    lines.push("       绿循平台月度运营报表");
    lines.push("═══════════════════════════════════════════");
    lines.push(`城市：${city === "全部" ? "全部城市" : city}    月份：${month}`);
    lines.push("");
    lines.push("【总体指标】");
    lines.push(`  回收收入：¥${filteredData.income.toLocaleString()}`);
    lines.push(`  运营成本：¥${filteredData.cost.toLocaleString()}`);
    lines.push(`  毛利润：¥${(filteredData.income - filteredData.cost).toLocaleString()}`);
    lines.push(`  用户满意度：${filteredData.satisfaction}%`);
    lines.push("");
    lines.push("【各品类回收明细】");
    lines.push("  品类\t\t回收量(kg)\t订单量\t收入(¥)\t成本(¥)");
    lines.push("  ─────────────────────────────────────────");
    filteredData.categoryBreakdown.forEach((c) => {
      lines.push(`  ${c.category}\t\t${c.weight.toLocaleString()}\t\t${c.orders}\t${c.income.toLocaleString()}\t\t${c.cost.toLocaleString()}`);
    });
    lines.push("");
    lines.push("【回收员绩效排名】");
    lines.push("  排名\t姓名\t接单量\t评分\t收入(¥)");
    lines.push("  ─────────────────────────────────────────");
    filteredData.performance.forEach((c, i) => {
      lines.push(`  ${i + 1}\t${c.name}\t${c.orders}\t${c.rating}\t¥${c.earnings.toLocaleString()}`);
    });
    lines.push("");
    lines.push("═══════════════════════════════════════════");
    lines.push(`  报表生成时间：${new Date().toLocaleString("zh-CN")}`);
    lines.push("═══════════════════════════════════════════");

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `绿循运营报表_${city === "全部" ? "全部城市" : city}_${month}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <button className="eco-btn-primary flex items-center gap-2 ml-auto text-sm py-2 px-4" onClick={handleExport}>
          <Download size={16} />
          导出报表
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="eco-card p-5 flex items-center gap-4">
          <div className="bg-forest-700 w-12 h-12 rounded-xl flex items-center justify-center">
            <DollarSign size={22} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-forest-500">本月回收收入</p>
            <p className="text-xl font-bold text-forest-800">¥{filteredData.income.toLocaleString()}</p>
          </div>
        </div>
        <div className="eco-card p-5 flex items-center gap-4">
          <div className="bg-eco-blue w-12 h-12 rounded-xl flex items-center justify-center">
            <Recycle size={22} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-forest-500">运营成本</p>
            <p className="text-xl font-bold text-forest-800">¥{filteredData.cost.toLocaleString()}</p>
          </div>
        </div>
        <div className="eco-card p-5 flex items-center gap-4">
          <div className="bg-accent w-12 h-12 rounded-xl flex items-center justify-center">
            <Trophy size={22} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-forest-500">用户满意度</p>
            <p className="text-xl font-bold text-forest-800">{filteredData.satisfaction}%</p>
          </div>
        </div>
      </div>

      <div className="eco-card p-5">
        <h3 className="section-title mb-4">各品类回收明细</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest-100">
                <th className="text-left py-3 px-4 text-forest-500 font-medium">品类</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">回收量(kg)</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">订单量</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">收入(¥)</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">成本(¥)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.categoryBreakdown.map((c) => (
                <tr key={c.category} className="border-b border-forest-50 hover:bg-forest-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-forest-800">{c.category}</td>
                  <td className="py-3 px-4 text-forest-700">{c.weight.toLocaleString()}</td>
                  <td className="py-3 px-4 text-forest-700">{c.orders}</td>
                  <td className="py-3 px-4 text-forest-700 font-medium">¥{c.income.toLocaleString()}</td>
                  <td className="py-3 px-4 text-forest-500">¥{c.cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="eco-card p-5">
        <h3 className="section-title mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-accent" />
          回收员绩效排名
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest-100">
                <th className="text-left py-3 px-4 text-forest-500 font-medium">排名</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">姓名</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">接单量</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">评分</th>
                <th className="text-left py-3 px-4 text-forest-500 font-medium">收入</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.performance.map((c, i) => (
                <tr key={c.id} className="border-b border-forest-50 hover:bg-forest-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i < 3 ? "bg-forest-700" : "bg-forest-400"}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-forest-800">{c.name}</td>
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

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/data/mockData";
import { ScanLine, Camera, Scale, CheckCircle, MapPin, Clock, Package, Navigation } from "lucide-react";

export default function CollectorActive() {
  const { recycleOrders, currentCollector, updateOrderStatus, completeOrder } = useStore();
  const [weights, setWeights] = useState<Record<string, string>>({});

  const activeOrders = recycleOrders.filter(
    (o) =>
      o.collectorId === currentCollector.id &&
      ["matched", "accepted", "arrived", "weighing"].includes(o.status)
  );

  if (activeOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-forest-500">
        <Clock className="h-16 w-16 mb-4 text-forest-300" />
        <p className="text-lg font-medium">暂无进行中订单</p>
        <p className="text-sm mt-1 text-forest-400">接单后订单会出现在这里</p>
      </div>
    );
  }

  const handleComplete = (orderId: string) => {
    const w = parseFloat(weights[orderId] || "0");
    if (w <= 0) return;
    completeOrder(orderId, w, []);
  };

  const statusLabelMap: Record<string, string> = {
    matched: "待接单",
    accepted: "已接单·待出发",
    arrived: "已到达·待扫码",
    weighing: "称重中",
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="section-title">进行中 ({activeOrders.length})</h2>

      {activeOrders.map((order) => (
        <div key={order.id} className="eco-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="eco-badge bg-forest-100 text-forest-700">
              {order.id}
            </span>
            <span className="eco-badge bg-amber-100 text-amber-700">
              {statusLabelMap[order.status] ?? order.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {order.categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-2.5 py-1 text-xs text-forest-700"
              >
                {CATEGORY_ICONS[cat]}
                {CATEGORY_LABELS[cat]}
              </span>
            ))}
          </div>

          <div className="space-y-1.5 text-sm text-forest-600">
            <p className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              预估重量: {order.estimatedWeight}kg
            </p>
            <p className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {order.scheduledTime}
            </p>
            <p className="flex items-start gap-1">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{order.address.detail}</span>
            </p>
          </div>

          {order.status === "matched" && (
            <button
              onClick={() => updateOrderStatus(order.id, "accepted")}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-forest-600 py-3 text-sm font-medium text-white hover:bg-forest-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              接单
            </button>
          )}

          {order.status === "accepted" && (
            <button
              onClick={() => updateOrderStatus(order.id, "arrived")}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-forest-600 py-3 text-sm font-medium text-white hover:bg-forest-700 transition-colors"
            >
              <Navigation className="h-4 w-4" />
              出发前往
            </button>
          )}

          {order.status === "arrived" && (
            <button
              onClick={() => updateOrderStatus(order.id, "weighing")}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <ScanLine className="h-4 w-4" />
              扫码确认
            </button>
          )}

          {order.status === "weighing" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-forest-600" />
                <input
                  type="number"
                  placeholder="输入实际重量(kg)"
                  value={weights[order.id] || ""}
                  onChange={(e) =>
                    setWeights((prev) => ({ ...prev, [order.id]: e.target.value }))
                  }
                  className="eco-input flex-1 !py-2 text-sm"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-forest-700 hover:bg-gray-200 transition-colors">
                  <Camera className="h-4 w-4" />
                  拍照
                </button>
                <button
                  onClick={() => handleComplete(order.id)}
                  disabled={!weights[order.id] || parseFloat(weights[order.id]) <= 0}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-forest-600 py-2.5 text-sm font-medium text-white hover:bg-forest-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-4 w-4" />
                  确认完成
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

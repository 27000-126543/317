import { useStore } from "@/store/useStore";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/data/mockData";
import { MapPin, Package, Clock, CheckCircle } from "lucide-react";

const MOCK_DISTANCE = () => (Math.random() * 4 + 0.5).toFixed(1);

export default function CollectorPending() {
  const { recycleOrders, acceptOrder } = useStore();
  const pendingOrders = recycleOrders.filter((o) => o.status === "pending");

  if (pendingOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-forest-500">
        <Package className="h-16 w-16 mb-4 text-forest-300" />
        <p className="text-lg font-medium">暂无待接订单</p>
        <p className="text-sm mt-1 text-forest-400">新订单会实时推送到这里</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="section-title">待接订单 ({pendingOrders.length})</h2>

      {pendingOrders.map((order) => (
        <div key={order.id} className="eco-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="eco-badge bg-forest-100 text-forest-700">
              {order.id}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-forest-600">
              <MapPin className="h-4 w-4" />
              {MOCK_DISTANCE()}km
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

          <div className="flex items-center gap-4 text-sm text-forest-600">
            <span className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              预估 {order.estimatedWeight}kg
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {order.scheduledTime}
            </span>
          </div>

          <p className="text-sm text-forest-600 flex items-start gap-1">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{order.address.detail}</span>
          </p>

          <button
            onClick={() => acceptOrder(order.id)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-700 active:bg-forest-800"
          >
            <CheckCircle className="h-4 w-4" />
            接单
          </button>
        </div>
      ))}
    </div>
  );
}

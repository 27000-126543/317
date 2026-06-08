import { useStore } from "@/store/useStore";
import { Package, Truck, CheckCircle, Clock, ShoppingBag } from "lucide-react";
import type { ExchangeOrder } from "@/data/mockData";

const statusConfig: Record<
  ExchangeOrder["status"],
  { label: string; color: string; icon: typeof Package }
> = {
  pending: { label: "待发货", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  shipped: { label: "已发货", color: "bg-blue-100 text-blue-700", icon: Truck },
  delivered: { label: "已签收", color: "bg-green-100 text-green-700", icon: CheckCircle },
};

const statusTimeline: Record<ExchangeOrder["status"], number> = {
  pending: 1,
  shipped: 2,
  delivered: 3,
};

export default function ExchangeOrders() {
  const exchangeOrders = useStore((s) => s.exchangeOrders);

  if (exchangeOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-forest-400 gap-3 animate-slide-up">
        <Package size={48} className="opacity-30" />
        <p>暂无兑换记录</p>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-4 animate-slide-up">
      {exchangeOrders.map((order) => {
        const config = statusConfig[order.status];
        const Icon = config.icon;
        const step = statusTimeline[order.status];
        const timelineSteps = [
          { num: 1, label: "兑换成功", time: new Date(order.createdAt).toLocaleString("zh-CN") },
          { num: 2, label: "已发货", time: order.shippedAt ? new Date(order.shippedAt).toLocaleString("zh-CN") : "" },
          { num: 3, label: "已签收", time: order.deliveredAt ? new Date(order.deliveredAt).toLocaleString("zh-CN") : "" },
        ];

        return (
          <div key={order.id} className="eco-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              {order.productImage ? (
                <img src={order.productImage} alt={order.productName} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-forest-50 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={24} className="text-forest-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-forest-800 truncate">{order.productName}</p>
                <p className="text-xs text-forest-500 flex items-center gap-1 mt-0.5">
                  <Package size={12} />
                  {order.pointsCost} 积分
                </p>
              </div>
              <span className={`eco-badge flex-shrink-0 ${config.color}`}>
                <Icon size={12} className="mr-1" />
                {config.label}
              </span>
            </div>

            <div className="space-y-0">
              {timelineSteps.map((s, idx) => {
                const isActive = s.num <= step;
                const isCurrent = s.num === step;
                return (
                  <div key={s.num} className="flex items-start gap-3 relative">
                    {idx < timelineSteps.length - 1 && (
                      <div className={`absolute left-[7px] top-5 w-0.5 h-full ${s.num < step ? "bg-forest-500" : "bg-forest-200"}`} />
                    )}
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-bold z-10 mt-0.5 ${
                      isCurrent ? "bg-forest-700 text-white ring-2 ring-forest-200" :
                      isActive ? "bg-forest-500 text-white" : "bg-forest-100 text-forest-400"
                    }`}>
                      {isActive ? "✓" : s.num}
                    </div>
                    <div className="flex-1 pb-3">
                      <p className={`text-xs font-medium ${isActive ? "text-forest-700" : "text-forest-400"}`}>
                        {s.label}
                      </p>
                      {s.time && (
                        <p className="text-[10px] text-forest-400 mt-0.5">{s.time}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {order.trackingNumber && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-forest-50">
                <span className="text-forest-400 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                </span>
                <span className="text-forest-600 flex items-center gap-1 font-medium">
                  <Truck size={12} />
                  物流单号：{order.trackingNumber}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

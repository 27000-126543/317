import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { Package, Truck, CheckCircle, Clock, ShoppingBag, MapPin, KeyRound, FileText, ChevronRight, XCircle } from "lucide-react";
import type { ExchangeOrder } from "@/data/mockData";

const statusConfig: Record<
  ExchangeOrder["status"],
  { label: string; color: string; icon: typeof Package }
> = {
  pending: { label: "待发货", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  shipped: { label: "已发货", color: "bg-blue-100 text-blue-700", icon: Truck },
  delivered: { label: "已签收", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "已取消", color: "bg-gray-100 text-gray-500", icon: XCircle },
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

        return (
          <Link
            key={order.id}
            to={`/mall/order/${order.id}`}
            className="eco-card p-4 space-y-3 block hover:shadow-eco-lg transition-shadow"
          >
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

            {order.pickupInfo && order.status !== "cancelled" && (
              <div className="bg-forest-50/70 rounded-xl p-3 space-y-1.5">
                <p className="text-xs font-bold text-forest-700 flex items-center gap-1">
                  <MapPin size={12} />
                  取货通知
                </p>
                <p className="text-xs text-forest-600 flex items-center gap-1.5">
                  <Clock size={11} className="text-forest-400 flex-shrink-0" />
                  <span>预计取货时间：{order.pickupInfo.estimatedTime}</span>
                </p>
                <p className="text-xs text-forest-600 flex items-center gap-1.5">
                  <KeyRound size={11} className="text-forest-400 flex-shrink-0" />
                  <span>取货码：<span className="font-bold text-forest-800 tracking-wider">{order.pickupInfo.pickupCode}</span></span>
                </p>
                <p className="text-xs text-forest-600 flex items-center gap-1.5">
                  <FileText size={11} className="text-forest-400 flex-shrink-0" />
                  <span>{order.pickupInfo.instruction}</span>
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-2 border-t border-forest-50">
              <span className="text-forest-400 flex items-center gap-1">
                <Clock size={12} />
                {new Date(order.createdAt).toLocaleDateString("zh-CN")}
              </span>
              <span className="text-forest-500 flex items-center gap-1">
                查看详情
                <ChevronRight size={12} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

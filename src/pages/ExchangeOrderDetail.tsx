import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import type { ExchangeOrder } from "@/data/mockData";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  KeyRound,
  FileText,
  ShoppingBag,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

const STATUS_CONFIG: Record<
  ExchangeOrder["status"],
  { label: string; color: string; icon: typeof Package; bg: string }
> = {
  pending: { label: "待发货", color: "text-yellow-700", icon: Clock, bg: "bg-yellow-100" },
  shipped: { label: "已发货", color: "text-blue-700", icon: Truck, bg: "bg-blue-100" },
  delivered: { label: "已签收", color: "text-green-700", icon: CheckCircle, bg: "bg-green-100" },
  cancelled: { label: "已取消", color: "text-gray-700", icon: XCircle, bg: "bg-gray-100" },
};

const STATUS_STEP: Record<ExchangeOrder["status"], number> = {
  pending: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 0,
};

const NEXT_STATUS: Record<ExchangeOrder["status"], string | null> = {
  pending: "shipped",
  shipped: "delivered",
  delivered: null,
  cancelled: null,
};

const NEXT_LABEL: Record<string, string> = {
  pending: "确认发货",
  shipped: "确认签收",
};

export default function ExchangeOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const exchangeOrders = useStore((s) => s.exchangeOrders);
  const advanceExchangeStatus = useStore((s) => s.advanceExchangeStatus);
  const cancelExchange = useStore((s) => s.cancelExchange);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const order = exchangeOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-forest-400">
        <Package size={48} className="opacity-30 mb-3" />
        <p className="text-sm">兑换记录不存在</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-forest-600 text-sm underline">
          返回
        </button>
      </div>
    );
  }

  const config = STATUS_CONFIG[order.status];
  const StatusIcon = config.icon;
  const step = STATUS_STEP[order.status];
  const nextStatus = NEXT_STATUS[order.status];
  const canCancel = order.status === "pending" || order.status === "shipped";
  const isCancelled = order.status === "cancelled";

  const timelineSteps = [
    {
      num: 1,
      label: "兑换成功",
      time: new Date(order.createdAt).toLocaleString("zh-CN"),
      desc: `消耗 ${order.pointsCost} 积分`,
    },
    {
      num: 2,
      label: "已发货",
      time: order.shippedAt ? new Date(order.shippedAt).toLocaleString("zh-CN") : "",
      desc: order.trackingNumber ? `物流单号：${order.trackingNumber}` : "",
    },
    {
      num: 3,
      label: "已签收",
      time: order.deliveredAt ? new Date(order.deliveredAt).toLocaleString("zh-CN") : "",
      desc: "",
    },
  ];

  const handleAdvance = () => {
    advanceExchangeStatus(order.id);
  };

  const handleCancel = () => {
    cancelExchange(order.id);
    setShowCancelConfirm(false);
  };

  return (
    <div className="pb-8 animate-slide-up">
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-forest-50 flex items-center justify-center text-forest-700 hover:bg-forest-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-forest-800 font-display">兑换详情</h1>
      </div>

      <div className="px-5 space-y-4">
        <div className={`rounded-2xl p-5 text-white ${
          isCancelled ? "bg-gradient-to-r from-gray-500 to-gray-400" : "bg-gradient-to-r from-forest-600 to-forest-500"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">当前状态</span>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${config.bg} ${config.color}`}>
              <StatusIcon size={14} />
              {config.label}
            </span>
          </div>
          <p className="text-white/70 text-xs">订单编号：{order.id}</p>
          {isCancelled && order.cancelledAt && (
            <p className="text-white/70 text-xs mt-1">
              取消时间：{new Date(order.cancelledAt).toLocaleString("zh-CN")}
            </p>
          )}
        </div>

        {isCancelled && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <XCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">兑换已取消</p>
              <p className="text-xs text-amber-600 mt-0.5">
                已退回 {order.pointsCost} 积分至您的账户
              </p>
            </div>
          </div>
        )}

        <div className="eco-card p-5">
          <div className="flex items-center gap-4">
            {order.productImage ? (
              <img src={order.productImage} alt={order.productName} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-forest-50 flex items-center justify-center flex-shrink-0">
                <ShoppingBag size={32} className="text-forest-300" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-forest-800 text-base truncate">{order.productName}</h3>
              <p className="text-accent font-bold text-lg mt-1">
                {order.pointsCost}
                <span className="text-xs font-normal ml-0.5">积分</span>
              </p>
              <p className="text-xs text-forest-400 mt-1">
                兑换时间：{new Date(order.createdAt).toLocaleString("zh-CN")}
              </p>
            </div>
          </div>
        </div>

        {!isCancelled && (
          <div className="eco-card p-5">
            <h3 className="font-bold text-forest-800 mb-4 font-display">物流进度</h3>
            <div className="space-y-0">
              {timelineSteps.map((s, idx) => {
                const isActive = s.num === step;
                const isDone = s.num < step;
                return (
                  <div key={s.num} className="flex items-start gap-3 relative">
                    {idx < timelineSteps.length - 1 && (
                      <div className={`absolute left-[11px] top-6 w-0.5 h-full ${isDone ? "bg-forest-500" : "bg-forest-200"}`} />
                    )}
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold z-10 ${
                      isActive ? "bg-forest-700 text-white ring-4 ring-forest-100" :
                      isDone ? "bg-forest-500 text-white" : "bg-forest-100 text-forest-400"
                    }`}>
                      {isDone ? "✓" : s.num}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`text-sm font-medium ${isDone || isActive ? "text-forest-700" : "text-forest-400"}`}>
                        {s.label}
                      </p>
                      {s.time && <p className="text-xs text-forest-400 mt-0.5">{s.time}</p>}
                      {s.desc && <p className="text-xs text-forest-500 mt-0.5">{s.desc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {nextStatus && (
              <button
                onClick={handleAdvance}
                className="w-full mt-3 py-2.5 rounded-full bg-forest-600 text-white text-sm font-medium hover:bg-forest-700 transition-colors"
              >
                {NEXT_LABEL[order.status]}
              </button>
            )}
          </div>
        )}

        {order.pickupInfo && !isCancelled && (
          <div className="eco-card p-5">
            <h3 className="font-bold text-forest-800 mb-3 font-display flex items-center gap-2">
              <MapPin size={16} className="text-forest-600" />
              取货通知
            </h3>
            <div className="bg-forest-50/70 rounded-xl p-4 space-y-2.5">
              <p className="text-sm text-forest-600 flex items-center gap-2">
                <Clock size={14} className="text-forest-400 flex-shrink-0" />
                <span>预计取货时间：{order.pickupInfo.estimatedTime}</span>
              </p>
              <p className="text-sm text-forest-600 flex items-center gap-2">
                <KeyRound size={14} className="text-forest-400 flex-shrink-0" />
                <span>取货码：<span className="font-bold text-forest-800 tracking-wider text-base">{order.pickupInfo.pickupCode}</span></span>
              </p>
              <p className="text-sm text-forest-600 flex items-center gap-2">
                <FileText size={14} className="text-forest-400 flex-shrink-0" />
                <span>{order.pickupInfo.instruction}</span>
              </p>
            </div>
          </div>
        )}

        {order.trackingNumber && !isCancelled && (
          <div className="eco-card p-5">
            <h3 className="font-bold text-forest-800 mb-3 font-display flex items-center gap-2">
              <Truck size={16} className="text-forest-600" />
              物流信息
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-forest-500">物流单号</span>
                <span className="text-sm text-forest-800 font-medium">{order.trackingNumber}</span>
              </div>
              {order.shippedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-forest-500">发货时间</span>
                  <span className="text-sm text-forest-800">{new Date(order.shippedAt).toLocaleString("zh-CN")}</span>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-forest-500">签收时间</span>
                  <span className="text-sm text-forest-800">{new Date(order.deliveredAt).toLocaleString("zh-CN")}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {canCancel && !showCancelConfirm && (
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="w-full py-2.5 rounded-full border-2 border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <XCircle size={16} />
            取消兑换
          </button>
        )}

        {showCancelConfirm && (
          <div className="eco-card p-5 border-2 border-red-200">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700">确认取消兑换？</p>
                <p className="text-xs text-red-600 mt-1">
                  取消后将退回 {order.pointsCost} 积分至您的账户，商品库存将恢复。此操作不可撤销。
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                再想想
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                确认取消
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Clock, Package, Leaf, PartyPopper, User, Phone, Star } from "lucide-react";
import { useStore } from "@/store/useStore";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/data/mockData";
import type { RecycleOrder } from "@/data/mockData";

const STEPS = [
  { key: "pending", label: "提交订单" },
  { key: "matched", label: "匹配回收员" },
  { key: "accepted", label: "回收员接单" },
  { key: "departed", label: "回收员出发" },
  { key: "arrived", label: "回收员到达" },
  { key: "weighing", label: "称重确认" },
  { key: "completed", label: "完成发放" },
];

const STATUS_ORDER: Record<RecycleOrder["status"], number> = {
  pending: 0,
  matched: 1,
  accepted: 2,
  departed: 3,
  arrived: 4,
  weighing: 5,
  completed: 6,
  cancelled: -1,
};

const STATUS_LABEL: Record<RecycleOrder["status"], string> = {
  pending: "待匹配",
  matched: "已匹配回收员",
  accepted: "回收员已接单",
  departed: "回收员已出发",
  arrived: "回收员已到达",
  weighing: "正在称重",
  completed: "已完成",
  cancelled: "已取消",
};

export default function RecycleOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recycleOrders = useStore((s) => s.recycleOrders);
  const currentCollector = useStore((s) => s.currentCollector);
  const order = recycleOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-forest-400">
        <Package size={48} className="opacity-30 mb-3" />
        <p className="text-sm">订单不存在</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-forest-600 text-sm underline"
        >
          返回
        </button>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const isCompleted = order.status === "completed";
  const currentStep = STATUS_ORDER[order.status];

  return (
    <div className="pb-8 animate-slide-up">
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-forest-50 flex items-center justify-center text-forest-700 hover:bg-forest-100 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-forest-800 font-display">订单详情</h1>
      </div>

      {isCompleted && (
        <section className="mx-5 mb-5 bg-gradient-to-r from-forest-600 to-forest-500 rounded-2xl p-5 text-white text-center">
          <PartyPopper size={36} className="mx-auto mb-2 animate-float" />
          <p className="text-lg font-bold">回收完成！</p>
          <p className="text-forest-100 text-sm mt-1">
            实际重量 {order.actualWeight}kg · 获得{" "}
            <span className="font-bold text-white">{order.pointsEarned}</span> 积分
          </p>
        </section>
      )}

      {isCancelled && (
        <section className="mx-5 mb-5 bg-gray-100 rounded-2xl p-5 text-center">
          <p className="text-lg font-bold text-gray-600">订单已取消</p>
        </section>
      )}

      <section className="px-5 mb-5">
        <div className="eco-card p-5">
          <h3 className="font-bold text-forest-800 mb-4 font-display">订单追踪</h3>
          <div className="relative">
            {STEPS.map((step, idx) => {
              const stepOrder = idx;
              const isActive = !isCancelled && currentStep === stepOrder;
              const isDone = !isCancelled && currentStep > stepOrder;
              const isPending = !isCancelled && currentStep < stepOrder;

              return (
                <div key={step.key} className="flex items-start gap-3 pb-6 last:pb-0 relative">
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`absolute left-[11px] top-6 w-0.5 h-full ${
                        isDone ? "bg-forest-500" : "bg-forest-200"
                      }`}
                    />
                  )}
                  <div
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold z-10 ${
                      isDone
                        ? "bg-forest-600 text-white"
                        : isActive
                        ? "bg-forest-500 text-white ring-4 ring-forest-100"
                        : isPending
                        ? "bg-forest-100 text-forest-400"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isDone ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`text-sm pt-0.5 ${
                      isDone
                        ? "text-forest-700 font-medium"
                        : isActive
                        ? "text-forest-800 font-bold"
                        : isPending
                        ? "text-forest-400"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {order.collectorId && (
        <section className="px-5 mb-5">
          <div className="eco-card p-5">
            <h3 className="font-bold text-forest-800 mb-3 font-display">回收员信息</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-forest-100 flex items-center justify-center">
                <User size={24} className="text-forest-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium text-forest-800">
                  {currentCollector.id === order.collectorId ? currentCollector.name : "李师傅"}
                </p>
                <p className="text-xs text-forest-500 flex items-center gap-1">
                  <Phone size={12} />
                  {currentCollector.id === order.collectorId ? currentCollector.phone : "139****1234"}
                </p>
                <p className="text-xs text-forest-500 flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  {currentCollector.id === order.collectorId ? currentCollector.rating : 4.8} 评分
                </p>
              </div>
              <div className="text-right">
                <span className={`eco-badge ${
                  currentCollector.id === order.collectorId && currentCollector.status === "online"
                    ? "bg-green-100 text-green-700"
                    : currentCollector.id === order.collectorId && currentCollector.status === "busy"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-forest-100 text-forest-700"
                }`}>
                  {STATUS_LABEL[order.status]}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-5">
        <div className="eco-card p-5 space-y-4">
          <h3 className="font-bold text-forest-800 font-display">订单信息</h3>

          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-forest-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-forest-400">回收地址</p>
              <p className="text-sm text-forest-800">
                {order.address.label && (
                  <span className="font-semibold">{order.address.label} · </span>
                )}
                {order.address.detail}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock size={16} className="text-forest-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-forest-400">预约时间</p>
              <p className="text-sm text-forest-800">{order.scheduledTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Package size={16} className="text-forest-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-forest-400">回收品类</p>
              <div className="flex items-center gap-1.5 mt-1">
                {order.categories.map((cat) => (
                  <span key={cat} className="flex items-center gap-1 eco-badge bg-forest-50 text-forest-700">
                    <span>{CATEGORY_ICONS[cat]}</span>
                    {CATEGORY_LABELS[cat]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Leaf size={16} className="text-forest-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-forest-400">重量与积分</p>
              <p className="text-sm text-forest-800">
                预估 {order.estimatedWeight}kg
                {order.actualWeight !== null && (
                  <span className="ml-3">
                    实际 <span className="font-bold text-forest-700">{order.actualWeight}kg</span>
                  </span>
                )}
                {order.pointsEarned !== null && (
                  <span className="ml-3 text-forest-600 font-semibold">
                    +{order.pointsEarned} 积分
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-forest-100 flex items-center justify-between">
            <span className="text-xs text-forest-400">
              订单编号：{order.id}
            </span>
            <span className="text-xs text-forest-400">
              创建时间：{new Date(order.createdAt).toLocaleString("zh-CN")}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

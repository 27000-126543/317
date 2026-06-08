import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router-dom";
import { User, Star, Phone, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const statusOptions = [
  { value: "online" as const, label: "在线", activeClass: "bg-green-500 text-white", dotClass: "bg-green-400" },
  { value: "busy" as const, label: "忙碌", activeClass: "bg-yellow-500 text-white", dotClass: "bg-yellow-400" },
  { value: "offline" as const, label: "离线", activeClass: "bg-red-500 text-white", dotClass: "bg-red-400" },
];

export default function CollectorProfile() {
  const { currentCollector, updateCollectorStatus, setCurrentRole } = useStore();
  const navigate = useNavigate();

  const handleBackToUser = () => {
    setCurrentRole("user");
    navigate("/");
  };

  const currentStatus = statusOptions.find((s) => s.value === currentCollector.status);

  return (
    <div className="p-4 space-y-4">
      <div className="eco-card p-6 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-forest-100">
            <User className="h-12 w-12 text-forest-600" />
          </div>
          <span
            className={cn(
              "absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white",
              currentStatus?.dotClass
            )}
          />
        </div>
        <h2 className="text-xl font-bold text-forest-800">{currentCollector.name}</h2>
        <div className="flex items-center gap-1.5 mt-1 text-forest-500">
          <Phone className="h-4 w-4" />
          <span className="text-sm">{currentCollector.phone}</span>
        </div>
      </div>

      <div className="eco-card p-4">
        <p className="text-sm text-forest-500 mb-3">工作状态</p>
        <div className="flex gap-2">
          {statusOptions.map((s) => (
            <button
              key={s.value}
              onClick={() => updateCollectorStatus(s.value)}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-sm font-medium transition-all",
                currentCollector.status === s.value
                  ? s.activeClass
                  : "bg-forest-50 text-forest-600 hover:bg-forest-100"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="eco-card p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-forest-800">{currentCollector.totalOrders}</span>
          <span className="text-xs text-forest-500 mt-1">总接单</span>
        </div>
        <div className="eco-card p-4 flex flex-col items-center">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="text-2xl font-bold text-forest-800">{currentCollector.rating}</span>
          </div>
          <span className="text-xs text-forest-500 mt-1">评分</span>
        </div>
        <div className="eco-card p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-forest-800">¥{currentCollector.monthlyEarnings}</span>
          <span className="text-xs text-forest-500 mt-1">本月收入</span>
        </div>
      </div>

      <button
        onClick={handleBackToUser}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-700 py-3 text-sm font-medium text-white hover:bg-forest-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        返回用户端
      </button>
    </div>
  );
}

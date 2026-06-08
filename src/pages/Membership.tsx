import { useStore } from "@/store/useStore";
import { MEMBER_LEVELS } from "@/data/mockData";
import { Crown, TrendingUp, Award, Bell, Check, Lock, Star, Recycle, Shield } from "lucide-react";

const LEVEL_ORDER: Array<"normal" | "silver" | "gold" | "diamond"> = ["normal", "silver", "gold", "diamond"];

const BENEFITS: Record<string, string[]> = {
  normal: ["基础预约回收"],
  silver: ["优先预约", "加价回收5%"],
  gold: ["优先预约", "加价回收10%", "免费上门"],
  diamond: ["优先预约", "加价回收15%", "免费上门", "专属客服"],
};

const NotificationCard = () => {
  const user = useStore((s) => s.currentUser);
  const level = MEMBER_LEVELS[user.memberLevel];
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex items-center gap-3 border border-green-100">
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
        <Bell className="w-5 h-5 text-green-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-green-800">恭喜升级！您已成为{level.label}</p>
        <p className="text-xs text-green-600 mt-0.5">享受更多专属权益，继续加油！</p>
      </div>
    </div>
  );
};

export default function Membership() {
  const currentUser = useStore((s) => s.currentUser);
  const currentLevel = MEMBER_LEVELS[currentUser.memberLevel];
  const levelIndex = LEVEL_ORDER.indexOf(currentUser.memberLevel);
  const isMaxLevel = levelIndex === LEVEL_ORDER.length - 1;
  const nextLevel = isMaxLevel ? null : MEMBER_LEVELS[LEVEL_ORDER[levelIndex + 1]];

  const weightProgress = nextLevel
    ? Math.min((currentUser.totalRecycledWeight / nextLevel.minWeight) * 100, 100)
    : 100;
  const activityProgress = nextLevel
    ? Math.min((currentUser.activity / nextLevel.minActivity) * 100, 100)
    : 100;

  const currentBenefits = BENEFITS[currentUser.memberLevel];
  const allBenefits = BENEFITS.diamond;
  const activeBenefitSet = new Set(currentBenefits);

  const stats = [
    { icon: Recycle, label: "总回收量", value: `${currentUser.totalRecycledWeight}kg` },
    { icon: Star, label: "总积分", value: currentUser.points },
    { icon: Shield, label: "环保贡献等级", value: currentLevel.label },
    { icon: TrendingUp, label: "本月活跃度", value: `${currentUser.activity}%` },
  ];

  return (
    <div className="pb-6 space-y-5">
      <div className={`bg-gradient-to-r ${currentLevel.color} rounded-2xl p-5 text-white`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{currentLevel.icon}</span>
          <div>
            <p className="text-lg font-bold">{currentUser.name}</p>
            <p className="text-sm opacity-90">{currentLevel.label}</p>
          </div>
          <Crown className="w-6 h-6 ml-auto opacity-80" />
        </div>
        <div className="flex items-center justify-between bg-white/15 rounded-xl px-4 py-2.5">
          <span className="text-sm">积分余额</span>
          <span className="text-xl font-bold">{currentUser.points}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">升级进度</h3>
        {isMaxLevel ? (
          <div className="text-center py-4 text-green-600 font-medium">
            <Award className="w-8 h-8 mx-auto mb-2" />
            已达最高等级
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                <span>回收重量进度</span>
                <span>{currentUser.totalRecycledWeight}/{nextLevel!.minWeight} kg</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${weightProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">{weightProgress.toFixed(1)}%</p>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                <span>活跃度进度</span>
                <span>{currentUser.activity}/{nextLevel!.minActivity}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${activityProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">{activityProgress.toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <s.icon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-sm font-semibold text-gray-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">会员权益</h3>
        <ul className="space-y-2.5">
          {allBenefits.map((benefit) => {
            const active = activeBenefitSet.has(benefit);
            return (
              <li key={benefit} className={`flex items-center gap-2.5 text-sm ${active ? "text-green-600" : "text-gray-400"}`}>
                {active ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 shrink-0" />
                )}
                <span>{benefit}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">礼遇通知</h3>
        <NotificationCard />
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { CATEGORY_LABELS } from "@/data/mockData";
import { Calendar, MapPin, Users, QrCode, Award, ClipboardList, CheckCircle } from "lucide-react";
import { useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  ...CATEGORY_LABELS,
  mixed: "综合",
};

const VOLUNTEER_TASKS = ["现场引导", "物资搬运", "签到登记", "分类指导", "宣传推广"];

export default function CommunityEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const communityEvents = useStore((s) => s.communityEvents);
  const joinEvent = useStore((s) => s.joinEvent);
  const checkInEvent = useStore((s) => s.checkInEvent);
  const joinedEvents = useStore((s) => s.joinedEvents);
  const checkedInEvents = useStore((s) => s.checkedInEvents);
  const [joinMsg, setJoinMsg] = useState("");
  const [checkInMsg, setCheckInMsg] = useState("");

  const event = communityEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-forest-400">
        <p>活动不存在</p>
        <button
          onClick={() => navigate("/user/community")}
          className="mt-4 text-forest-600 underline"
        >
          返回社区
        </button>
      </div>
    );
  }

  const progressPercent = Math.min(
    (event.currentParticipants / event.maxParticipants) * 100,
    100
  );

  const isFull = event.currentParticipants >= event.maxParticipants;
  const hasJoined = joinedEvents.has(event.id);
  const hasCheckedIn = checkedInEvents.has(event.id);

  const handleJoin = () => {
    if (hasJoined) {
      setJoinMsg("您已报名，请勿重复操作");
      return;
    }
    const ok = joinEvent(event.id);
    if (ok) {
      setJoinMsg("报名成功！");
    } else {
      setJoinMsg(isFull ? "人数已满" : "报名失败");
    }
  };

  const handleCheckIn = () => {
    if (hasCheckedIn) {
      setCheckInMsg("您已签到，请勿重复操作");
      return;
    }
    const ok = checkInEvent(event.id);
    if (ok) {
      setCheckInMsg(`签到成功！获得${event.checkInPoints}积分`);
    } else {
      setCheckInMsg("签到失败");
    }
  };

  const infoItems = [
    {
      icon: <Calendar size={16} className="text-forest-400" />,
      label: "时间",
      value: `${new Date(event.startTime).toLocaleDateString("zh-CN")} - ${new Date(event.endTime).toLocaleDateString("zh-CN")}`,
    },
    {
      icon: <MapPin size={16} className="text-forest-400" />,
      label: "地点",
      value: event.location,
    },
    {
      icon: <Users size={16} className="text-forest-400" />,
      label: "参与人数",
      value: `${event.currentParticipants}/${event.maxParticipants}人`,
    },
    {
      icon: <Award size={16} className="text-forest-400" />,
      label: "签到积分",
      value: `${event.checkInPoints}积分`,
    },
  ];

  return (
    <div className="pb-8 animate-slide-up">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-forest-700 hover:bg-white transition-colors"
        >
          ←
        </button>
      </div>

      <div className="px-5 -mt-4 relative z-10 space-y-5">
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-forest-800 flex-1">
              {event.title}
            </h1>
            <span className="eco-badge bg-forest-100 text-forest-700 shrink-0">
              {TYPE_LABELS[event.type] ?? event.type}
            </span>
          </div>
          <p className="text-sm text-forest-500">
            发起人：{event.organizerName}
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="grid grid-cols-2 gap-4">
            {infoItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center gap-1.5 text-forest-500 text-xs">
                  {item.icon}
                  {item.label}
                </div>
                <p className="text-sm font-medium text-forest-800">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-forest-500 mb-1.5">
              <span>参与进度</span>
              <span>{event.currentParticipants}/{event.maxParticipants}</span>
            </div>
            <div className="h-2 bg-forest-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-card-gradient rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {event.status !== "completed" && (
            <button onClick={handleCheckIn} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-medium text-sm transition-all ${
              hasCheckedIn
                ? "bg-forest-100 text-forest-500 cursor-default"
                : "eco-btn-primary"
            }`}>
              {hasCheckedIn ? <CheckCircle size={18} /> : <QrCode size={18} />}
              {hasCheckedIn ? "已签到" : "扫码签到"}
            </button>
          )}
          {event.status !== "completed" && !isFull && (
            <button
              onClick={handleJoin}
              className={`flex-1 py-3 rounded-full font-medium text-sm transition-all ${
                hasJoined
                  ? "bg-forest-100 text-forest-500 cursor-default border-2 border-forest-200"
                  : "eco-btn-outline"
              }`}
            >
              {hasJoined ? "已报名" : "参加活动"}
            </button>
          )}
          {isFull && event.status !== "completed" && (
            <button disabled className="flex-1 py-3 rounded-full bg-gray-200 text-gray-500 font-medium cursor-not-allowed">
              人数已满
            </button>
          )}
          {event.status === "completed" && (
            <button disabled className="flex-1 py-3 rounded-full bg-gray-200 text-gray-500 font-medium cursor-not-allowed">
              已结束
            </button>
          )}
        </div>

        {checkInMsg && (
          <p className={`text-center text-sm ${checkInMsg.includes("成功") ? "text-forest-600" : "text-amber-600"}`}>
            {checkInMsg}
          </p>
        )}
        {joinMsg && (
          <p className={`text-center text-sm ${joinMsg.includes("成功") ? "text-forest-600" : "text-amber-600"}`}>
            {joinMsg}
          </p>
        )}

        <div className="glass-card p-5">
          <h3 className="font-bold text-forest-800 mb-2">活动详情</h3>
          <p className="text-sm text-forest-600 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-bold text-forest-800 mb-3 flex items-center gap-2">
            <Users size={16} className="text-forest-600" />
            推荐志愿者 {event.volunteers.length} 人
          </h3>
          <div className="space-y-2.5">
            {event.volunteers.map((v, i) => (
              <div key={v} className="flex items-center gap-3 p-2 rounded-xl bg-forest-50/60">
                <div className="w-9 h-9 rounded-full bg-forest-200 flex items-center justify-center text-forest-700 text-xs font-bold">
                  {v.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-forest-800 truncate">{v}</p>
                  <p className="text-xs text-forest-500 flex items-center gap-1">
                    <ClipboardList size={10} />
                    {VOLUNTEER_TASKS[i % VOLUNTEER_TASKS.length]}
                  </p>
                </div>
                <span className="eco-badge bg-forest-100 text-forest-600 text-[10px]">志愿者</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

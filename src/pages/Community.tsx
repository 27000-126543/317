import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { CATEGORY_LABELS } from "@/data/mockData";
import { MapPin, Calendar, Users, Plus, Filter, CheckCircle } from "lucide-react";
import type { RecycleCategory } from "@/data/mockData";

const TABS = [
  { key: "all", label: "全部" },
  { key: "upcoming", label: "即将开始" },
  { key: "ongoing", label: "进行中" },
  { key: "completed", label: "已结束" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const TYPE_LABELS: Record<string, string> = {
  ...CATEGORY_LABELS,
  mixed: "综合",
};

export default function Community() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const communityEvents = useStore((s) => s.communityEvents);
  const joinEvent = useStore((s) => s.joinEvent);
  const joinedEvents = useStore((s) => s.joinedEvents);

  const filteredEvents =
    activeTab === "all"
      ? communityEvents
      : communityEvents.filter((e) => e.status === activeTab);

  return (
    <div className="pb-8 space-y-5 animate-slide-up">
      <div className="px-5 flex items-center justify-between">
        <h1 className="section-title">社区活动</h1>
        <Link to="/community/create" className="eco-btn-primary flex items-center gap-1.5 !px-4 !py-2 text-sm">
          <Plus size={16} />
          发起活动
        </Link>
      </div>

      <div className="px-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <Filter size={16} className="text-forest-500 flex-shrink-0" />
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`eco-tab ${activeTab === tab.key ? "eco-tab-active" : "eco-tab-inactive"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-4">
        {filteredEvents.map((event) => {
          const hasJoined = joinedEvents.has(event.id);
          const isFull = event.currentParticipants >= event.maxParticipants;

          return (
            <Link
              key={event.id}
              to={`/community/event/${event.id}`}
              className="eco-card block overflow-hidden"
            >
              <img
                src={event.image}
                alt={event.title}
                className="h-40 w-full object-cover rounded-t-2xl"
              />
              <div className="p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-forest-800 truncate flex-1">
                    {event.title}
                  </h3>
                  <span className="eco-badge bg-forest-100 text-forest-700 shrink-0">
                    {TYPE_LABELS[event.type] ?? event.type}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-forest-600">
                  <p className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-forest-400" />
                    {event.location}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-forest-400" />
                    {new Date(event.startTime).toLocaleDateString("zh-CN")}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users size={14} className="text-forest-400" />
                    {event.currentParticipants}/{event.maxParticipants}人参与
                  </p>
                </div>

                {event.status === "completed" ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-full bg-gray-200 text-gray-500 text-sm font-medium cursor-not-allowed"
                    onClick={(e) => e.preventDefault()}
                  >
                    已结束
                  </button>
                ) : hasJoined ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-full bg-forest-100 text-forest-600 text-sm font-medium cursor-default flex items-center justify-center gap-1.5"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CheckCircle size={14} />
                    已报名
                  </button>
                ) : isFull ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-full bg-gray-200 text-gray-500 text-sm font-medium cursor-not-allowed"
                    onClick={(e) => e.preventDefault()}
                  >
                    人数已满
                  </button>
                ) : (
                  <button
                    className="w-full py-2 rounded-full bg-forest-600 text-white text-sm font-medium hover:bg-forest-700 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      joinEvent(event.id);
                    }}
                  >
                    参加活动
                  </button>
                )}
              </div>
            </Link>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-forest-400">
            暂无相关活动
          </div>
        )}
      </div>
    </div>
  );
}

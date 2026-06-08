import { Link } from "react-router-dom";
import { Recycle, MapPin, Star, ChevronRight, Clock, Users, Calendar } from "lucide-react";
import { useStore } from "@/store/useStore";
import { mockCommunityEvents, mockNews, CATEGORY_ICONS, CATEGORY_LABELS, MEMBER_LEVELS } from "@/data/mockData";
import type { RecycleCategory } from "@/data/mockData";

const categories: RecycleCategory[] = ["paper", "plastic", "metal", "electronics", "clothes"];

export default function Home() {
  const currentUser = useStore((s) => s.currentUser);
  const level = MEMBER_LEVELS[currentUser.memberLevel];

  return (
    <div className="pb-8 space-y-6 animate-slide-up">
      <section className="bg-hero-gradient rounded-b-3xl px-5 pt-12 pb-8 text-white">
        <p className="text-forest-200 text-sm">绿循 · 让回收更简单</p>
        <h1 className="text-2xl font-bold mt-1 font-display">你好，{currentUser.name}</h1>
        <p className="text-forest-100 mt-2 text-sm">让回收更简单，让地球更绿色</p>
        <Link
          to="/recycle/book"
          className="inline-flex items-center gap-2 mt-5 bg-white text-forest-700 font-semibold px-6 py-2.5 rounded-full shadow-eco hover:shadow-eco-lg transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Recycle size={18} />
          立即预约回收
        </Link>
      </section>

      <section className="px-5">
        <div className="flex justify-between">
          {categories.map((cat) => (
            <div key={cat} className="flex flex-col items-center gap-1.5 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-forest-50 flex items-center justify-center text-xl group-hover:bg-forest-100 group-hover:scale-110 transition-all duration-200">
                {CATEGORY_ICONS[cat]}
              </div>
              <span className="text-xs text-forest-700 font-medium">{CATEGORY_LABELS[cat]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-forest-800 font-display">我的积分</h3>
            <span className="eco-badge bg-forest-100 text-forest-700">
              {level.icon} {level.label}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-forest-700">{currentUser.points.toLocaleString()}</p>
              <p className="text-xs text-forest-500 mt-0.5 flex items-center gap-1">
                <Star size={12} /> 当前积分
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-forest-700">{currentUser.totalRecycledWeight}kg</p>
              <p className="text-xs text-forest-500 mt-0.5 flex items-center gap-1">
                <Recycle size={12} /> 本月回收量
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5">
        <div className="bg-card-gradient rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={18} />
            <span className="font-medium">快速上门回收</span>
          </div>
          <div className="space-y-1.5 text-sm text-forest-100">
            <p className="flex items-center gap-2">
              <MapPin size={14} />
              距离最近回收员 1.2km
            </p>
            <p className="flex items-center gap-2">
              <Clock size={14} />
              预计30分钟上门
            </p>
          </div>
          <Link
            to="/recycle/book"
            className="mt-4 w-full flex items-center justify-center gap-2 bg-white text-forest-700 font-semibold py-2.5 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            预约上门
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <section className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">社区活动</h2>
          <Link to="/community" className="text-sm text-forest-500 flex items-center gap-0.5 hover:text-forest-700 transition-colors">
            查看更多 <ChevronRight size={14} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-thin">
          {mockCommunityEvents.map((event) => (
            <div key={event.id} className="eco-card min-w-[240px] flex-shrink-0 overflow-hidden">
              <img src={event.image} alt={event.title} className="h-32 w-full object-cover" />
              <div className="p-3 space-y-1.5">
                <h4 className="font-medium text-sm text-forest-800 truncate">{event.title}</h4>
                <p className="text-xs text-forest-500 flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(event.startTime).toLocaleDateString("zh-CN")}
                </p>
                <p className="text-xs text-forest-500 flex items-center gap-1">
                  <Users size={12} />
                  {event.currentParticipants}/{event.maxParticipants}人
                </p>
                <button className="w-full text-xs py-1.5 rounded-full bg-forest-50 text-forest-700 font-medium hover:bg-forest-100 transition-colors">
                  参加活动
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">环保资讯</h2>
        </div>
        <div className="space-y-3">
          {mockNews.map((news) => (
            <div key={news.id} className="eco-card flex overflow-hidden">
              <img src={news.image} alt={news.title} className="w-20 h-20 object-cover flex-shrink-0" />
              <div className="p-3 flex flex-col justify-center min-w-0">
                <h4 className="text-sm font-medium text-forest-800 line-clamp-2 leading-snug">{news.title}</h4>
                <span className="eco-badge bg-forest-50 text-forest-600 mt-1.5 self-start text-[10px]">{news.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

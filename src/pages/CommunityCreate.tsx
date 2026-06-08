import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_LABELS } from "@/data/mockData";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import type { RecycleCategory } from "@/data/mockData";
import { useStore } from "@/store/useStore";

const TYPE_OPTIONS: { value: RecycleCategory | "mixed"; label: string }[] = [
  { value: "paper", label: CATEGORY_LABELS.paper },
  { value: "plastic", label: CATEGORY_LABELS.plastic },
  { value: "metal", label: CATEGORY_LABELS.metal },
  { value: "electronics", label: CATEGORY_LABELS.electronics },
  { value: "clothes", label: CATEGORY_LABELS.clothes },
  { value: "mixed", label: "综合" },
];

export default function CommunityCreate() {
  const navigate = useNavigate();
  const { currentUser, addCommunityEvent } = useStore();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<RecycleCategory | "mixed">("paper");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [checkInPoints, setCheckInPoints] = useState(50);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCommunityEvent({
      title,
      type,
      location,
      lat: 39.91 + (Math.random() - 0.5) * 0.05,
      lng: 116.4 + (Math.random() - 0.5) * 0.05,
      startTime,
      endTime,
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      maxParticipants,
      checkInPoints,
      description,
      status: "upcoming",
    });
    navigate("/user/community");
  };

  return (
    <div className="pb-8 animate-slide-up">
      <div className="px-5 flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 hover:bg-forest-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="section-title">发起活动</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-forest-700 mb-1.5">
            活动名称
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入活动名称"
            className="eco-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-700 mb-1.5">
            活动类型
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as RecycleCategory | "mixed")}
            className="eco-input"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-700 mb-1.5 flex items-center gap-1.5">
            <MapPin size={14} />
            活动地点
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="请输入活动地点"
            className="eco-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-700 mb-1.5 flex items-center gap-1.5">
            <Calendar size={14} />
            开始时间
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="eco-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-700 mb-1.5 flex items-center gap-1.5">
            <Calendar size={14} />
            结束时间
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="eco-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-700 mb-1.5 flex items-center gap-1.5">
            <Users size={14} />
            最大参与人数
          </label>
          <input
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(Number(e.target.value))}
            min={1}
            className="eco-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-700 mb-1.5">
            签到积分
          </label>
          <input
            type="number"
            value={checkInPoints}
            onChange={(e) => setCheckInPoints(Number(e.target.value))}
            min={0}
            className="eco-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-700 mb-1.5">
            活动描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="请输入活动描述"
            rows={4}
            className="eco-input resize-none"
            required
          />
        </div>

        <button type="submit" className="eco-btn-primary w-full mt-2">
          发布活动
        </button>
      </form>
    </div>
  );
}

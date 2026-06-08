import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, Calendar, Clock, ChevronRight, Leaf } from "lucide-react";
import { useStore } from "@/store/useStore";
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_POINTS_PER_KG } from "@/data/mockData";
import type { RecycleCategory } from "@/data/mockData";

const ALL_CATEGORIES: RecycleCategory[] = ["paper", "plastic", "metal", "electronics", "clothes"];

const TIME_SLOTS = ["8:00-10:00", "10:00-12:00", "14:00-16:00", "16:00-18:00"];

export default function RecycleBook() {
  const navigate = useNavigate();
  const { currentUser, addRecycleOrder } = useStore();
  const [selectedCategories, setSelectedCategories] = useState<Set<RecycleCategory>>(new Set());
  const [weights, setWeights] = useState<Record<RecycleCategory, number>>({
    paper: 5,
    plastic: 5,
    metal: 5,
    electronics: 3,
    clothes: 5,
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    currentUser.addresses.find((a) => a.isDefault)?.id ?? currentUser.addresses[0]?.id ?? ""
  );
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const toggleCategory = (cat: RecycleCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const estimatedPoints = Array.from(selectedCategories).reduce(
    (sum, cat) => sum + weights[cat] * CATEGORY_POINTS_PER_KG[cat],
    0
  );

  const totalWeight = Array.from(selectedCategories).reduce(
    (sum, cat) => sum + weights[cat],
    0
  );

  const handleSubmit = () => {
    const address = currentUser.addresses.find((a) => a.id === selectedAddressId);
    if (!address || selectedCategories.size === 0 || !scheduledDate || !selectedTime) return;

    addRecycleOrder({
      userId: currentUser.id,
      categories: Array.from(selectedCategories),
      estimatedWeight: totalWeight,
      address,
      scheduledTime: `${scheduledDate} ${selectedTime}`,
    });
    navigate("/recycle/orders");
  };

  const isValid = selectedCategories.size > 0 && selectedAddressId && scheduledDate && selectedTime;

  return (
    <div className="pb-24 space-y-5 animate-slide-up">
      <section className="px-5">
        <h2 className="section-title flex items-center gap-2">
          <Package size={20} />
          选择回收品类
        </h2>
        <div className="grid grid-cols-5 gap-3 mt-3">
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategories.has(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-forest-500 bg-forest-50 shadow-eco"
                    : "border-forest-100 bg-white hover:border-forest-200"
                }`}
              >
                <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                <span className={`text-xs font-medium ${isSelected ? "text-forest-700" : "text-forest-500"}`}>
                  {CATEGORY_LABELS[cat]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {selectedCategories.size > 0 && (
        <section className="px-5">
          <h2 className="section-title flex items-center gap-2">
            <Leaf size={20} />
            预估重量
          </h2>
          <div className="space-y-3 mt-3">
            {Array.from(selectedCategories).map((cat) => (
              <div key={cat} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-forest-100">
                <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                <span className="text-sm font-medium text-forest-700 min-w-[60px]">{CATEGORY_LABELS[cat]}</span>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={weights[cat]}
                    onChange={(e) =>
                      setWeights((prev) => ({ ...prev, [cat]: Math.max(1, Number(e.target.value)) }))
                    }
                    className="eco-input w-20 text-center text-sm"
                  />
                  <span className="text-sm text-forest-500">kg</span>
                </div>
                <span className="text-xs text-forest-400">
                  {CATEGORY_POINTS_PER_KG[cat]}积分/kg
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-5">
        <h2 className="section-title flex items-center gap-2">
          <MapPin size={20} />
          回收地址
        </h2>
        <div className="space-y-2.5 mt-3">
          {currentUser.addresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id;
            return (
              <button
                key={addr.id}
                onClick={() => setSelectedAddressId(addr.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-forest-500 bg-forest-50"
                    : "border-forest-100 bg-white hover:border-forest-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-forest-600" : "border-forest-300"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-forest-600" />}
                  </div>
                  <span className="text-sm font-semibold text-forest-800">
                    {addr.label || "地址"}
                    {addr.isDefault && (
                      <span className="ml-2 eco-badge bg-forest-100 text-forest-600 text-[10px]">默认</span>
                    )}
                  </span>
                </div>
                <p className="text-xs text-forest-500 mt-1.5 ml-6">{addr.detail}</p>
              </button>
            );
          })}
          <button className="w-full py-3 rounded-xl border-2 border-dashed border-forest-200 text-forest-500 text-sm flex items-center justify-center gap-1 hover:border-forest-400 hover:text-forest-700 transition-colors">
            + 新增地址
          </button>
        </div>
      </section>

      <section className="px-5">
        <h2 className="section-title flex items-center gap-2">
          <Calendar size={20} />
          预约日期
        </h2>
        <input
          type="date"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          className="eco-input w-full mt-3"
        />
      </section>

      <section className="px-5">
        <h2 className="section-title flex items-center gap-2">
          <Clock size={20} />
          预约时段
        </h2>
        <div className="flex gap-3 mt-3">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedTime === slot;
            return (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-forest-700 text-white shadow-eco"
                    : "bg-forest-50 text-forest-600 hover:bg-forest-100"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-forest-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-forest-500">
              预估 <span className="font-semibold text-forest-700">{totalWeight}kg</span> · 可获
            </p>
            <p className="text-xl font-bold text-forest-700 flex items-center gap-1">
              <Leaf size={18} />
              {estimatedPoints} 积分
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 ${
              isValid
                ? "bg-forest-700 shadow-eco hover:bg-forest-800 hover:shadow-eco-lg active:scale-95"
                : "bg-forest-300 cursor-not-allowed"
            }`}
          >
            提交预约
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

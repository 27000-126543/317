import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, Filter } from "lucide-react";
import { useStore } from "@/store/useStore";

const categories = ["全部", "生活用品", "数码产品", "厨房用品", "园艺", "文具"];

export default function Mall() {
  const { currentUser, products } = useStore();
  const [activeCategory, setActiveCategory] = useState("全部");

  const filtered =
    activeCategory === "全部"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="animate-slide-up pb-6">
      <div className="bg-card-gradient px-5 py-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={20} />
            <span className="font-medium">我的积分</span>
          </div>
          <span className="text-2xl font-bold">
            {currentUser.points.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-forest-600" />
          <span className="text-sm font-medium text-forest-700">分类筛选</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`eco-tab flex-shrink-0 ${
                activeCategory === cat ? "eco-tab-active" : "eco-tab-inactive"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product) => (
            <Link
              key={product.id}
              to={`/mall/product/${product.id}`}
              className="eco-card overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square rounded-t-2xl object-cover"
              />
              <div className="p-3 space-y-1.5">
                <p className="text-sm font-medium truncate text-forest-800">
                  {product.name}
                </p>
                <p className="text-accent font-bold">
                  {product.pointsPrice}
                  <span className="text-xs font-normal ml-0.5">积分</span>
                </p>
                {product.stock < 50 && (
                  <p className="text-xs text-red-500">
                    仅剩{product.stock}件
                  </p>
                )}
                <button className="eco-btn-accent rounded-full px-4 py-1.5 text-xs w-full flex items-center justify-center gap-1">
                  <ShoppingBag size={12} />
                  兑换
                </button>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-forest-400">
            <ShoppingBag size={40} className="mx-auto mb-2 opacity-40" />
            <p>该分类暂无商品</p>
          </div>
        )}
      </div>
    </div>
  );
}

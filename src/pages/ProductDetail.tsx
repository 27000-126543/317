import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, AlertCircle } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, currentUser, userRewardMap, exchangeProduct } = useStore();
  const [error, setError] = useState("");

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-full text-forest-400">
        <p>商品不存在</p>
      </div>
    );
  }

  const reward = userRewardMap[currentUser.id];
  const totalPoints = currentUser.points + (reward?.points || 0);
  const canAfford = totalPoints >= product.pointsPrice;
  const inStock = product.stock > 0;

  const handleExchange = () => {
    if (!canAfford) {
      setError("积分不足");
      return;
    }
    if (!inStock) {
      setError("库存不足，暂时无法兑换");
      return;
    }
    exchangeProduct(product.id);
    alert("兑换成功！物流单号已生成，请注意查收取货通知");
    navigate("/mall/orders");
  };

  return (
    <div className="animate-slide-up pb-6">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-white/80 backdrop-blur-xl px-4 py-3 border-b border-forest-100">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-forest-50 transition-colors"
        >
          <ArrowLeft size={20} className="text-forest-700" />
        </button>
        <span className="font-bold text-forest-800">商品详情</span>
      </div>

      <div className="px-5 mt-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-square rounded-2xl object-cover"
        />
      </div>

      <div className="px-5 mt-4 space-y-3">
        <h1 className="text-xl font-bold text-forest-900">{product.name}</h1>
        <p className="text-forest-600 text-sm leading-relaxed">
          {product.description}
        </p>
        <p className="text-2xl text-accent font-bold">
          {product.pointsPrice}
          <span className="text-sm font-normal ml-1">积分</span>
        </p>
        <p className="text-sm text-forest-500">
          库存：{product.stock > 0 ? `${product.stock}件` : "暂无库存"}
        </p>
      </div>

      {error && (
        <div className="mx-5 mt-3 flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="px-5 mt-6">
        <button
          onClick={handleExchange}
          disabled={!inStock}
          className="eco-btn-accent w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={18} />
          {inStock ? "立即兑换" : "暂无库存"}
        </button>
        {!canAfford && (
          <p className="text-center text-xs text-red-400 mt-2">
            当前积分 {totalPoints.toLocaleString()}，还需{" "}
            {(product.pointsPrice - totalPoints).toLocaleString()} 积分
          </p>
        )}
      </div>
    </div>
  );
}

export type RecycleCategory = "paper" | "plastic" | "metal" | "electronics" | "clothes";

export interface Address {
  id: string;
  label: string;
  detail: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  points: number;
  memberLevel: "normal" | "silver" | "gold" | "diamond";
  totalRecycledWeight: number;
  activity: number;
  addresses: Address[];
}

export interface RecycleOrder {
  id: string;
  userId: string;
  collectorId: string | null;
  categories: RecycleCategory[];
  estimatedWeight: number;
  actualWeight: number | null;
  address: Address;
  scheduledTime: string;
  status: "pending" | "matched" | "accepted" | "departed" | "arrived" | "weighing" | "completed" | "cancelled";
  pointsEarned: number | null;
  photos: string[];
  collectorRating: number | null;
  createdAt: string;
  completedAt: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  pointsPrice: number;
  stock: number;
  category: string;
}

export interface PickupInfo {
  estimatedTime: string;
  pickupCode: string;
  instruction: string;
}

export interface ExchangeOrder {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImage: string;
  pointsCost: number;
  status: "pending" | "shipped" | "delivered";
  trackingNumber: string | null;
  pickupInfo: PickupInfo | null;
  createdAt: string;
  shippedAt?: string | null;
  deliveredAt?: string | null;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: RecycleCategory | "mixed";
  location: string;
  lat: number;
  lng: number;
  startTime: string;
  endTime: string;
  organizerId: string;
  organizerName: string;
  volunteers: string[];
  maxParticipants: number;
  currentParticipants: number;
  checkInPoints: number;
  status: "upcoming" | "ongoing" | "completed";
  image: string;
}

export interface Collector {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  totalOrders: number;
  monthlyOrders: number;
  monthlyEarnings: number;
  status: "online" | "offline" | "busy";
  location: { lat: number; lng: number };
  todayOrders: number;
  todayEarnings: number;
}

export interface DashboardData {
  totalRecycledWeight: number;
  totalOrders: number;
  activeCollectors: number;
  pointsExchangeRate: number;
  complaintResolutionTime: number;
  totalUsers: number;
  categoryBreakdown: { category: string; weight: number; orders: number }[];
  monthlyTrend: { month: string; weight: number; orders: number; points: number }[];
  collectorPerformance: { id: string; name: string; orders: number; rating: number; earnings: number }[];
  prediction: {
    nextMonthPeak: string;
    suggestedPriceAdjustment: Record<string, number>;
    suggestedStaffCount: number;
  };
}

export const CATEGORY_LABELS: Record<RecycleCategory, string> = {
  paper: "废纸",
  plastic: "塑料",
  metal: "金属",
  electronics: "电子产品",
  clothes: "旧衣物",
};

export const CATEGORY_ICONS: Record<RecycleCategory, string> = {
  paper: "📄",
  plastic: "♻️",
  metal: "🔩",
  electronics: "📱",
  clothes: "👕",
};

export const CATEGORY_POINTS_PER_KG: Record<RecycleCategory, number> = {
  paper: 10,
  plastic: 8,
  metal: 15,
  electronics: 20,
  clothes: 5,
};

export const MEMBER_LEVELS = {
  normal: { label: "普通会员", minWeight: 0, minActivity: 0, color: "from-gray-400 to-gray-500", icon: "🌱" },
  silver: { label: "银卡会员", minWeight: 50, minActivity: 60, color: "from-gray-300 to-gray-400", icon: "🥈" },
  gold: { label: "金卡会员", minWeight: 200, minActivity: 75, color: "from-yellow-400 to-yellow-500", icon: "🥇" },
  diamond: { label: "钻石会员", minWeight: 500, minActivity: 90, color: "from-blue-400 to-purple-500", icon: "💎" },
};

export const mockUser: User = {
  id: "u001",
  name: "张小绿",
  phone: "138****6789",
  avatar: "",
  points: 2580,
  memberLevel: "gold",
  totalRecycledWeight: 186.5,
  activity: 78,
  addresses: [
    { id: "a1", label: "家", detail: "北京市朝阳区建国路88号绿城花园3号楼1单元502", lat: 39.9087, lng: 116.4074, isDefault: true },
    { id: "a2", label: "公司", detail: "北京市海淀区中关村大街1号创新大厦12层", lat: 39.9842, lng: 116.3074, isDefault: false },
  ],
};

export const mockCollector: Collector = {
  id: "c001",
  name: "李师傅",
  phone: "139****1234",
  avatar: "",
  rating: 4.8,
  totalOrders: 1256,
  monthlyOrders: 87,
  monthlyEarnings: 6580,
  status: "online",
  location: { lat: 39.915, lng: 116.404 },
  todayOrders: 5,
  todayEarnings: 380,
};

export const mockRecycleOrders: RecycleOrder[] = [
  {
    id: "RO20260601001",
    userId: "u001",
    collectorId: "c001",
    categories: ["paper", "plastic"],
    estimatedWeight: 15,
    actualWeight: 14.2,
    address: { id: "a1", label: "家", detail: "北京市朝阳区建国路88号绿城花园3号楼1单元502", lat: 39.9087, lng: 116.4074, isDefault: true },
    scheduledTime: "2026-06-01 14:00-16:00",
    status: "completed",
    pointsEarned: 254,
    photos: [],
    collectorRating: 5,
    createdAt: "2026-06-01T10:00:00",
    completedAt: "2026-06-01T15:30:00",
  },
  {
    id: "RO20260605001",
    userId: "u001",
    collectorId: "c001",
    categories: ["electronics"],
    estimatedWeight: 5,
    actualWeight: null,
    address: { id: "a1", label: "家", detail: "北京市朝阳区建国路88号绿城花园3号楼1单元502", lat: 39.9087, lng: 116.4074, isDefault: true },
    scheduledTime: "2026-06-08 10:00-12:00",
    status: "matched",
    pointsEarned: null,
    photos: [],
    collectorRating: null,
    createdAt: "2026-06-07T20:00:00",
    completedAt: null,
  },
  {
    id: "RO20260608001",
    userId: "u002",
    collectorId: null,
    categories: ["clothes", "paper"],
    estimatedWeight: 20,
    actualWeight: null,
    address: { id: "a3", label: "", detail: "北京市西城区金融街10号国际公寓A座801", lat: 39.912, lng: 116.356, isDefault: true },
    scheduledTime: "2026-06-08 14:00-16:00",
    status: "pending",
    pointsEarned: null,
    photos: [],
    collectorRating: null,
    createdAt: "2026-06-08T08:00:00",
    completedAt: null,
  },
  {
    id: "RO20260608002",
    userId: "u003",
    collectorId: null,
    categories: ["metal"],
    estimatedWeight: 30,
    actualWeight: null,
    address: { id: "a4", label: "", detail: "北京市东城区东直门内大街28号", lat: 39.942, lng: 116.422, isDefault: true },
    scheduledTime: "2026-06-08 16:00-18:00",
    status: "pending",
    pointsEarned: null,
    photos: [],
    collectorRating: null,
    createdAt: "2026-06-08T09:00:00",
    completedAt: null,
  },
];

export const mockProducts: Product[] = [
  { id: "p001", name: "可降解垃圾袋（30只装）", description: "玉米淀粉材质，完全可降解，环保首选", image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=biodegradable garbage bags eco-friendly product on white background&image_size=square", pointsPrice: 200, stock: 500, category: "生活用品" },
  { id: "p002", name: "不锈钢保温杯 500ml", description: "316不锈钢内胆，12小时保温，绿色生活从一杯开始", image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stainless steel thermos cup eco bottle on nature background&image_size=square", pointsPrice: 800, stock: 200, category: "生活用品" },
  { id: "p003", name: "竹纤维毛巾套装", description: "天然竹纤维，抗菌防螨，亲肤柔软", image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bamboo fiber towel set eco product green&image_size=square", pointsPrice: 500, stock: 300, category: "生活用品" },
  { id: "p004", name: "太阳能充电宝 10000mAh", description: "太阳能+USB双充，户外应急好帮手", image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=solar powered portable charger powerbank green energy&image_size=square", pointsPrice: 1500, stock: 100, category: "数码产品" },
  { id: "p005", name: "有机棉帆布袋", description: "可重复使用，减少塑料袋消耗", image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=organic cotton canvas tote bag eco shopping bag&image_size=square", pointsPrice: 300, stock: 400, category: "生活用品" },
  { id: "p006", name: "植物种子礼盒", description: "含向日葵、薄荷、罗勒种子，种出绿色生活", image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=plant seed gift box herb seeds eco friendly&image_size=square", pointsPrice: 150, stock: 600, category: "园艺" },
  { id: "p007", name: "蜂蜡保鲜布（3件套）", description: "替代保鲜膜，可重复使用1年以上", image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beeswax wrap food cover eco alternative&image_size=square", pointsPrice: 450, stock: 250, category: "厨房用品" },
  { id: "p008", name: "环保笔记本（再生纸）", description: "100%再生纸制作，大豆油墨印刷", image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=recycled paper notebook eco stationery green&image_size=square", pointsPrice: 100, stock: 800, category: "文具" },
];

export const mockExchangeOrders: ExchangeOrder[] = [
  { id: "EO20260520001", userId: "u001", productId: "p001", productName: "可降解垃圾袋（30只装）", productImage: "", pointsCost: 200, status: "delivered", trackingNumber: "SF1234567890", pickupInfo: { estimatedTime: "2026-05-22 10:00-18:00", pickupCode: "PKG82001", instruction: "请凭取货码到小区菜鸟驿站自提" }, createdAt: "2026-05-20T10:00:00" },
  { id: "EO20260525001", userId: "u001", productId: "p005", productName: "有机棉帆布袋", productImage: "", pointsCost: 300, status: "shipped", trackingNumber: "YT0987654321", pickupInfo: { estimatedTime: "2026-05-28 09:00-20:00", pickupCode: "PKG82501", instruction: "请凭取货码到丰巢快递柜扫码取件" }, createdAt: "2026-05-25T14:00:00" },
];

export const mockCommunityEvents: CommunityEvent[] = [
  {
    id: "e001",
    title: "朝阳区旧衣回收日",
    description: "每月第二个周六，带上您的旧衣物来参加回收活动！积分翻倍，还有精美礼品。",
    type: "clothes",
    location: "北京市朝阳区望京SOHO广场",
    lat: 39.994,
    lng: 116.474,
    startTime: "2026-06-14T09:00:00",
    endTime: "2026-06-14T17:00:00",
    organizerId: "u010",
    organizerName: "绿循朝阳社区",
    volunteers: ["v001", "v002", "v003"],
    maxParticipants: 100,
    currentParticipants: 67,
    checkInPoints: 50,
    status: "upcoming",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=community clothing recycling event people gathering eco&image_size=landscape_16_9",
  },
  {
    id: "e002",
    title: "电子废弃物集中回收周",
    description: "废旧手机、电脑、电池等电子产品集中回收，专业处理，安全环保。",
    type: "electronics",
    location: "北京市海淀区中关村广场",
    lat: 39.984,
    lng: 116.307,
    startTime: "2026-06-10T08:00:00",
    endTime: "2026-06-16T20:00:00",
    organizerId: "u011",
    organizerName: "绿循海淀社区",
    volunteers: ["v004", "v005"],
    maxParticipants: 200,
    currentParticipants: 134,
    checkInPoints: 80,
    status: "ongoing",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electronics recycling event e-waste collection point&image_size=landscape_16_9",
  },
  {
    id: "e003",
    title: "废纸换绿植活动",
    description: "10kg废纸兑换一盆多肉植物，传递绿色，从纸张回收开始。",
    type: "paper",
    location: "北京市西城区金融街购物中心B1",
    lat: 39.912,
    lng: 116.356,
    startTime: "2026-06-20T10:00:00",
    endTime: "2026-06-20T18:00:00",
    organizerId: "u012",
    organizerName: "绿循西城社区",
    volunteers: ["v006"],
    maxParticipants: 50,
    currentParticipants: 23,
    checkInPoints: 30,
    status: "upcoming",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper recycling exchange plants event green&image_size=landscape_16_9",
  },
];

export const mockDashboardData: DashboardData = {
  totalRecycledWeight: 12850.6,
  totalOrders: 3456,
  activeCollectors: 48,
  pointsExchangeRate: 67.3,
  complaintResolutionTime: 4.2,
  totalUsers: 12890,
  categoryBreakdown: [
    { category: "废纸", weight: 4250, orders: 1200 },
    { category: "塑料", weight: 3180, orders: 890 },
    { category: "金属", weight: 2650, orders: 560 },
    { category: "电子产品", weight: 1580, orders: 420 },
    { category: "旧衣物", weight: 1190, orders: 386 },
  ],
  monthlyTrend: [
    { month: "1月", weight: 980, orders: 280, points: 15600 },
    { month: "2月", weight: 820, orders: 235, points: 13200 },
    { month: "3月", weight: 1150, orders: 340, points: 18900 },
    { month: "4月", weight: 1380, orders: 395, points: 22100 },
    { month: "5月", weight: 1520, orders: 430, points: 24500 },
    { month: "6月", weight: 1680, orders: 480, points: 27300 },
  ],
  collectorPerformance: [
    { id: "c001", name: "李师傅", orders: 87, rating: 4.8, earnings: 6580 },
    { id: "c002", name: "王师傅", orders: 76, rating: 4.9, earnings: 6120 },
    { id: "c003", name: "赵师傅", orders: 65, rating: 4.7, earnings: 5340 },
    { id: "c004", name: "孙师傅", orders: 58, rating: 4.6, earnings: 4890 },
    { id: "c005", name: "周师傅", orders: 52, rating: 4.8, earnings: 4560 },
  ],
  prediction: {
    nextMonthPeak: "7月中旬（预计废纸和塑料回收量增长30%）",
    suggestedPriceAdjustment: { paper: 15, plastic: 10, metal: 5 },
    suggestedStaffCount: 62,
  },
};

export const mockNews = [
  { id: "n1", title: "塑料回收新突破：化学回收技术让废塑料变废为宝", tag: "环保科技", image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=plastic recycling technology innovation laboratory&image_size=landscape_16_9" },
  { id: "n2", title: "旧衣物回收指南：这5种衣服最值得回收", tag: "回收贴士", image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=clothes recycling guide sorted clothing&image_size=landscape_16_9" },
  { id: "n3", title: "绿循平台6月会员日：积分翻倍，好礼不停", tag: "平台公告", image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=membership rewards day celebration green theme&image_size=landscape_16_9" },
];

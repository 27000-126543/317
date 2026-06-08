import { create } from "zustand";
import type {
  User,
  RecycleOrder,
  Product,
  ExchangeOrder,
  CommunityEvent,
  Collector,
  DashboardData,
  RecycleCategory,
  PickupInfo,
} from "@/data/mockData";
import {
  mockUser,
  mockCollector,
  mockRecycleOrders,
  mockProducts,
  mockExchangeOrders,
  mockCommunityEvents,
  mockDashboardData,
  CATEGORY_POINTS_PER_KG,
} from "@/data/mockData";

const generateTrackingNumber = () => {
  const carriers = ["SF", "YT", "ZTO", "JD", "DB"];
  const carrier = carriers[Math.floor(Math.random() * carriers.length)];
  const num = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
  return `${carrier}${num}`;
};

const generatePickupCode = () => {
  return `PKG${Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join("")}`;
};

const generatePickupInfo = (): PickupInfo => {
  const days = Math.floor(Math.random() * 3) + 1;
  const d = new Date();
  d.setDate(d.getDate() + days);
  const dateStr = d.toISOString().split("T")[0];
  const locations = ["小区菜鸟驿站自提", "丰巢快递柜扫码取件", "小区快递代收点取件"];
  const loc = locations[Math.floor(Math.random() * locations.length)];
  return {
    estimatedTime: `${dateStr} 09:00-20:00`,
    pickupCode: generatePickupCode(),
    instruction: `请凭取货码到${loc}`,
  };
};

const VOLUNTEER_NAMES = ["王小明", "李丽华", "张建国", "刘美芳", "陈志强", "赵秀英", "周大伟", "吴小兰"];

interface AppState {
  currentUser: User;
  currentCollector: Collector;
  recycleOrders: RecycleOrder[];
  products: Product[];
  exchangeOrders: ExchangeOrder[];
  communityEvents: CommunityEvent[];
  dashboardData: DashboardData;
  currentRole: "user" | "collector" | "admin";
  joinedEvents: Set<string>;
  checkedInEvents: Set<string>;
  userRewardMap: Record<string, { points: number; weight: number }>;

  setCurrentRole: (role: "user" | "collector" | "admin") => void;
  addRecycleOrder: (order: Omit<RecycleOrder, "id" | "createdAt" | "status" | "pointsEarned" | "actualWeight" | "photos" | "collectorRating" | "completedAt" | "collectorId">) => void;
  acceptOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: RecycleOrder["status"]) => void;
  completeOrder: (orderId: string, actualWeight: number, photos: string[]) => void;
  exchangeProduct: (productId: string) => void;
  joinEvent: (eventId: string) => boolean;
  checkInEvent: (eventId: string) => boolean;
  addCommunityEvent: (event: Omit<CommunityEvent, "id" | "currentParticipants" | "volunteers" | "image">) => void;
  addPoints: (points: number) => void;
  updateCollectorStatus: (status: "online" | "offline" | "busy") => void;
  getUserPoints: (userId: string) => number;
  getUserWeight: (userId: string) => number;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: mockUser,
  currentCollector: mockCollector,
  recycleOrders: mockRecycleOrders,
  products: mockProducts,
  exchangeOrders: mockExchangeOrders,
  communityEvents: mockCommunityEvents,
  dashboardData: mockDashboardData,
  currentRole: "user",
  joinedEvents: new Set<string>(),
  checkedInEvents: new Set<string>(),
  userRewardMap: {},

  setCurrentRole: (role) => set({ currentRole: role }),

  getUserPoints: (userId) => {
    const base = userId === get().currentUser.id ? get().currentUser.points : 0;
    const earned = get().userRewardMap[userId]?.points || 0;
    return base + earned;
  },

  getUserWeight: (userId) => {
    const base = userId === get().currentUser.id ? get().currentUser.totalRecycledWeight : 0;
    const earned = get().userRewardMap[userId]?.weight || 0;
    return base + earned;
  },

  addRecycleOrder: (order) => {
    const collector = get().currentCollector;
    const isOnline = collector.status === "online" || collector.status === "busy";
    const newOrder: RecycleOrder = {
      ...order,
      id: `RO${Date.now()}`,
      status: isOnline ? "matched" : "pending",
      pointsEarned: null,
      actualWeight: null,
      photos: [],
      collectorRating: null,
      completedAt: null,
      collectorId: isOnline ? collector.id : null,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ recycleOrders: [newOrder, ...state.recycleOrders] }));
  },

  acceptOrder: (orderId) => {
    set((state) => ({
      recycleOrders: state.recycleOrders.map((o) =>
        o.id === orderId ? { ...o, status: "accepted" as const, collectorId: state.currentCollector.id } : o
      ),
    }));
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      recycleOrders: state.recycleOrders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      ),
    }));
  },

  completeOrder: (orderId, actualWeight, photos) => {
    const order = get().recycleOrders.find((o) => o.id === orderId);
    if (!order) return;
    let totalPoints = 0;
    order.categories.forEach((cat) => {
      totalPoints += actualWeight * CATEGORY_POINTS_PER_KG[cat];
    });
    totalPoints = Math.round(totalPoints / order.categories.length);
    set((state) => {
      const prevReward = state.userRewardMap[order.userId] || { points: 0, weight: 0 };
      return {
        recycleOrders: state.recycleOrders.map((o) =>
          o.id === orderId
            ? { ...o, status: "completed" as const, actualWeight, photos, pointsEarned: totalPoints, completedAt: new Date().toISOString() }
            : o
        ),
        userRewardMap: {
          ...state.userRewardMap,
          [order.userId]: {
            points: prevReward.points + totalPoints,
            weight: prevReward.weight + actualWeight,
          },
        },
      };
    });
  },

  exchangeProduct: (productId) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product) return;
    const user = get().currentUser;
    const availablePoints = user.points + (get().userRewardMap[user.id]?.points || 0);
    if (availablePoints < product.pointsPrice) return;
    if (product.stock <= 0) return;
    const trackingNumber = generateTrackingNumber();
    const pickupInfo = generatePickupInfo();
    const now = new Date().toISOString();
    const newExchange: ExchangeOrder = {
      id: `EO${Date.now()}`,
      userId: user.id,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      pointsCost: product.pointsPrice,
      status: "shipped",
      trackingNumber,
      pickupInfo,
      createdAt: now,
      shippedAt: now,
    };
    set((state) => {
      const reward = state.userRewardMap[user.id];
      if (reward && reward.points >= product.pointsPrice) {
        return {
          exchangeOrders: [newExchange, ...state.exchangeOrders],
          userRewardMap: {
            ...state.userRewardMap,
            [user.id]: { ...reward, points: reward.points - product.pointsPrice },
          },
          products: state.products.map((p) =>
            p.id === productId ? { ...p, stock: Math.max(0, p.stock - 1) } : p
          ),
        };
      }
      const remaining = product.pointsPrice - (reward?.points || 0);
      return {
        exchangeOrders: [newExchange, ...state.exchangeOrders],
        currentUser: {
          ...state.currentUser,
          points: state.currentUser.points - remaining,
        },
        userRewardMap: {
          ...state.userRewardMap,
          [user.id]: { ...reward, points: 0 },
        },
        products: state.products.map((p) =>
          p.id === productId ? { ...p, stock: Math.max(0, p.stock - 1) } : p
        ),
      };
    });
  },

  joinEvent: (eventId) => {
    const state = get();
    if (state.joinedEvents.has(eventId)) return false;
    const event = state.communityEvents.find((e) => e.id === eventId);
    if (!event || event.currentParticipants >= event.maxParticipants) return false;
    set((state) => ({
      communityEvents: state.communityEvents.map((e) =>
        e.id === eventId ? { ...e, currentParticipants: e.currentParticipants + 1 } : e
      ),
      joinedEvents: new Set([...state.joinedEvents, eventId]),
    }));
    return true;
  },

  checkInEvent: (eventId) => {
    const state = get();
    if (!state.joinedEvents.has(eventId)) return false;
    if (state.checkedInEvents.has(eventId)) return false;
    const event = state.communityEvents.find((e) => e.id === eventId);
    if (!event) return false;
    set((state) => ({
      userRewardMap: {
        ...state.userRewardMap,
        [state.currentUser.id]: {
          points: (state.userRewardMap[state.currentUser.id]?.points || 0) + event.checkInPoints,
          weight: state.userRewardMap[state.currentUser.id]?.weight || 0,
        },
      },
      checkedInEvents: new Set([...state.checkedInEvents, eventId]),
    }));
    return true;
  },

  addCommunityEvent: (eventInput) => {
    const volunteerCount = Math.floor(Math.random() * 4) + 2;
    const shuffled = [...VOLUNTEER_NAMES].sort(() => Math.random() - 0.5);
    const volunteers = shuffled.slice(0, volunteerCount);
    const newEvent: CommunityEvent = {
      ...eventInput,
      id: `e${Date.now()}`,
      currentParticipants: 0,
      volunteers,
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=community recycling event eco green volunteers&image_size=landscape_16_9",
    };
    set((state) => ({
      communityEvents: [newEvent, ...state.communityEvents],
    }));
  },

  addPoints: (points) => {
    set((state) => ({
      currentUser: { ...state.currentUser, points: state.currentUser.points + points },
    }));
  },

  updateCollectorStatus: (status) => {
    set((state) => ({
      currentCollector: { ...state.currentCollector, status },
    }));
  },
}));

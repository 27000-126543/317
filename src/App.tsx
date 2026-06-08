import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "@/components/UserLayout";
import AdminLayout from "@/components/AdminLayout";
import CollectorLayout from "@/components/CollectorLayout";
import Home from "@/pages/Home";
import RecycleBook from "@/pages/RecycleBook";
import RecycleOrders from "@/pages/RecycleOrders";
import RecycleOrderDetail from "@/pages/RecycleOrderDetail";
import Mall from "@/pages/Mall";
import ProductDetail from "@/pages/ProductDetail";
import ExchangeOrders from "@/pages/ExchangeOrders";
import Community from "@/pages/Community";
import CommunityCreate from "@/pages/CommunityCreate";
import CommunityEvent from "@/pages/CommunityEvent";
import Membership from "@/pages/Membership";
import CollectorPending from "@/pages/CollectorPending";
import CollectorActive from "@/pages/CollectorActive";
import CollectorPerformance from "@/pages/CollectorPerformance";
import CollectorProfile from "@/pages/CollectorProfile";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminReports from "@/pages/AdminReports";
import AdminPredictions from "@/pages/AdminPredictions";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/user/home" replace />} />

        <Route path="/user" element={<UserLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="recycle" element={<RecycleBook />} />
          <Route path="recycle/book" element={<RecycleBook />} />
          <Route path="recycle/orders" element={<RecycleOrders />} />
          <Route path="recycle/order/:id" element={<RecycleOrderDetail />} />
          <Route path="shop" element={<Mall />} />
          <Route path="mall" element={<Mall />} />
          <Route path="mall/product/:id" element={<ProductDetail />} />
          <Route path="mall/orders" element={<ExchangeOrders />} />
          <Route path="community" element={<Community />} />
          <Route path="community/create" element={<CommunityCreate />} />
          <Route path="community/event/:id" element={<CommunityEvent />} />
          <Route path="profile" element={<Membership />} />
          <Route path="membership" element={<Membership />} />
        </Route>

        <Route path="/collector" element={<CollectorLayout />}>
          <Route path="pending" element={<CollectorPending />} />
          <Route path="active" element={<CollectorActive />} />
          <Route path="performance" element={<CollectorPerformance />} />
          <Route path="profile" element={<CollectorProfile />} />
          <Route index element={<Navigate to="pending" replace />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="predictions" element={<AdminPredictions />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="/recycle/book" element={<RecycleBook />} />
        <Route path="/recycle/orders" element={<RecycleOrders />} />
        <Route path="/recycle/order/:id" element={<RecycleOrderDetail />} />
        <Route path="/mall" element={<Mall />} />
        <Route path="/mall/product/:id" element={<ProductDetail />} />
        <Route path="/mall/orders" element={<ExchangeOrders />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/create" element={<CommunityCreate />} />
        <Route path="/community/event/:id" element={<CommunityEvent />} />
        <Route path="/membership" element={<Membership />} />
      </Routes>
    </Router>
  );
}

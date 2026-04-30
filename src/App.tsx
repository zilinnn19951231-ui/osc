import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import GroupSettings from "@/pages/GroupSettings";
import AdsManagement from "@/pages/AdsManagement";
import FeatureSettings from "@/pages/FeatureSettings";
import AdEditor from "@/pages/AdEditor";
import Blacklist from "@/pages/Blacklist";
import Logs from "@/pages/Logs";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

function ProtectedRoutes() {
  const { user, isLoading } = useAuth();

  // 开发模式：直接通过，无需认证
  if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === "true") {
    return (
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/group" element={<GroupSettings />} />
          <Route path="/ads" element={<AdsManagement />} />
          <Route path="/features" element={<FeatureSettings />} />
          <Route path="/editor" element={<AdEditor />} />
          <Route path="/blacklist" element={<Blacklist />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0f] text-[#e8e8f0]">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#00d4aa] border-t-transparent" />
          <div className="text-sm text-[#555570]">載入中...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/group" element={<GroupSettings />} />
        <Route path="/ads" element={<AdsManagement />} />
        <Route path="/features" element={<FeatureSettings />} />
        <Route path="/editor" element={<AdEditor />} />
        <Route path="/blacklist" element={<Blacklist />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

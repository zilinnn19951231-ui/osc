/**
 * Py API Client
 * 對接 py 項目的 FastAPI 服務
 */
import { HttpClient } from "../../api/lib/http";

// 根據環境配置 API 地址
const PY_API_URL = import.meta.env.VITE_PY_API_URL || "http://localhost:8000";

export const pyApi = new HttpClient(PY_API_URL);

// ==================== 類型定義 ====================

export interface DashboardStats {
  ads_count: number;
  checkin_count: number;
  dice_games: number;
  blacklist_count: number;
  users_count: number;
}

export interface ModuleStatus {
  auto_ads: boolean;
  checkin: boolean;
  dice: boolean;
  blacklist: boolean;
}

export interface BlacklistEntry {
  id: string;
  text: string;
  images: string[];
  reason?: string;
}

export interface AdEntry {
  id: number;
  text: string;
  images: string[];
  buttons: { text: string; type?: string; url?: string; data?: string }[];
}

export interface FeatureStatus {
  name: string;
  enabled: boolean;
  description: string;
  config: Record<string, unknown>;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  source?: string;
}

// ==================== Stats API ====================

export const statsApi = {
  getDashboard: () => pyApi.request<DashboardStats>("/stats/dashboard"),
  getModuleStatus: () => pyApi.request<ModuleStatus>("/stats/module-status"),
  getRecentActivity: (limit = 20) => pyApi.request<{ activities: unknown[] }>(`/stats/recent-activity?limit=${limit}`),
};

// ==================== Blacklist API ====================

export const blacklistApi = {
  getAll: () => pyApi.request<BlacklistEntry[]>("/blacklist/"),
  getCount: () => pyApi.request<{ count: number }>("/blacklist/count"),
  add: (data: { text: string; images: string[]; reason?: string }) =>
    pyApi.request<{ success: boolean }>("/blacklist/", { method: "POST", body: JSON.stringify(data) }),
  delete: (id: string) =>
    pyApi.request<{ success: boolean }>(`/blacklist/${id}`, { method: "DELETE" }),
  reload: () => pyApi.request<{ success: boolean; count: number }>("/blacklist/reload", { method: "POST" }),
};

// ==================== Ads API ====================

export const adsApi = {
  getAll: () => pyApi.request<AdEntry[]>("/ads/"),
  getCount: () => pyApi.request<{ count: number; current_index: number }>("/ads/count"),
  getCurrent: () => pyApi.request<AdEntry>("/ads/current"),
  next: () => pyApi.request<{ success: boolean; current_index: number }>("/ads/next", { method: "POST" }),
  previous: () => pyApi.request<{ success: boolean; current_index: number }>("/ads/previous", { method: "POST" }),
  reload: (groupId?: number) =>
    pyApi.request<{ success: boolean; count: number }>(`/ads/reload${groupId ? `?group_id=${groupId}` : ""}`, { method: "POST" }),
  getById: (id: number) => pyApi.request<AdEntry>(`/ads/${id}`),
  update: (id: number, data: { text?: string; images?: string[]; buttons?: unknown[] }) =>
    pyApi.request<{ success: boolean }>(`/ads/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

// ==================== Features API ====================

export const featuresApi = {
  getAll: () => pyApi.request<FeatureStatus[]>("/features/"),
  get: (name: string) => pyApi.request<FeatureStatus>(`/features/${name}`),
  update: (name: string, data: { enabled?: boolean; config?: Record<string, unknown> }) =>
    pyApi.request<{ success: boolean; feature: FeatureStatus }>(`/features/${name}`, { method: "PUT", body: JSON.stringify(data) }),
  toggle: (name: string) =>
    pyApi.request<{ success: boolean; enabled: boolean }>(`/features/${name}/toggle`, { method: "POST" }),
};

// ==================== Logs API ====================

export const logsApi = {
  getAll: (level?: string, limit = 100) =>
    pyApi.request<LogEntry[]>(`/logs/${level ? `?level=${level}&` : "?"}limit=${limit}`),
  getLevels: () => pyApi.request<{ levels: string[] }>("/logs/levels"),
  getRecentErrors: (limit = 20) => pyApi.request<{ errors: LogEntry[] }>(`/logs/recent-errors?limit=${limit}`),
};
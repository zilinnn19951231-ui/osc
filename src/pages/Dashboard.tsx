import { Link } from "react-router";
import { trpc } from "@/providers/trpc";

const statCards = [
  { icon: "📢", color: "#2ed573", label: "輪播廣告數量", value: "9", trend: "▲ 每小時自動輪播" },
  { icon: "✅", color: "#6c7bff", label: "今日簽到人數", value: "1,247", trend: "▲ +86 較昨日" },
  { icon: "🎲", color: "#ffa502", label: "骰子對戰場次", value: "328", trend: "▲ 活躍中" },
  { icon: "🚫", color: "#ff4757", label: "黑名單用戶", value: "3", trend: "▼ 0 新增今日" },
];

export default function Dashboard() {
  const { data: features } = trpc.feature.list.useQuery();
  const { data: logs } = trpc.log.list.useQuery({ limit: 20 });

  const featureCards = features?.map((f) => ({
    icon: f.icon || "⚙️",
    name: f.name,
    desc: f.description || "",
    status: f.enabled ? "on" : (f.enabled === false ? "off" : "pause"),
    color: f.enabled ? "rgba(46,213,115,0.1)" : "rgba(136,136,160,0.1)",
  })) || [
    { icon: "🔄", name: "自動輪播訊息", desc: "簽到 / 骰子 / 博彩 / 廣告", status: "on", color: "rgba(0,212,170,0.1)" },
    { icon: "🚀", name: "開機自動發送圖文", desc: "啟動時自動推送歡迎訊息", status: "off", color: "rgba(136,136,160,0.1)" },
    { icon: "📅", name: "每日簽到系統", desc: "連續簽到獎勵機制", status: "on", color: "rgba(46,213,115,0.1)" },
    { icon: "🎡", name: "幸運輪盤", desc: "隨機獎勵抽獎功能", status: "on", color: "rgba(255,165,2,0.1)" },
    { icon: "👤", name: "個人詳情查詢", desc: "用戶資料與積分查詢", status: "on", color: "rgba(55,66,250,0.1)" },
    { icon: "🎲", name: "骰子對戰功能", desc: "群組內骰子比大小", status: "on", color: "rgba(255,71,87,0.1)" },
    { icon: "🔍", name: "黑名單查詢", desc: "封鎖用戶管理與查詢", status: "on", color: "rgba(102,126,234,0.1)" },
    { icon: "🗑️", name: "自動刪除指令消息", desc: "清理機器人指令訊息", status: "on", color: "rgba(0,212,170,0.1)" },
    { icon: "⏰", name: "每小時廣告輪播", desc: "定時推送廣告內容", status: "on", color: "rgba(255,165,2,0.1)" },
    { icon: "👋", name: "自動問候排程", desc: "定時群組問候訊息", status: "on", color: "rgba(46,213,115,0.1)" },
    { icon: "📜", name: "日誌優化", desc: "過濾 deleteMessage 紀錄", status: "on", color: "rgba(55,66,250,0.1)" },
    { icon: "🔙", name: "返回主選單按鈕", desc: "所有頁面統一返回入口", status: "on", color: "rgba(0,212,170,0.1)" },
  ];

  const logItems = logs && logs.length > 0 ? logs.map(l => ({
    time: new Date(l.createdAt).toLocaleTimeString("zh-TW", { hour12: false }),
    tag: l.tag,
    tagClass: l.type,
    msg: l.message,
  })) : [
    { time: "00:07:42", tag: "廣告", tagClass: "ads", msg: "輪播廣告 #ads-3 已發送至群組，觸及 2,530 人" },
    { time: "00:06:15", tag: "簽到", tagClass: "success", msg: "用戶 @user_8842 完成今日簽到，連續 7 天" },
    { time: "00:05:33", tag: "骰子", tagClass: "info", msg: "群組骰子對戰：@player_A (🎲6) vs @player_B (🎲3) — A 獲勝" },
    { time: "00:04:18", tag: "警告", tagClass: "warn", msg: "用戶 @spammer_001 觸發黑名單規則，已自動封鎖" },
    { time: "00:03:00", tag: "廣告", tagClass: "ads", msg: "每小時廣告輪播觸發，發送 ads-5 至廣告板" },
    { time: "00:02:45", tag: "系統", tagClass: "success", msg: "自動問候排程執行：「晚安，各位辛苦囉 💤」" },
    { time: "00:01:12", tag: "查詢", tagClass: "info", msg: "用戶 @chen_99 查詢個人詳情，積分：8,420" },
    { time: "00:00:00", tag: "系統", tagClass: "success", msg: "機器人狀態檢查通過，所有模組運行正常" },
  ];

  const getTagClass = (item: typeof logItems[0]) => {
    const tc = item.tagClass || item.tag;
    if (tc === "ads") return "bg-[rgba(0,212,170,0.1)] text-[#00d4aa]";
    if (tc === "success" || tc === "系統" || tc === "簽到") return "bg-[rgba(46,213,115,0.1)] text-[#2ed573]";
    if (tc === "warn" || tc === "警告") return "bg-[rgba(255,165,2,0.1)] text-[#ffa502]";
    if (tc === "error") return "bg-[rgba(255,71,87,0.1)] text-[#ff4757]";
    return "bg-[rgba(55,66,250,0.1)] text-[#6c7bff]";
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border border-[#252535] bg-[#16161f] p-5 transition-all hover:-translate-y-0.5 hover:border-[#2a2a3a]">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] text-lg" style={{ background: s.color + "20", color: s.color }}>
                {s.icon}
              </div>
            </div>
            <div className="text-[28px] font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#555570]">{s.label}</div>
            <div className={`mt-2 flex items-center gap-1 text-[11px] ${s.trend.startsWith("▲") ? "text-[#2ed573]" : "text-[#ff4757]"}`}>
              {s.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#e8e8f0]">
          <span className="h-4 w-1 rounded bg-[#00d4aa]" />
          功能模組狀態
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((f) => (
            <Link
              key={f.name}
              to="/features"
              className="flex items-center gap-3.5 rounded-[10px] border border-[#252535] bg-[#16161f] p-4 transition-all hover:border-[#2a2a3a] hover:bg-[#1c1c28]"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[10px] text-xl" style={{ background: f.color }}>
                {f.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold">{f.name}</div>
                <div className="text-[11px] text-[#555570]">{f.desc}</div>
              </div>
              <div className={`flex flex-shrink-0 items-center gap-1.5 text-xs font-semibold ${
                f.status === "on" ? "text-[#2ed573]" : f.status === "pause" ? "text-[#ffa502]" : "text-[#555570]"
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  f.status === "on" ? "bg-[#2ed573] shadow-[0_0_8px_#2ed573]" : f.status === "pause" ? "bg-[#ffa502]" : "bg-[#555570]"
                }`} />
                {f.status === "on" ? "運行中" : f.status === "pause" ? "暫停" : "已停用"}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#e8e8f0]">
          <span className="h-4 w-1 rounded bg-[#00d4aa]" />
          即時運行日誌
        </h3>
        <div className="overflow-hidden rounded-xl border border-[#252535] bg-[#16161f]">
          <div className="flex items-center justify-between border-b border-[#252535] px-5 py-3">
            <span className="text-[13px] font-semibold">📜 系統日誌 (已過濾 deleteMessage)</span>
            <div className="flex gap-2">
              {["全部", "廣告", "簽到", "骰子", "警告"].map((f) => (
                <button key={f} className="rounded-md border border-[#252535] bg-[#1c1c28] px-3 py-1 text-[11px] text-[#8888a0] transition-all hover:border-[#00d4aa] hover:text-[#00d4aa]">
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[280px] overflow-y-auto">
            {logItems.map((l, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-[#252535] px-5 py-2.5 text-xs transition-colors hover:bg-[#1c1c28]">
                <span className="min-w-[60px] font-mono text-[11px] text-[#555570]">
                  {l.time}
                </span>
                <span className={`min-w-[60px] rounded px-2 py-0.5 text-center text-[10px] font-semibold ${getTagClass(l)}`}>
                  {l.tag}
                </span>
                <span className="flex-1 text-[#8888a0]">{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

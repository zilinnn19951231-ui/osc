import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { section: "主要功能", items: [
    { path: "/", icon: "📊", label: "主畫面概覽" },
    { path: "/group", icon: "📝", label: "群組訊息設定" },
    { path: "/ads", icon: "🖼️", label: "輪播廣告圖文", badge: "9", badgeColor: "green" as const },
    { path: "/features", icon: "⚙️", label: "勾選附設功能" },
  ]},
  { section: "系統設定", items: [
    { path: "/settings", icon: "🔧", label: "機器人總設定" },
    { path: "/editor", icon: "➕", label: "創建廣告版面" },
    { path: "/blacklist", icon: "📋", label: "黑名單管理", badge: "3", badgeColor: "orange" as const },
    { path: "/logs", icon: "📜", label: "日誌與紀錄", badge: "Live", badgeColor: "green" as const },
  ]},
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0f] text-[#e8e8f0]">
      {/* Scanline overlay */}
      <div className="scanline pointer-events-none fixed inset-0 z-[9999]" />

      {/* Sidebar */}
      <aside className={`flex flex-col border-r border-[#252535] bg-[#111118] transition-all duration-300 ${collapsed ? "w-16" : "w-[260px]"}`}>
        <div className="border-b border-[#252535] p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#00d4aa] to-[#00a884] text-lg shadow-[0_0_20px_rgba(0,212,170,0.3)]">
              🤖
            </div>
            {!collapsed && (
              <div>
                <div className="text-[15px] font-bold tracking-wide">機器人控制台</div>
                <div className="text-[11px] text-[#555570]">v3.0 管理後台</div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((section) => (
            <div key={section.section} className="mb-2">
              {!collapsed && (
                <div className="px-5 pb-2 text-[10px] font-medium uppercase tracking-[2px] text-[#555570]">
                  {section.section}
                </div>
              )}
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-[13px] transition-all ${
                    isActive(item.path)
                      ? "bg-[rgba(0,212,170,0.15)] text-[#00d4aa] border-l-[3px] border-[#00d4aa]"
                      : "text-[#8888a0] hover:bg-[#1c1c28] hover:text-[#e8e8f0]"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                >
                  <span className="text-center text-base w-[22px]">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${
                          item.badgeColor === "green" ? "bg-[#2ed573]" : item.badgeColor === "orange" ? "bg-[#ffa502]" : "bg-[#ff4757]"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-[#252535] p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg py-2 text-[#555570] hover:bg-[#1c1c28] hover:text-[#e8e8f0]"
          >
            {collapsed ? "▶" : "◀ 收合選單"}
          </button>
          {user && !collapsed && (
            <div className="mt-2 flex items-center gap-2 px-3">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-xs font-bold">
                {user.name?.[0] || "U"}
              </div>
              <div className="flex-1 truncate text-xs">{user.name || user.email || "管理員"}</div>
              <button onClick={() => logout()} className="text-[10px] text-[#ff4757] hover:underline">登出</button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="border-b border-[#252535] bg-[#111118] px-7">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-xl font-bold">
                台
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[3px] border-[#111118] bg-[#2ed573]" />
              </div>
              <div>
                <h2 className="flex items-center gap-2 text-[15px] font-semibold">
                  没钱没关系，哥做台水养妳3.0
                  <span className="font-mono text-[11px] text-[#555570]">-1003709004584</span>
                </h2>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-[#8888a0]">
                  <span>👥 2,530 位成員</span>
                  <span>•</span>
                  <span>📋 6 個板塊</span>
                  <span>•</span>
                  <span>📝 295156 廣告編號</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[rgba(46,213,115,0.3)] bg-[rgba(46,213,115,0.1)] px-4 py-1.5 text-xs font-semibold text-[#2ed573]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2ed573]" />
              機器人已啟動
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-[#252535] bg-[#111118] px-7 py-3 text-[11px] text-[#555570]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00d4aa]" />
              Bot Manager v3.0.1
            </span>
            <span>|</span>
            <span>群組：-1003709004584</span>
            <span>|</span>
            <span>最後更新：{new Date().toLocaleString("zh-TW")}</span>
          </div>
          <div>所有頁面返回主選單按鈕 ✅ 已啟用</div>
        </footer>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [botName, setBotName] = useState("CHUN_BOT_V3");
  const [token, setToken] = useState("8189358568:AAHRU5yX...");
  const [webhook, setWebhook] = useState("https://example.com/webhook");

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-5 w-1 rounded bg-[#00d4aa]" />
        <h1 className="text-xl font-bold">機器人總設定</h1>
      </div>

      <div className="space-y-4 rounded-xl border border-[#252535] bg-[#16161f] p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#00d4aa]">
          <span className="text-lg">🔐</span> API 認證設定
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#8888a0]">機器人名稱</label>
            <input
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="w-full rounded-lg border border-[#252535] bg-[#111118] px-3 py-2 text-sm text-[#e8e8f0] focus:border-[#00d4aa] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#8888a0]">Bot Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded-lg border border-[#252535] bg-[#111118] px-3 py-2 text-sm text-[#e8e8f0] focus:border-[#00d4aa] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#8888a0]">Webhook URL</label>
            <input
              value={webhook}
              onChange={(e) => setWebhook(e.target.value)}
              className="w-full rounded-lg border border-[#252535] bg-[#111118] px-3 py-2 text-sm text-[#e8e8f0] focus:border-[#00d4aa] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-[#252535] bg-[#16161f] p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#00d4aa]">
          <span className="text-lg">⚙️</span> 系統功能
        </div>
        <div className="space-y-3">
          {[
            { label: "自動輪播訊息", desc: "簽到 / 骰子 / 博彩 / 廣告 自動推送", enabled: true },
            { label: "自動刪除指令消息", desc: "清理機器人指令保持群組整潔", enabled: true },
            { label: "黑名單自動封鎖", desc: "偵測黑名單用戶自動移除", enabled: true },
            { label: "日誌紀錄功能", desc: "記錄所有機器人操作與事件", enabled: true },
            { label: "每小時廣告輪播", desc: "定時向群組推送廣告", enabled: false },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{s.label}</div>
                <div className="text-[11px] text-[#555570]">{s.desc}</div>
              </div>
              <Switch defaultChecked={s.enabled} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 rounded-xl bg-[#00d4aa] py-3 text-sm font-semibold text-[#111118] hover:bg-[#00e6bb]">
          💾 儲存設定
        </button>
        <button className="flex-1 rounded-xl border border-[#252535] bg-[#16161f] py-3 text-sm font-semibold text-[#8888a0] hover:border-[#2a2a3a] hover:text-[#e8e8f0]">
          🔄 重啟機器人
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { trpc } from "@/providers/trpc";

export default function GroupSettings() {
  const { data: boards } = trpc.board.list.useQuery();
  const [activeTab, setActiveTab] = useState("chat");

  const boardTabs = boards?.map((b) => ({
    id: b.boardId,
    name: b.name,
    emoji: b.emoji,
  })) || [
    { id: "chat", name: "聊天版", emoji: "💬" },
    { id: "signin", name: "簽到版", emoji: "✅" },
    { id: "casino", name: "博彩版", emoji: "🎰" },
    { id: "dice", name: "骰子版", emoji: "🎲" },
    { id: "ads", name: "廣告板", emoji: "📢" },
    { id: "blacklist", name: "黑單版", emoji: "🚫" },
  ];

  const currentBoard = boards?.find((b) => b.boardId === activeTab);
  const variants = currentBoard?.variants || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-5 w-1 rounded bg-[#00d4aa]" />
        <h1 className="text-xl font-bold">群組訊息設定</h1>
      </div>

      <p className="text-sm text-[#555570]">
        管理各板塊的訊息內容與互動按鈕。點選板塊查看與編輯訊息，修改後自動同步至 Telegram 群組。
      </p>

      {/* Board tabs */}
      <div className="flex flex-wrap gap-2">
        {boardTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === t.id
                ? "border-[rgba(0,212,170,0.3)] bg-[rgba(0,212,170,0.1)] text-[#00d4aa]"
                : "border-[#252535] bg-[#16161f] text-[#8888a0] hover:border-[#2a2a3a] hover:text-[#e8e8f0]"
            }`}
          >
            <span className="text-lg">{t.emoji}</span>
            {t.name}
            {activeTab === t.id && <span className="h-2 w-2 rounded-full bg-[#00d4aa]" />}
          </button>
        ))}
      </div>

      {/* Variants */}
      <div className="space-y-4">
        {variants.length === 0 && (
          <div className="rounded-xl border border-[#252535] bg-[#16161f] p-8 text-center text-sm text-[#555570]">
            此板塊暫無訊息內容
          </div>
        )}
        {variants.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-xl border border-[#252535] bg-[#16161f]">
            <div className="flex items-center justify-between border-b border-[#252535] px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#252535] text-xs font-mono text-[#00d4aa]">
                  {v.variantId}
                </div>
                <span className="text-xs text-[#555570]">ID: {v.id}</span>
              </div>
              <button className="rounded-lg bg-[#00d4aa] px-3 py-1.5 text-xs font-semibold text-[#111118] transition-all hover:bg-[#00e6bb]">
                ✏️ 編輯
              </button>
            </div>
            <div className="flex gap-5 p-5">
              {v.image && (
                <div className="flex-shrink-0">
                  <img
                    src={v.image}
                    alt={v.variantId}
                    className="h-48 w-48 rounded-lg border border-[#252535] object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="whitespace-pre-wrap text-[13px] leading-relaxed text-[#e8e8f0]">
                  {v.content || <span className="italic text-[#555570]">無文字內容</span>}
                </div>
                {v.buttons && v.buttons.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {v.buttons.map((btn: any, idx: number) => (
                      <button
                        key={idx}
                        className={`rounded-lg px-3 py-1.5 text-xs ${
                          btn.url
                            ? "bg-[rgba(55,66,250,0.1)] text-[#6c7bff] border border-[rgba(55,66,250,0.3)]"
                            : "bg-[#252535] text-[#8888a0]"
                        }`}
                      >
                        {btn.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

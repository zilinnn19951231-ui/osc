import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";

export default function AdsManagement() {
  const { data: adsBoard } = trpc.board.getById.useQuery({ boardId: "ads" });
  const variants = adsBoard?.variants || [];
  const [filter, setFilter] = useState("全部");

  const filters = ["全部", "已發送", "待審核", "草稿"];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-5 w-1 rounded bg-[#00d4aa]" />
          <h1 className="text-xl font-bold">輪播廣告圖文管理</h1>
          <span className="rounded-full bg-[rgba(0,212,170,0.1)] px-2.5 py-0.5 text-xs font-semibold text-[#00d4aa]">
            {variants.length} 則廣告
          </span>
        </div>
        <Link
          to="/editor"
          className="flex items-center gap-2 rounded-lg bg-[#00d4aa] px-4 py-2 text-sm font-semibold text-[#111118] transition-all hover:bg-[#00e6bb]"
        >
          ➕ 新增廣告
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-all ${
              filter === f
                ? "border-[rgba(0,212,170,0.3)] bg-[rgba(0,212,170,0.1)] text-[#00d4aa]"
                : "border-[#252535] bg-[#16161f] text-[#8888a0] hover:border-[#2a2a3a]"
            }`}
          >
            {f}
          </button>
        ))}
        <input
          type="text"
          placeholder="🔍 搜尋廣告編號、標題..."
          className="ml-auto w-[260px] rounded-lg border border-[#252535] bg-[#111118] px-3 py-1.5 text-xs text-[#e8e8f0] placeholder-[#555570] focus:border-[#00d4aa] focus:outline-none"
        />
      </div>

      <div className="space-y-3">
        {variants.map((v, idx) => (
          <div key={v.id} className="group flex items-center gap-4 overflow-hidden rounded-xl border border-[#252535] bg-[#16161f] p-4 transition-all hover:border-[#2a2a3a]">
            <div className="text-center">
              <div className="text-lg font-bold text-[#e8e8f0]">{(idx + 1).toString().padStart(2, "0")}</div>
              <div className="text-[10px] text-[#555570]">#{v.variantId}</div>
            </div>

            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-[#252535]">
              {v.image ? (
                <img
                  src={v.image}
                  alt={v.variantId}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.innerHTML = `<div class="flex h-full w-full items-center justify-center text-2xl">🖼️</div>`;
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl">🖼️</div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm font-semibold">
                {v.variantId}
                <span className="rounded bg-[rgba(0,212,170,0.1)] px-2 py-0.5 text-[10px] text-[#00d4aa]">已發送</span>
              </div>
              <div className="mt-1 line-clamp-1 text-xs text-[#555570]">
                {v.content ? v.content.slice(0, 80) + "..." : "無文字內容"}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(v.buttons || []).map((btn: any, i: number) => (
                  <span key={i} className="rounded bg-[#252535] px-2 py-0.5 text-[10px] text-[#8888a0]">
                    {btn.text}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 text-[11px] text-[#555570]">
              <div>每 4 小時</div>
              <div>👁️ {Math.floor(Math.random() * 2000 + 500)}</div>
            </div>

            <div className="flex flex-col gap-1.5">
              <button className="rounded-md bg-[rgba(0,212,170,0.1)] px-3 py-1 text-[11px] text-[#00d4aa] hover:bg-[rgba(0,212,170,0.2)]">
                ✏️ 編輯
              </button>
              <button className="rounded-md bg-[#252535] px-3 py-1 text-[11px] text-[#ff4757] hover:bg-[rgba(255,71,87,0.1)]">
                🗑️ 刪除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

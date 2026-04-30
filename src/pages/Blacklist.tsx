import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BlacklistPage() {
  const { data: entries } = trpc.blacklist.list.useQuery();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const filtered = entries?.filter((e) =>
    (e.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.tgHandle || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.reason || "").toLowerCase().includes(search.toLowerCase())
  );

  const statusMap: Record<string, { label: string; class: string }> = {
    approved: { label: "已確認", class: "bg-[rgba(255,71,87,0.1)] text-[#ff4757]" },
    pending: { label: "待審核", class: "bg-[rgba(255,165,2,0.1)] text-[#ffa502]" },
    rejected: { label: "已駁回", class: "bg-[rgba(136,136,160,0.1)] text-[#8888a0]" },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-5 w-1 rounded bg-[#ff4757]" />
          <h1 className="text-xl font-bold">黑名單管理</h1>
          <span className="rounded-full bg-[rgba(255,71,87,0.1)] px-2.5 py-0.5 text-xs font-semibold text-[#ff4757]">
            {entries?.length || 0} 筆紀錄
          </span>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[#ff4757] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#ff6b81]">
          ➕ 新增黑名單
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["全部", "已確認", "待審核", "已駁回"].map((f) => (
          <button
            key={f}
            className="rounded-lg border border-[#252535] bg-[#16161f] px-4 py-1.5 text-xs font-medium text-[#8888a0] transition-all hover:border-[#2a2a3a] hover:text-[#e8e8f0]"
          >
            {f}
          </button>
        ))}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 搜尋姓名、TG 帳號、原因..."
          className="ml-auto w-[280px] rounded-lg border border-[#252535] bg-[#111118] px-3 py-1.5 text-xs text-[#e8e8f0] placeholder-[#555570] focus:border-[#00d4aa] focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#252535] bg-[#16161f]">
        <div className="grid grid-cols-[60px_1fr_1fr_1fr_100px_120px] border-b border-[#252535] px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#555570]">
          <div>ID</div>
          <div>姓名 / TG</div>
          <div>原因</div>
          <div>事件詳情</div>
          <div>狀態</div>
          <div>操作</div>
        </div>
        <div className="max-h-[480px] overflow-y-auto">
          {filtered?.map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-[60px_1fr_1fr_1fr_100px_120px] items-center border-b border-[#252535] px-5 py-3 text-xs transition-colors hover:bg-[#1c1c28]"
            >
              <div className="font-mono text-[#555570]">{e.entryId}</div>
              <div>
                <div className="font-medium text-[#e8e8f0]">{e.name || "未知"}</div>
                <div className="text-[#555570]">{e.tgHandle || "—"}</div>
              </div>
              <div className="line-clamp-2 text-[#8888a0]">{e.reason || "—"}</div>
              <div className="line-clamp-2 text-[#555570]">{e.bounty ? `懸賞: ${e.bounty}` : "—"}</div>
              <div>
                <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${statusMap[e.status]?.class || ""}`}>
                  {statusMap[e.status]?.label || e.status}
                </span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSelected(e)}
                  className="rounded-md bg-[#252535] px-2 py-1 text-[10px] text-[#8888a0] hover:text-[#e8e8f0]"
                >
                  詳情
                </button>
                <button className="rounded-md bg-[rgba(255,71,87,0.1)] px-2 py-1 text-[10px] text-[#ff4757]">
                  刪除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg border-[#252535] bg-[#16161f] text-[#e8e8f0]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              🚫 黑名單詳情 <span className="font-mono text-sm text-[#555570]">#{selected?.entryId}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-sm">
            <div className="flex gap-4">
              <div className="w-20 text-[#555570]">姓名</div>
              <div>{selected?.name || "—"}</div>
            </div>
            <div className="flex gap-4">
              <div className="w-20 text-[#555570]">TG 帳號</div>
              <div>{selected?.tgHandle || "—"}</div>
            </div>
            <div className="flex gap-4">
              <div className="w-20 text-[#555570]">性別</div>
              <div>{selected?.gender || "—"}</div>
            </div>
            <div className="flex gap-4">
              <div className="w-20 text-[#555570]">原因</div>
              <div className="whitespace-pre-wrap">{selected?.reason || "—"}</div>
            </div>
            {selected?.images && selected.images.length > 0 && (
              <div>
                <div className="mb-2 text-[#555570]">證據截圖</div>
                <div className="grid grid-cols-3 gap-2">
                  {selected.images.map((img: string, i: number) => (
                    <img
                      key={i}
                      src={img}
                      alt="evidence"
                      className="h-24 rounded-lg border border-[#252535] object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { trpc } from "@/providers/trpc";

export default function LogsPage() {
  const { data: logs } = trpc.log.list.useQuery({ limit: 100 });

  const tagClass = (tag: string) => {
    switch (tag) {
      case "廣告": return "bg-[rgba(0,212,170,0.1)] text-[#00d4aa]";
      case "系統":
      case "簽到": return "bg-[rgba(46,213,115,0.1)] text-[#2ed573]";
      case "警告": return "bg-[rgba(255,165,2,0.1)] text-[#ffa502]";
      case "骰子":
      case "查詢": return "bg-[rgba(55,66,250,0.1)] text-[#6c7bff]";
      default: return "bg-[rgba(136,136,160,0.1)] text-[#8888a0]";
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-5 w-1 rounded bg-[#00d4aa]" />
        <h1 className="text-xl font-bold">日誌與紀錄</h1>
        <span className="rounded-full bg-[rgba(0,212,170,0.1)] px-2.5 py-0.5 text-xs font-semibold text-[#00d4aa]">
          {logs?.length || 0} 筆紀錄
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#252535] bg-[#16161f]">
        <div className="max-h-[600px] overflow-y-auto">
          {logs?.map((l) => (
            <div key={l.id} className="flex items-start gap-3 border-b border-[#252535] px-5 py-3 text-xs transition-colors hover:bg-[#1c1c28]">
              <span className="min-w-[140px] font-mono text-[11px] text-[#555570]">
                {new Date(l.createdAt).toLocaleString("zh-TW")}
              </span>
              <span className={`min-w-[60px] rounded px-2 py-0.5 text-center text-[10px] font-semibold ${tagClass(l.tag)}`}>
                {l.tag}
              </span>
              <span className="flex-1 text-[#8888a0]">{l.message}</span>
              {!!l.metadata && (
                <span className="text-[10px] text-[#555570]">
                  {typeof l.metadata === "object" && l.metadata !== null
                    ? JSON.stringify(l.metadata).slice(0, 60)
                    : String(l.metadata).slice(0, 60)}
                </span>
              )}
            </div>
          )) || (
            <div className="px-5 py-8 text-center text-sm text-[#555570]">
              暫無日誌紀錄
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

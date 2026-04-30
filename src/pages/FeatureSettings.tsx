import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const categories = ["全部", "輪播與自動化", "互動功能", "管理與安全"];

export default function FeatureSettings() {
  const utils = trpc.useUtils();
  const { data: features } = trpc.feature.list.useQuery();
  const toggle = trpc.feature.toggle.useMutation({
    onSuccess: () => utils.feature.list.invalidate(),
  });

  const [activeCategory, setActiveCategory] = useState("全部");

  const filtered = activeCategory === "全部"
    ? features
    : features?.filter((f) => f.category === activeCategory);

  const grouped = filtered?.reduce((acc, f) => {
    const cat = f.category || "其他";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(f);
    return acc;
  }, {} as Record<string, typeof filtered>) || {};

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-5 w-1 rounded bg-[#00d4aa]" />
          <h1 className="text-xl font-bold">附設功能設定</h1>
          <span className="rounded-full bg-[rgba(0,212,170,0.1)] px-2.5 py-0.5 text-xs font-semibold text-[#00d4aa]">
            {features?.length || 12} 項功能
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-all ${
              activeCategory === c
                ? "border-[rgba(0,212,170,0.3)] bg-[rgba(0,212,170,0.1)] text-[#00d4aa]"
                : "border-[#252535] bg-[#16161f] text-[#8888a0] hover:border-[#2a2a3a]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#e8e8f0]">
              <span className="h-3.5 w-1 rounded bg-[#00d4aa]" />
              {cat}
            </h3>
            <div className="space-y-2">
              {items?.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-4 rounded-xl border border-[#252535] bg-[#16161f] px-5 py-4 transition-all hover:border-[#2a2a3a]"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#252535] text-xl">
                    {f.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      {f.name}
                      {f.tag && (
                        <Badge className={`${
                          f.tag === "核心" ? "bg-[rgba(0,212,170,0.1)] text-[#00d4aa] border-[rgba(0,212,170,0.3)]" :
                          f.tag === "NEW" ? "bg-[rgba(55,66,250,0.1)] text-[#6c7bff] border-[rgba(55,66,250,0.3)]" :
                          "bg-[rgba(255,165,2,0.1)] text-[#ffa502] border-[rgba(255,165,2,0.3)]"
                        } text-[10px] border`}>
                          {f.tag}
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-[#555570]">{f.description}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-medium ${f.enabled ? "text-[#2ed573]" : "text-[#555570]"}`}>
                      {f.enabled ? "啟用" : "停用"}
                    </span>
                    <Switch
                      checked={f.enabled}
                      onCheckedChange={(v) => toggle.mutate({ key: f.key, enabled: v })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

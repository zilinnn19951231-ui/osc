import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";

export default function AdEditor() {
  const navigate = useNavigate();
  const create = trpc.board.createVariant.useMutation({
    onSuccess: () => navigate("/ads"),
  });

  const [form, setForm] = useState({
    variantId: "",
    image: "",
    content: "",
    button1Text: "",
    button1Url: "",
    button2Text: "",
    button2Url: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const buttons = [];
    if (form.button1Text) buttons.push({ text: form.button1Text, url: form.button1Url || undefined });
    if (form.button2Text) buttons.push({ text: form.button2Text, url: form.button2Url || undefined });

    create.mutate({
      boardId: "ads",
      variantId: form.variantId,
      image: form.image || null,
      content: form.content || null,
      buttons,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((f) => ({ ...f, image: url }));
    }
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-5 w-1 rounded bg-[#00d4aa]" />
        <h1 className="text-xl font-bold">創建廣告版面</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-[#252535] bg-[#16161f] p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#00d4aa]">
            <span className="text-lg">📝</span> 廣告基本資訊
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[#8888a0]">廣告編號</label>
              <input
                required
                value={form.variantId}
                onChange={(e) => setForm((f) => ({ ...f, variantId: e.target.value }))}
                placeholder="例如: ads-20"
                className="w-full rounded-lg border border-[#252535] bg-[#111118] px-3 py-2 text-sm text-[#e8e8f0] placeholder-[#555570] focus:border-[#00d4aa] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[#8888a0]">發送頻率</label>
              <select className="w-full rounded-lg border border-[#252535] bg-[#111118] px-3 py-2 text-sm text-[#e8e8f0]">
                <option>每 4 小時</option>
                <option>每 6 小時</option>
                <option>每 8 小時</option>
                <option>每天一次</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#252535] bg-[#16161f] p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#00d4aa]">
            <span className="text-lg">🖼️</span> 圖片上傳 (選填)
          </div>
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#252535] bg-[#111118] py-10 transition-all hover:border-[#00d4aa] hover:bg-[rgba(0,212,170,0.02)]"
            onClick={() => document.getElementById("ad-image")?.click()}
          >
            <div className="mb-3 text-4xl text-[#555570]">📷</div>
            <div className="text-sm font-medium">點擊或拖曳上傳圖片</div>
            <div className="mt-1 text-xs text-[#555570]">支援 JPG, PNG, WEBP (最大 10MB)</div>
            {form.image && (
              <img src={form.image} alt="preview" className="mt-4 h-32 rounded-lg border border-[#252535] object-contain" />
            )}
          </div>
          <input id="ad-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>

        <div className="rounded-xl border border-[#252535] bg-[#16161f] p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#00d4aa]">
            <span className="text-lg">📄</span> 文字內容
          </div>
          <textarea
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="請輸入廣告文字內容..."
            rows={8}
            className="w-full rounded-lg border border-[#252535] bg-[#111118] px-3 py-2 text-sm text-[#e8e8f0] placeholder-[#555570] focus:border-[#00d4aa] focus:outline-none"
          />
        </div>

        <div className="rounded-xl border border-[#252535] bg-[#16161f] p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#00d4aa]">
            <span className="text-lg">🔗</span> 按鈕連結設定
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[#8888a0]">按鈕 1 文字</label>
              <input
                value={form.button1Text}
                onChange={(e) => setForm((f) => ({ ...f, button1Text: e.target.value }))}
                placeholder="例如: 了解更多"
                className="w-full rounded-lg border border-[#252535] bg-[#111118] px-3 py-2 text-sm text-[#e8e8f0] placeholder-[#555570] focus:border-[#00d4aa] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[#8888a0]">按鈕 1 URL</label>
              <input
                value={form.button1Url}
                onChange={(e) => setForm((f) => ({ ...f, button1Url: e.target.value }))}
                placeholder="https://..."
                className="w-full rounded-lg border border-[#252535] bg-[#111118] px-3 py-2 text-sm text-[#e8e8f0] placeholder-[#555570] focus:border-[#00d4aa] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[#8888a0]">按鈕 2 文字</label>
              <input
                value={form.button2Text}
                onChange={(e) => setForm((f) => ({ ...f, button2Text: e.target.value }))}
                placeholder="例如: 聯絡我們"
                className="w-full rounded-lg border border-[#252535] bg-[#111118] px-3 py-2 text-sm text-[#e8e8f0] placeholder-[#555570] focus:border-[#00d4aa] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[#8888a0]">按鈕 2 URL</label>
              <input
                value={form.button2Url}
                onChange={(e) => setForm((f) => ({ ...f, button2Url: e.target.value }))}
                placeholder="https://..."
                className="w-full rounded-lg border border-[#252535] bg-[#111118] px-3 py-2 text-sm text-[#e8e8f0] placeholder-[#555570] focus:border-[#00d4aa] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={create.isPending}
            className="flex-1 rounded-xl bg-[#00d4aa] py-3 text-sm font-semibold text-[#111118] transition-all hover:bg-[#00e6bb] disabled:opacity-50"
          >
            {create.isPending ? "儲存中..." : "💾 儲存並推送"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/ads")}
            className="flex-1 rounded-xl border border-[#252535] bg-[#16161f] py-3 text-sm font-semibold text-[#8888a0] transition-all hover:border-[#2a2a3a] hover:text-[#e8e8f0]"
          >
            ❌ 取消
          </button>
        </div>
      </form>
    </div>
  );
}

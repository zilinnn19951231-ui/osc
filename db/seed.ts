import { getDb } from "../api/queries/connection";
import { eq } from "drizzle-orm";
import {
  boards,
  boardVariants,
  blacklist,
  blacklistImages,
  features,
  buttonMappings,
  systemLogs,
} from "./schema";
import fs from "fs";
import path from "path";

async function seed() {
  const db = getDb();

  // Seed boards
  const existingBoards = await db.select().from(boards);
  if (existingBoards.length === 0) {
    const boardData = [
      { boardId: "chat", name: "聊天版", emoji: "💬", sortOrder: 1 },
      { boardId: "signin", name: "簽到版", emoji: "✅", sortOrder: 2 },
      { boardId: "casino", name: "博彩版", emoji: "🎰", sortOrder: 3 },
      { boardId: "dice", name: "骰子版", emoji: "🎲", sortOrder: 4 },
      { boardId: "ads", name: "廣告板", emoji: "📢", sortOrder: 5 },
      { boardId: "blacklist", name: "黑單版", emoji: "🚫", sortOrder: 6 },
    ];
    await db.insert(boards).values(boardData);
  }

  // Load JSON files
  const uploadDir = "/mnt/agents/upload";

  const loadJson = (filename: string) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(uploadDir, filename), "utf-8"));
    } catch {
      return null;
    }
  };

  const allBoards = await db.select().from(boards);
  const boardMap = new Map(allBoards.map((b) => [b.boardId, b.id]));

  // Seed board variants from JSON
  const seedBoardVariants = async (boardIdStr: string, jsonFile: string) => {
    const data = loadJson(jsonFile);
    if (!data || !data.variants) return;
    const boardDbId = boardMap.get(boardIdStr);
    if (!boardDbId) return;

    const existing = await db.select().from(boardVariants).where(eq(boardVariants.boardId, boardDbId));
    if (existing.length > 0) return; // skip if already seeded

    const rows = data.variants.map((v: any, idx: number) => ({
      boardId: boardDbId,
      variantId: v.variant_id || v.id,
      image: v.image?.replace("account/", "/images/") || null,
      content: v.content || v.text || "",
      buttons: v.buttons || [],
      sortOrder: idx,
    }));

    if (rows.length > 0) {
      await db.insert(boardVariants).values(rows);
    }
  };

  await seedBoardVariants("signin", "簽到版.json");
  await seedBoardVariants("casino", "博弈版.json");
  await seedBoardVariants("dice", "骰子版.json");
  await seedBoardVariants("ads", "廣告版.json");

  // Seed blacklist from 黑單版.json
  const existingBlacklist = await db.select().from(blacklist);
  if (existingBlacklist.length === 0) {
    const blacklistData = loadJson("黑單版.json");
    if (blacklistData && blacklistData.blacklist) {
      for (const entry of blacklistData.blacklist) {
        const result = await db.insert(blacklist).values({
          entryId: `BL-${String(entry.id).padStart(3, "0")}`,
          name: "",
          tgHandle: "",
          reason: entry.text || "",
          status: "approved",
        });
        const insertedId = Number(result[0].insertId);
        if (entry.images) {
          const imgRows = entry.images.map((img: string) => ({
            blacklistId: insertedId,
            imagePath: img.replace("account/", "/images/"),
          }));
          await db.insert(blacklistImages).values(imgRows);
        }
      }
    }
  }

  // Seed features
  const existingFeatures = await db.select().from(features);
  if (existingFeatures.length === 0) {
    const featureData = [
      { key: "auto_rotate", name: "自動輪播訊息", description: "簽到 / 骰子 / 博彩 / 廣告 自動輪播推送", category: "輪播與自動化", icon: "🔄", enabled: true, tag: "核心" },
      { key: "boot_message", name: "開機自動發送圖文", description: "機器人啟動時自動推送歡迎/公告訊息", category: "輪播與自動化", icon: "🚀", enabled: false, tag: null },
      { key: "hourly_ads", name: "每小時廣告輪播", description: "定時向群組推送輪播廣告內容", category: "輪播與自動化", icon: "⏰", enabled: true, tag: "NEW" },
      { key: "auto_greeting", name: "自動問候排程", description: "定時發送群組問候與活躍訊息", category: "輪播與自動化", icon: "👋", enabled: true, tag: null },
      { key: "daily_checkin", name: "每日簽到系統", description: "連續簽到獎勵機制，積分累積兌換", category: "互動功能", icon: "📅", enabled: true, tag: "核心" },
      { key: "lucky_wheel", name: "幸運輪盤", description: "隨機獎勵抽獎，積分滿 20 即可轉動", category: "互動功能", icon: "🎡", enabled: true, tag: null },
      { key: "dice_battle", name: "骰子對戰功能", description: "群組內骰子比大小，支援多人對戰", category: "互動功能", icon: "🎲", enabled: true, tag: "BETA" },
      { key: "profile_query", name: "個人詳情查詢", description: "用戶資料、積分、戰績查詢", category: "互動功能", icon: "👤", enabled: true, tag: null },
      { key: "blacklist_query", name: "黑名單查詢", description: "查詢與管理被封鎖用戶名單", category: "管理與安全", icon: "🔍", enabled: true, tag: "核心" },
      { key: "auto_delete_cmd", name: "自動刪除指令消息", description: "清理機器人指令訊息，保持群組整潔", category: "管理與安全", icon: "🗑️", enabled: true, tag: null },
      { key: "log_optimize", name: "日誌優化", description: "過濾 deleteMessage 紀錄，提升可讀性", category: "管理與安全", icon: "📜", enabled: true, tag: "NEW" },
      { key: "back_menu", name: "返回主選單按鈕", description: "所有頁面統一返回入口", category: "管理與安全", icon: "🔙", enabled: true, tag: null },
    ];
    await db.insert(features).values(featureData);
  }

  // Seed button mappings from 按鈕響應.json
  const existingButtons = await db.select().from(buttonMappings);
  if (existingButtons.length === 0) {
    const btnData = loadJson("按鈕響應.json");
    if (btnData && btnData.button_mappings) {
      const rows = btnData.button_mappings.map((btn: any) => ({
        callbackData: btn.callback_data,
        handler: btn.handler,
        description: btn.description,
        apiEndpoint: btn.api_endpoint,
        responseTemplate: btn.response_template,
        errorTemplate: btn.error_template,
      }));
      await db.insert(buttonMappings).values(rows);
    }
  }

  // Seed sample logs
  const existingLogs = await db.select().from(systemLogs);
  if (existingLogs.length === 0) {
    const logTypes = [
      { type: "ads", tag: "廣告", message: "輪播廣告 #ads-3 已發送至群組，觸及 2,530 人" },
      { type: "checkin", tag: "簽到", message: "用戶 @user_8842 完成今日簽到，連續 7 天" },
      { type: "dice", tag: "骰子", message: "群組骰子對戰：@player_A (🎲6) vs @player_B (🎲3) — A 獲勝" },
      { type: "warn", tag: "警告", message: "用戶 @spammer_001 觸發黑名單規則，已自動封鎖" },
      { type: "ads", tag: "廣告", message: "每小時廣告輪播觸發，發送 ads-5 至廣告板" },
      { type: "system", tag: "系統", message: "自動問候排程執行：「晚安，各位辛苦囉 💤」" },
      { type: "query", tag: "查詢", message: "用戶 @chen_99 查詢個人詳情，積分：8,420" },
      { type: "system", tag: "系統", message: "機器人狀態檢查通過，所有模組運行正常" },
    ];
    await db.insert(systemLogs).values(logTypes);
  }

  console.log("Seed completed.");
}

seed().catch(console.error);

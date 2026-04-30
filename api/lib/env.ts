import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  // 开发模式下返回空字符串（不抛错）
  return value ?? "";
}

export const env = {
  appId: required("APP_ID"),
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  kimiAuthUrl: required("KIMI_AUTH_URL") || "https://auth.kimi.com", // 开发环境默认值
  kimiOpenUrl: required("KIMI_OPEN_URL") || "https://open.kimi.com",
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
};

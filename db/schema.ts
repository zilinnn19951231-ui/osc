import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  json,
  boolean,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const boards = mysqlTable("boards", {
  id: serial("id").primaryKey(),
  boardId: varchar("board_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  emoji: varchar("emoji", { length: 20 }).default("📋"),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Board = typeof boards.$inferSelect;

export const boardVariants = mysqlTable("board_variants", {
  id: serial("id").primaryKey(),
  boardId: bigint("board_id", { mode: "number", unsigned: true }).notNull(),
  variantId: varchar("variant_id", { length: 50 }).notNull(),
  image: varchar("image", { length: 255 }),
  content: text("content"),
  buttons: json("buttons").$type<Array<{ text: string; type?: string; url?: string; data?: string }>>(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BoardVariant = typeof boardVariants.$inferSelect;

export const blacklist = mysqlTable("blacklist", {
  id: serial("id").primaryKey(),
  entryId: varchar("entry_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  tgHandle: varchar("tg_handle", { length: 100 }),
  gender: varchar("gender", { length: 10 }),
  birthday: varchar("birthday", { length: 20 }),
  location: varchar("location", { length: 255 }),
  scamAmount: varchar("scam_amount", { length: 50 }),
  reason: text("reason"),
  bounty: varchar("bounty", { length: 100 }),
  reporter: varchar("reporter", { length: 100 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("approved").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlacklistEntry = typeof blacklist.$inferSelect;

export const blacklistImages = mysqlTable("blacklist_images", {
  id: serial("id").primaryKey(),
  blacklistId: bigint("blacklist_id", { mode: "number", unsigned: true }).notNull(),
  imagePath: varchar("image_path", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlacklistImage = typeof blacklistImages.$inferSelect;

export const features = mysqlTable("features", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).default("general"),
  icon: varchar("icon", { length: 50 }).default("⚙️"),
  enabled: boolean("enabled").default(true).notNull(),
  tag: varchar("tag", { length: 20 }),
  config: json("config"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Feature = typeof features.$inferSelect;

export const systemLogs = mysqlTable("system_logs", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  tag: varchar("tag", { length: 50 }).notNull(),
  message: text("message").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SystemLog = typeof systemLogs.$inferSelect;

export const buttonMappings = mysqlTable("button_mappings", {
  id: serial("id").primaryKey(),
  callbackData: varchar("callback_data", { length: 100 }).notNull().unique(),
  handler: varchar("handler", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }),
  apiEndpoint: varchar("api_endpoint", { length: 255 }),
  responseTemplate: text("response_template"),
  errorTemplate: text("error_template"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ButtonMapping = typeof buttonMappings.$inferSelect;

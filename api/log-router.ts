import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { systemLogs } from "@db/schema";

export const logRouter = createRouter({
  list: publicQuery
    .input(z.object({ tag: z.string().optional(), limit: z.number().default(50) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const tag = input?.tag;
      const limit = input?.limit || 50;
      if (tag) {
        return db.select().from(systemLogs).where(eq(systemLogs.tag, tag)).orderBy(desc(systemLogs.createdAt)).limit(limit);
      }
      return db.select().from(systemLogs).orderBy(desc(systemLogs.createdAt)).limit(limit);
    }),

  create: adminQuery
    .input(
      z.object({
        type: z.string(),
        tag: z.string(),
        message: z.string(),
        metadata: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(systemLogs).values(input);
      return { id: Number(result[0].insertId) };
    }),

  clear: adminQuery.mutation(async () => {
    const db = getDb();
    await db.delete(systemLogs);
    return { success: true };
  }),
});

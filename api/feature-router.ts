import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { features } from "@db/schema";

export const featureRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(features).orderBy(asc(features.id));
  }),

  toggle: adminQuery
    .input(z.object({ key: z.string(), enabled: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(features).set({ enabled: input.enabled }).where(eq(features.key, input.key));
      return { success: true };
    }),

  updateConfig: adminQuery
    .input(z.object({ key: z.string(), config: z.record(z.string(), z.any()) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(features).set({ config: input.config }).where(eq(features.key, input.key));
      return { success: true };
    }),
});

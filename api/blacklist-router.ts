import { z } from "zod";
import { eq, desc, like } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { blacklist, blacklistImages } from "@db/schema";

export const blacklistRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const entries = await db.select().from(blacklist).orderBy(desc(blacklist.createdAt));
    const images = await db.select().from(blacklistImages);
    return entries.map((e) => ({
      ...e,
      images: images.filter((i) => i.blacklistId === e.id).map((i) => i.imagePath),
    }));
  }),

  search: publicQuery
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const entries = await db.select().from(blacklist).where(like(blacklist.name, `%${input.query}%`)).limit(50);
      return entries;
    }),

  create: adminQuery
    .input(
      z.object({
        entryId: z.string(),
        name: z.string().optional(),
        tgHandle: z.string().optional(),
        gender: z.string().optional(),
        birthday: z.string().optional(),
        location: z.string().optional(),
        scamAmount: z.string().optional(),
        reason: z.string().optional(),
        bounty: z.string().optional(),
        reporter: z.string().optional(),
        images: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { images, ...data } = input;
      const result = await db.insert(blacklist).values(data);
      const insertedId = Number(result[0].insertId);
      if (images && images.length > 0) {
        for (const img of images) {
          await db.insert(blacklistImages).values({ blacklistId: insertedId, imagePath: img });
        }
      }
      return { id: insertedId };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        tgHandle: z.string().optional(),
        gender: z.string().optional(),
        birthday: z.string().optional(),
        location: z.string().optional(),
        scamAmount: z.string().optional(),
        reason: z.string().optional(),
        bounty: z.string().optional(),
        reporter: z.string().optional(),
        status: z.enum(["pending", "approved", "rejected"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(blacklist).set(data).where(eq(blacklist.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(blacklistImages).where(eq(blacklistImages.blacklistId, input.id));
      await db.delete(blacklist).where(eq(blacklist.id, input.id));
      return { success: true };
    }),
});

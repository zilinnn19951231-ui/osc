import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { buttonMappings } from "@db/schema";

export const buttonRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(buttonMappings).orderBy(buttonMappings.id);
  }),

  create: adminQuery
    .input(
      z.object({
        callbackData: z.string(),
        handler: z.string(),
        description: z.string().optional(),
        apiEndpoint: z.string().optional(),
        responseTemplate: z.string().optional(),
        errorTemplate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(buttonMappings).values(input);
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        callbackData: z.string().optional(),
        handler: z.string().optional(),
        description: z.string().optional(),
        apiEndpoint: z.string().optional(),
        responseTemplate: z.string().optional(),
        errorTemplate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(buttonMappings).set(data).where(eq(buttonMappings.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(buttonMappings).where(eq(buttonMappings.id, input.id));
      return { success: true };
    }),
});

import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { boards, boardVariants } from "@db/schema";

export const boardRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const allBoards = await db.select().from(boards).orderBy(asc(boards.sortOrder));
    const allVariants = await db.select().from(boardVariants).orderBy(asc(boardVariants.sortOrder));
    return allBoards.map((b) => ({
      ...b,
      variants: allVariants.filter((v) => v.boardId === b.id),
    }));
  }),

  getById: publicQuery
    .input(z.object({ boardId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [board] = await db.select().from(boards).where(eq(boards.boardId, input.boardId)).limit(1);
      if (!board) return null;
      const variants = await db.select().from(boardVariants).where(eq(boardVariants.boardId, board.id)).orderBy(asc(boardVariants.sortOrder));
      return { ...board, variants };
    }),

  createVariant: adminQuery
    .input(
      z.object({
        boardId: z.string(),
        variantId: z.string(),
        image: z.string().nullable().optional(),
        content: z.string().nullable().optional(),
        buttons: z.array(z.object({ text: z.string(), type: z.string().optional(), url: z.string().optional(), data: z.string().optional() })).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [board] = await db.select().from(boards).where(eq(boards.boardId, input.boardId)).limit(1);
      if (!board) throw new Error("Board not found");
      const result = await db.insert(boardVariants).values({
        boardId: board.id,
        variantId: input.variantId,
        image: input.image,
        content: input.content,
        buttons: input.buttons,
      });
      return { id: Number(result[0].insertId) };
    }),

  updateVariant: adminQuery
    .input(
      z.object({
        id: z.number(),
        image: z.string().nullable().optional(),
        content: z.string().nullable().optional(),
        buttons: z.array(z.object({ text: z.string(), type: z.string().optional(), url: z.string().optional(), data: z.string().optional() })).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(boardVariants).set(data).where(eq(boardVariants.id, id));
      return { success: true };
    }),

  deleteVariant: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(boardVariants).where(eq(boardVariants.id, input.id));
      return { success: true };
    }),
});

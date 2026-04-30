import { authRouter } from "./auth-router";
import { boardRouter } from "./board-router";
import { blacklistRouter } from "./blacklist-router";
import { featureRouter } from "./feature-router";
import { logRouter } from "./log-router";
import { buttonRouter } from "./button-router";
import { createRouter, publicQuery } from "./middleware";
import { pyRouter } from "./py-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  board: boardRouter,
  blacklist: blacklistRouter,
  feature: featureRouter,
  log: logRouter,
  button: buttonRouter,
  py: pyRouter,
});

export type AppRouter = typeof appRouter;

/**
 * Py API Router
 * 通過 tRPC 調用 py 後端的 API
 */
import { createRouter, publicQuery } from "../api/middleware";
import { statsApi, blacklistApi, adsApi, featuresApi, logsApi } from "../src/lib/py-api";

export const pyRouter = createRouter({
  // ==================== Stats ====================
  stats: createRouter({
    dashboard: publicQuery.query(async () => {
      return statsApi.getDashboard();
    }),
    moduleStatus: publicQuery.query(async () => {
      return statsApi.getModuleStatus();
    }),
    recentActivity: publicQuery
      .input(
        (val: unknown) => (typeof val === "object" && val !== null ? (val as { limit?: number }).limit : 20)
      )
      .query(async ({ input }) => {
        const limit = typeof input === "number" ? input : 20;
        return statsApi.getRecentActivity(limit);
      }),
  }),

  // ==================== Blacklist ====================
  blacklist: createRouter({
    list: publicQuery.query(async () => {
      return blacklistApi.getAll();
    }),
    count: publicQuery.query(async () => {
      return blacklistApi.getCount();
    }),
    add: publicQuery
      .input(
        (val: unknown) => {
          if (typeof val !== "object" || val === null) throw new Error("Invalid input");
          const obj = val as Record<string, unknown>;
          return {
            text: typeof obj.text === "string" ? obj.text : "",
            images: Array.isArray(obj.images) ? (obj.images as string[]) : [],
            reason: typeof obj.reason === "string" ? obj.reason : undefined,
          };
        }
      )
      .mutation(async ({ input }) => {
        return blacklistApi.add(input);
      }),
    delete: publicQuery
      .input((val: unknown) => {
        if (typeof val === "string") return val;
        if (typeof val === "object" && val !== null) return (val as { id: string }).id;
        throw new Error("Invalid input");
      })
      .mutation(async ({ input }) => {
        return blacklistApi.delete(input);
      }),
    reload: publicQuery.mutation(async () => {
      return blacklistApi.reload();
    }),
  }),

  // ==================== Ads ====================
  ads: createRouter({
    list: publicQuery.query(async () => {
      return adsApi.getAll();
    }),
    count: publicQuery.query(async () => {
      return adsApi.getCount();
    }),
    current: publicQuery.query(async () => {
      return adsApi.getCurrent();
    }),
    next: publicQuery.mutation(async () => {
      return adsApi.next();
    }),
    previous: publicQuery.mutation(async () => {
      return adsApi.previous();
    }),
    reload: publicQuery
      .input((val: unknown) => {
        if (typeof val === "number") return val;
        if (typeof val === "object" && val !== null) return (val as { groupId?: number }).groupId;
        return undefined;
      })
      .mutation(async ({ input }) => {
        return adsApi.reload(input);
      }),
    getById: publicQuery
      .input((val: unknown) => {
        if (typeof val === "number") return val;
        if (typeof val === "object" && val !== null) return (val as { id: number }).id;
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        return adsApi.getById(input);
      }),
  }),

  // ==================== Features ====================
  features: createRouter({
    list: publicQuery.query(async () => {
      return featuresApi.getAll();
    }),
    get: publicQuery
      .input((val: unknown) => {
        if (typeof val === "string") return val;
        if (typeof val === "object" && val !== null) return (val as { name: string }).name;
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        return featuresApi.get(input);
      }),
    update: publicQuery
      .input(
        (val: unknown) => {
          if (typeof val !== "object" || val === null) throw new Error("Invalid input");
          const obj = val as Record<string, unknown>;
          return {
            name: typeof obj.name === "string" ? obj.name : "",
            enabled: typeof obj.enabled === "boolean" ? obj.enabled : undefined,
            config: typeof obj.config === "object" ? (obj.config as Record<string, unknown>) : undefined,
          };
        }
      )
      .mutation(async ({ input }) => {
        return featuresApi.update(input.name, {
          enabled: input.enabled,
          config: input.config,
        });
      }),
    toggle: publicQuery
      .input((val: unknown) => {
        if (typeof val === "string") return val;
        if (typeof val === "object" && val !== null) return (val as { name: string }).name;
        throw new Error("Invalid input");
      })
      .mutation(async ({ input }) => {
        return featuresApi.toggle(input);
      }),
  }),

  // ==================== Logs ====================
  logs: createRouter({
    list: publicQuery
      .input(
        (val: unknown) => {
          if (typeof val === "object" && val !== null) {
            return {
              level: typeof (val as { level?: string }).level === "string" ? (val as { level: string }).level : undefined,
              limit: typeof (val as { limit?: number }).limit === "number" ? (val as { limit: number }).limit : 100,
            };
          }
          return { level: undefined, limit: 100 };
        }
      )
      .query(async ({ input }) => {
        return logsApi.getAll(input.level, input.limit);
      }),
    levels: publicQuery.query(async () => {
      return logsApi.getLevels();
    }),
    recentErrors: publicQuery
      .input((val: unknown) => (typeof val === "number" ? val : 20))
      .query(async ({ input }) => {
        return logsApi.getRecentErrors(typeof input === "number" ? input : 20);
      }),
  }),
});
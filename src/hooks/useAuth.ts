import { trpc } from "@/providers/trpc";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LOGIN_PATH } from "@/const";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH } =
    options ?? {};

  const navigate = useNavigate();

  // 检查是否為開發模式且跳過認證
  const isDevSkipAuth =
    import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === "true";

  // 開發模式：直接返回模擬數據，不發起 API 請求
  if (isDevSkipAuth) {
    const mockUser = {
      id: 1,
      unionId: "dev_user",
      name: "開發者",
      email: "dev@example.com",
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignInAt: new Date(),
    };

    return useMemo(
      () => ({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: () => {
          console.log("[Dev Mode] Logout clicked (no-op)");
        },
        refresh: async () => {},
      }),
      [],
    );
  }

  // 正式模式：正常查詢後端
  const utils = trpc.useUtils();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      navigate(redirectPath);
    },
  });

  const logout = useCallback(() => logoutMutation.mutate(), [logoutMutation]);

  useEffect(() => {
    if (redirectOnUnauthenticated && !isLoading && !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectPath) {
        navigate(redirectPath);
      }
    }
  }, [redirectOnUnauthenticated, isLoading, user, navigate, redirectPath]);

  return useMemo(
    () => ({
      user: user ?? null,
      isAuthenticated: !!user,
      isLoading: isLoading || logoutMutation.isPending,
      error,
      logout,
      refresh: refetch,
    }),
    [user, isLoading, logoutMutation.isPending, error, logout, refetch],
  );
}

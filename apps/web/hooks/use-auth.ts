"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "~/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
}

/** 
 * Helper: set a lightweight session indicator cookie for Next.js middleware.
 * 
 * TODO (BUG-11): Migrate to secure, backend-set httpOnly cookies.
 * Currently, JWT is stored in localStorage and read on client-side fetch.
 * When the frontend and API server are configured on the same domain (or cross-site cookies
 * with SameSite=None are enabled), migrate authentication fully to httpOnly cookies
 * and remove localStorage/client-side session cookie handling.
 */
function setSessionCookie(present: boolean) {
  if (typeof document === "undefined") return;
  if (present) {
    document.cookie = "patra_logged_in=1;path=/;max-age=604800;SameSite=Lax";
  } else {
    document.cookie = "patra_logged_in=;path=/;max-age=0";
  }
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // BUG-03 fix: Initialize token synchronously so the first render already has it
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("patra_token");
    }
    return null;
  });

  // Get current user query. Only active if a token is present.
  const {
    data: user,
    isLoading: queryLoading,
    refetch,
    isError,
  } = trpc.auth.me.useQuery(undefined, {
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // BUG-06 fix: If auth.me errors (expired/invalid JWT), clear the stale token
  useEffect(() => {
    if (isError && token) {
      localStorage.removeItem("patra_token");
      setSessionCookie(false);
      setToken(null);
    }
  }, [isError, token]);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("patra_token", data.token);
      setSessionCookie(true);
      setToken(data.token);
      queryClient.invalidateQueries();
      router.push("/dashboard");
    },
  });

  const signupMutation = trpc.auth.createUserWithEmailAndPassword.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("patra_token", data.token);
      setSessionCookie(true);
      setToken(data.token);
      queryClient.invalidateQueries();
      router.push("/dashboard");
    },
  });

  // BUG-18 fix: removed unnecessary handleLogout wrapper
  const logout = () => {
    localStorage.removeItem("patra_token");
    setSessionCookie(false);
    setToken(null);
    queryClient.clear();
    router.push("/login");
  };

  return {
    user: user as User | undefined,
    isAuthenticated: !!user,
    isLoading: !!token && queryLoading,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    loginError: loginMutation.error?.message ?? null,
    signupError: signupMutation.error?.message ?? null,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout,
    refetchUser: refetch,
  };
}

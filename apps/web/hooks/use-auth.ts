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

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);

  // Initialize token from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("patra_token");
      setToken(stored);
    }
  }, []);

  // Get current user query. Only active if a token is present.
  const {
    data: user,
    isLoading,
    refetch,
    isError,
  } = trpc.auth.me.useQuery(undefined, {
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("patra_token", data.token);
      setToken(data.token);
      queryClient.invalidateQueries();
      router.push("/dashboard");
    },
  });

  const signupMutation = trpc.auth.createUserWithEmailAndPassword.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("patra_token", data.token);
      setToken(data.token);
      queryClient.invalidateQueries();
      router.push("/dashboard");
    },
  });

  const logout = () => {
    localStorage.removeItem("patra_token");
    setToken(null);
    queryClient.clear();
    router.push("/login");
  };

  const handleLogout = () => {
    logout();
  };

  return {
    user: user as User | undefined,
    isAuthenticated: !!user,
    isLoading: isLoading && !!token,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    loginError: loginMutation.error?.message ?? null,
    signupError: signupMutation.error?.message ?? null,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: handleLogout,
    refetchUser: refetch,
  };
}

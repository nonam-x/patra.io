"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/hooks/use-auth";

/**
 * Redirects to /login if user is not authenticated.
 * Returns { user, isLoading } for convenience.
 */
export function useAuthGuard() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, ...rest } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  return { user, isLoading: isLoading || !user, isAuthenticated, ...rest };
}

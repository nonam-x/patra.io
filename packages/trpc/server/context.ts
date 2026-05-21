import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

/**
 * Creates tRPC context from Express request.
 * Extracts authorization token and IP address for downstream middleware.
 */
export async function createContext({ req }: CreateExpressContextOptions) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const ipAddress =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
    req.socket.remoteAddress ??
    "unknown";

  return {
    token,
    ipAddress,
    user: null as { id: string; email: string; role: string } | null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

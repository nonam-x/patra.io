import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import type { Context } from "./context";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<Context>()
  .create({
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          message: error.message,
        },
      };
    },
  });

export const router = tRPCContext.router;

/** Unauthenticated procedure — available to everyone */
export const publicProcedure = tRPCContext.procedure;

/**
 * Auth middleware — inline to avoid circular dependency.
 * Extracts JWT from context, verifies it, and injects user into ctx.
 */
const authMiddleware = tRPCContext.middleware(async ({ ctx, next }) => {
  // Lazy import to avoid circular init
  const UserService = (await import("@repo/services/user")).default;

  const token = ctx.token;
  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing authentication token",
    });
  }

  const user = UserService.verifyToken(token);
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired authentication token",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

/**
 * Rate-limit middleware — inline to avoid circular dependency.
 * In-memory sliding window: 10 requests/minute per IP.
 */
const rateLimitStore = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const valid = timestamps.filter((t) => now - t < WINDOW_MS);
    if (valid.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, valid);
    }
  }
}, 5 * 60_000);

const rateLimitMiddleware = tRPCContext.middleware(async ({ ctx, next }) => {
  const ip = ctx.ipAddress ?? "unknown";
  const now = Date.now();

  const timestamps = rateLimitStore.get(ip) ?? [];
  const windowTimestamps = timestamps.filter((t) => now - t < WINDOW_MS);

  if (windowTimestamps.length >= MAX_REQUESTS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate limit exceeded. Please try again later.",
    });
  }

  windowTimestamps.push(now);
  rateLimitStore.set(ip, windowTimestamps);

  return next();
});

/** Authenticated procedure — requires valid JWT in Authorization header */
export const protectedProcedure = tRPCContext.procedure.use(authMiddleware);

/** Rate-limited public procedure — for spam-sensitive public endpoints */
export const rateLimitedProcedure =
  tRPCContext.procedure.use(rateLimitMiddleware);

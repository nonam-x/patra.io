/**
 * Rate-limit middleware is defined inline in trpc.ts to avoid
 * circular dependency issues during module initialization.
 *
 * See: packages/trpc/server/trpc.ts (rateLimitMiddleware)
 *
 * The middleware:
 * - In-memory sliding window: 10 requests/minute per IP
 * - Automatic stale entry cleanup every 5 minutes
 * - Throws TOO_MANY_REQUESTS when limit exceeded
 */
export {};

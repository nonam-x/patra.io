/**
 * Auth middleware is defined inline in trpc.ts to avoid
 * circular dependency issues during module initialization.
 *
 * See: packages/trpc/server/trpc.ts (authMiddleware)
 *
 * The middleware:
 * - Extracts JWT from context.token
 * - Verifies via UserService.verifyToken()
 * - Injects { id, email, role } into ctx.user
 * - Throws UNAUTHORIZED on missing/invalid tokens
 */
export {};

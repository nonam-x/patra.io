import { z } from "zod";

// ─── Registration ────────────────────────────────────────
export const createUserWithEmailAndPasswordInput = z.object({
  name: z.string().describe("full name of user"),
  email: z.email().describe("email address of user"),
  password: z.string().min(6).describe("user password"),
});

export type CreateUserWithEmailAndPasswordInputType = z.infer<
  typeof createUserWithEmailAndPasswordInput
>;

// ─── Login ───────────────────────────────────────────────
export const loginInput = z.object({
  email: z.email().describe("email address"),
  password: z.string().min(1).describe("user password"),
});

export type LoginInputType = z.infer<typeof loginInput>;

// ─── Token payload ───────────────────────────────────────
export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
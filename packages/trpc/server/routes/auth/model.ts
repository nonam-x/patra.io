import { z } from "zod";

// ─── Register ────────────────────────────────────────
export const createUserWithEmailAndPasswordInput = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const createUserWithEmailAndPasswordOutput = z.object({
  id: z.string().describe("ID of the user created"),
  token: z.string().describe("JWT authentication token"),
});

// ─── Login ───────────────────────────────────────────
export const loginInput = z.object({
  email: z.string().email().describe("Email address"),
  password: z.string().min(1).describe("Password"),
});

export const loginOutput = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  token: z.string().describe("JWT authentication token"),
});

// ─── Me ──────────────────────────────────────────────
export const meOutput = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  plan: z.string(),
  profileImageUrl: z.string().nullable(),
  createdAt: z.string().nullable(),
});

// ─── Types ───────────────────────────────────────────
export type CreateUserWithEmailAndPasswordInputType = z.infer<
  typeof createUserWithEmailAndPasswordInput
>;
export type CreateUserWithEmailAndPasswordOutputType = z.infer<
  typeof createUserWithEmailAndPasswordOutput
>;
export type LoginInputType = z.infer<typeof loginInput>;
export type LoginOutputType = z.infer<typeof loginOutput>;
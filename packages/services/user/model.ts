import { z } from "zod";

export const createUserWithEmailAndPasswordInput = z.object({
  name: z.string().describe("full name of user"),
  email: z.string().email().describe("email address of user"),
  password: z.string().min(6).describe("users password"),
});

export type CreateUserWithEmailAndPasswordInputType = z.infer<
  typeof createUserWithEmailAndPasswordInput
>;

export const loginInput = z.object({
  email: z.string().email().describe("email address of user"),
  password: z.string().describe("users password"),
});

export type LoginInputType = z.infer<typeof loginInput>;

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const generateTokenPayload = z.object({
  id: z.string().describe("uuid of user"),
});

export type GenerateTokenPayloadType = z.infer<typeof generateTokenPayload>;
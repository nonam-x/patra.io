import { z } from "zod";

// ─── Create ──────────────────────────────────────────
export const createFormInput = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  visibility: z.enum(["public", "unlisted", "private"]).default("public"),
  themeId: z.string().uuid().optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export const formOutput = z.object({
  id: z.string(),
  creatorId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  visibility: z.string(),
  status: z.string(),
  themeId: z.string().nullable(),
  settings: z.unknown(),
  createdAt: z.unknown(),
  updatedAt: z.unknown(),
});

// ─── Update ──────────────────────────────────────────
export const updateFormInput = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  visibility: z.enum(["public", "unlisted", "private"]).optional(),
  themeId: z.string().uuid().nullable().optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

// ─── Full form with fields ───────────────────────────
export const formDetailOutput = z.object({
  id: z.string(),
  creatorId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  visibility: z.string(),
  status: z.string(),
  themeId: z.string().nullable(),
  settings: z.unknown(),
  createdAt: z.unknown(),
  updatedAt: z.unknown(),
  fields: z.array(z.record(z.string(), z.unknown())),
  theme: z.record(z.string(), z.unknown()).nullable(),
});

// ─── List ────────────────────────────────────────────
export const listFormsInput = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export const listFormsOutput = z.object({
  forms: z.array(z.record(z.string(), z.unknown())),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// ─── Common ──────────────────────────────────────────
export const formIdInput = z.object({
  id: z.string().uuid(),
});

export const successOutput = z.object({
  success: z.boolean(),
});

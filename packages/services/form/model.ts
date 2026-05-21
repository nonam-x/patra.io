import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().min(1).max(255).describe("Form title"),
  description: z.string().max(2000).optional().describe("Form description"),
  visibility: z
    .enum(["public", "unlisted", "private"])
    .default("public")
    .describe("Form visibility"),
  themeId: z.string().uuid().optional().describe("Theme ID"),
  settings: z
    .record(z.string(), z.unknown())
    .optional()
    .describe("Form settings"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const updateFormInput = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  visibility: z.enum(["public", "unlisted", "private"]).optional(),
  themeId: z.string().uuid().nullable().optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export type UpdateFormInputType = z.infer<typeof updateFormInput>;

export const paginationInput = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export type PaginationInputType = z.infer<typeof paginationInput>;

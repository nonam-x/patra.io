import { z } from "zod";

export const exploreListInput = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export const exploreListOutput = z.object({
  forms: z.array(z.record(z.string(), z.unknown())),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const slugInput = z.object({
  slug: z.string(),
});

export const publicFormOutput = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  status: z.string(),
  fields: z.array(z.record(z.string(), z.unknown())),
  theme: z.record(z.string(), z.unknown()).nullable(),
});

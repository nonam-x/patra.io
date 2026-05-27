import { z } from "zod";

export const emailLogInput = z.object({
  formId: z.string().uuid().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const emailLogOutput = z.object({
  emails: z.array(
    z.object({
      id: z.string(),
      formId: z.string().nullable(),
      to: z.string(),
      subject: z.string(),
      body: z.string(),
      type: z.string(),
      createdAt: z.unknown(),
    }),
  ),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

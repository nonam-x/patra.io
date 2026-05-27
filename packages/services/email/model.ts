import { z } from "zod";

export const emailLogInput = z.object({
  formId: z.string().uuid().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type EmailLogInputType = z.infer<typeof emailLogInput>;

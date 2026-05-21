import { z } from "zod";

export const submitResponseInput = z.object({
  slug: z.string().describe("Form slug"),
  answers: z
    .array(
      z.object({
        fieldId: z.string().uuid(),
        value: z.string(),
      }),
    )
    .min(1),
  metadata: z
    .object({
      browser: z.string().optional(),
      referrer: z.string().optional(),
      locale: z.string().optional(),
    })
    .optional(),
});

export const submitResponseOutput = z.object({
  submissionId: z.string(),
});

export const submissionListInput = z.object({
  formId: z.string().uuid(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const submissionListOutput = z.object({
  submissions: z.array(z.record(z.string(), z.unknown())),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const submissionIdInput = z.object({
  id: z.string().uuid(),
});

export const submissionDetailOutput = z.record(z.string(), z.unknown());

export const formIdInput = z.object({
  formId: z.string().uuid(),
});

export const csvExportOutput = z.object({
  csv: z.string().describe("CSV content"),
  filename: z.string().describe("Suggested filename"),
});

export const successOutput = z.object({
  success: z.boolean(),
});

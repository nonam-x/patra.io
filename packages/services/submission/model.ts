import { z } from "zod";

export const submitResponseInput = z.object({
  answers: z
    .array(
      z.object({
        fieldId: z.string().uuid().describe("Field ID"),
        value: z.string().describe("Answer value"),
      }),
    )
    .min(1)
    .describe("List of answers"),
  metadata: z
    .object({
      browser: z.string().optional(),
      referrer: z.string().optional(),
      locale: z.string().optional(),
    })
    .optional(),
});

export type SubmitResponseInputType = z.infer<typeof submitResponseInput>;

export const submissionPaginationInput = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type SubmissionPaginationInputType = z.infer<
  typeof submissionPaginationInput
>;

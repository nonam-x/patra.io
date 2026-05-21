import { z } from "zod";

// No input models needed for analytics — just formId/creatorId params
// Output types are defined here for documentation

export const formAnalyticsOutput = z.object({
  totalResponses: z.number(),
  completionRate: z.number(),
  avgCompletionTimeSeconds: z.number().nullable(),
  responsesOverTime: z.array(
    z.object({
      date: z.string(),
      count: z.number(),
    }),
  ),
  fieldBreakdown: z.array(
    z.object({
      fieldId: z.string(),
      fieldLabel: z.string(),
      fieldType: z.string(),
      answerDistribution: z.array(
        z.object({
          value: z.string(),
          count: z.number(),
          percentage: z.number(),
        }),
      ),
    }),
  ),
});

export type FormAnalyticsOutput = z.infer<typeof formAnalyticsOutput>;

export const dashboardOutput = z.object({
  totalForms: z.number(),
  totalResponses: z.number(),
  publishedForms: z.number(),
  recentForms: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      status: z.string(),
      responseCount: z.number(),
      createdAt: z.string().nullable(),
    }),
  ),
});

export type DashboardOutput = z.infer<typeof dashboardOutput>;

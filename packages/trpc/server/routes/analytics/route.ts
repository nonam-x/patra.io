import {
  formAnalyticsInput,
  formAnalyticsOutput,
  dashboardOutput,
} from "./model";
import { analyticsService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { z } from "zod";

const TAGS = ["Analytics"];
const getPath = generatePath("/analytics");

export const analyticsRouter = router({
  getFormAnalytics: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/form/{formId}"),
        tags: TAGS,
        summary: "Get analytics for a specific form",
        protect: true,
      },
    })
    .input(formAnalyticsInput)
    .output(formAnalyticsOutput)
    .query(async ({ ctx, input }) => {
      return analyticsService.getFormAnalytics(input.formId, ctx.user.id);
    }),

  getDashboard: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/dashboard"),
        tags: TAGS,
        summary: "Get creator dashboard analytics",
        protect: true,
      },
    })
    .input(z.undefined().describe("No input required"))
    .output(dashboardOutput)
    .query(async ({ ctx }) => {
      return analyticsService.getCreatorDashboard(ctx.user.id);
    }),
});

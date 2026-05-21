import {
  submitResponseInput,
  submitResponseOutput,
  submissionListInput,
  submissionListOutput,
  submissionIdInput,
  submissionDetailOutput,
  formIdInput,
  csvExportOutput,
  successOutput,
} from "./model";
import { submissionService } from "../../services";
import {
  publicProcedure,
  protectedProcedure,
  rateLimitedProcedure,
  router,
} from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Submissions"];
const getPath = generatePath("/submissions");

export const submissionRouter = router({
  submit: rateLimitedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/submit"),
        tags: TAGS,
        summary: "Submit a form response (public, rate-limited)",
      },
    })
    .input(submitResponseInput)
    .output(submitResponseOutput)
    .mutation(async ({ ctx, input }) => {
      const { slug, ...data } = input;
      return submissionService.submitResponse(slug, data, {
        ipAddress: ctx.ipAddress,
        userAgent: "trpc-client",
      });
    }),

  list: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/"),
        tags: TAGS,
        summary: "List submissions for a form",
        protect: true,
      },
    })
    .input(submissionListInput)
    .output(submissionListOutput)
    .query(async ({ ctx, input }) => {
      const { formId, ...pagination } = input;
      return submissionService.getSubmissions(formId, ctx.user.id, pagination);
    }),

  getById: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/{id}"),
        tags: TAGS,
        summary: "Get submission details",
        protect: true,
      },
    })
    .input(submissionIdInput)
    .output(submissionDetailOutput)
    .query(async ({ ctx, input }) => {
      return submissionService.getSubmissionById(input.id, ctx.user.id);
    }),

  delete: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/{id}"),
        tags: TAGS,
        summary: "Delete a submission",
        protect: true,
      },
    })
    .input(submissionIdInput)
    .output(successOutput)
    .mutation(async ({ ctx, input }) => {
      return submissionService.deleteSubmission(input.id, ctx.user.id);
    }),

  exportCSV: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/export/{formId}"),
        tags: TAGS,
        summary: "Export form submissions as CSV",
        protect: true,
      },
    })
    .input(formIdInput)
    .output(csvExportOutput)
    .query(async ({ ctx, input }) => {
      const csv = await submissionService.exportSubmissionsCSV(
        input.formId,
        ctx.user.id,
      );
      return {
        csv,
        filename: `submissions-${input.formId}.csv`,
      };
    }),
});

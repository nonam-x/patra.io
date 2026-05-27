import { emailLogInput, emailLogOutput } from "./model";
import { emailService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Emails"];
const getPath = generatePath("/emails");

export const emailRouter = router({
  list: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/"),
        tags: TAGS,
        summary: "List simulated email logs for the current creator",
        protect: true,
      },
    })
    .input(emailLogInput)
    .output(emailLogOutput)
    .query(async ({ ctx, input }) => {
      return emailService.getEmailLogs(ctx.user.id, input);
    }),
});

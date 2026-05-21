import {
  exploreListInput,
  exploreListOutput,
  slugInput,
  publicFormOutput,
} from "./model";
import { formService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Explore"];
const getPath = generatePath("/explore");

export const exploreRouter = router({
  listPublicForms: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/"),
        tags: TAGS,
        summary: "Browse public published forms",
      },
    })
    .input(exploreListInput)
    .output(exploreListOutput)
    .query(async ({ input }) => {
      return formService.getPublicForms(input);
    }),

  getFormBySlug: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/{slug}"),
        tags: TAGS,
        summary: "Get a form by slug (for responding)",
      },
    })
    .input(slugInput)
    .output(publicFormOutput)
    .query(async ({ input }) => {
      const form = await formService.getFormBySlug(input.slug);
      if (!form) throw new Error("Form not found");

      // Only allow access to published forms that are public or unlisted
      if (form.status !== "published") {
        throw new Error("Form is not available");
      }
      if (form.visibility === "private") {
        throw new Error("This form is private");
      }

      return {
        id: form.id,
        title: form.title,
        description: form.description,
        slug: form.slug,
        status: form.status,
        fields: form.fields,
        theme: form.theme,
      };
    }),
});

import {
  createThemeInput,
  updateThemeInput,
  themeOutput,
  themeIdInput,
  themesListOutput,
  successOutput,
} from "./model";
import { themeService } from "../../services";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { z } from "zod";

const TAGS = ["Themes"];
const getPath = generatePath("/themes");

export const themeRouter = router({
  list: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/"),
        tags: TAGS,
        summary: "List available themes (system + user's custom)",
        protect: true,
      },
    })
    .input(z.undefined().describe("No input required"))
    .output(themesListOutput)
    .query(async ({ ctx }) => {
      return themeService.listThemes(ctx.user.id);
    }),

  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/"),
        tags: TAGS,
        summary: "Create a custom theme",
        protect: true,
      },
    })
    .input(createThemeInput)
    .output(themeOutput)
    .mutation(async ({ ctx, input }) => {
      return themeService.createTheme(ctx.user.id, input);
    }),

  update: protectedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/{id}"),
        tags: TAGS,
        summary: "Update a custom theme",
        protect: true,
      },
    })
    .input(updateThemeInput.extend({ id: themeIdInput.shape.id }))
    .output(themeOutput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return themeService.updateTheme(id, ctx.user.id, data);
    }),

  delete: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/{id}"),
        tags: TAGS,
        summary: "Delete a custom theme",
        protect: true,
      },
    })
    .input(themeIdInput)
    .output(successOutput)
    .mutation(async ({ ctx, input }) => {
      return themeService.deleteTheme(input.id, ctx.user.id);
    }),
});

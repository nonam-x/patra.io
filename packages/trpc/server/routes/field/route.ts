import {
  createFieldInput,
  updateFieldInput,
  fieldOutput,
  fieldIdInput,
  reorderFieldsInput,
  fieldsArrayOutput,
  successOutput,
} from "./model";
import { fieldService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Fields"];
const getPath = generatePath("/fields");

export const fieldRouter = router({
  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/"),
        tags: TAGS,
        summary: "Add a field to a form",
        protect: true,
      },
    })
    .input(createFieldInput)
    .output(fieldOutput)
    .mutation(async ({ ctx, input }) => {
      return fieldService.createField(ctx.user.id, input);
    }),

  update: protectedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/{id}"),
        tags: TAGS,
        summary: "Update a field",
        protect: true,
      },
    })
    .input(updateFieldInput.extend({ id: fieldIdInput.shape.id }))
    .output(fieldOutput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return fieldService.updateField(id, ctx.user.id, data);
    }),

  delete: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/{id}"),
        tags: TAGS,
        summary: "Delete a field",
        protect: true,
      },
    })
    .input(fieldIdInput)
    .output(successOutput)
    .mutation(async ({ ctx, input }) => {
      return fieldService.deleteField(input.id, ctx.user.id);
    }),

  reorder: protectedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/reorder"),
        tags: TAGS,
        summary: "Reorder fields within a form",
        protect: true,
      },
    })
    .input(reorderFieldsInput)
    .output(fieldsArrayOutput)
    .mutation(async ({ ctx, input }) => {
      return fieldService.reorderFields(ctx.user.id, input);
    }),
});

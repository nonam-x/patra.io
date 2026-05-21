import {
  createFormInput,
  updateFormInput,
  formOutput,
  formDetailOutput,
  formIdInput,
  listFormsInput,
  listFormsOutput,
  successOutput,
} from "./model";
import { formService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Forms"];
const getPath = generatePath("/forms");

export const formRouter = router({
  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/"),
        tags: TAGS,
        summary: "Create a new form",
        protect: true,
      },
    })
    .input(createFormInput)
    .output(formOutput)
    .mutation(async ({ ctx, input }) => {
      return formService.createForm(ctx.user.id, input);
    }),

  getById: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/{id}"),
        tags: TAGS,
        summary: "Get form by ID with fields and theme",
        protect: true,
      },
    })
    .input(formIdInput)
    .output(formDetailOutput)
    .query(async ({ input }) => {
      const form = await formService.getFormById(input.id);
      if (!form) throw new Error("Form not found");
      return form;
    }),

  update: protectedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/{id}"),
        tags: TAGS,
        summary: "Update a form",
        protect: true,
      },
    })
    .input(updateFormInput.extend({ id: formIdInput.shape.id }))
    .output(formOutput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return formService.updateForm(id, ctx.user.id, data);
    }),

  delete: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/{id}"),
        tags: TAGS,
        summary: "Delete a form",
        protect: true,
      },
    })
    .input(formIdInput)
    .output(successOutput)
    .mutation(async ({ ctx, input }) => {
      return formService.deleteForm(input.id, ctx.user.id);
    }),

  list: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/"),
        tags: TAGS,
        summary: "List creator's forms",
        protect: true,
      },
    })
    .input(listFormsInput)
    .output(listFormsOutput)
    .query(async ({ ctx, input }) => {
      return formService.listCreatorForms(ctx.user.id, input);
    }),

  publish: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/{id}/publish"),
        tags: TAGS,
        summary: "Publish a form",
        protect: true,
      },
    })
    .input(formIdInput)
    .output(formOutput)
    .mutation(async ({ ctx, input }) => {
      return formService.publishForm(input.id, ctx.user.id);
    }),

  unpublish: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/{id}/unpublish"),
        tags: TAGS,
        summary: "Unpublish a form",
        protect: true,
      },
    })
    .input(formIdInput)
    .output(formOutput)
    .mutation(async ({ ctx, input }) => {
      return formService.unpublishForm(input.id, ctx.user.id);
    }),

  preview: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/{id}/preview"),
        tags: TAGS,
        summary: "Preview a form (regardless of publish status)",
        protect: true,
      },
    })
    .input(formIdInput)
    .output(formDetailOutput)
    .query(async ({ ctx, input }) => {
      const form = await formService.getFormPreview(input.id, ctx.user.id);
      if (!form) throw new Error("Form not found");
      return form;
    }),

  duplicate: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/{id}/duplicate"),
        tags: TAGS,
        summary: "Duplicate a form",
        protect: true,
      },
    })
    .input(formIdInput)
    .output(formDetailOutput)
    .mutation(async ({ ctx, input }) => {
      const form = await formService.duplicateForm(input.id, ctx.user.id);
      if (!form) throw new Error("Failed to duplicate form");
      return form;
    }),
});

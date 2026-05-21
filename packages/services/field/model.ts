import { z } from "zod";

export const fieldTypeEnum = z.enum([
  "short_text",
  "long_text",
  "multiple_choice",
  "checkbox",
  "dropdown",
  "rating",
  "date",
  "email",
  "number",
  "file_upload",
  "welcome",
  "thank_you",
]);

export type FieldType = z.infer<typeof fieldTypeEnum>;

export const conditionalRuleSchema = z
  .object({
    showIf: z.object({
      fieldId: z.string().uuid(),
      operator: z.enum(["equals", "not_equals", "contains", "greater_than", "less_than"]),
      value: z.string(),
    }),
  })
  .optional();

export const createFieldInput = z.object({
  formId: z.string().uuid().describe("Form ID"),
  type: fieldTypeEnum.describe("Field type"),
  label: z.string().min(1).max(500).describe("Field label"),
  description: z.string().max(1000).optional(),
  placeholder: z.string().max(500).optional(),
  required: z.boolean().default(false),
  order: z.number().int().min(0),
  options: z.array(z.string()).optional(),
  validations: z
    .object({
      minLength: z.number().int().optional(),
      maxLength: z.number().int().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
    })
    .optional(),
  conditionalRules: conditionalRuleSchema,
  properties: z.record(z.string(), z.unknown()).optional(),
});

export type CreateFieldInputType = z.infer<typeof createFieldInput>;

export const updateFieldInput = z.object({
  type: fieldTypeEnum.optional(),
  label: z.string().min(1).max(500).optional(),
  description: z.string().max(1000).optional(),
  placeholder: z.string().max(500).optional(),
  required: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  options: z.array(z.string()).optional(),
  validations: z
    .object({
      minLength: z.number().int().optional(),
      maxLength: z.number().int().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
    })
    .optional(),
  conditionalRules: conditionalRuleSchema,
  properties: z.record(z.string(), z.unknown()).optional(),
});

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;

export const reorderFieldsInput = z.object({
  formId: z.string().uuid(),
  fieldIds: z.array(z.string().uuid()).min(1),
});

export type ReorderFieldsInputType = z.infer<typeof reorderFieldsInput>;

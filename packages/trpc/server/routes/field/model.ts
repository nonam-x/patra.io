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

export const createFieldInput = z.object({
  formId: z.string().uuid(),
  type: fieldTypeEnum,
  label: z.string().min(1).max(500),
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
  conditionalRules: z
    .object({
      showIf: z.object({
        fieldId: z.string().uuid(),
        operator: z.enum(["equals", "not_equals", "contains", "greater_than", "less_than"]),
        value: z.string(),
      }),
    })
    .optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
});

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
  conditionalRules: z
    .object({
      showIf: z.object({
        fieldId: z.string().uuid(),
        operator: z.enum(["equals", "not_equals", "contains", "greater_than", "less_than"]),
        value: z.string(),
      }),
    })
    .optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
});

export const fieldOutput = z.record(z.string(), z.unknown());

export const fieldIdInput = z.object({
  id: z.string().uuid(),
});

export const reorderFieldsInput = z.object({
  formId: z.string().uuid(),
  fieldIds: z.array(z.string().uuid()).min(1),
});

export const fieldsArrayOutput = z.array(z.record(z.string(), z.unknown()));

export const successOutput = z.object({
  success: z.boolean(),
});

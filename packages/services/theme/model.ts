import { z } from "zod";

export const createThemeInput = z.object({
  name: z.string().min(1).max(100).describe("Theme name"),
  colors: z
    .object({
      primary: z.string(),
      secondary: z.string(),
      background: z.string(),
      text: z.string(),
      accent: z.string(),
    })
    .describe("Color palette"),
  fontFamily: z.string().max(100).optional(),
  borderRadius: z.string().max(20).optional(),
});

export type CreateThemeInputType = z.infer<typeof createThemeInput>;

export const updateThemeInput = z.object({
  name: z.string().min(1).max(100).optional(),
  colors: z
    .object({
      primary: z.string(),
      secondary: z.string(),
      background: z.string(),
      text: z.string(),
      accent: z.string(),
    })
    .optional(),
  fontFamily: z.string().max(100).optional(),
  borderRadius: z.string().max(20).optional(),
});

export type UpdateThemeInputType = z.infer<typeof updateThemeInput>;

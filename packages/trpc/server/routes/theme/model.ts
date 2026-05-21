import { z } from "zod";

export const createThemeInput = z.object({
  name: z.string().min(1).max(100),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    text: z.string(),
    accent: z.string(),
  }),
  fontFamily: z.string().max(100).optional(),
  borderRadius: z.string().max(20).optional(),
});

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

export const themeOutput = z.record(z.string(), z.unknown());

export const themeIdInput = z.object({
  id: z.string().uuid(),
});

export const themesListOutput = z.array(z.record(z.string(), z.unknown()));

export const successOutput = z.object({
  success: z.boolean(),
});

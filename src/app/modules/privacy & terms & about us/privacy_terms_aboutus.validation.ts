import { z } from "zod";

export const zodPrivacySchema = z.object({
  body: z.object({
    privacy: z.string().optional(),
  }),
});

export const zodTermsSchema = z.object({
  body: z.object({
    terms: z.string().optional(),
  }),
});

export const zodAboutUsSchema = z.object({
  body: z.object({
    about: z.string().optional(),
  }),
});

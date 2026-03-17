import { z } from "zod";

export const updateConfigSchema = z.object({
  welcomeTitle: z.string().max(100).optional(),
  welcomeSubtitle: z.string().max(200).optional(),
  confirmButtonLabel: z.string().max(60).optional(),
  successTitle: z.string().max(100).optional(),
  duplicateTitle: z.string().max(100).optional(),
  notFoundTitle: z.string().max(100).optional(),
  notFoundMessage: z.string().max(300).optional(),
  autoResetSeconds: z.coerce.number().int().min(3).max(60).optional(),
  backgroundImageUrl: z.string().nullable().optional(),
  backgroundColorHex: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida")
    .nullable()
    .optional(),
  loadingImageUrl: z.string().nullable().optional(),
});

export type UpdateConfigType = z.infer<typeof updateConfigSchema>;

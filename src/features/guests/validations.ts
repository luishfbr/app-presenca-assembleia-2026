import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(3, "No mínimo 3 caracteres")
  .max(100, "No máximo 100 caracteres");

const documentSchema = z
  .string()
  .trim()
  .min(1, "Documento obrigatório")
  .max(20, "No máximo 20 caracteres");

const typeSchema = z.string().trim().min(1, "Tipo obrigatório");

export const createGuestSchema = z.object({
  name: nameSchema,
  document: documentSchema,
  type: typeSchema,
});

export const updateGuestSchema = createGuestSchema.partial();

export type CreateGuestType = z.infer<typeof createGuestSchema>;
export type UpdateGuestType = z.infer<typeof updateGuestSchema>;

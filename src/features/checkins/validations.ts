import { z } from "zod";

export const documentSchema = z.object({
  document: z
    .string()
    .regex(/^\d{11}$/, "CPF deve conter exatamente 11 dígitos numéricos"),
});

export type DocumentFormType = z.infer<typeof documentSchema>;

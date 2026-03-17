import { z } from "zod";

const usernameSchema = z
  .string()
  .trim()
  .min(5, "No mínimo 5 caracteres")
  .max(50, "No máximo 50 caracteres");

const passwordSchema = z
  .string()
  .min(8, { message: "No mínimo 8 caracteres" })
  .regex(/[A-Z]/, { message: "Pelo menos uma letra maiúscula" })
  .regex(/[a-z]/, { message: "Pelo menos uma letra minúscula" })
  .regex(/[^A-Za-z0-9]/, { message: "Pelo menos um caractere especial" });

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type LoginType = z.infer<typeof loginSchema>;

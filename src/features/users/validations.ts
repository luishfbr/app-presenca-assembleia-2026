import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(3, "No mínimo 3 caracteres")
  .max(100, "No máximo 100 caracteres");

const roleSchema = z.enum(["admin", "user"]);

const emailSchema = z.email("Email inválido");

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

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  role: roleSchema,
  password: passwordSchema,
  username: usernameSchema,
});

export const updateUserSchema = z.object({
  name: nameSchema,
  role: roleSchema,
  username: usernameSchema,
});

export type CreateUserType = z.infer<typeof createUserSchema>;
export type UpdateUserType = z.infer<typeof updateUserSchema>;

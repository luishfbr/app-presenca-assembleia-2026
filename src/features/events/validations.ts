import { z } from "zod";

export const createEventSchema = z
  .object({
    name: z.string().min(3, "Mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
    startDate: z.string().min(1, "Data de início obrigatória"),
    endDate: z.string().min(1, "Data de término obrigatória"),
  })
  .refine((d) => new Date(d.endDate) > new Date(d.startDate), {
    message: "Data de término deve ser após a data de início",
    path: ["endDate"],
  });

export const updateEventSchema = z
  .object({
    name: z.string().min(3, "Mínimo 3 caracteres").max(100, "Máximo 100 caracteres").optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (d) => {
      if (d.startDate && d.endDate) {
        return new Date(d.endDate) > new Date(d.startDate);
      }
      return true;
    },
    {
      message: "Data de término deve ser após a data de início",
      path: ["endDate"],
    },
  );

export type CreateEventType = z.infer<typeof createEventSchema>;
export type UpdateEventType = z.infer<typeof updateEventSchema>;

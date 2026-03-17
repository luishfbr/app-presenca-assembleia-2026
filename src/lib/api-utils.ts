import { z } from "zod";

export const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().max(100).default(""),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

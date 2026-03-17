import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url().startsWith("postgresql://"),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  ADMIN_EMAIL: z.email(),
  ADMIN_FULLNAME: z.string().min(1),
  // LGPD — chaves de criptografia (32 bytes cada, representados em 64 chars hex)
  ENCRYPTION_KEY: z.string().length(64, "ENCRYPTION_KEY deve ter 64 chars hex (32 bytes)"),
  HMAC_KEY: z.string().length(64, "HMAC_KEY deve ter 64 chars hex (32 bytes)"),
});

export const env = envSchema.parse(process.env);

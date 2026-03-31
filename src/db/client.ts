import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { schema } from "./schema";

export const db = drizzle({
  schema,
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: true },
  },
});

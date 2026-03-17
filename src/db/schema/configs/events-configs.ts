import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const eventsConfigs = pgTable("events-configs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

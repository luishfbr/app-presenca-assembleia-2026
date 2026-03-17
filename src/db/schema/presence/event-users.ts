import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-zod";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { z } from "zod";
import { events } from "./events";
import { users } from "../auth/users";

export const eventUsers = pgTable(
  "event_users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    eventId: text("event_id")
      .references(() => events.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [unique("event_users_event_id_user_id_idx").on(t.eventId, t.userId)],
);

export const eventUsersRelations = relations(eventUsers, ({ one }) => ({
  event: one(events, {
    fields: [eventUsers.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventUsers.userId],
    references: [users.id],
  }),
}));

export const selectEventUserSchema = createSelectSchema(eventUsers);
export const insertEventUserSchema = createInsertSchema(eventUsers).omit({
  id: true,
  createdAt: true,
});

export type EventUser = z.infer<typeof selectEventUserSchema>;
export type NewEventUser = z.infer<typeof insertEventUserSchema>;

import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { guests } from "./guests";
import { users } from "../auth/users";
import { events } from "./events";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const checkins = pgTable("checkins", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  eventId: text("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  guestId: text("guest_id")
    .references(() => guests.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),

  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const checkinsRelations = relations(checkins, ({ one }) => ({
  event: one(events, {
    fields: [checkins.eventId],
    references: [events.id],
  }),
  guest: one(guests, {
    fields: [checkins.guestId],
    references: [guests.id],
  }),
  user: one(users, {
    fields: [checkins.userId],
    references: [users.id],
  }),
}));

export const selectCheckinSchema = createSelectSchema(checkins);
export const insertCheckinSchema = createInsertSchema(checkins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateCheckinSchema = createUpdateSchema(checkins);

export type Checkin = z.infer<typeof selectCheckinSchema>;
export type NewCheckin = z.infer<typeof insertCheckinSchema>;
export type CheckinUpdate = z.infer<typeof updateCheckinSchema>;

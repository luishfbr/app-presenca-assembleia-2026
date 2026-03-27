import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { eventUsers } from "./event-users";
import { guests } from "./guests";
import { checkins } from "./checkins";

export const events = pgTable("events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const eventsRelations = relations(events, ({ many }) => ({
  eventUsers: many(eventUsers),
  guests: many(guests),
  checkins: many(checkins),
}));

export const selectEventSchema = createSelectSchema(events);
export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});
export const updateEventSchema = createUpdateSchema(events).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export type Event = z.infer<typeof selectEventSchema>;
export type NewEvent = z.infer<typeof insertEventSchema>;
export type EventUpdate = z.infer<typeof updateEventSchema>;

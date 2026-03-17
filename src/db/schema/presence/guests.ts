import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { checkins } from "./checkins";
import { events } from "./events";
import { z } from "zod";

export const guests = pgTable(
  "guests",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    eventId: text("event_id")
      .references(() => events.id, { onDelete: "cascade" })
      .notNull(),

    // Armazenado criptografado (AES-256-GCM). Descriptografar antes de exibir.
    name: text("name").notNull(),

    // Armazenado criptografado (AES-256-GCM). Descriptografar antes de exibir.
    document: text("document").notNull(),

    // HMAC-SHA256 do document (determinístico). Usado para:
    //   - Constraint UNIQUE por evento (garante sem expor o valor real)
    //   - Busca exata por documento dentro de um evento
    documentHash: text("document_hash").notNull(),

    type: text("type").notNull(),

    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    unique("guests_document_hash_event_id_idx").on(t.documentHash, t.eventId),
  ],
);

export const guestsRelations = relations(guests, ({ one, many }) => ({
  event: one(events, {
    fields: [guests.eventId],
    references: [events.id],
  }),
  checkins: many(checkins),
}));

export const selectGuestSchema = createSelectSchema(guests);
export const insertGuestSchema = createInsertSchema(guests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  documentHash: true, // calculado internamente no route, nunca vem do client
});
export const updateGuestSchema = createUpdateSchema(guests);

export type Guest = z.infer<typeof selectGuestSchema>;
export type NewGuest = z.infer<typeof insertGuestSchema>;
export type GuestUpdate = z.infer<typeof updateGuestSchema>;

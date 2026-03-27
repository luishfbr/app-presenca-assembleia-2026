import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const siteConfig = pgTable("site_config", {
  id: text("id").primaryKey().$defaultFn(() => "default"),
  welcomeTitle: text("welcome_title"),
  welcomeSubtitle: text("welcome_subtitle"),
  confirmButtonLabel: text("confirm_button_label"),
  successTitle: text("success_title"),
  duplicateTitle: text("duplicate_title"),
  notFoundTitle: text("not_found_title"),
  notFoundMessage: text("not_found_message"),
  autoResetSeconds: integer("auto_reset_seconds"),
  backgroundImageUrl: text("background_image_url"),
  backgroundColorHex: text("background_color_hex"),
  loadingImageUrl: text("loading_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const selectSiteConfigSchema = createSelectSchema(siteConfig);
export const insertSiteConfigSchema = createInsertSchema(siteConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateSiteConfigSchema = createUpdateSchema(siteConfig);

export type SiteConfig = z.infer<typeof selectSiteConfigSchema>;
export type NewSiteConfig = z.infer<typeof insertSiteConfigSchema>;
export type SiteConfigUpdate = z.infer<typeof updateSiteConfigSchema>;

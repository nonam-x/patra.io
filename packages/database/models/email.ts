import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const emailsTable = pgTable("emails", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id").references(() => formsTable.id, {
    onDelete: "cascade",
  }),

  /** Recipient email address */
  to: varchar("to", { length: 255 }).notNull(),

  /** Email subject line */
  subject: varchar("subject", { length: 500 }).notNull(),

  /** Email body content (plain text or HTML) */
  body: text("body").notNull(),

  /** "creator_notification" | "respondent_receipt" */
  type: varchar("type", { length: 50 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectEmail = typeof emailsTable.$inferSelect;
export type InsertEmail = typeof emailsTable.$inferInsert;

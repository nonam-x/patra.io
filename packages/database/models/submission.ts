import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";
import { usersTable } from "./user";
import { fieldsTable } from "./field";

export const submissionsTable = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, { onDelete: "cascade" }),

  /** null for anonymous / public submissions */
  respondentId: uuid("respondent_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),

  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),

  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at").defaultNow(),

  /** Extensible metadata: { browser, referrer, locale, ... } */
  metadata: jsonb("metadata"),
});

export const answersTable = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom(),

  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissionsTable.id, { onDelete: "cascade" }),

  fieldId: uuid("field_id")
    .notNull()
    .references(() => fieldsTable.id, { onDelete: "cascade" }),

  /** Serialized answer value — stored as text for uniform handling */
  value: text("value"),

  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectSubmission = typeof submissionsTable.$inferSelect;
export type InsertSubmission = typeof submissionsTable.$inferInsert;
export type SelectAnswer = typeof answersTable.$inferSelect;
export type InsertAnswer = typeof answersTable.$inferInsert;

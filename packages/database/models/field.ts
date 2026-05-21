import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const fieldsTable = pgTable("fields", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, { onDelete: "cascade" }),

  /**
   * Field type determines rendering & validation.
   * "short_text" | "long_text" | "multiple_choice" | "checkbox" |
   * "dropdown" | "rating" | "date" | "email" | "number" |
   * "file_upload" | "welcome" | "thank_you"
   */
  type: varchar("type", { length: 50 }).notNull(),

  label: text("label").notNull(),
  description: text("description"),
  placeholder: text("placeholder"),

  required: boolean("required").default(false).notNull(),

  /** Display ordering within the form */
  order: integer("order").notNull(),

  /** For choice-based fields: ["Option A", "Option B", ...] */
  options: jsonb("options"),

  /** Validation constraints: { minLength, maxLength, min, max, pattern } */
  validations: jsonb("validations"),

  /** Conditional display rules: { showIf: { fieldId, operator, value } } */
  conditionalRules: jsonb("conditional_rules"),

  /** Field-type-specific properties: { maxRating: 5, shape: "star", ... } */
  properties: jsonb("properties"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectField = typeof fieldsTable.$inferSelect;
export type InsertField = typeof fieldsTable.$inferInsert;

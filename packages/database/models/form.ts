import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { themesTable } from "./theme";

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),

  creatorId: uuid("creator_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),

  slug: varchar("slug", { length: 100 }).notNull().unique(),

  /** "public" | "unlisted" | "private" */
  visibility: varchar("visibility", { length: 20 }).default("public").notNull(),

  /** "draft" | "published" */
  status: varchar("status", { length: 20 }).default("draft").notNull(),

  themeId: uuid("theme_id").references(() => themesTable.id, {
    onDelete: "set null",
  }),

  /** Extensible settings: { maxResponses, closeDate, showProgressBar, ... } */
  settings: jsonb("settings").default({}),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;

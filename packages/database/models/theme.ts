import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const themesTable = pgTable("themes", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 100 }).notNull(),

  /** null = system-provided theme */
  creatorId: uuid("creator_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),

  /** { primary, secondary, background, text, accent } */
  colors: jsonb("colors").notNull(),

  fontFamily: varchar("font_family", { length: 100 }),
  borderRadius: varchar("border_radius", { length: 20 }),

  /** System themes cannot be deleted by users */
  isSystem: boolean("is_system").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectTheme = typeof themesTable.$inferSelect;
export type InsertTheme = typeof themesTable.$inferInsert;

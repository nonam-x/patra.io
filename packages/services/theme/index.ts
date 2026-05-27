import { CreateThemeInputType, UpdateThemeInputType } from "./model";
import { db, eq, or } from "@patra/database";
import { themesTable } from "@patra/database/schema";

class ThemeService {
  // ─── List ────────────────────────────────────────────

  public async listThemes(creatorId?: string) {
    if (creatorId) {
      // Return system themes + user's custom themes
      return db
        .select()
        .from(themesTable)
        .where(
          or(
            eq(themesTable.isSystem, true),
            eq(themesTable.creatorId, creatorId),
          ),
        )
        .orderBy(themesTable.name);
    }

    // Public: system themes only
    return db
      .select()
      .from(themesTable)
      .where(eq(themesTable.isSystem, true))
      .orderBy(themesTable.name);
  }

  // ─── Get by ID ───────────────────────────────────────

  public async getThemeById(themeId: string) {
    const [theme] = await db
      .select()
      .from(themesTable)
      .where(eq(themesTable.id, themeId));
    return theme ?? null;
  }

  // ─── Create ──────────────────────────────────────────

  public async createTheme(creatorId: string, data: CreateThemeInputType) {
    const [theme] = await db
      .insert(themesTable)
      .values({
        name: data.name,
        creatorId,
        colors: data.colors,
        fontFamily: data.fontFamily,
        borderRadius: data.borderRadius,
        isSystem: false,
      })
      .returning();

    return theme!;
  }

  // ─── Update ──────────────────────────────────────────

  public async updateTheme(
    themeId: string,
    creatorId: string,
    data: UpdateThemeInputType,
  ) {
    const theme = await this.getThemeById(themeId);
    if (!theme) throw new Error("Theme not found");
    if (theme.isSystem) throw new Error("Cannot modify a system theme");
    if (theme.creatorId !== creatorId) {
      throw new Error("Unauthorized: You don't own this theme");
    }

    const [updated] = await db
      .update(themesTable)
      .set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.colors !== undefined && { colors: data.colors }),
        ...(data.fontFamily !== undefined && { fontFamily: data.fontFamily }),
        ...(data.borderRadius !== undefined && {
          borderRadius: data.borderRadius,
        }),
      })
      .where(eq(themesTable.id, themeId))
      .returning();

    return updated!;
  }

  // ─── Delete ──────────────────────────────────────────

  public async deleteTheme(themeId: string, creatorId: string) {
    const theme = await this.getThemeById(themeId);
    if (!theme) throw new Error("Theme not found");
    if (theme.isSystem) throw new Error("Cannot delete a system theme");
    if (theme.creatorId !== creatorId) {
      throw new Error("Unauthorized: You don't own this theme");
    }

    await db.delete(themesTable).where(eq(themesTable.id, themeId));
    return { success: true };
  }
}

export default ThemeService;

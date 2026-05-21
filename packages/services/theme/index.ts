import { CreateThemeInputType, UpdateThemeInputType } from "./model";
import { db, eq, or } from "@repo/database";
import { themesTable } from "@repo/database/schema";

export const DHURANDHAR_THEME_ID = "d40b0000-0000-0000-0000-000000000001";

export const DHURANDHAR_THEME = {
  id: DHURANDHAR_THEME_ID,
  name: "Dhurandhar (Tactical)",
  colors: {
    background: "#0f0f0f",
    card: "#171717",
    primary: "#c49b63",
    secondary: "#171717",
    text: "#f5f1e8",
    accent: "#8b1e1e",
    muted: "#7d7d7d",
  },
  fontFamily: "IBM Plex Mono",
  borderRadius: "0px",
  isSystem: true,
  creatorId: null,
  createdAt: new Date("2026-05-21T00:00:00.000Z"),
  updatedAt: new Date("2026-05-21T00:00:00.000Z"),
};

class ThemeService {
  // ─── List ────────────────────────────────────────────

  public async listThemes(creatorId?: string) {
    let dbThemes: any[] = [];
    if (creatorId) {
      // Return system themes + user's custom themes
      dbThemes = await db
        .select()
        .from(themesTable)
        .where(
          or(
            eq(themesTable.isSystem, true),
            eq(themesTable.creatorId, creatorId),
          ),
        )
        .orderBy(themesTable.name);
    } else {
      // Public: system themes only
      dbThemes = await db
        .select()
        .from(themesTable)
        .where(eq(themesTable.isSystem, true))
        .orderBy(themesTable.name);
    }

    const hasDhurandhar = dbThemes.some(
      (t) => t.id === DHURANDHAR_THEME_ID || t.name === "Dhurandhar (Tactical)"
    );
    if (!hasDhurandhar) {
      return [DHURANDHAR_THEME, ...dbThemes];
    }
    return dbThemes;
  }

  // ─── Get by ID ───────────────────────────────────────

  public async getThemeById(themeId: string) {
    if (themeId === DHURANDHAR_THEME_ID) {
      return DHURANDHAR_THEME;
    }
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


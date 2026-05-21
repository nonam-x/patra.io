import {
  CreateFormInputType,
  UpdateFormInputType,
  PaginationInputType,
} from "./model";
import { db, eq, and, or, like, desc, sql, count } from "@repo/database";
import {
  formsTable,
  fieldsTable,
  themesTable,
  submissionsTable,
} from "@repo/database/schema";
import { randomBytes } from "node:crypto";
import { DHURANDHAR_THEME, DHURANDHAR_THEME_ID } from "../theme";

class FormService {
  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      randomBytes(4).toString("hex")
    );
  }

  // ─── CRUD ────────────────────────────────────────────

  public async createForm(creatorId: string, data: CreateFormInputType) {
    const slug = this.generateSlug(data.title);

    const [form] = await db
      .insert(formsTable)
      .values({
        creatorId,
        title: data.title,
        description: data.description,
        slug,
        visibility: data.visibility ?? "public",
        themeId: data.themeId,
        settings: data.settings ?? {},
      })
      .returning();

    return form!;
  }

  public async getFormById(formId: string) {
    const [form] = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (!form) return null;

    const fields = await db
      .select()
      .from(fieldsTable)
      .where(eq(fieldsTable.formId, formId))
      .orderBy(fieldsTable.order);

    let theme = null;
    if (form.themeId) {
      if (form.themeId === DHURANDHAR_THEME_ID) {
        theme = DHURANDHAR_THEME;
      } else {
        const [t] = await db
          .select()
          .from(themesTable)
          .where(eq(themesTable.id, form.themeId));
        theme = t ?? null;
      }
    }

    return { ...form, fields, theme };
  }

  public async getFormBySlug(slug: string) {
    const [form] = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.slug, slug));

    if (!form) return null;

    const fields = await db
      .select()
      .from(fieldsTable)
      .where(eq(fieldsTable.formId, form.id))
      .orderBy(fieldsTable.order);

    let theme = null;
    if (form.themeId) {
      if (form.themeId === DHURANDHAR_THEME_ID) {
        theme = DHURANDHAR_THEME;
      } else {
        const [t] = await db
          .select()
          .from(themesTable)
          .where(eq(themesTable.id, form.themeId));
        theme = t ?? null;
      }
    }

    return { ...form, fields, theme };
  }

  public async updateForm(
    formId: string,
    creatorId: string,
    data: UpdateFormInputType,
  ) {
    const form = await this.assertOwnership(formId, creatorId);

    const [updated] = await db
      .update(formsTable)
      .set({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.visibility !== undefined && { visibility: data.visibility }),
        ...(data.themeId !== undefined && { themeId: data.themeId }),
        ...(data.settings !== undefined && { settings: data.settings }),
      })
      .where(eq(formsTable.id, formId))
      .returning();

    return updated!;
  }

  public async deleteForm(formId: string, creatorId: string) {
    await this.assertOwnership(formId, creatorId);
    await db.delete(formsTable).where(eq(formsTable.id, formId));
    return { success: true };
  }

  // ─── Listing ─────────────────────────────────────────

  public async listCreatorForms(
    creatorId: string,
    pagination: PaginationInputType,
  ) {
    const { page, limit, search } = pagination;
    const offset = (page - 1) * limit;

    const conditions = [eq(formsTable.creatorId, creatorId)];
    if (search) {
      conditions.push(like(formsTable.title, `%${search}%`));
    }

    const whereClause =
      conditions.length > 1 ? and(...conditions) : conditions[0]!;

    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        slug: formsTable.slug,
        visibility: formsTable.visibility,
        status: formsTable.status,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
        responseCount: sql<number>`(
          SELECT COUNT(*) FROM submissions
          WHERE submissions.form_id = ${formsTable.id}
        )`.as("response_count"),
      })
      .from(formsTable)
      .where(whereClause)
      .orderBy(desc(formsTable.createdAt))
      .limit(limit)
      .offset(offset);

    const [totalResult] = await db
      .select({ total: count() })
      .from(formsTable)
      .where(whereClause);

    return {
      forms,
      pagination: {
        page,
        limit,
        total: totalResult?.total ?? 0,
        totalPages: Math.ceil((totalResult?.total ?? 0) / limit),
      },
    };
  }

  // ─── Publish / Unpublish ─────────────────────────────

  public async publishForm(formId: string, creatorId: string) {
    await this.assertOwnership(formId, creatorId);

    // Ensure form has at least one non-welcome/thank_you field
    const fields = await db
      .select()
      .from(fieldsTable)
      .where(eq(fieldsTable.formId, formId));

    const contentFields = fields.filter(
      (f) => f.type !== "welcome" && f.type !== "thank_you",
    );
    if (contentFields.length === 0) {
      throw new Error(
        "Cannot publish a form without at least one content field",
      );
    }

    const [updated] = await db
      .update(formsTable)
      .set({ status: "published" })
      .where(eq(formsTable.id, formId))
      .returning();

    return updated!;
  }

  public async unpublishForm(formId: string, creatorId: string) {
    await this.assertOwnership(formId, creatorId);

    const [updated] = await db
      .update(formsTable)
      .set({ status: "draft" })
      .where(eq(formsTable.id, formId))
      .returning();

    return updated!;
  }

  // ─── Preview ─────────────────────────────────────────

  public async getFormPreview(formId: string, creatorId: string) {
    await this.assertOwnership(formId, creatorId);
    return this.getFormById(formId);
  }

  // ─── Explore (Public) ────────────────────────────────

  public async getPublicForms(pagination: PaginationInputType) {
    const { page, limit, search } = pagination;
    const offset = (page - 1) * limit;

    const conditions = [
      eq(formsTable.status, "published"),
      eq(formsTable.visibility, "public"),
    ];
    if (search) {
      conditions.push(like(formsTable.title, `%${search}%`));
    }

    const whereClause = and(...conditions);

    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        slug: formsTable.slug,
        createdAt: formsTable.createdAt,
        responseCount: sql<number>`(
          SELECT COUNT(*) FROM submissions
          WHERE submissions.form_id = ${formsTable.id}
        )`.as("response_count"),
      })
      .from(formsTable)
      .where(whereClause)
      .orderBy(desc(formsTable.createdAt))
      .limit(limit)
      .offset(offset);

    const [totalResult] = await db
      .select({ total: count() })
      .from(formsTable)
      .where(whereClause);

    return {
      forms,
      pagination: {
        page,
        limit,
        total: totalResult?.total ?? 0,
        totalPages: Math.ceil((totalResult?.total ?? 0) / limit),
      },
    };
  }

  // ─── Duplicate ───────────────────────────────────────

  public async duplicateForm(formId: string, creatorId: string) {
    const original = await this.getFormById(formId);
    if (!original) throw new Error("Form not found");

    // Only owners can duplicate their own forms
    if (original.creatorId !== creatorId) {
      throw new Error("Unauthorized: You don't own this form");
    }

    const newSlug = this.generateSlug(original.title + " Copy");
    const [newForm] = await db
      .insert(formsTable)
      .values({
        creatorId,
        title: `${original.title} (Copy)`,
        description: original.description,
        slug: newSlug,
        visibility: original.visibility,
        status: "draft",
        themeId: original.themeId,
        settings: original.settings,
      })
      .returning();

    // Duplicate all fields
    if (original.fields.length > 0) {
      await db.insert(fieldsTable).values(
        original.fields.map((f) => ({
          formId: newForm!.id,
          type: f.type,
          label: f.label,
          description: f.description,
          placeholder: f.placeholder,
          required: f.required,
          order: f.order,
          options: f.options,
          validations: f.validations,
          conditionalRules: f.conditionalRules,
          properties: f.properties,
        })),
      );
    }

    return this.getFormById(newForm!.id);
  }

  // ─── Helpers ─────────────────────────────────────────

  private async assertOwnership(formId: string, creatorId: string) {
    const [form] = await db
      .select({ id: formsTable.id, creatorId: formsTable.creatorId })
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (!form) throw new Error("Form not found");
    if (form.creatorId !== creatorId) {
      throw new Error("Unauthorized: You don't own this form");
    }
    return form;
  }
}

export default FormService;

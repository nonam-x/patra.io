import {
  CreateFieldInputType,
  UpdateFieldInputType,
  ReorderFieldsInputType,
} from "./model";
import { db, eq, and } from "@patra/database";
import { fieldsTable, formsTable } from "@patra/database/schema";

class FieldService {
  // ─── CRUD ────────────────────────────────────────────

  public async createField(creatorId: string, data: CreateFieldInputType) {
    await this.assertFormOwnership(data.formId, creatorId);

    const [field] = await db
      .insert(fieldsTable)
      .values({
        formId: data.formId,
        type: data.type,
        label: data.label,
        description: data.description,
        placeholder: data.placeholder,
        required: data.required,
        order: data.order,
        options: data.options,
        validations: data.validations,
        conditionalRules: data.conditionalRules,
        properties: data.properties,
      })
      .returning();

    return field!;
  }

  public async updateField(
    fieldId: string,
    creatorId: string,
    data: UpdateFieldInputType,
  ) {
    const field = await this.getFieldById(fieldId);
    if (!field) throw new Error("Field not found");

    await this.assertFormOwnership(field.formId, creatorId);

    const [updated] = await db
      .update(fieldsTable)
      .set({
        ...(data.type !== undefined && { type: data.type }),
        ...(data.label !== undefined && { label: data.label }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.placeholder !== undefined && {
          placeholder: data.placeholder,
        }),
        ...(data.required !== undefined && { required: data.required }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.options !== undefined && { options: data.options }),
        ...(data.validations !== undefined && {
          validations: data.validations,
        }),
        ...(data.conditionalRules !== undefined && {
          conditionalRules: data.conditionalRules,
        }),
        ...(data.properties !== undefined && { properties: data.properties }),
      })
      .where(eq(fieldsTable.id, fieldId))
      .returning();

    return updated!;
  }

  public async deleteField(fieldId: string, creatorId: string) {
    const field = await this.getFieldById(fieldId);
    if (!field) throw new Error("Field not found");

    await this.assertFormOwnership(field.formId, creatorId);
    await db.delete(fieldsTable).where(eq(fieldsTable.id, fieldId));

    return { success: true };
  }

  // ─── Reorder ─────────────────────────────────────────

  public async reorderFields(creatorId: string, data: ReorderFieldsInputType) {
    await this.assertFormOwnership(data.formId, creatorId);

    // Update each field's order based on position in array
    for (let i = 0; i < data.fieldIds.length; i++) {
      await db
        .update(fieldsTable)
        .set({ order: i })
        .where(
          and(
            eq(fieldsTable.id, data.fieldIds[i]!),
            eq(fieldsTable.formId, data.formId),
          ),
        );
    }

    // Return the reordered fields
    return this.getFieldsByFormId(data.formId);
  }

  // ─── Queries ─────────────────────────────────────────

  public async getFieldsByFormId(formId: string) {
    return db
      .select()
      .from(fieldsTable)
      .where(eq(fieldsTable.formId, formId))
      .orderBy(fieldsTable.order);
  }

  public async getFieldById(fieldId: string) {
    const [field] = await db
      .select()
      .from(fieldsTable)
      .where(eq(fieldsTable.id, fieldId));
    return field ?? null;
  }

  // ─── Helpers ─────────────────────────────────────────

  private async assertFormOwnership(formId: string, creatorId: string) {
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

export default FieldService;

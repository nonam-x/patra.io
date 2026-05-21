import {
  SubmitResponseInputType,
  SubmissionPaginationInputType,
} from "./model";
import { db, eq, desc, count, sql } from "@repo/database";
import {
  formsTable,
  fieldsTable,
  submissionsTable,
  answersTable,
} from "@repo/database/schema";

class SubmissionService {
  // ─── Submit Response (Public) ────────────────────────

  public async submitResponse(
    formSlug: string,
    data: SubmitResponseInputType,
    requestMeta?: { ipAddress?: string; userAgent?: string },
  ) {
    // Find form by slug
    const [form] = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.slug, formSlug));

    if (!form) throw new Error("Form not found");
    if (form.status !== "published") throw new Error("Form is not accepting responses");

    // Validate that all required fields are answered
    const fields = await db
      .select()
      .from(fieldsTable)
      .where(eq(fieldsTable.formId, form.id));

    const requiredFields = fields.filter(
      (f) =>
        f.required && f.type !== "welcome" && f.type !== "thank_you",
    );

    const answeredFieldIds = new Set(data.answers.map((a) => a.fieldId));
    for (const field of requiredFields) {
      if (!answeredFieldIds.has(field.id)) {
        throw new Error(`Required field "${field.label}" is missing`);
      }
    }

    // Validate answer field IDs belong to this form
    const fieldIds = new Set(fields.map((f) => f.id));
    for (const answer of data.answers) {
      if (!fieldIds.has(answer.fieldId)) {
        throw new Error(`Field ${answer.fieldId} does not belong to this form`);
      }
    }

    // Check max responses setting
    const settings = (form.settings ?? {}) as Record<string, unknown>;
    if (settings.maxResponses) {
      const [countResult] = await db
        .select({ total: count() })
        .from(submissionsTable)
        .where(eq(submissionsTable.formId, form.id));

      if ((countResult?.total ?? 0) >= (settings.maxResponses as number)) {
        throw new Error("This form has reached its maximum number of responses");
      }
    }

    // Create submission
    const [submission] = await db
      .insert(submissionsTable)
      .values({
        formId: form.id,
        ipAddress: requestMeta?.ipAddress,
        userAgent: requestMeta?.userAgent,
        metadata: data.metadata ?? {},
      })
      .returning();

    // Create answers
    if (data.answers.length > 0) {
      await db.insert(answersTable).values(
        data.answers.map((a) => ({
          submissionId: submission!.id,
          fieldId: a.fieldId,
          value: a.value,
        })),
      );
    }

    return { submissionId: submission!.id };
  }

  // ─── List Submissions (Protected) ────────────────────

  public async getSubmissions(
    formId: string,
    creatorId: string,
    pagination: SubmissionPaginationInputType,
  ) {
    await this.assertFormOwnership(formId, creatorId);

    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const submissions = await db
      .select()
      .from(submissionsTable)
      .where(eq(submissionsTable.formId, formId))
      .orderBy(desc(submissionsTable.completedAt))
      .limit(limit)
      .offset(offset);

    // Fetch answers for each submission
    const withAnswers = await Promise.all(
      submissions.map(async (sub) => {
        const answers = await db
          .select({
            id: answersTable.id,
            fieldId: answersTable.fieldId,
            value: answersTable.value,
          })
          .from(answersTable)
          .where(eq(answersTable.submissionId, sub.id));

        return { ...sub, answers };
      }),
    );

    const [totalResult] = await db
      .select({ total: count() })
      .from(submissionsTable)
      .where(eq(submissionsTable.formId, formId));

    return {
      submissions: withAnswers,
      pagination: {
        page,
        limit,
        total: totalResult?.total ?? 0,
        totalPages: Math.ceil((totalResult?.total ?? 0) / limit),
      },
    };
  }

  // ─── Get Single Submission ───────────────────────────

  public async getSubmissionById(submissionId: string, creatorId: string) {
    const [submission] = await db
      .select()
      .from(submissionsTable)
      .where(eq(submissionsTable.id, submissionId));

    if (!submission) throw new Error("Submission not found");

    await this.assertFormOwnership(submission.formId, creatorId);

    const answers = await db
      .select()
      .from(answersTable)
      .where(eq(answersTable.submissionId, submissionId));

    return { ...submission, answers };
  }

  // ─── Delete Submission ───────────────────────────────

  public async deleteSubmission(submissionId: string, creatorId: string) {
    const [submission] = await db
      .select()
      .from(submissionsTable)
      .where(eq(submissionsTable.id, submissionId));

    if (!submission) throw new Error("Submission not found");
    await this.assertFormOwnership(submission.formId, creatorId);

    await db
      .delete(submissionsTable)
      .where(eq(submissionsTable.id, submissionId));

    return { success: true };
  }

  // ─── CSV Export ──────────────────────────────────────

  public async exportSubmissionsCSV(formId: string, creatorId: string) {
    await this.assertFormOwnership(formId, creatorId);

    // Get fields for column headers
    const fields = await db
      .select()
      .from(fieldsTable)
      .where(eq(fieldsTable.formId, formId))
      .orderBy(fieldsTable.order);

    const contentFields = fields.filter(
      (f) => f.type !== "welcome" && f.type !== "thank_you",
    );

    // Get all submissions with answers
    const submissions = await db
      .select()
      .from(submissionsTable)
      .where(eq(submissionsTable.formId, formId))
      .orderBy(desc(submissionsTable.completedAt));

    const allAnswers = await db
      .select()
      .from(answersTable)
      .where(
        sql`${answersTable.submissionId} IN (
          SELECT id FROM submissions WHERE form_id = ${formId}
        )`,
      );

    // Build CSV
    const headers = [
      "Submission ID",
      "Submitted At",
      "IP Address",
      ...contentFields.map((f) => f.label),
    ];

    const escapeCSV = (val: string | null): string => {
      if (!val) return "";
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const rows = submissions.map((sub) => {
      const subAnswers = allAnswers.filter(
        (a) => a.submissionId === sub.id,
      );
      const answerMap = new Map(subAnswers.map((a) => [a.fieldId, a.value]));

      return [
        sub.id,
        sub.completedAt?.toISOString() ?? "",
        sub.ipAddress ?? "",
        ...contentFields.map((f) => escapeCSV(answerMap.get(f.id) ?? null)),
      ].join(",");
    });

    return [headers.map(escapeCSV).join(","), ...rows].join("\n");
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

export default SubmissionService;

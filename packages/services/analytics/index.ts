import { db, eq, sql, count, desc } from "@repo/database";
import {
  formsTable,
  fieldsTable,
  submissionsTable,
  answersTable,
} from "@repo/database/schema";

class AnalyticsService {
  // ─── Form Analytics ──────────────────────────────────

  public async getFormAnalytics(formId: string, creatorId: string) {
    await this.assertFormOwnership(formId, creatorId);

    // Total responses
    const [responseCount] = await db
      .select({ total: count() })
      .from(submissionsTable)
      .where(eq(submissionsTable.formId, formId));

    const totalResponses = responseCount?.total ?? 0;

    // Average completion time (seconds between startedAt and completedAt)
    const [avgTime] = await db
      .select({
        avg: sql<number>`AVG(
          EXTRACT(EPOCH FROM (${submissionsTable.completedAt} - ${submissionsTable.startedAt}))
        )`.as("avg_time"),
      })
      .from(submissionsTable)
      .where(
        sql`${submissionsTable.formId} = ${formId}
          AND ${submissionsTable.startedAt} IS NOT NULL
          AND ${submissionsTable.completedAt} IS NOT NULL`,
      );

    // Responses over time (last 30 days, daily)
    const responsesOverTime = await db
      .select({
        date: sql<string>`TO_CHAR(${submissionsTable.completedAt}, 'YYYY-MM-DD')`.as(
          "date",
        ),
        count: count(),
      })
      .from(submissionsTable)
      .where(
        sql`${submissionsTable.formId} = ${formId}
          AND ${submissionsTable.completedAt} >= NOW() - INTERVAL '30 days'`,
      )
      .groupBy(
        sql`TO_CHAR(${submissionsTable.completedAt}, 'YYYY-MM-DD')`,
      )
      .orderBy(
        sql`TO_CHAR(${submissionsTable.completedAt}, 'YYYY-MM-DD')`,
      );

    // Field breakdown — per-field answer distribution
    const fields = await db
      .select()
      .from(fieldsTable)
      .where(eq(fieldsTable.formId, formId))
      .orderBy(fieldsTable.order);

    const contentFields = fields.filter(
      (f) => f.type !== "welcome" && f.type !== "thank_you",
    );

    const fieldBreakdown = await Promise.all(
      contentFields.map(async (field) => {
        const distribution = await db
          .select({
            value: answersTable.value,
            count: count(),
          })
          .from(answersTable)
          .where(eq(answersTable.fieldId, field.id))
          .groupBy(answersTable.value)
          .orderBy(desc(count()))
          .limit(20); // Top 20 answers

        const totalForField = distribution.reduce(
          (sum, d) => sum + d.count,
          0,
        );

        return {
          fieldId: field.id,
          fieldLabel: field.label,
          fieldType: field.type,
          answerDistribution: distribution.map((d) => ({
            value: d.value ?? "(empty)",
            count: d.count,
            percentage:
              totalForField > 0
                ? Math.round((d.count / totalForField) * 10000) / 100
                : 0,
          })),
        };
      }),
    );

    return {
      totalResponses,
      completionRate: 100, // All stored submissions are completed
      avgCompletionTimeSeconds: avgTime?.avg ?? null,
      responsesOverTime: responsesOverTime.map((r) => ({
        date: r.date,
        count: r.count,
      })),
      fieldBreakdown,
    };
  }

  // ─── Creator Dashboard ───────────────────────────────

  public async getCreatorDashboard(creatorId: string) {
    // Total forms
    const [formCount] = await db
      .select({ total: count() })
      .from(formsTable)
      .where(eq(formsTable.creatorId, creatorId));

    // Published forms
    const [publishedCount] = await db
      .select({ total: count() })
      .from(formsTable)
      .where(
        sql`${formsTable.creatorId} = ${creatorId} AND ${formsTable.status} = 'published'`,
      );

    // Total responses across all forms
    const [totalResponseCount] = await db
      .select({ total: count() })
      .from(submissionsTable)
      .where(
        sql`${submissionsTable.formId} IN (
          SELECT id FROM forms WHERE creator_id = ${creatorId}
        )`,
      );

    // Recent forms with response counts
    const recentForms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        status: formsTable.status,
        createdAt: formsTable.createdAt,
        responseCount: sql<number>`(
          SELECT COUNT(*) FROM submissions
          WHERE submissions.form_id = ${formsTable.id}
        )`.as("response_count"),
      })
      .from(formsTable)
      .where(eq(formsTable.creatorId, creatorId))
      .orderBy(desc(formsTable.createdAt))
      .limit(5);

    return {
      totalForms: formCount?.total ?? 0,
      totalResponses: totalResponseCount?.total ?? 0,
      publishedForms: publishedCount?.total ?? 0,
      recentForms: recentForms.map((f) => ({
        id: f.id,
        title: f.title,
        status: f.status,
        responseCount: f.responseCount,
        createdAt: f.createdAt?.toISOString() ?? null,
      })),
    };
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

export default AnalyticsService;

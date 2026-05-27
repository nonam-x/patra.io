import { EmailLogInputType } from "./model";
import { db, eq, desc, count, sql, inArray } from "@patra/database";
import {
  emailsTable,
  formsTable,
  usersTable,
} from "@patra/database/schema";
import { logger } from "@patra/logger";

class EmailService {
  /**
   * Simulate sending an email by logging it to the database and console.
   * In production, this would integrate with Resend, SendGrid, etc.
   */
  public async sendEmail(opts: {
    formId: string;
    to: string;
    subject: string;
    body: string;
    type: "creator_notification" | "respondent_receipt";
  }) {
    logger.info(
      `📧 [Simulated Email] To: ${opts.to} | Subject: ${opts.subject} | Type: ${opts.type}`,
    );

    const [email] = await db
      .insert(emailsTable)
      .values({
        formId: opts.formId,
        to: opts.to,
        subject: opts.subject,
        body: opts.body,
        type: opts.type,
      })
      .returning();

    return email!;
  }

  /**
   * Notify the form creator that a new submission was received.
   */
  public async notifyCreatorOfSubmission(
    formId: string,
    formTitle: string,
    submissionId: string,
  ) {
    // Fetch the creator's email
    const [form] = await db
      .select({
        creatorId: formsTable.creatorId,
      })
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (!form) return;

    const [creator] = await db
      .select({ email: usersTable.email, name: usersTable.name })
      .from(usersTable)
      .where(eq(usersTable.id, form.creatorId));

    if (!creator) return;

    const subject = `🔔 New response on "${formTitle}"`;
    const body = [
      `Hi ${creator.name},`,
      ``,
      `Your form "${formTitle}" just received a new submission.`,
      ``,
      `Submission ID: ${submissionId}`,
      `Time: ${new Date().toISOString()}`,
      ``,
      `View the response in your Patra dashboard:`,
      `https://patra.io/forms/${formId}/analytics`,
      ``,
      `— Patra.io Notifications`,
    ].join("\n");

    await this.sendEmail({
      formId,
      to: creator.email,
      subject,
      body,
      type: "creator_notification",
    });
  }

  /**
   * Send a receipt/thank-you email to the respondent (if they provided an email).
   */
  public async sendRespondentReceipt(
    formId: string,
    formTitle: string,
    respondentEmail: string,
    answers: { label: string; value: string }[],
  ) {
    const subject = `✅ Your response to "${formTitle}" was recorded`;
    const answerSummary = answers
      .map((a) => `• ${a.label}: ${a.value}`)
      .join("\n");

    const body = [
      `Thank you for completing "${formTitle}"!`,
      ``,
      `Here's a copy of your answers:`,
      ``,
      answerSummary,
      ``,
      `If you have any questions, contact the form creator directly.`,
      ``,
      `— Patra.io`,
    ].join("\n");

    await this.sendEmail({
      formId,
      to: respondentEmail,
      subject,
      body,
      type: "respondent_receipt",
    });
  }

  /**
   * List email logs for a creator (scoped to their forms).
   */
  public async getEmailLogs(creatorId: string, pagination: EmailLogInputType) {
    const { page, limit, formId } = pagination;
    const offset = (page - 1) * limit;

    // Get all form IDs owned by this creator
    const creatorForms = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(eq(formsTable.creatorId, creatorId));

    const formIds = creatorForms.map((f) => f.id);
    if (formIds.length === 0) {
      return {
        emails: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }

    // Build query - if formId filter provided, use it; else use all creator forms
    const targetFormIds = formId ? [formId] : formIds;

    const emails = await db
      .select()
      .from(emailsTable)
      .where(inArray(emailsTable.formId, targetFormIds))
      .orderBy(desc(emailsTable.createdAt))
      .limit(limit)
      .offset(offset);

    const [totalResult] = await db
      .select({ total: count() })
      .from(emailsTable)
      .where(inArray(emailsTable.formId, targetFormIds));

    return {
      emails,
      pagination: {
        page,
        limit,
        total: totalResult?.total ?? 0,
        totalPages: Math.ceil((totalResult?.total ?? 0) / limit),
      },
    };
  }
}

export default EmailService;

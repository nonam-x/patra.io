import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "./env";
import {
  usersTable,
  themesTable,
  formsTable,
  fieldsTable,
  submissionsTable,
  answersTable,
} from "./schema";
import { createHmac, randomBytes } from "node:crypto";

const sql = neon(env.DATABASE_URL);
const db = drizzle({ client: sql });

function hashPassword(password: string, salt: string): string {
  return createHmac("sha256", salt).update(password).digest("hex");
}

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    randomBytes(4).toString("hex")
  );
}

async function seed() {
  console.log("🌱 Seeding Patra.io database...\n");

  // ─── 1. Themes ─────────────────────────────────────────
  console.log("  Creating system themes...");
  const systemThemes = await db
    .insert(themesTable)
    .values([
      {
        name: "Modern Gradient",
        colors: {
          primary: "#6366f1",
          secondary: "#8b5cf6",
          background: "#ffffff",
          text: "#1e293b",
          accent: "#f43f5e",
        },
        fontFamily: "Inter",
        borderRadius: "12px",
        isSystem: true,
      },
      {
        name: "Classic Professional",
        colors: {
          primary: "#1e40af",
          secondary: "#3b82f6",
          background: "#f8fafc",
          text: "#0f172a",
          accent: "#f59e0b",
        },
        fontFamily: "Roboto",
        borderRadius: "8px",
        isSystem: true,
      },
      {
        name: "Dark Elegant",
        colors: {
          primary: "#a78bfa",
          secondary: "#c084fc",
          background: "#0f172a",
          text: "#f1f5f9",
          accent: "#fb923c",
        },
        fontFamily: "Outfit",
        borderRadius: "16px",
        isSystem: true,
      },
      {
        name: "Minimalist Editorial",
        colors: {
          primary: "#111111",
          secondary: "#f5f5f7",
          background: "#fafafb",
          text: "#1c1c1e",
          accent: "#86868b",
        },
        fontFamily: "Playfair Display",
        borderRadius: "2px",
        isSystem: true,
      },
      {
        name: "Glassmorphism Aurora",
        colors: {
          primary: "#d8b4fe",
          secondary: "#1e1b4b",
          background: "#090514",
          text: "#f8fafc",
          accent: "#818cf8",
        },
        fontFamily: "Plus Jakarta Sans",
        borderRadius: "16px",
        isSystem: true,
      },
      {
        name: "Cyberpunk Terminal",
        colors: {
          primary: "#39ff14",
          secondary: "#0d0d0d",
          background: "#050505",
          text: "#00ff66",
          accent: "#ff007f",
        },
        fontFamily: "Share Tech Mono",
        borderRadius: "0px",
        isSystem: true,
      },
      {
        name: "SaaS Dashboard Hub",
        colors: {
          primary: "#4f46e5",
          secondary: "#ffffff",
          background: "#f3f4f6",
          text: "#1f2937",
          accent: "#6366f1",
        },
        fontFamily: "Space Grotesk",
        borderRadius: "8px",
        isSystem: true,
      },
      {
        name: "Playful Bubblegum",
        colors: {
          primary: "#ff2a85",
          secondary: "#ffe033",
          background: "#fffdf0",
          text: "#5c2a18",
          accent: "#ff6b00",
        },
        fontFamily: "Outfit",
        borderRadius: "28px",
        isSystem: true,
      },
    ])
    .returning();

  const modernTheme = systemThemes.find((t) => t.name === "Modern Gradient");
  const classicTheme = systemThemes.find((t) => t.name === "Classic Professional");
  const darkTheme = systemThemes.find((t) => t.name === "Dark Elegant");

  console.log(`  ✅ Created ${systemThemes.length} system themes`);

  // ─── 2. Demo User ──────────────────────────────────────
  console.log("  Creating demo user...");
  const salt = randomBytes(16).toString("hex");
  const [demoUser] = await db
    .insert(usersTable)
    .values({
      name: "Patra Demo",
      email: "demo@patra.io",
      password: hashPassword("password123", salt),
      salt,
      role: "creator",
      plan: "pro",
    })
    .returning();

  console.log(`  ✅ Created demo user: demo@patra.io / password123`);

  // ─── 3. Sample Forms ───────────────────────────────────
  console.log("  Creating sample forms...");

  // Form 1: Customer Feedback Survey
  const [feedbackForm] = await db
    .insert(formsTable)
    .values({
      creatorId: demoUser!.id,
      title: "Customer Feedback Survey",
      description:
        "Help us improve our product by sharing your experience and suggestions.",
      slug: generateSlug("customer-feedback-survey"),
      visibility: "public",
      status: "published",
      themeId: modernTheme!.id,
      settings: {
        showProgressBar: true,
        allowMultipleSubmissions: false,
      },
    })
    .returning();

  const feedbackFields = await db
    .insert(fieldsTable)
    .values([
      {
        formId: feedbackForm!.id,
        type: "welcome",
        label: "Welcome to our Feedback Survey! 🎉",
        description:
          "Your feedback helps us build a better product. This takes about 2 minutes.",
        order: 0,
      },
      {
        formId: feedbackForm!.id,
        type: "rating",
        label: "How would you rate your overall experience?",
        required: true,
        order: 1,
        properties: { maxRating: 5, shape: "star" },
      },
      {
        formId: feedbackForm!.id,
        type: "multiple_choice",
        label: "Which features do you use most?",
        required: true,
        order: 2,
        options: [
          "Form Builder",
          "Analytics Dashboard",
          "Templates",
          "API Integration",
          "CSV Export",
        ],
      },
      {
        formId: feedbackForm!.id,
        type: "dropdown",
        label: "How did you hear about us?",
        order: 3,
        options: [
          "Search Engine",
          "Social Media",
          "Friend/Colleague",
          "Blog Post",
          "Other",
        ],
      },
      {
        formId: feedbackForm!.id,
        type: "long_text",
        label: "What improvements would you like to see?",
        placeholder: "Tell us your ideas...",
        order: 4,
        validations: { maxLength: 1000 },
      },
      {
        formId: feedbackForm!.id,
        type: "email",
        label: "Your email (optional, for follow-up)",
        placeholder: "you@example.com",
        order: 5,
      },
      {
        formId: feedbackForm!.id,
        type: "thank_you",
        label: "Thank you for your feedback! 🙏",
        description: "We truly appreciate you taking the time to help us improve.",
        order: 6,
      },
    ])
    .returning();

  // Form 2: Event Registration
  const [eventForm] = await db
    .insert(formsTable)
    .values({
      creatorId: demoUser!.id,
      title: "Tech Conference 2026 Registration",
      description:
        "Register for the biggest tech conference of the year. Limited spots available!",
      slug: generateSlug("tech-conference-2026"),
      visibility: "public",
      status: "published",
      themeId: classicTheme!.id,
      settings: {
        showProgressBar: true,
        maxResponses: 500,
      },
    })
    .returning();

  const eventFields = await db
    .insert(fieldsTable)
    .values([
      {
        formId: eventForm!.id,
        type: "welcome",
        label: "Tech Conference 2026 🚀",
        description:
          "Join industry leaders for 3 days of talks, workshops, and networking.",
        order: 0,
      },
      {
        formId: eventForm!.id,
        type: "short_text",
        label: "Full Name",
        placeholder: "John Doe",
        required: true,
        order: 1,
        validations: { minLength: 2, maxLength: 100 },
      },
      {
        formId: eventForm!.id,
        type: "email",
        label: "Email Address",
        placeholder: "john@company.com",
        required: true,
        order: 2,
      },
      {
        formId: eventForm!.id,
        type: "short_text",
        label: "Company / Organization",
        placeholder: "Acme Inc.",
        order: 3,
      },
      {
        formId: eventForm!.id,
        type: "dropdown",
        label: "Which track interests you most?",
        required: true,
        order: 4,
        options: [
          "AI & Machine Learning",
          "Web Development",
          "Cloud Infrastructure",
          "Mobile Development",
          "DevOps & Security",
        ],
      },
      {
        formId: eventForm!.id,
        type: "checkbox",
        label: "Which days can you attend?",
        required: true,
        order: 5,
        options: [
          "Day 1 - Keynotes (Mon)",
          "Day 2 - Workshops (Tue)",
          "Day 3 - Hackathon (Wed)",
        ],
      },
      {
        formId: eventForm!.id,
        type: "multiple_choice",
        label: "Dietary requirements",
        order: 6,
        options: ["None", "Vegetarian", "Vegan", "Halal", "Gluten-free"],
      },
      {
        formId: eventForm!.id,
        type: "thank_you",
        label: "You're registered! 🎉",
        description:
          "Check your email for confirmation details. See you at the conference!",
        order: 7,
      },
    ])
    .returning();

  // Form 3: Job Application (unlisted, draft)
  const [jobForm] = await db
    .insert(formsTable)
    .values({
      creatorId: demoUser!.id,
      title: "Senior Developer Application",
      description:
        "Apply for our Senior Developer position. We're looking for passionate engineers.",
      slug: generateSlug("senior-developer-application"),
      visibility: "unlisted",
      status: "draft",
      themeId: darkTheme!.id,
      settings: {},
    })
    .returning();

  await db.insert(fieldsTable).values([
    {
      formId: jobForm!.id,
      type: "short_text",
      label: "Full Name",
      required: true,
      order: 0,
    },
    {
      formId: jobForm!.id,
      type: "email",
      label: "Email",
      required: true,
      order: 1,
    },
    {
      formId: jobForm!.id,
      type: "number",
      label: "Years of Experience",
      required: true,
      order: 2,
      validations: { min: 0, max: 50 },
    },
    {
      formId: jobForm!.id,
      type: "multiple_choice",
      label: "Primary Programming Language",
      required: true,
      order: 3,
      options: ["TypeScript", "Python", "Go", "Rust", "Java", "Other"],
    },
    {
      formId: jobForm!.id,
      type: "long_text",
      label: "Why do you want to join us?",
      required: true,
      order: 4,
      validations: { minLength: 50, maxLength: 2000 },
    },
    {
      formId: jobForm!.id,
      type: "short_text",
      label: "Portfolio / GitHub URL",
      placeholder: "https://github.com/...",
      order: 5,
    },
  ]);

  console.log(`  ✅ Created 3 sample forms with fields`);

  // ─── 4. Sample Submissions ─────────────────────────────
  console.log("  Creating sample submissions...");

  const sampleNames = [
    "Alice Johnson",
    "Bob Smith",
    "Carol Williams",
    "David Brown",
    "Emma Davis",
    "Frank Miller",
    "Grace Wilson",
    "Henry Moore",
    "Ivy Taylor",
    "Jack Anderson",
    "Karen Thomas",
    "Leo Jackson",
    "Mia White",
    "Noah Harris",
    "Olivia Martin",
    "Peter Garcia",
    "Quinn Martinez",
    "Rachel Robinson",
    "Sam Clark",
    "Tina Rodriguez",
  ];

  const ratingField = feedbackFields[1]!;
  const featureField = feedbackFields[2]!;
  const sourceField = feedbackFields[3]!;
  const improvementField = feedbackFields[4]!;

  // 50 submissions for feedback form
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const submittedAt = new Date();
    submittedAt.setDate(submittedAt.getDate() - daysAgo);
    submittedAt.setHours(Math.floor(Math.random() * 24));

    const [submission] = await db
      .insert(submissionsTable)
      .values({
        formId: feedbackForm!.id,
        ipAddress: `192.168.1.${(i % 254) + 1}`,
        userAgent: "Mozilla/5.0 (Seed Data)",
        completedAt: submittedAt,
        metadata: { source: "seed" },
      })
      .returning();

    const rating = Math.floor(Math.random() * 3) + 3; // 3-5
    const features = ["Form Builder", "Analytics Dashboard", "Templates"];
    const sources = [
      "Search Engine",
      "Social Media",
      "Friend/Colleague",
      "Blog Post",
    ];
    const improvements = [
      "Better analytics visualizations",
      "More template options",
      "Faster page load times",
      "Dark mode support",
      "Mobile app",
      "Team collaboration features",
      "Webhook integrations",
      "Custom CSS support",
    ];

    await db.insert(answersTable).values([
      {
        submissionId: submission!.id,
        fieldId: ratingField.id,
        value: String(rating),
      },
      {
        submissionId: submission!.id,
        fieldId: featureField.id,
        value: features[Math.floor(Math.random() * features.length)]!,
      },
      {
        submissionId: submission!.id,
        fieldId: sourceField.id,
        value: sources[Math.floor(Math.random() * sources.length)]!,
      },
      {
        submissionId: submission!.id,
        fieldId: improvementField.id,
        value: improvements[Math.floor(Math.random() * improvements.length)]!,
      },
    ]);
  }

  // 20 submissions for event form
  const nameField = eventFields[1]!;
  const emailField = eventFields[2]!;
  const companyField = eventFields[3]!;
  const trackField = eventFields[4]!;

  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 14);
    const submittedAt = new Date();
    submittedAt.setDate(submittedAt.getDate() - daysAgo);

    const name = sampleNames[i % sampleNames.length]!;

    const [submission] = await db
      .insert(submissionsTable)
      .values({
        formId: eventForm!.id,
        ipAddress: `10.0.0.${(i % 254) + 1}`,
        userAgent: "Mozilla/5.0 (Seed Data)",
        completedAt: submittedAt,
        metadata: { source: "seed" },
      })
      .returning();

    const tracks = [
      "AI & Machine Learning",
      "Web Development",
      "Cloud Infrastructure",
      "Mobile Development",
    ];

    await db.insert(answersTable).values([
      {
        submissionId: submission!.id,
        fieldId: nameField.id,
        value: name,
      },
      {
        submissionId: submission!.id,
        fieldId: emailField.id,
        value: `${name.toLowerCase().replace(/\s/g, ".")}@example.com`,
      },
      {
        submissionId: submission!.id,
        fieldId: companyField.id,
        value: ["Acme Inc", "TechCorp", "StartupXYZ", "MegaSoft"][i % 4]!,
      },
      {
        submissionId: submission!.id,
        fieldId: trackField.id,
        value: tracks[i % tracks.length]!,
      },
    ]);
  }

  console.log(`  ✅ Created 70 sample submissions with answers`);

  // ─── Done ──────────────────────────────────────────────
  console.log("\n🎉 Seeding complete!");
  console.log("   Demo credentials: demo@patra.io / password123\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

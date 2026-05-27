"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutTemplate, Plus, Loader2, Sparkles, Heart, FileText, CheckCircle } from "lucide-react";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

interface TemplateField {
  type: "welcome" | "thank_you" | "short_text" | "long_text" | "multiple_choice" | "checkbox" | "dropdown" | "rating" | "date" | "email" | "number";
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface Template {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  badge: string;
  fields: TemplateField[];
}

const templates: Template[] = [
  {
    id: "feedback",
    title: "Customer Satisfaction Survey",
    description: "Measure Net Promoter Score (NPS) and gather descriptive customer feedback.",
    icon: Heart,
    color: "text-[#EC4899] bg-[#EC4899]/10 border-[#EC4899]/20",
    badge: "Popular",
    fields: [
      {
        type: "welcome",
        label: "Welcome! We value your feedback to help us build a better experience.",
        required: false,
      },
      {
        type: "rating",
        label: "How likely are you to recommend Patra to a friend or colleague?",
        required: true,
      },
      {
        type: "short_text",
        label: "What is the primary reason for your score?",
        required: false,
        placeholder: "Type your reason here...",
      },
      {
        type: "long_text",
        label: "Any other suggestions or feature requests?",
        required: false,
        placeholder: "Type suggestions...",
      },
      {
        type: "thank_you",
        label: "Thank you! Your feedback is highly appreciated and will guide our roadmap.",
        required: false,
      },
    ],
  },
  {
    id: "beta-signup",
    title: "Product Waitlist & Beta Sign-up",
    description: "Collect high-quality leads, team sizes and primary use cases for new products.",
    icon: Sparkles,
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    badge: "Lead Gen",
    fields: [
      {
        type: "welcome",
        label: "Apply for the Patra Private Beta and secure early access.",
        required: false,
      },
      {
        type: "short_text",
        label: "What is your full name?",
        required: true,
        placeholder: "John Doe",
      },
      {
        type: "email",
        label: "What is your best email address?",
        required: true,
        placeholder: "name@company.com",
      },
      {
        type: "multiple_choice",
        label: "What describes your role?",
        required: true,
        options: ["Developer / Engineer", "Product Manager", "Designer", "Founder / Business Owner", "Other"],
      },
      {
        type: "number",
        label: "How many members are in your team?",
        required: false,
        placeholder: "e.g. 5",
      },
      {
        type: "thank_you",
        label: "Thanks! We review waitlist applications daily and will reach out soon.",
        required: false,
      },
    ],
  },
  {
    id: "support-inquiry",
    title: "Customer Support Ticket",
    description: "Structure user inquiries and bugs to speed up response times.",
    icon: FileText,
    color: "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20",
    badge: "Operations",
    fields: [
      {
        type: "welcome",
        label: "How can our support engineering team help you today?",
        required: false,
      },
      {
        type: "short_text",
        label: "Summarize your request in a single sentence",
        required: true,
        placeholder: "e.g. Cannot save custom themes",
      },
      {
        type: "long_text",
        label: "Provide detailed steps to reproduce the issue",
        required: true,
        placeholder: "Describe the bug...",
      },
      {
        type: "email",
        label: "Reply email address",
        required: true,
        placeholder: "name@domain.com",
      },
      {
        type: "thank_you",
        label: "Inquiry received. A support engineer will review and reply within 24 hours.",
        required: false,
      },
    ],
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null);

  // Mutations
  const createFormMutation = trpc.form.create.useMutation();
  const createFieldMutation = trpc.field.create.useMutation();

  const handleUseTemplate = async (template: Template) => {
    setCreatingTemplateId(template.id);
    try {
      // 1. Create the Form
      const newForm = await createFormMutation.mutateAsync({
        title: template.title,
        description: template.description,
        visibility: "public",
      });

      // 2. Create the Fields sequentially to maintain correct order
      for (let i = 0; i < template.fields.length; i++) {
        const f = template.fields[i]!;
        await createFieldMutation.mutateAsync({
          formId: newForm.id,
          type: f.type,
          label: f.label,
          order: i,
          required: f.required,
          placeholder: f.placeholder,
          options: f.options,
        });
      }

      toast.success(`${template.title} created successfully!`);
      router.push(`/forms/${newForm.id}/builder`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create form from template");
    } finally {
      setCreatingTemplateId(null);
    }
  };

  return (
    <div className="flex-grow bg-background font-sans p-6 md:p-8 space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col gap-1 border-b border-border/50 pb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <LayoutTemplate className="text-primary" size={20} /> Templates Library
        </h2>
        <p className="text-xs text-muted-foreground">
          Kickstart your form creation process using pre-built conversational layouts.
        </p>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const Icon = template.icon;
          const isCreating = creatingTemplateId === template.id;

          return (
            <div
              key={template.id}
              className="p-6 rounded-xl border border-border bg-card hover:border-muted-foreground/30 transition-all duration-200 flex flex-col justify-between h-60 hover:shadow-sm relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-xl border ${template.color} shrink-0`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-[8px] font-bold font-mono px-2 py-0.5 rounded border border-primary/20 text-primary bg-primary/5 uppercase tracking-wider">
                    {template.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground leading-normal truncate">
                    {template.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Footer action */}
              <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                <span className="text-[10px] font-mono text-muted-foreground">
                  {template.fields.length} questions
                </span>

                <Button
                  disabled={creatingTemplateId !== null}
                  onClick={() => handleUseTemplate(template)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-3.5 h-8.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 shadow-sm active:scale-[0.98]"
                >
                  {isCreating ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Use Template</span>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

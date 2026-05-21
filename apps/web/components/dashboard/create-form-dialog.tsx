"use client";

import React, { useState } from "react";
import { Sparkles, Plus, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
interface GeneratedField {
  type: "welcome" | "thank_you" | "short_text" | "long_text" | "multiple_choice" | "checkbox" | "dropdown" | "rating" | "date" | "email" | "number";
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

function getAiFieldsFromPrompt(prompt: string, title: string): GeneratedField[] {
  const p = prompt.toLowerCase();
  
  if (p.includes("feedback") || p.includes("survey") || p.includes("satisfaction") || p.includes("review") || p.includes("nps")) {
    return [
      {
        type: "welcome",
        label: `Welcome to our feedback survey! We value your response.`,
        required: false,
      },
      {
        type: "rating",
        label: "How would you rate your overall experience with our service?",
        required: true,
      },
      {
        type: "multiple_choice",
        label: "Which area needs the most improvement?",
        required: true,
        options: ["Customer Support", "Performance & Speed", "Pricing & Billing", "Feature Set", "Other"],
      },
      {
        type: "long_text",
        label: "Please share any specific comments or feedback you have.",
        required: false,
        placeholder: "Type your feedback here...",
      },
      {
        type: "thank_you",
        label: "Thank you for sharing your feedback! We review submissions daily.",
        required: false,
      }
    ];
  }

  if (p.includes("signup") || p.includes("waitlist") || p.includes("lead") || p.includes("beta") || p.includes("register")) {
    return [
      {
        type: "welcome",
        label: `Welcome! Sign up for early access to our product.`,
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
        label: "What is your email address?",
        required: true,
        placeholder: "name@company.com",
      },
      {
        type: "multiple_choice",
        label: "What describes your team size?",
        required: true,
        options: ["Just me", "2-10 people", "11-50 people", "50+ people"],
      },
      {
        type: "thank_you",
        label: "Thank you! You are on the waitlist. We will reach out soon.",
        required: false,
      }
    ];
  }

  if (p.includes("contact") || p.includes("support") || p.includes("bug") || p.includes("help") || p.includes("issue")) {
    return [
      {
        type: "welcome",
        label: `Get in touch with the Support Team.`,
        required: false,
      },
      {
        type: "short_text",
        label: "What is the subject of your request?",
        required: true,
        placeholder: "e.g. Account billing question",
      },
      {
        type: "email",
        label: "Where should we reply to you?",
        required: true,
        placeholder: "name@domain.com",
      },
      {
        type: "long_text",
        label: "Provide details of your message or support request",
        required: true,
        placeholder: "Describe your inquiry here...",
      },
      {
        type: "thank_you",
        label: "Thanks! We received your ticket and will reply within 24 hours.",
        required: false,
      }
    ];
  }

  // Default theme: general question flow
  return [
    {
      type: "welcome",
      label: `Welcome to our custom form!`,
      required: false,
    },
    {
      type: "short_text",
      label: "What is your name?",
      required: true,
      placeholder: "Type your name...",
    },
    {
      type: "email",
      label: "What is your email address?",
      required: false,
      placeholder: "name@domain.com",
    },
    {
      type: "rating",
      label: "How would you rate this interactive conversational form builder?",
      required: false,
    },
    {
      type: "thank_you",
      label: "Thank you for completing our form!",
      required: false,
    }
  ];
}

export function CreateFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateFormDialogProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"blank" | "ai">("blank");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createFormMutation = trpc.form.create.useMutation({
    onError: (err) => {
      toast.error(err.message || "Failed to create form");
    },
  });

  const createFieldMutation = trpc.field.create.useMutation({
    onError: (err) => {
      toast.error(err.message || "Failed to generate field");
    },
  });

  const handleCreateBlank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const form = await createFormMutation.mutateAsync({
        title,
        description: description || undefined,
        visibility: "public",
      });
      toast.success("Form created successfully!");
      onOpenChange(false);
      if (onSuccess) onSuccess();
      router.push(`/forms/${form.id}/builder`);
    } catch (err) {
      // Handled by onError
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsSubmitting(true);
    try {
      const generatedTitle = aiPrompt.length > 35 ? aiPrompt.slice(0, 35) + "..." : aiPrompt;
      const form = await createFormMutation.mutateAsync({
        title: generatedTitle,
        description: "Generated dynamically via AI Form Assistant",
        visibility: "public",
      });

      // Get generated fields
      const fieldsToCreate = getAiFieldsFromPrompt(aiPrompt, generatedTitle);
      
      // Create fields sequentially
      for (let i = 0; i < fieldsToCreate.length; i++) {
        const f = fieldsToCreate[i]!;
        await createFieldMutation.mutateAsync({
          formId: form.id,
          type: f.type,
          label: f.label,
          order: i,
          required: f.required,
          placeholder: f.placeholder,
          options: f.options,
        });
      }

      toast.success("AI generated your conversational form!");
      onOpenChange(false);
      if (onSuccess) onSuccess();
      router.push(`/forms/${form.id}/builder`);
    } catch (err) {
      // Handled by onError
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border text-foreground p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-base font-bold tracking-tight text-foreground">
            Create Form
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Choose a starting point for your next conversational form.
          </DialogDescription>
        </DialogHeader>
 
        <Tabs
          defaultValue="blank"
          className="w-full mt-4"
          onValueChange={(val) => setActiveTab(val as "blank" | "ai")}
        >
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted border border-border">
              <TabsTrigger
                value="blank"
                className="text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
              >
                <Plus size={13} className="mr-1.5" />
                Start Blank
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
              >
                <Sparkles size={13} className="mr-1.5 text-primary" />
                AI Assistant
              </TabsTrigger>
            </TabsList>
          </div>
 
          <div className="p-6">
            <TabsContent value="blank" className="mt-0 outline-none">
              <form onSubmit={handleCreateBlank} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                    Form Title
                  </label>
                  <Input
                    required
                    placeholder="e.g. Customer Feedback Survey"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-background border-border focus-visible:ring-primary text-xs text-foreground placeholder:text-muted-foreground/60"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                    Description (optional)
                  </label>
                  <Textarea
                    placeholder="Briefly describe what this form is about..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-background border-border focus-visible:ring-primary text-xs text-foreground placeholder:text-muted-foreground/60 min-h-[80px]"
                    disabled={isSubmitting}
                  />
                </div>
 
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="text-muted-foreground hover:bg-muted text-xs"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin mr-1.5" size={12} />
                    ) : null}
                    Create Form
                  </Button>
                </div>
              </form>
            </TabsContent>
 
            <TabsContent value="ai" className="mt-0 outline-none">
              <form onSubmit={handleCreateAi} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                    What is the goal of your form?
                  </label>
                  <Textarea
                    required
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. A developer satisfaction survey asking about tech stacks, build tools, and local setup satisfaction rating."
                    className="bg-background border-border focus-visible:ring-primary text-xs text-foreground placeholder:text-muted-foreground/60 resize-none min-h-[100px]"
                    disabled={isSubmitting}
                  />
                </div>
 
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="text-muted-foreground hover:bg-muted text-xs"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin mr-1.5" size={12} />
                    ) : (
                      <Sparkles size={12} className="mr-1.5 text-primary-foreground fill-primary-foreground" />
                    )}
                    Generate Form
                  </Button>
                </div>
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}


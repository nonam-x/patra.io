"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Check,
  Star,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";

interface Field {
  id: string;
  type: string;
  label: string;
  placeholder?: string | null;
  required?: boolean;
  options?: string[] | null;
  conditionalRules?: any;
  validations?: Record<string, any> | null;
  properties?: Record<string, any> | null;
}

interface FieldCanvasProps {
  field: Field | null;
  onUpdateFieldLabel: (label: string) => void;
}

export function FieldCanvas({ field, onUpdateFieldLabel }: FieldCanvasProps) {
  const [localLabel, setLocalLabel] = useState("");

  useEffect(() => {
    if (field) {
      setLocalLabel(field.label || "");
    }
  }, [field]);

  if (!field) {
    return (
      <div className="flex-1 bg-background flex flex-col justify-center items-center p-8 relative">
        <div className="text-center max-w-xs">
          <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-5 text-muted-foreground">
            <Heart size={22} className="opacity-40" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1.5">No field selected</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Select a question from the sidebar or add a new one to start editing.
          </p>
        </div>
      </div>
    );
  }

  const handleBlur = () => {
    if (localLabel.trim() && localLabel !== field.label) {
      onUpdateFieldLabel(localLabel);
    }
  };

  return (
    <div className="flex-1 bg-background flex justify-center items-start p-8 md:p-16 relative overflow-y-auto font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-2xl pt-8 md:pt-16"
        >
          {/* Required indicator — subtle inline */}
          {field.required && (
            <div className="mb-4">
              <span className="text-[10px] font-medium text-red-500/80 bg-red-50 border border-red-200/40 px-2 py-0.5 rounded-md">
                Required
              </span>
            </div>
          )}

          {/* Editable Question Label — Document style */}
          <div className="mb-8">
            <textarea
              value={localLabel}
              onChange={(e) => setLocalLabel(e.target.value)}
              onBlur={handleBlur}
              placeholder="Type your question here..."
              rows={2}
              className="w-full bg-transparent text-2xl md:text-[32px] font-semibold tracking-tight text-foreground border-none resize-none focus:outline-none leading-snug placeholder:text-muted-foreground/40 transition-all duration-200"
            />
          </div>

          {/* Input/Selection Previews */}
          <div>
            {/* Welcome Screen */}
            {field.type === "welcome" && (
              <div className="p-10 rounded-2xl bg-card border border-border text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto">
                  <Heart size={24} className="text-primary/60" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Welcome Screen</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    This is the first screen respondents see when they open your form.
                  </p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-8 h-11 rounded-xl transition-all duration-200 flex items-center gap-2 mx-auto shadow-sm">
                  Start Form <ArrowRight size={14} />
                </Button>
              </div>
            )}

            {/* Thank You Screen */}
            {field.type === "thank_you" && (
              <div className="p-10 rounded-2xl bg-card border border-border text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200/40 flex items-center justify-center mx-auto">
                  <Check size={24} className="text-emerald-600/60" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Thank You Screen</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    Shown after the form is submitted.
                  </p>
                </div>
              </div>
            )}

            {/* Short Text / Email / Number */}
            {["short_text", "email", "number"].includes(field.type) && (
              <div className="space-y-3">
                <div className="border-b-2 border-border/60 focus-within:border-primary pb-3 transition-colors duration-300">
                  <input
                    disabled
                    type={field.type === "number" ? "number" : "text"}
                    placeholder={field.placeholder || "Type your answer here..."}
                    className="w-full bg-transparent text-lg md:text-xl text-muted-foreground placeholder:text-muted-foreground/30 outline-none cursor-not-allowed border-none focus:ring-0 p-0"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/60 font-medium">
                  {field.type.replace("_", " ")}
                </p>
              </div>
            )}

            {/* Long Text — textarea preview */}
            {field.type === "long_text" && (
              <div className="space-y-3">
                <div className="border-b-2 border-border/60 focus-within:border-primary pb-3 transition-colors duration-300">
                  <textarea
                    disabled
                    rows={3}
                    placeholder={field.placeholder || "Type your detailed response here..."}
                    className="w-full bg-transparent text-lg md:text-xl text-muted-foreground placeholder:text-muted-foreground/30 outline-none cursor-not-allowed border-none focus:ring-0 p-0 resize-none leading-relaxed"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/60 font-medium">
                  long text
                </p>
              </div>
            )}

            {/* Choice Selections */}
            {["multiple_choice", "checkbox", "dropdown"].includes(field.type) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(field.options || []).length === 0 ? (
                    <div className="col-span-full p-6 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
                      No options yet. Add choices in the settings panel →
                    </div>
                  ) : (
                    (field.options || []).map((opt: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-border bg-card text-sm font-medium text-foreground/80 flex justify-between items-center hover:border-primary/30 hover:shadow-sm transition-all duration-200 select-none cursor-default"
                      >
                        <span className="truncate pr-4">{opt}</span>
                        <span className="text-[10px] font-medium bg-secondary px-2 py-0.5 rounded-md text-muted-foreground shrink-0">
                          {idx + 1}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground/60 font-medium">
                  {field.type.replace("_", " ")}
                </p>
              </div>
            )}

            {/* Star Rating — dynamic maxRating */}
            {field.type === "rating" && (() => {
              const maxRating = field.properties?.maxRating || 5;
              return (
                <div className="space-y-4">
                  <div className="flex gap-2.5 flex-wrap">
                    {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
                      <div
                        key={star}
                        className="w-14 h-14 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground/40 hover:text-amber-500 hover:border-amber-300/50 hover:shadow-sm transition-all duration-200 cursor-default"
                      >
                        <Star size={20} />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 font-medium">
                    star rating ({maxRating} stars)
                  </p>
                </div>
              );
            })()}

            {/* Date Picker */}
            {field.type === "date" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-border bg-card max-w-xs text-sm text-muted-foreground flex items-center gap-3 select-none cursor-default">
                  <Calendar size={16} className="text-muted-foreground/50" />
                  <span>Select a date...</span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 font-medium">
                  date input
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

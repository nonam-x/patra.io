"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Check,
  Type,
  AlignLeft,
  List,
  CheckSquare,
  ChevronDown,
  Star,
  Calendar,
  Mail,
  Binary,
  Upload,
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
      <div className="flex-1 bg-[#09090B] flex flex-col justify-center items-center p-8 relative">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#111111] border border-[#27272A] flex items-center justify-center mx-auto mb-4 text-[#71717A]">
            <Heart size={20} className="animate-pulse" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Canvas is empty</h3>
          <p className="text-xs text-[#71717A] leading-relaxed">
            Select an existing question from the sidebar structure or create a new one to start building.
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
    <div className="flex-1 bg-[#09090B] flex justify-center items-center p-6 md:p-12 relative overflow-y-auto font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-xl space-y-8"
        >
          {/* Question Index Badge */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono text-[#8B5CF6] tracking-widest uppercase bg-[#8B5CF6]/10 px-2 py-0.5 rounded border border-[#8B5CF6]/20">
              Live Preview
            </span>
            {field.required && (
              <span className="text-[9px] font-bold font-mono text-red-400 bg-red-950/20 border border-red-500/15 px-2 py-0.5 rounded">
                Required
              </span>
            )}
          </div>

          {/* Editable Question Label */}
          <div className="space-y-2">
            <textarea
              value={localLabel}
              onChange={(e) => setLocalLabel(e.target.value)}
              onBlur={handleBlur}
              placeholder="Type your question prompt here..."
              rows={2}
              className="w-full bg-transparent text-2xl md:text-3xl font-bold tracking-tight text-white border-none resize-none focus:outline-none focus:bg-[#111111]/30 px-3 py-2 rounded-xl transition-all placeholder-zinc-700 leading-snug"
            />
          </div>

          {/* Input/Selection Previews */}
          <div className="px-3 pt-2">
            {/* Welcome Screen */}
            {field.type === "welcome" && (
              <div className="p-8 rounded-2xl bg-[#111111] border border-[#27272A] text-center space-y-5 shadow-xl">
                <div className="w-14 h-14 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mx-auto shadow-inner">
                  <Heart size={24} className="text-[#8B5CF6]" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-semibold text-white">Conversational Entrance</h4>
                  <p className="text-xs text-[#71717A] max-w-xs mx-auto leading-relaxed">
                    This screen displays first to welcome respondents and capture their attention.
                  </p>
                </div>
                <Button className="bg-[#FFFFFF] hover:bg-[#FFFFFF]/90 text-black text-xs font-bold px-8 h-10 rounded-xl transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] flex items-center gap-1.5 mx-auto">
                  Start Form <ArrowRight size={13} />
                </Button>
              </div>
            )}

            {/* Thank You Screen */}
            {field.type === "thank_you" && (
              <div className="p-8 rounded-2xl bg-[#111111] border border-[#27272A] text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 flex items-center justify-center mx-auto shadow-inner">
                  <Check size={24} className="text-[#22D3EE]" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-semibold text-white">Completion Message</h4>
                  <p className="text-xs text-[#71717A] max-w-xs mx-auto leading-relaxed">
                    This screen displays upon form submission to thank respondents.
                  </p>
                </div>
              </div>
            )}

            {/* Text Inputs */}
            {["short_text", "long_text", "email", "number"].includes(field.type) && (
              <div className="space-y-3">
                <div className="border-b border-[#27272A] focus-within:border-[#8B5CF6] pb-3 transition-colors duration-300">
                  <input
                    disabled
                    type={field.type === "number" ? "number" : "text"}
                    placeholder={field.placeholder || "Respondent will type answer..."}
                    className="w-full bg-transparent text-lg md:text-xl text-[#A1A1AA] placeholder-zinc-700 outline-none cursor-not-allowed border-none focus:ring-0 p-0"
                  />
                </div>
                <p className="text-[10px] text-[#71717A] font-mono uppercase tracking-wider">
                  Type: {field.type.replace("_", " ")}
                </p>
              </div>
            )}

            {/* Choice Selections */}
            {["multiple_choice", "checkbox", "dropdown"].includes(field.type) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(field.options || []).length === 0 ? (
                    <div className="col-span-full p-4 rounded-xl border border-dashed border-[#27272A] text-center text-xs text-[#71717A] font-mono">
                      No options defined yet. Add choices in the right properties drawer.
                    </div>
                  ) : (
                    (field.options || []).map((opt: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-[#27272A] bg-[#111111] text-xs font-semibold text-[#A1A1AA] flex justify-between items-center shadow-sm select-none"
                      >
                        <span className="truncate pr-4">{opt}</span>
                        <span className="text-[9px] font-mono bg-[#18181B] px-1.5 py-0.5 rounded border border-[#27272A] shrink-0 text-[#71717A]">
                          {idx + 1}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[10px] text-[#71717A] font-mono uppercase tracking-wider">
                  Type: {field.type.replace("_", " ")}
                </p>
              </div>
            )}

            {/* Star Rating */}
            {field.type === "rating" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className="w-12 h-12 rounded-xl border border-[#27272A] bg-[#111111] flex items-center justify-center text-[#71717A] shadow-sm"
                    >
                      <Star size={18} />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[#71717A] font-mono uppercase tracking-wider">
                  Type: Star Rating
                </p>
              </div>
            )}

            {/* Date Picker */}
            {field.type === "date" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-[#27272A] bg-[#111111] max-w-xs text-xs text-[#71717A] flex items-center gap-3 shadow-sm select-none">
                  <Calendar size={15} />
                  <span>Select Date...</span>
                </div>
                <p className="text-[10px] text-[#71717A] font-mono uppercase tracking-wider">
                  Type: Date Input
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

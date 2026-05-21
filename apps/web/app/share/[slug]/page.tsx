"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
// Import framer-motion components
import { motion as fm, AnimatePresence as Ap } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  fontFamily?: string;
  borderRadius?: string;
}

export default function PublicFormPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  // Queries
  const { data: form, isLoading, error } =
    trpc.explore.getFormBySlug.useQuery({ slug }, { retry: false });

  // Mutations
  const submitMutation = trpc.submission.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit answers");
    },
  });

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentTextValue, setCurrentTextValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [navHistory, setNavHistory] = useState<number[]>([0]);
  const [isFocused, setIsFocused] = useState(false);

  const fields = (form?.fields || []) as any[];

  const defaultTheme: Theme = {
    id: "default-light",
    name: "Warm Cream Light",
    colors: {
      background: "#EEEAE3",
      text: "#343330",
      primary: "#3C402B",
      secondary: "#FFFFFF",
      accent: "#3C402B",
    },
    borderRadius: "12px",
    fontFamily: "Inter",
  };

  const theme = (form?.theme || defaultTheme) as Theme;
  const isDhurandhar = theme.id === "d40b0000-0000-0000-0000-000000000001";

  // Dynamically load theme fonts in document head immediately
  useEffect(() => {
    const fonts = isDhurandhar
      ? ["Bebas Neue", "IBM Plex Mono", "Inter"]
      : theme.fontFamily
        ? [theme.fontFamily]
        : [];

    fonts.forEach((font) => {
      const fontId = `google-font-${font.replace(/\s+/g, "-").toLowerCase()}`;
      if (document.getElementById(fontId)) return;

      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
        font
      )}:wght@400;500;600;700;800&display=swap`;
      document.head.appendChild(link);
    });
  }, [theme.fontFamily, isDhurandhar]);

  // Keyboard navigation & Shortcuts listener
  useEffect(() => {
    if (submitted || !form) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeField = fields[currentIndex];
      if (!activeField) return;

      // Handle numerical option selection for multiple choices
      if (["multiple_choice", "checkbox", "dropdown"].includes(activeField.type)) {
        const keyVal = parseInt(e.key);
        if (keyVal >= 1 && keyVal <= (activeField.options || []).length) {
          e.preventDefault();
          const opt = activeField.options[keyVal - 1];
          if (opt) handleNext(opt);
        }
      }

      // Enter key for text inputs
      if (e.key === "Enter" && !e.shiftKey) {
        // Prevent default only if typing in text/number fields to trigger submission
        if (["short_text", "long_text", "email", "number"].includes(activeField.type)) {
          e.preventDefault();
          if (currentTextValue.trim() || !activeField.required) {
            handleNext(currentTextValue);
          } else {
            toast.error("This question is required!");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, fields, currentTextValue, submitted, form]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EEEAE3] flex items-center justify-center">
        <div className="text-[#343330] text-sm animate-pulse font-mono flex items-center gap-2">
          <Loader2 className="animate-spin text-[#3C402B]" size={16} />
          <span>loading form assets...</span>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-[#EEEAE3] flex items-center justify-center p-6 text-center">
        <div className="max-w-sm space-y-4">
          <AlertCircle size={40} className="text-[#3C402B] mx-auto" />
          <h2 className="text-xl font-bold text-[#343330]">Form Unreachable</h2>
          <p className="text-xs text-[#343330]/80">
            This conversational form might be private, unpublished, or does not exist.
          </p>
          <Button onClick={() => router.push("/")} className="bg-[#3C402B] text-[#EEEAE3] hover:bg-[#3C402B]/90 font-semibold text-xs px-6">
            Go back Home
          </Button>
        </div>
      </div>
    );
  }

  const activeField = fields[currentIndex];

  const handleNext = async (val: string) => {
    // 1. Save current answer value
    const updatedAnswers = { ...answers };
    if (activeField) {
      updatedAnswers[activeField.id] = val;
      setAnswers(updatedAnswers);
    }

    // Reset current text prompt value
    setCurrentTextValue("");

    // 2. Compute next index based on conditional logic
    let nextIdx = currentIndex + 1;

    // Check skip rules for later questions
    while (nextIdx < fields.length) {
      const field = fields[nextIdx];
      if (!field) break;

      // If no conditional rules exist, display it
      if (!field.conditionalRules || !field.conditionalRules.showIf) {
        break;
      }

      const { fieldId, operator, value } = field.conditionalRules.showIf;
      const targetAns = updatedAnswers[fieldId];

      if (operator === "equals" && targetAns === value) {
        break; // matches conditions, display question
      }

      nextIdx++; // skips question
    }

    // 3. Move forward or submit
    if (nextIdx < fields.length) {
      setNavHistory((prev) => [...prev, nextIdx]);
      setCurrentIndex(nextIdx);
    } else {
      // Final submission trigger
      const formattedAnswers = Object.entries(updatedAnswers).map(([fieldId, value]) => ({
        fieldId,
        value,
      }));
      
      try {
        await submitMutation.mutateAsync({
          slug,
          answers: formattedAnswers,
        });
      } catch (err) {
        // Handled in tRPC onError
      }
    }
  };

  const handleBack = () => {
    if (navHistory.length > 1) {
      const newHistory = [...navHistory];
      newHistory.pop();
      setNavHistory(newHistory);
      const prevIdx = newHistory[newHistory.length - 1]!;
      setCurrentIndex(prevIdx);
      setCurrentTextValue(answers[fields[prevIdx]!.id] || "");
    }
  };

  const completionPercent = fields.length > 0 ? Math.round((currentIndex / fields.length) * 100) : 0;

  // Generate theme classes stylesheet string
  const dynamicStyles = `
    .theme-option-btn {
      border-color: ${theme.colors.text}25;
      background-color: ${theme.colors.background === "#EEEAE3" ? "#FFFFFF" : `${theme.colors.text}08`};
      color: ${theme.colors.text};
      border-radius: ${theme.borderRadius || "12px"};
    }
    .theme-option-btn:hover {
      border-color: ${theme.colors.primary};
      background-color: ${theme.colors.primary}10;
    }
    .theme-option-badge {
      border-color: ${theme.colors.text}20;
      color: ${theme.colors.text}80;
      background-color: ${theme.colors.background === "#EEEAE3" ? "#EEEAE3" : `${theme.colors.text}08`};
    }
    .theme-option-btn:hover .theme-option-badge {
      border-color: ${theme.colors.primary}50;
      color: ${theme.colors.primary};
    }
    .theme-rating-star {
      border-color: ${theme.colors.text}25;
      background-color: ${theme.colors.background === "#EEEAE3" ? "#FFFFFF" : `${theme.colors.text}08`};
      color: ${theme.colors.text}80;
      border-radius: ${theme.borderRadius || "12px"};
    }
    .theme-rating-star:hover {
      border-color: ${theme.colors.accent};
      background-color: ${theme.colors.accent}10;
      color: ${theme.colors.accent};
    }
    .theme-back-btn {
      color: ${theme.colors.text}a0;
    }
    .theme-back-btn:hover {
      color: ${theme.colors.text};
      background-color: ${theme.colors.text}08;
    }

    /* Dhurandhar Theme Overrides */
    .dhurandhar-grain {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.04;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }
    .dhurandhar-scanlines {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9998;
      opacity: 0.03;
      background: linear-gradient(
        rgba(18, 16, 16, 0) 50%, 
        rgba(0, 0, 0, 0.25) 50%
      ), linear-gradient(
        90deg, 
        rgba(255, 0, 0, 0.06), 
        rgba(0, 255, 0, 0.02), 
        rgba(0, 0, 255, 0.06)
      );
      background-size: 100% 4px, 6px 100%;
    }
    .theme-option-btn.dhurandhar-btn {
      border: 1px solid #c49b6330 !important;
      border-radius: 0px !important;
      font-family: 'IBM Plex Mono', monospace !important;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .theme-option-btn.dhurandhar-btn:hover {
      border-color: #c49b63 !important;
      background-color: #c49b6310 !important;
      box-shadow: 0 0 10px #c49b6315;
    }
    .theme-option-btn.dhurandhar-btn .theme-option-badge {
      border-color: #c49b6350 !important;
      color: #c49b63 !important;
      background-color: transparent !important;
      border-radius: 0px !important;
    }
    .dhurandhar-input {
      border-radius: 0px !important;
      border-bottom: 2px solid #c49b6350 !important;
      font-family: 'IBM Plex Mono', monospace !important;
    }
    .dhurandhar-input:focus {
      border-bottom-color: #c49b63 !important;
      box-shadow: none !important;
    }
    .dhurandhar-heading {
      font-family: 'Bebas Neue', sans-serif !important;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 400 !important;
    }
    .dhurandhar-body {
      font-family: 'IBM Plex Mono', monospace !important;
    }
    .theme-rating-star.dhurandhar-star {
      border-radius: 0px !important;
      border: 1px solid #c49b6330 !important;
      color: #7d7d7d !important;
    }
    .theme-rating-star.dhurandhar-star:hover,
    .theme-rating-star.dhurandhar-star.active {
      border-color: #c49b63 !important;
      color: #c49b63 !important;
      background-color: #c49b6310 !important;
      box-shadow: 0 0 10px #c49b6315;
    }
  `;

  return (
    <div 
      className="min-h-screen flex flex-col select-none overflow-hidden relative"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: isDhurandhar
          ? "'IBM Plex Mono', monospace"
          : theme.fontFamily
            ? `"${theme.fontFamily}", sans-serif`
            : "var(--font-inter), sans-serif",
      }}
    >
      {/* Overlays for Dhurandhar theme */}
      {isDhurandhar && (
        <>
          <div className="dhurandhar-grain" />
          <div className="dhurandhar-scanlines" />
        </>
      )}

      {/* Dynamic font stylesheet loading */}
      {isDhurandhar ? (
        <>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          />
        </>
      ) : (
        theme.fontFamily && (
          <link
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(
              theme.fontFamily
            )}:wght@400;500;600;700;800&display=swap`}
          />
        )
      )}

      {/* Inject custom theme hover/active CSS properties */}
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      
      {/* Top running progress bar */}
      {!submitted && (
        <div 
          className="fixed top-0 left-0 w-full h-[3px] z-50"
          style={{ backgroundColor: isDhurandhar ? "#8b1e1e30" : `${theme.colors.text}10` }}
        >
          <div 
            className="h-full transition-all duration-500" 
            style={{ 
              width: `${completionPercent}%`,
              backgroundColor: isDhurandhar ? "#8b1e1e" : theme.colors.primary
            }}
          />
        </div>
      )}

      {/* Main question canvas */}
      <div className="flex-grow flex items-center justify-center px-6 md:px-12 py-16">
        <Ap mode="wait">
          {!submitted ? (
            activeField ? (
              <fm.div
                key={activeField.id}
                initial={{ opacity: 0, y: isDhurandhar ? 5 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isDhurandhar ? -5 : -15 }}
                transition={{ duration: isDhurandhar ? 0.8 : 0.4, ease: isDhurandhar ? [0.16, 1, 0.3, 1] : undefined }}
                className="w-full max-w-lg space-y-8"
              >
                {/* Question index indicator */}
                <div 
                  className={`text-xs font-semibold font-mono flex items-center gap-1.5 ${
                    isDhurandhar ? "dhurandhar-body" : ""
                  }`}
                  style={{ color: isDhurandhar ? "#8b1e1e" : theme.colors.accent }}
                >
                  <span>
                    {isDhurandhar 
                      ? `[SYS_LOG // SECURE_QUERY_${currentIndex + 1}_OF_${fields.length}]` 
                      : `Question ${currentIndex + 1} of ${fields.length}`}
                  </span>
                  {activeField.required && (
                    <span className={`text-[10px] ${
                      isDhurandhar 
                        ? "bg-[#8b1e1e]/20 text-[#8b1e1e] border border-[#8b1e1e]/40 px-1.5 py-0.5 font-bold"
                        : "bg-red-950/40 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-full font-bold"
                    }`}>
                      {isDhurandhar ? "CRITICAL" : "REQUIRED"}
                    </span>
                  )}
                </div>

                {isDhurandhar && (
                  <div className="text-[9px] font-mono text-[#8b1e1e] tracking-widest uppercase flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 bg-[#8b1e1e] animate-ping rounded-full inline-block" />
                    <span>[CLASSIFIED // LEVEL 4 ACCESS REQ]</span>
                  </div>
                )}

                <label 
                  className={`text-2xl md:text-3xl font-bold tracking-tight block leading-tight ${
                    isDhurandhar ? "dhurandhar-heading text-[#f5f1e8]" : ""
                  }`}
                  style={{ color: isDhurandhar ? undefined : theme.colors.text }}
                >
                  {activeField.label}
                </label>

                {/* Sub components depending on question type */}
                {activeField.type === "welcome" && (
                  <div className="space-y-4">
                    <p 
                      className={`text-sm ${isDhurandhar ? "dhurandhar-body" : ""}`}
                      style={{ color: isDhurandhar ? "#7d7d7d" : `${theme.colors.text}80` }}
                    >
                      {isDhurandhar 
                        ? "SECURE CONNECTION ESTABLISHED. INITIALIZE SEQUENCE TO START PRE-SCREENING." 
                        : "Press start key to initiate responding."}
                    </p>
                    <Button 
                      onClick={() => handleNext("started")}
                      className={`font-bold text-sm px-8 py-3 active:scale-[0.98] transition-all flex items-center gap-2 hover:opacity-90 ${
                        isDhurandhar ? "dhurandhar-btn border border-[#c49b63]/30 rounded-none bg-transparent" : ""
                      }`}
                      style={{
                        backgroundColor: isDhurandhar ? undefined : theme.colors.primary,
                        color: isDhurandhar ? "#c49b63" : theme.colors.background,
                        borderRadius: isDhurandhar ? "0px" : (theme.borderRadius || "12px"),
                      }}
                    >
                      {isDhurandhar ? "INITIATE MISSION" : "Start Form"}
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                )}

                {activeField.type === "thank_you" && (
                  <div className="space-y-4">
                    <p 
                      className={`text-sm ${isDhurandhar ? "dhurandhar-body" : ""}`}
                      style={{ color: isDhurandhar ? "#7d7d7d" : `${theme.colors.text}80` }}
                    >
                      {isDhurandhar 
                        ? "MISSION PRE-SCREENING DOSSIER COMPLETED. TRANSMIT TO HIGH COMMAND." 
                        : "You have finished reviewing details."}
                    </p>
                    <Button 
                      onClick={() => handleNext("completed")}
                      className={`font-bold text-sm px-8 py-3 hover:opacity-90 ${
                        isDhurandhar ? "dhurandhar-btn border border-[#c49b63]/30 rounded-none bg-transparent" : ""
                      }`}
                      style={{
                        backgroundColor: isDhurandhar ? undefined : theme.colors.primary,
                        color: isDhurandhar ? "#c49b63" : theme.colors.background,
                        borderRadius: isDhurandhar ? "0px" : (theme.borderRadius || "12px"),
                      }}
                    >
                      {isDhurandhar ? "TRANSMIT DOSSIER" : "Complete & Submit"}
                    </Button>
                  </div>
                )}

                {["short_text", "long_text", "email", "number"].includes(activeField.type) && (
                  <div className="space-y-4">
                    <div 
                      className="relative border-b-2 pb-2 transition-colors duration-200"
                      style={{
                        borderColor: isFocused 
                          ? (isDhurandhar ? "#c49b63" : theme.colors.primary)
                          : (isDhurandhar ? "#c49b6330" : `${theme.colors.text}30`),
                        borderRadius: isDhurandhar ? "0px" : undefined
                      }}
                    >
                      <div className="flex items-center w-full">
                        {isDhurandhar && <span className="text-xl md:text-2xl mr-2 font-mono text-[#c49b63] font-bold shrink-0">&gt;</span>}
                        <input
                          type={activeField.type === "number" ? "number" : "text"}
                          placeholder={activeField.placeholder || (isDhurandhar ? "ENTER TRANSMISSION..." : "Type your response here...")}
                          value={currentTextValue}
                          onChange={(e) => setCurrentTextValue(e.target.value)}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          className={`w-full bg-transparent text-xl md:text-2xl outline-none border-none py-1 focus:ring-0 ${
                            isDhurandhar ? "dhurandhar-input font-mono" : ""
                          }`}
                          style={{ color: theme.colors.text }}
                          autoFocus
                        />
                        {isDhurandhar && isFocused && (
                          <span className="animate-pulse text-xl md:text-2xl font-mono text-[#c49b63] font-bold">_</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#A1A1AA]">
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => {
                            if (currentTextValue.trim() || !activeField.required) {
                              handleNext(currentTextValue);
                            } else {
                              toast.error("This field is required!");
                            }
                          }}
                          className={`font-bold text-xs ${
                            isDhurandhar ? "dhurandhar-btn border border-[#c49b63]/30 rounded-none bg-transparent" : ""
                          }`}
                          style={{
                            backgroundColor: isDhurandhar ? undefined : theme.colors.primary,
                            color: isDhurandhar ? "#c49b63" : theme.colors.background,
                            borderRadius: isDhurandhar ? "0px" : (theme.borderRadius || "8px"),
                          }}
                        >
                          {isDhurandhar ? "SUBMIT COMMAND" : "OK"} <Check size={14} className="ml-1" />
                        </Button>
                      </div>
                      <div 
                        className={`hidden md:flex items-center gap-1 font-mono text-[10px] ${
                          isDhurandhar ? "dhurandhar-body text-[#7d7d7d]" : ""
                        }`}
                        style={{ color: isDhurandhar ? undefined : `${theme.colors.text}80` }}
                      >
                        press <kbd className={`px-1.5 py-0.5 rounded border ${
                          isDhurandhar ? "border-[#c49b63]/25 bg-transparent text-[#c49b63]" : ""
                        }`} style={{ backgroundColor: isDhurandhar ? undefined : `${theme.colors.text}08`, borderColor: isDhurandhar ? undefined : `${theme.colors.text}20`, color: isDhurandhar ? undefined : theme.colors.text }}>Enter ↵</kbd>
                      </div>
                    </div>
                  </div>
                )}

                {["multiple_choice", "checkbox", "dropdown"].includes(activeField.type) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeField.options || []).map((opt: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleNext(opt)}
                        className={`w-full p-4 text-left font-semibold transition-all group duration-200 active:scale-[0.98] flex items-center justify-between theme-option-btn border ${
                          isDhurandhar ? "dhurandhar-btn" : ""
                        }`}
                      >
                        <span>{opt}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono theme-option-badge border">
                          {isDhurandhar ? `0${idx + 1}` : idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {activeField.type === "rating" && (
                  <div className="flex gap-2.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleNext(star.toString())}
                        className={`w-14 h-14 flex items-center justify-center font-bold text-lg active:scale-[0.98] transition-all duration-200 theme-rating-star border ${
                          isDhurandhar ? "dhurandhar-star" : ""
                        }`}
                      >
                        {isDhurandhar ? (
                          <span className="font-mono text-sm">Lv{star}</span>
                        ) : (
                          <Star size={20} />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {activeField.type === "date" && (
                  <div className="space-y-4 max-w-sm">
                    <Input 
                      type="date" 
                      onChange={(e) => { if (e.target.value) handleNext(e.target.value); }}
                      style={{
                        backgroundColor: isDhurandhar ? "transparent" : (theme.colors.background === "#EEEAE3" ? "#FFFFFF" : `${theme.colors.text}08`),
                        borderColor: isDhurandhar ? "#c49b6330" : `${theme.colors.text}25`,
                        color: theme.colors.text,
                        borderRadius: isDhurandhar ? "0px" : theme.borderRadius,
                      }}
                      className={isDhurandhar ? "dhurandhar-input font-mono rounded-none" : ""}
                    />
                  </div>
                )}
              </fm.div>
            ) : (
              <div className={`text-center text-xs font-mono animate-pulse ${isDhurandhar ? "text-[#7d7d7d]" : "text-zinc-500"}`}>
                {isDhurandhar ? "SYNCHRONIZING RECONNAISSANCE MODULES..." : "loading form components..."}
              </div>
            )
          ) : (
            <fm.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: isDhurandhar ? 0.8 : 0.4 }}
              className="text-center max-w-sm space-y-6"
            >
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg ${
                  isDhurandhar ? "rounded-none" : ""
                }`}
                style={{
                  backgroundColor: isDhurandhar ? "#8b1e1e15" : `${theme.colors.primary}15`,
                  border: `1px solid ${isDhurandhar ? "#8b1e1e30" : `${theme.colors.primary}30`}`,
                  boxShadow: `0 10px 15px -3px ${isDhurandhar ? "#8b1e1e10" : `${theme.colors.primary}10`}`,
                }}
              >
                <Check 
                  size={28} 
                  style={{ color: isDhurandhar ? "#c49b63" : theme.colors.primary }} 
                />
              </div>
              <div>
                <h3 
                  className={`text-2xl font-bold tracking-tight mb-2 ${isDhurandhar ? "dhurandhar-heading text-[#c49b63]" : ""}`}
                  style={{ color: isDhurandhar ? undefined : theme.colors.text }}
                >
                  {isDhurandhar ? "TRANSMISSION RECEIVED" : "Thank you!"}
                </h3>
                <p 
                  className={`text-xs leading-relaxed ${isDhurandhar ? "dhurandhar-body text-[#7d7d7d]" : ""}`}
                  style={{ color: isDhurandhar ? undefined : `${theme.colors.text}a0` }}
                >
                  {isDhurandhar 
                    ? "CONFIDENTIAL DOSSIER SAVED. SUBMISSION LOGGED IN DEEP ARCHIVE. DISCONNECTING SECURE SESSION."
                    : "Your response has been securely recorded. You may close this tab."}
                </p>
              </div>
              <div 
                className={`pt-2 text-[10px] font-mono ${isDhurandhar ? "dhurandhar-body" : ""}`}
                style={{ color: isDhurandhar ? "#7d7d7d" : `${theme.colors.text}60` }}
              >
                {isDhurandhar ? "SESSION TERMINATED // " : "Powered by "}{" "}
                <span 
                  className="font-semibold"
                  style={{ color: theme.colors.primary }}
                >
                  patra.io
                </span>
              </div>
            </fm.div>
          )}
        </Ap>
      </div>

      {/* Navigation footer layout details */}
      {!submitted && navHistory.length > 1 && (
        <div 
          className="fixed bottom-6 right-6 flex items-center gap-2 z-40 p-1.5 border shadow-xl"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: isDhurandhar ? "#c49b6330" : `${theme.colors.text}20`,
            borderRadius: isDhurandhar ? "0px" : theme.borderRadius,
          }}
        >
          <button
            onClick={handleBack}
            className={`p-2 text-xs rounded-md transition-colors flex items-center gap-1 theme-back-btn ${
              isDhurandhar ? "dhurandhar-btn border-none font-mono text-[#c49b63]" : ""
            }`}
            style={{ borderRadius: isDhurandhar ? "0px" : `calc(${theme.borderRadius || '8px'} - 2px)` }}
          >
            <ChevronLeft size={14} /> Back
          </button>
        </div>
      )}
    </div>
  );
}

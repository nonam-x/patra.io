"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Star,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";

interface Field {
  id: string;
  type: string;
  label: string;
  placeholder?: string | null;
  required?: boolean;
  options?: string[] | null;
  conditionalRules?: any;
}

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

interface PreviewModeProps {
  fields: Field[];
  theme?: Theme | null;
  onClose: () => void;
}

export function PreviewMode({ fields, theme, onClose }: PreviewModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentTextValue, setCurrentTextValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [navHistory, setNavHistory] = useState<number[]>([0]);
  const [isFocused, setIsFocused] = useState(false);

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

  const activeTheme = (theme || defaultTheme) as Theme;
  const isDhurandhar = activeTheme.id === "d40b0000-0000-0000-0000-000000000001";

  // Dynamically load theme fonts in document head immediately
  useEffect(() => {
    const fonts = isDhurandhar
      ? ["Bebas Neue", "IBM Plex Mono", "Inter"]
      : activeTheme.fontFamily
        ? [activeTheme.fontFamily]
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
  }, [activeTheme.fontFamily, isDhurandhar]);

  // Keyboard navigation & Shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (submitted || fields.length === 0) return;
      
      const activeField = fields[currentIndex];
      if (!activeField) return;

      // Handle numerical option selection for multiple choices
      if (["multiple_choice", "checkbox", "dropdown"].includes(activeField.type)) {
        const keyVal = parseInt(e.key);
        if (keyVal >= 1 && keyVal <= (activeField.options || []).length) {
          e.preventDefault();
          const opt = activeField.options?.[keyVal - 1];
          if (opt) handleNext(opt);
        }
      }

      // Enter key for text inputs
      if (e.key === "Enter" && !e.shiftKey) {
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
  }, [currentIndex, fields, currentTextValue, submitted]);

  if (fields.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#09090B] z-50 flex items-center justify-center p-6 text-center text-white">
        <div className="max-w-sm space-y-4">
          <p className="text-sm text-[#A1A1AA]">
            You cannot preview a form with no fields. Add fields first.
          </p>
          <Button onClick={onClose} className="bg-white text-black font-semibold text-xs px-6 h-9 rounded-lg">
            Back to Builder
          </Button>
        </div>
      </div>
    );
  }

  const activeField = fields[currentIndex];

  const handleNext = (val: string) => {
    const updatedAnswers = { ...answers };
    if (activeField) {
      updatedAnswers[activeField.id] = val;
      setAnswers(updatedAnswers);
    }

    setCurrentTextValue("");

    let nextIdx = currentIndex + 1;

    // Check skip rules for later questions
    while (nextIdx < fields.length) {
      const field = fields[nextIdx];
      if (!field) break;

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

    if (nextIdx < fields.length) {
      setNavHistory((prev) => [...prev, nextIdx]);
      setCurrentIndex(nextIdx);
    } else {
      setSubmitted(true);
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
      border-color: ${activeTheme.colors.text}25;
      background-color: ${activeTheme.colors.background === "#EEEAE3" ? "#FFFFFF" : `${activeTheme.colors.text}08`};
      color: ${activeTheme.colors.text};
      border-radius: ${activeTheme.borderRadius || "12px"};
    }
    .theme-option-btn:hover {
      border-color: ${activeTheme.colors.primary};
      background-color: ${activeTheme.colors.primary}10;
    }
    .theme-option-badge {
      border-color: ${activeTheme.colors.text}20;
      color: ${activeTheme.colors.text}80;
      background-color: ${activeTheme.colors.background === "#EEEAE3" ? "#EEEAE3" : `${activeTheme.colors.text}08`};
    }
    .theme-option-btn:hover .theme-option-badge {
      border-color: ${activeTheme.colors.primary}50;
      color: ${activeTheme.colors.primary};
    }
    .theme-rating-star {
      border-color: ${activeTheme.colors.text}25;
      background-color: ${activeTheme.colors.background === "#EEEAE3" ? "#FFFFFF" : `${activeTheme.colors.text}08`};
      color: ${activeTheme.colors.text}80;
      border-radius: ${activeTheme.borderRadius || "12px"};
    }
    .theme-rating-star:hover {
      border-color: ${activeTheme.colors.accent};
      background-color: ${activeTheme.colors.accent}10;
      color: ${activeTheme.colors.accent};
    }
    .theme-back-btn {
      color: ${activeTheme.colors.text}a0;
    }
    .theme-back-btn:hover {
      color: ${activeTheme.colors.text};
      background-color: ${activeTheme.colors.text}08;
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
      className="fixed inset-0 z-50 flex flex-col font-sans select-none overflow-hidden"
      style={{
        backgroundColor: activeTheme.colors.background,
        color: activeTheme.colors.text,
        fontFamily: isDhurandhar
          ? "'IBM Plex Mono', monospace"
          : activeTheme.fontFamily
            ? `"${activeTheme.fontFamily}", sans-serif`
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
        activeTheme.fontFamily && (
          <link
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(
              activeTheme.fontFamily
            )}:wght@400;500;600;700;800&display=swap`}
          />
        )
      )}

      {/* Inject custom theme hover/active CSS properties */}
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      
      {/* Top Banner Indicator */}
      <div 
        className={`h-12 border-b px-6 flex items-center justify-between flex-shrink-0 z-50 ${
          isDhurandhar ? "border-b-[#c49b63]/20 font-mono" : ""
        }`}
        style={{
          backgroundColor: isDhurandhar ? "#0f0f0f" : (activeTheme.colors.background === "#EEEAE3" ? "#FFFFFF" : activeTheme.colors.background),
          borderColor: isDhurandhar ? undefined : (activeTheme.colors.background === "#EEEAE3" ? `${activeTheme.colors.text}10` : `${activeTheme.colors.text}15`),
        }}
      >
        <span 
          className="text-[11px] font-bold font-mono tracking-wider flex items-center gap-1.5 uppercase"
          style={{ color: isDhurandhar ? "#c49b63" : `${activeTheme.colors.text}80` }}
        >
          <span 
            className="w-1.5 h-1.5 rounded-full animate-ping"
            style={{ backgroundColor: isDhurandhar ? "#8b1e1e" : activeTheme.colors.primary }} 
          />
          {isDhurandhar ? "[MISSION_SIMULATION_ACTIVE]" : "Preview Mode"}
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg transition-colors flex items-center gap-1 text-xs"
          style={{
            color: isDhurandhar ? "#c49b63" : `${activeTheme.colors.text}80`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = isDhurandhar ? "#f5f1e8" : activeTheme.colors.text;
            e.currentTarget.style.backgroundColor = isDhurandhar ? "#c49b6310" : `${activeTheme.colors.text}08`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isDhurandhar ? "#c49b63" : `${activeTheme.colors.text}80`;
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <X size={14} /> Close
        </button>
      </div>

      {/* Top running progress bar */}
      {!submitted && (
        <div 
          className="w-full h-[3px] z-50"
          style={{ backgroundColor: isDhurandhar ? "#8b1e1e30" : `${activeTheme.colors.text}10` }}
        >
          <div 
            className="h-full transition-all duration-500" 
            style={{ 
              width: `${completionPercent}%`,
              backgroundColor: isDhurandhar ? "#8b1e1e" : activeTheme.colors.primary
            }}
          />
        </div>
      )}

      {/* Main question canvas */}
      <div className="flex-grow flex items-center justify-center px-6 md:px-12 py-16">
        <AnimatePresence mode="wait">
          {!submitted ? (
            activeField ? (
              <motion.div
                key={activeField.id}
                initial={{ opacity: 0, y: isDhurandhar ? 5 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isDhurandhar ? -5 : -15 }}
                transition={{ duration: isDhurandhar ? 0.8 : 0.3, ease: isDhurandhar ? [0.16, 1, 0.3, 1] : undefined }}
                className="w-full max-w-lg space-y-8 text-left"
              >
                {/* Question index indicator */}
                <div 
                  className={`text-xs font-semibold font-mono flex items-center gap-1.5 ${
                    isDhurandhar ? "dhurandhar-body" : ""
                  }`}
                  style={{ color: isDhurandhar ? "#8b1e1e" : activeTheme.colors.accent }}
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
                  style={{ color: isDhurandhar ? undefined : activeTheme.colors.text }}
                >
                  {activeField.label}
                </label>

                {/* Welcome */}
                {activeField.type === "welcome" && (
                  <div className="space-y-4">
                    <p 
                      className={`text-sm ${isDhurandhar ? "dhurandhar-body" : ""}`}
                      style={{ color: isDhurandhar ? "#7d7d7d" : `${activeTheme.colors.text}80` }}
                    >
                      {isDhurandhar 
                        ? "SECURE CONNECTION ESTABLISHED. INITIALIZE SEQUENCE TO START PRE-SCREENING." 
                        : "Press start button to begin simulation."}
                    </p>
                    <Button 
                      onClick={() => handleNext("started")}
                      className={`font-bold text-sm px-8 h-12 active:scale-[0.98] transition-all flex items-center gap-2 hover:opacity-90 ${
                        isDhurandhar ? "dhurandhar-btn border border-[#c49b63]/30 rounded-none bg-transparent" : ""
                      }`}
                      style={{
                        backgroundColor: isDhurandhar ? undefined : activeTheme.colors.primary,
                        color: isDhurandhar ? "#c49b63" : activeTheme.colors.background,
                        borderRadius: isDhurandhar ? "0px" : (activeTheme.borderRadius || "12px"),
                      }}
                    >
                      {isDhurandhar ? "INITIATE MISSION" : "Start Form"}
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                )}

                {/* Thank You */}
                {activeField.type === "thank_you" && (
                  <div className="space-y-4">
                    <p 
                      className={`text-sm ${isDhurandhar ? "dhurandhar-body" : ""}`}
                      style={{ color: isDhurandhar ? "#7d7d7d" : `${activeTheme.colors.text}80` }}
                    >
                      {isDhurandhar 
                        ? "MISSION PRE-SCREENING DOSSIER COMPLETED. TRANSMIT TO HIGH COMMAND." 
                        : "You have finished reviewing details."}
                    </p>
                    <Button 
                      onClick={() => handleNext("completed")}
                      className={`font-bold text-sm px-8 h-12 hover:opacity-90 ${
                        isDhurandhar ? "dhurandhar-btn border border-[#c49b63]/30 rounded-none bg-transparent" : ""
                      }`}
                      style={{
                        backgroundColor: isDhurandhar ? undefined : activeTheme.colors.primary,
                        color: isDhurandhar ? "#c49b63" : activeTheme.colors.background,
                        borderRadius: isDhurandhar ? "0px" : (activeTheme.borderRadius || "12px"),
                      }}
                    >
                      {isDhurandhar ? "TRANSMIT DOSSIER" : "Complete & Submit"}
                    </Button>
                  </div>
                )}

                {/* Input Fields */}
                {["short_text", "long_text", "email", "number"].includes(activeField.type) && (
                  <div className="space-y-4">
                    <div 
                      className="relative border-b-2 pb-2 transition-colors duration-200"
                      style={{
                        borderColor: isFocused 
                          ? (isDhurandhar ? "#c49b63" : activeTheme.colors.primary)
                          : (isDhurandhar ? "#c49b6330" : `${activeTheme.colors.text}30`),
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
                          style={{ color: activeTheme.colors.text }}
                          autoFocus
                        />
                        {isDhurandhar && isFocused && (
                          <span className="animate-pulse text-xl md:text-2xl font-mono text-[#c49b63] font-bold">_</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#A1A1AA]">
                      <Button 
                        onClick={() => {
                          if (currentTextValue.trim() || !activeField.required) {
                            handleNext(currentTextValue);
                          } else {
                            toast.error("This field is required!");
                          }
                        }}
                        className={`font-bold text-xs h-8 hover:opacity-90 ${
                          isDhurandhar ? "dhurandhar-btn border border-[#c49b63]/30 rounded-none bg-transparent" : ""
                        }`}
                        style={{
                          backgroundColor: isDhurandhar ? undefined : activeTheme.colors.primary,
                          color: isDhurandhar ? "#c49b63" : activeTheme.colors.background,
                          borderRadius: isDhurandhar ? "0px" : (activeTheme.borderRadius || "8px"),
                        }}
                      >
                        {isDhurandhar ? "SUBMIT COMMAND" : "OK"} <Check size={14} className="ml-1" />
                      </Button>
                      <div 
                        className={`hidden md:flex items-center gap-1 font-mono text-[10px] ${
                          isDhurandhar ? "dhurandhar-body text-[#7d7d7d]" : ""
                        }`}
                        style={{ color: isDhurandhar ? undefined : `${activeTheme.colors.text}80` }}
                      >
                        press <kbd className={`px-1.5 py-0.5 rounded border ${
                          isDhurandhar ? "border-[#c49b63]/25 bg-transparent text-[#c49b63]" : ""
                        }`} style={{ backgroundColor: isDhurandhar ? undefined : `${activeTheme.colors.text}08`, borderColor: isDhurandhar ? undefined : `${activeTheme.colors.text}20`, color: isDhurandhar ? undefined : activeTheme.colors.text }}>Enter ↵</kbd>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selections */}
                {["multiple_choice", "checkbox", "dropdown"].includes(activeField.type) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeField.options || []).map((opt, idx) => (
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

                {/* Rating */}
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

                {/* Date */}
                {activeField.type === "date" && (
                  <div className="space-y-4 max-w-sm">
                    <Input 
                      type="date" 
                      onChange={(e) => { if (e.target.value) handleNext(e.target.value); }}
                      style={{
                        backgroundColor: isDhurandhar ? "transparent" : (activeTheme.colors.background === "#EEEAE3" ? "#FFFFFF" : `${activeTheme.colors.text}08`),
                        borderColor: isDhurandhar ? "#c49b6330" : `${activeTheme.colors.text}25`,
                        color: activeTheme.colors.text,
                        borderRadius: isDhurandhar ? "0px" : activeTheme.borderRadius,
                      }}
                      className={isDhurandhar ? "dhurandhar-input font-mono rounded-none" : ""}
                    />
                  </div>
                )}
              </motion.div>
            ) : null
          ) : (
            <motion.div
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
                  backgroundColor: isDhurandhar ? "#8b1e1e15" : `${activeTheme.colors.primary}15`,
                  border: `1px solid ${isDhurandhar ? "#8b1e1e30" : `${activeTheme.colors.primary}30`}`,
                  boxShadow: `0 10px 15px -3px ${isDhurandhar ? "#8b1e1e10" : `${activeTheme.colors.primary}10`}`,
                }}
              >
                <Check 
                  size={28} 
                  style={{ color: isDhurandhar ? "#c49b63" : activeTheme.colors.primary }} 
                />
              </div>
              <div>
                <h3 
                  className={`text-2xl font-bold tracking-tight mb-2 ${isDhurandhar ? "dhurandhar-heading text-[#c49b63]" : ""}`}
                  style={{ color: isDhurandhar ? undefined : activeTheme.colors.text }}
                >
                  {isDhurandhar ? "TRANSMISSION SIMULATION FINISHED" : "Simulation Finished!"}
                </h3>
                <p 
                  className={`text-xs leading-relaxed ${isDhurandhar ? "dhurandhar-body text-[#7d7d7d]" : ""}`}
                  style={{ color: isDhurandhar ? undefined : `${activeTheme.colors.text}a0` }}
                >
                  {isDhurandhar 
                    ? "PRE-SCREENING PREVIEW DOSSIER COMPILED. SUBMISSION SIMULATED IN DISCARD MODE."
                    : "You have completed the preview. No responses were saved to database analytics."}
                </p>
              </div>
              <Button
                onClick={() => {
                  setAnswers({});
                  setCurrentIndex(0);
                  setNavHistory([0]);
                  setSubmitted(false);
                }}
                variant="outline"
                className={`text-xs h-9 font-semibold ${
                  isDhurandhar ? "dhurandhar-btn border border-[#c49b63]/30 rounded-none bg-transparent" : ""
                }`}
                style={{
                  backgroundColor: "transparent",
                  borderColor: isDhurandhar ? undefined : `${activeTheme.colors.text}25`,
                  color: activeTheme.colors.text,
                  borderRadius: isDhurandhar ? "0px" : (activeTheme.borderRadius || "8px"),
                }}
              >
                {isDhurandhar ? "REBOOT SEQUENCE" : "Restart Preview"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation back footer */}
      {!submitted && navHistory.length > 1 && (
        <div 
          className="fixed bottom-6 right-6 flex items-center gap-2 z-40 p-1.5 border shadow-xl"
          style={{
            backgroundColor: activeTheme.colors.background,
            borderColor: isDhurandhar ? "#c49b6330" : `${activeTheme.colors.text}20`,
            borderRadius: isDhurandhar ? "0px" : activeTheme.borderRadius,
          }}
        >
          <button
            onClick={handleBack}
            className={`p-2 text-xs rounded-md transition-colors flex items-center gap-1 theme-back-btn ${
              isDhurandhar ? "dhurandhar-btn border-none font-mono text-[#c49b63]" : ""
            }`}
            style={{ borderRadius: isDhurandhar ? "0px" : `calc(${activeTheme.borderRadius || '8px'} - 2px)` }}
          >
            <ChevronLeft size={14} /> Back
          </button>
        </div>
      )}
    </div>
  );
}

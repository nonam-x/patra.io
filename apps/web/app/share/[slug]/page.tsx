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
  X,
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
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [selectedDropdown, setSelectedDropdown] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string | null>>({});
  const [isButtonLocked, setIsButtonLocked] = useState(false);
  const [isShaking, setIsShaking] = useState(false);


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

  const layout = 
    theme.name === "Minimalist Editorial" ? "minimalist-card" :
    theme.name === "Glassmorphism Aurora" ? "split-screen" :
    theme.name === "Cyberpunk Terminal" ? "wizard-console" :
    theme.name === "SaaS Dashboard Hub" ? "dashboard" :
    theme.name === "Playful Bubblegum" ? "playful-card" :
    "default-centered";

  const validateField = (field: any, value: string): string | null => {
    if (!field || field.type === "welcome" || field.type === "thank_you") {
      return null;
    }

    const isRequired = !!field.required;
    const trimmed = (value || "").trim();

    if (isRequired && !trimmed) {
      return `"${field.label}" is required.`;
    }

    if (!trimmed) {
      return null;
    }

    const validations = (field.validations ?? {}) as Record<string, any>;

    switch (field.type) {
      case "email": {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) {
          return `"${field.label}" must be a valid email address.`;
        }
        break;
      }
      case "number": {
        const num = Number(trimmed);
        if (isNaN(num)) {
          return `"${field.label}" must be a number.`;
        }
        if (validations.min !== undefined && num < validations.min) {
          return `"${field.label}" must be at least ${validations.min}.`;
        }
        if (validations.max !== undefined && num > validations.max) {
          return `"${field.label}" must be at most ${validations.max}.`;
        }
        break;
      }
      case "short_text":
      case "long_text": {
        if (validations.minLength !== undefined && trimmed.length < validations.minLength) {
          return `"${field.label}" must be at least ${validations.minLength} characters.`;
        }
        if (validations.maxLength !== undefined && trimmed.length > validations.maxLength) {
          return `"${field.label}" must be at most ${validations.maxLength} characters.`;
        }
        if (validations.pattern) {
          try {
            const regex = new RegExp(validations.pattern);
            if (!regex.test(trimmed)) {
              return `"${field.label}" does not match the required format.`;
            }
          } catch (e) {
            // ignore regex parsing error
          }
        }
        break;
      }
      case "rating": {
        const rating = Number(trimmed);
        const maxRating = (field.properties as any)?.maxRating || 5;
        if (isNaN(rating) || rating < 1 || rating > maxRating) {
          return `"${field.label}" must be a rating between 1 and ${maxRating}.`;
        }
        break;
      }
      case "multiple_choice":
      case "dropdown": {
        const opts = (field.options ?? []) as string[];
        if (opts.length > 0 && !opts.includes(trimmed)) {
          return `"${field.label}" has an invalid selection.`;
        }
        break;
      }
      case "checkbox": {
        const opts = (field.options ?? []) as string[];
        const selected = trimmed.split(",").map((v) => v.trim()).filter(Boolean);
        if (selected.length === 0 && isRequired) {
          return `"${field.label}" is required.`;
        }
        if (opts.length > 0) {
          for (const sel of selected) {
            if (!opts.includes(sel)) {
              return `"${field.label}" has an invalid selection: "${sel}".`;
            }
          }
        }
        break;
      }
      case "date": {
        if (isNaN(Date.parse(trimmed))) {
          return `"${field.label}" must be a valid date.`;
        }
        break;
      }
    }

    return null;
  };

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
          // Minimalist Editorial blocks Enter if invalid
          if (layout === "minimalist-card") {
            const err = validateField(activeField, currentTextValue);
            if (err) {
              setValidationError(err);
              return;
            }
          }
          if (isButtonLocked) return;
          handleNext(currentTextValue);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, fields, currentTextValue, submitted, form, layout, isButtonLocked]);

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
  const validationError = activeField ? validationErrors[activeField.id] || null : null;

  const setValidationError = (err: string | null) => {
    if (activeField) {
      setValidationErrors((prev) => ({ ...prev, [activeField.id]: err }));
    }
  };

  const handleFieldChange = (val: string) => {
    setCurrentTextValue(val);
    if (layout === "split-screen" || layout === "playful-card") {
      const err = validateField(activeField, val);
      setValidationError(err);
    } else {
      setValidationError(null);
    }
  };

  const handleFieldBlur = () => {
    if (layout === "minimalist-card") {
      const err = validateField(activeField, currentTextValue);
      setValidationError(err);
    }
  };

  const handleNext = async (val: string) => {
    // 1. Client-side field validation block
    if (activeField && activeField.type !== "welcome" && activeField.type !== "thank_you") {
      const errorMsg = validateField(activeField, val);
      if (errorMsg) {
        setValidationError(errorMsg);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);

        if (layout === "dashboard") {
          setIsButtonLocked(true);
          setTimeout(() => setIsButtonLocked(false), 1000);
        }
        return; // Block progression
      }
    }
    setValidationError(null); // Clear active validation errors

    // 2. Save current answer value
    const updatedAnswers = { ...answers };
    if (activeField) {
      updatedAnswers[activeField.id] = val;
      setAnswers(updatedAnswers);
    }

    // Reset current text prompt value
    setCurrentTextValue("");

    // 3. Compute next index based on conditional logic
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

    // 4. Move forward or submit
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
    setValidationError(null);
    if (navHistory.length > 1) {
      const newHistory = [...navHistory];
      newHistory.pop();
      setNavHistory(newHistory);
      const prevIdx = newHistory[newHistory.length - 1]!;
      setCurrentIndex(prevIdx);
      setCurrentTextValue(answers[fields[prevIdx]!.id] || "");
    }
  };

  const handleSidebarJump = (index: number) => {
    setValidationError(null);
    setNavHistory((prev) => [...prev, index]);
    setCurrentIndex(index);
    const activeF = fields[index];
    if (activeF) {
      setCurrentTextValue(answers[activeF.id] || "");
    }
  };

  const getGoogleFontsUrl = () => {
    switch (theme.name) {
      case "Minimalist Editorial":
        return "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&display=swap";
      case "Glassmorphism Aurora":
        return "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700&display=swap";
      case "Cyberpunk Terminal":
        return "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap";
      case "SaaS Dashboard Hub":
        return "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap";
      case "Playful Bubblegum":
        return "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Lexend:wght@300;400;500;600;700;800&display=swap";
      default:
        return theme.fontFamily 
          ? `https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme.fontFamily)}:wght@400;500;600;700;800&display=swap`
          : null;
    }
  };

  const fontsUrl = getGoogleFontsUrl();

  // Generate theme classes stylesheet string
  let dynamicStyles = `
    .theme-option-btn {
      border-color: ${theme.colors.text}25;
      background-color: ${theme.colors.background === "#EEEAE3" ? "#FFFFFF" : `${theme.colors.text}08`};
      color: ${theme.colors.text};
      border-radius: ${theme.borderRadius || "12px"};
      border-width: 1px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
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
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
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
    .theme-input-wrapper {
      border-bottom: 2px solid ${theme.colors.text}30;
      padding-bottom: 8px;
    }
    .theme-input-wrapper.focused {
      border-color: ${theme.colors.primary};
    }
    .theme-submit-btn {
      background-color: ${theme.colors.primary};
      color: ${theme.colors.background};
      border-radius: ${theme.borderRadius || "8px"};
      transition: all 0.2s ease;
    }
    @keyframes themeShake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .theme-shake-effect {
      animation: themeShake 0.4s ease-in-out;
    }
    @keyframes neonRedPulse {
      0%, 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); border-color: rgba(239, 68, 68, 0.6); }
      50% { box-shadow: 0 0 25px rgba(239, 68, 68, 0.95); border-color: rgba(239, 68, 68, 1); }
    }
    .glass-button-invalid {
      animation: neonRedPulse 1s infinite alternate !important;
      background-image: linear-gradient(135deg, #f87171 0%, #ef4444 100%) !important;
      color: white !important;
      border: none !important;
    }
    @keyframes matrixRedFlash {
      0%, 100% { border-color: #ff007f; color: #ff007f; box-shadow: 0 0 5px #ff007f; }
      50% { border-color: #ef4444; color: #ef4444; box-shadow: 0 0 15px #ef4444; }
    }
    .cyberpunk-button-invalid {
      animation: matrixRedFlash 0.5s infinite !important;
      background-color: rgba(255, 0, 127, 0.1) !important;
      color: #ff007f !important;
    }
    @keyframes wildWobble {
      0% { transform: rotate(0deg) scale(1); }
      15% { transform: rotate(-3deg) scale(0.98); }
      30% { transform: rotate(3deg) scale(0.98); }
      45% { transform: rotate(-2deg) scale(1.02); }
      60% { transform: rotate(2deg) scale(1); }
      100% { transform: rotate(0deg) scale(1); }
    }
    .bubblegum-button-invalid {
      animation: wildWobble 0.4s ease-in-out infinite !important;
      background-color: #ff2a85 !important;
      border-color: #5c2a18 !important;
      color: white !important;
    }
  `;

  if (theme.name === "Minimalist Editorial") {
    dynamicStyles += `
      body, .min-h-screen {
        font-family: 'Inter', sans-serif !important;
      }
      h1, h2, h3, label, .theme-heading {
        font-family: 'Playfair Display', serif !important;
        font-weight: 600 !important;
        letter-spacing: -0.015em !important;
      }
      .theme-option-btn {
        border-color: ${theme.colors.text}12;
        background-color: transparent;
        border-radius: 2px;
      }
      .theme-option-btn:hover {
        background-color: ${theme.colors.primary}08;
        border-color: ${theme.colors.primary};
      }
      .theme-rating-star {
        background-color: transparent;
        border-color: ${theme.colors.text}12;
        border-radius: 2px;
      }
      .theme-rating-star:hover {
        background-color: ${theme.colors.accent}08;
        border-color: ${theme.colors.accent};
      }
      .theme-input-wrapper {
        border-bottom: 1px solid ${theme.colors.text}20;
        padding-bottom: 4px;
      }
      .theme-input-wrapper.focused {
        border-color: ${theme.colors.primary};
      }
      .theme-submit-btn {
        background-color: transparent !important;
        border: 1px solid ${theme.colors.primary} !important;
        color: ${theme.colors.primary} !important;
        border-radius: 2px !important;
        font-family: 'Inter', sans-serif !important;
      }
      .theme-submit-btn:hover {
        background-color: ${theme.colors.primary}10 !important;
      }
    `;
  } else if (theme.name === "Glassmorphism Aurora") {
    dynamicStyles += `
      body, .min-h-screen {
        font-family: 'Manrope', sans-serif !important;
      }
      h1, h2, h3, label, .theme-heading {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-weight: 800 !important;
        letter-spacing: -0.025em !important;
      }
      .theme-option-btn {
        background-color: rgba(255, 255, 255, 0.02) !important;
        backdrop-filter: blur(16px);
        border-color: rgba(255, 255, 255, 0.07) !important;
        border-radius: 9999px !important;
        padding: 12px 24px !important;
      }
      .theme-option-btn:hover {
        background-color: rgba(216, 180, 254, 0.12) !important;
        border-color: #d8b4fe !important;
        box-shadow: 0 8px 32px 0 rgba(216, 180, 254, 0.18);
      }
      .theme-rating-star {
        background-color: rgba(255, 255, 255, 0.02) !important;
        backdrop-filter: blur(16px);
        border-color: rgba(255, 255, 255, 0.07) !important;
        border-radius: 9999px !important;
        width: 3.5rem;
        height: 3.5rem;
      }
      .theme-rating-star:hover {
        background-color: rgba(129, 140, 248, 0.12) !important;
        border-color: #818cf8 !important;
        box-shadow: 0 8px 32px 0 rgba(129, 140, 248, 0.18);
      }
      .theme-input-wrapper {
        border-bottom: none !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        background-color: rgba(255, 255, 255, 0.02) !important;
        backdrop-filter: blur(16px);
        border-radius: 9999px;
        padding: 10px 20px;
        display: flex;
        align-items: center;
      }
      .theme-input-wrapper.focused {
        border-color: #d8b4fe !important;
        box-shadow: 0 0 20px rgba(216, 180, 254, 0.25);
      }
      .theme-submit-btn {
        background-image: linear-gradient(135deg, #d8b4fe 0%, #818cf8 100%) !important;
        color: #090514 !important;
        border-radius: 9999px !important;
        box-shadow: 0 4px 15px rgba(129, 140, 248, 0.3) !important;
        border: none !important;
      }
      .theme-submit-btn:hover {
        box-shadow: 0 6px 20px rgba(216, 180, 254, 0.45) !important;
        opacity: 0.95;
      }
    `;
  } else if (theme.name === "Cyberpunk Terminal") {
    dynamicStyles += `
      body, .min-h-screen, input, textarea, button, span, label, div {
        font-family: 'Share Tech Mono', monospace !important;
      }
      .theme-option-btn {
        border: 1px solid #39ff1440 !important;
        background-color: #0d0d0d !important;
        color: #39ff14 !important;
        border-radius: 0px !important;
      }
      .theme-option-btn:hover {
        border-color: #39ff14 !important;
        background-color: #39ff1418 !important;
        box-shadow: 0 0 10px #39ff1470;
      }
      .theme-rating-star {
        border: 1px solid #39ff1440 !important;
        background-color: #0d0d0d !important;
        color: #39ff14 !important;
        border-radius: 0px !important;
      }
      .theme-rating-star:hover {
        border-color: #ff007f !important;
        background-color: #ff007f18 !important;
        box-shadow: 0 0 10px #ff007f70;
        color: #ff007f !important;
      }
      .theme-input-wrapper {
        border-bottom: none !important;
        border: 1px solid #39ff1440 !important;
        background-color: #050505 !important;
        border-radius: 0px !important;
        padding: 10px 14px;
      }
      .theme-input-wrapper.focused {
        border-color: #39ff14 !important;
        box-shadow: 0 0 8px #39ff1450;
      }
      .theme-submit-btn {
        border: 1px solid #39ff14 !important;
        background-color: transparent !important;
        color: #39ff14 !important;
        border-radius: 0px !important;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
      .theme-submit-btn:hover {
        background-color: #39ff14 !important;
        color: #050505 !important;
        box-shadow: 0 0 12px #39ff1480;
      }
    `;
  } else if (theme.name === "SaaS Dashboard Hub") {
    dynamicStyles += `
      body, .min-h-screen {
        font-family: 'DM Sans', sans-serif !important;
      }
      h1, h2, h3, label, .theme-heading {
        font-family: 'Space Grotesk', sans-serif !important;
        font-weight: 700 !important;
        letter-spacing: -0.02em !important;
      }
      .theme-option-btn {
        background-color: #ffffff !important;
        border: 1px solid ${theme.colors.text}18 !important;
        border-radius: 8px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      }
      .theme-option-btn:hover {
        border-color: #4f46e5 !important;
        background-color: #4f46e505 !important;
      }
      .theme-rating-star {
        background-color: #ffffff !important;
        border: 1px solid ${theme.colors.text}18 !important;
        border-radius: 8px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      }
      .theme-rating-star:hover {
        border-color: #6366f1 !important;
        background-color: #6366f105 !important;
        color: #6366f1 !important;
      }
      .theme-input-wrapper {
        border-bottom: none !important;
        border: 1px solid ${theme.colors.text}20 !important;
        background-color: #ffffff !important;
        border-radius: 8px !important;
        padding: 10px 14px;
      }
      .theme-input-wrapper.focused {
        border-color: #4f46e5 !important;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15) !important;
      }
      .theme-submit-btn {
        background-color: #4f46e5 !important;
        color: #ffffff !important;
        border-radius: 8px !important;
        box-shadow: 0 2px 4px rgba(79, 70, 229, 0.15) !important;
        border: none !important;
      }
      .theme-submit-btn:hover {
        background-color: #4338ca !important;
        box-shadow: 0 4px 8px rgba(79, 70, 229, 0.25) !important;
      }
    `;
  } else if (theme.name === "Playful Bubblegum") {
    dynamicStyles += `
      body, .min-h-screen {
        font-family: 'Lexend', sans-serif !important;
      }
      h1, h2, h3, label, .theme-heading {
        font-family: 'Outfit', sans-serif !important;
        font-weight: 900 !important;
        letter-spacing: -0.01em !important;
      }
      .theme-option-btn {
        border: 2px solid ${theme.colors.text} !important;
        border-radius: 28px !important;
        box-shadow: 4px 4px 0px ${theme.colors.text} !important;
        background-color: #ffffff !important;
      }
      .theme-option-btn:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px ${theme.colors.text} !important;
        background-color: ${theme.colors.secondary} !important;
        animation: wobble 0.3s ease;
      }
      .theme-rating-star {
        border: 2px solid ${theme.colors.text} !important;
        border-radius: 28px !important;
        box-shadow: 4px 4px 0px ${theme.colors.text} !important;
        background-color: #ffffff !important;
      }
      .theme-rating-star:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px ${theme.colors.text} !important;
        background-color: ${theme.colors.primary}20 !important;
        animation: wobble 0.3s ease;
      }
      .theme-input-wrapper {
        border-bottom: none !important;
        border: 2px solid ${theme.colors.text} !important;
        background-color: #ffffff !important;
        border-radius: 20px !important;
        padding: 12px 18px;
      }
      .theme-input-wrapper.focused {
        border-color: ${theme.colors.primary} !important;
        animation: wobble 0.3s ease;
      }
      .theme-submit-btn {
        background-color: ${theme.colors.primary} !important;
        color: #ffffff !important;
        border: 2px solid ${theme.colors.text} !important;
        border-radius: 28px !important;
        box-shadow: 4px 4px 0px ${theme.colors.text} !important;
        font-weight: 800 !important;
      }
      .theme-submit-btn:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px ${theme.colors.text} !important;
        animation: wobble 0.3s ease;
      }
      @keyframes wobble {
        0% { transform: rotate(0deg); }
        15% { transform: rotate(-1.5deg) scale(1.02); }
        30% { transform: rotate(1.5deg) scale(1.02); }
        45% { transform: rotate(-1deg) scale(1.01); }
        60% { transform: rotate(0.5deg) scale(1); }
        100% { transform: rotate(0deg); }
      }
    `;
  }

  const isButtonDisabled = (layout === "minimalist-card" && !!validationError) || isButtonLocked;

  const getButtonClassName = () => {
    let base = "font-bold text-xs theme-submit-btn cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 ";
    if (validationError) {
      if (layout === "minimalist-card") {
        base += "border-dotted border-red-700 text-red-700 bg-red-50 hover:bg-red-100 opacity-70 pointer-events-none ";
      } else if (layout === "split-screen") {
        base += "glass-button-invalid ";
      } else if (layout === "wizard-console") {
        base += "cyberpunk-button-invalid ";
      } else if (layout === "playful-card") {
        base += "bubblegum-button-invalid ";
      } else if (layout === "dashboard") {
        base += "bg-red-600 text-white hover:bg-red-700 cursor-not-allowed ";
      }
    }
    return base;
  };

  const renderButtonContent = (label = "OK") => {
    if (layout === "wizard-console" && validationError) {
      return <span>[ERROR_LOCK]</span>;
    }
    if (layout === "dashboard" && isButtonLocked) {
      return <span>LOCKED</span>;
    }
    return (
      <>
        {label} <Check size={14} className="ml-1" />
      </>
    );
  };

  const renderSidebar = () => {
    return (
      <div 
        className="hidden md:flex flex-col w-64 border-r shrink-0 p-5 space-y-4 animate-in slide-in-from-left duration-300"
        style={{
          backgroundColor: `${theme.colors.text}03`,
          borderColor: `${theme.colors.text}10`,
        }}
      >
        <div className="font-bold text-xs uppercase tracking-wider opacity-60 px-2">
          Questions outline
        </div>
        <div className="space-y-1 overflow-y-auto pr-1">
          {fields.map((f, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = !!answers[f.id];
            const hasError = !!validationErrors[f.id];
            return (
              <button
                key={f.id}
                onClick={() => handleSidebarJump(idx)}
                className={`w-full text-left p-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-all duration-150 ${
                  isCurrent 
                    ? "bg-primary text-white shadow-sm" 
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
                style={isCurrent ? { backgroundColor: theme.colors.primary, color: theme.colors.background } : {}}
              >
                <span className="truncate pr-2">{f.label || `Step ${idx + 1}`}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {hasError && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                  {isAnswered && !isCurrent && !hasError && (
                    <Check size={12} className="text-emerald-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCanvas = () => {
    return (
      <Ap mode="wait">
        {!submitted ? (
          activeField ? (
            <fm.div
              key={activeField.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-lg space-y-8 relative"
            >
              {/* Question index indicator */}
              {(() => {
                const requiredBadge = activeField.required && (() => {
                  if (layout === "minimalist-card") {
                    return <span className="text-red-700 font-sans text-[10px] italic font-normal">(required)</span>;
                  }
                  if (layout === "split-screen") {
                    return (
                      <span className="text-[9px] bg-purple-500/20 text-purple-200 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold tracking-widest shadow-[0_0_8px_rgba(216,180,254,0.15)]">
                        REQUIRED
                      </span>
                    );
                  }
                  if (layout === "wizard-console") {
                    return (
                      <span className="text-[10px] bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/40 px-1.5 py-0.5 font-bold uppercase tracking-tighter">
                        !_REQUIRED
                      </span>
                    );
                  }
                  if (layout === "dashboard") {
                    return (
                      <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Required
                      </span>
                    );
                  }
                  if (layout === "playful-card") {
                    return (
                      <span className="text-[9px] bg-[#ffe033] text-[#5c2a18] border-2 border-[#5c2a18] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider rotate-2 shadow-[2px_2px_0px_#5c2a18] select-none inline-block">
                        MUST ANSWER 🌟
                      </span>
                    );
                  }
                  return (
                    <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-full font-bold">
                      REQUIRED
                    </span>
                  );
                })();

                if (layout === "minimalist-card") {
                  return (
                    <div className="text-xs font-medium font-serif flex items-center gap-2" style={{ color: theme.colors.accent }}>
                      <span>p. {currentIndex + 1} of {fields.length}</span>
                      {requiredBadge}
                    </div>
                  );
                }
                if (layout === "split-screen") {
                  return (
                    <div className="text-xs font-semibold tracking-wider uppercase flex items-center gap-2.5" style={{ color: theme.colors.accent }}>
                      <span>Step {currentIndex + 1} / {fields.length}</span>
                      {requiredBadge}
                    </div>
                  );
                }
                if (layout === "wizard-console") {
                  return (
                    <div className="text-xs font-mono flex items-center gap-2.5" style={{ color: theme.colors.primary }}>
                      <span>[SYS.LOC: {String(currentIndex + 1).padStart(2, '0')} / {String(fields.length).padStart(2, '0')}]</span>
                      {requiredBadge}
                    </div>
                  );
                }
                if (layout === "dashboard") {
                  return (
                    <div className="text-xs font-bold tracking-tight flex items-center gap-2.5 text-muted-foreground" style={{ color: `${theme.colors.text}aa` }}>
                      <span>Question {currentIndex + 1} of {fields.length}</span>
                      {requiredBadge}
                    </div>
                  );
                }
                if (layout === "playful-card") {
                  return (
                    <div className="text-sm font-extrabold flex items-center gap-2.5" style={{ color: theme.colors.text }}>
                      <span>Question {currentIndex + 1} of {fields.length}! 🎯</span>
                      {requiredBadge}
                    </div>
                  );
                }
                return (
                  <div className="text-xs font-semibold font-mono flex items-center gap-1.5" style={{ color: theme.colors.accent }}>
                    <span>Question {currentIndex + 1} of {fields.length}</span>
                    {requiredBadge}
                  </div>
                );
              })()}

              <label 
                className="text-2xl md:text-3xl font-bold tracking-tight block leading-tight theme-heading"
                style={{ color: theme.colors.text }}
              >
                {activeField.label}
              </label>

              {/* Sub components depending on question type */}
              {activeField.type === "welcome" && (
                <div className="space-y-4">
                  <p 
                    className="text-sm opacity-80"
                    style={{ color: theme.colors.text }}
                  >
                    Press start key to initiate responding.
                  </p>
                  <Button 
                    onClick={() => handleNext("started")}
                    className="font-bold text-sm px-8 py-3 active:scale-[0.98] transition-all flex items-center gap-2 hover:opacity-90 theme-submit-btn"
                  >
                    Start Form
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}

              {activeField.type === "thank_you" && (
                <div className="space-y-4">
                  <p 
                    className="text-sm opacity-80"
                    style={{ color: theme.colors.text }}
                  >
                    You have finished reviewing details.
                  </p>
                  <Button 
                    onClick={() => handleNext("completed")}
                    className="font-bold text-sm px-8 py-3 hover:opacity-90 theme-submit-btn"
                  >
                    Complete & Submit
                  </Button>
                </div>
              )}

              {["short_text", "email", "number"].includes(activeField.type) && (
                <div className="space-y-4">
                  <div 
                    className={`relative theme-input-wrapper transition-all duration-200 ${
                      isFocused ? "focused" : ""
                    }`}
                  >
                    {layout === "wizard-console" && (
                      <span className="text-[#39ff14]/70 mr-1.5 font-mono select-none">&gt;</span>
                    )}
                    <input
                      type={activeField.type === "number" ? "number" : "text"}
                      placeholder={activeField.placeholder || "Type your response here..."}
                      value={currentTextValue}
                      onChange={(e) => handleFieldChange(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => {
                        setIsFocused(false);
                        handleFieldBlur();
                      }}
                      className="w-full bg-transparent text-xl md:text-2xl outline-none border-none py-1 focus:ring-0 focus:outline-none"
                      style={{ color: theme.colors.text }}
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#A1A1AA]">
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleNext(currentTextValue)}
                        className={getButtonClassName()}
                        disabled={isButtonDisabled}
                      >
                        {renderButtonContent("OK")}
                      </Button>
                    </div>
                    <div 
                      className="hidden md:flex items-center gap-1 font-mono text-[10px]"
                      style={{ color: `${theme.colors.text}80` }}
                    >
                      press <kbd className="px-1.5 py-0.5 rounded border" style={{ backgroundColor: `${theme.colors.text}08`, borderColor: `${theme.colors.text}20`, color: theme.colors.text }}>Enter ↵</kbd>
                    </div>
                  </div>
                </div>
              )}

              {activeField.type === "long_text" && (
                <div className="space-y-4">
                  <div 
                    className={`relative theme-input-wrapper transition-all duration-200 ${
                      isFocused ? "focused" : ""
                    }`}
                  >
                    {layout === "wizard-console" && (
                      <span className="text-[#39ff14]/70 mr-1.5 font-mono select-none block mb-1">&gt;</span>
                    )}
                    <textarea
                      placeholder={activeField.placeholder || "Type your detailed response here..."}
                      value={currentTextValue}
                      onChange={(e) => handleFieldChange(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => {
                        setIsFocused(false);
                        handleFieldBlur();
                      }}
                      rows={4}
                      className="w-full bg-transparent text-lg md:text-xl outline-none border-none py-1 focus:ring-0 focus:outline-none resize-none leading-relaxed"
                      style={{ color: theme.colors.text }}
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#A1A1AA]">
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleNext(currentTextValue)}
                        className={getButtonClassName()}
                        disabled={isButtonDisabled}
                      >
                        {renderButtonContent("OK")}
                      </Button>
                    </div>
                    <div 
                      className="hidden md:flex items-center gap-1 font-mono text-[10px]"
                      style={{ color: `${theme.colors.text}80` }}
                    >
                      press <kbd className="px-1.5 py-0.5 rounded border" style={{ backgroundColor: `${theme.colors.text}08`, borderColor: `${theme.colors.text}20`, color: theme.colors.text }}>Shift+Enter</kbd> for newline
                    </div>
                  </div>
                </div>
              )}

              {activeField.type === "multiple_choice" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(activeField.options || []).map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleNext(opt)}
                      className="w-full p-4 text-left font-semibold transition-all group duration-200 active:scale-[0.98] flex items-center justify-between theme-option-btn border"
                    >
                      <span>{opt}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono theme-option-badge border">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {activeField.type === "checkbox" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeField.options || []).map((opt: string, idx: number) => {
                      const isSelected = selectedCheckboxes.includes(opt);
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedCheckboxes((prev) => {
                              const newChecked = isSelected
                                ? prev.filter((v) => v !== opt)
                                : [...prev, opt];
                              
                              const valStr = newChecked.join(", ");
                              if (layout === "split-screen" || layout === "playful-card") {
                                const err = validateField(activeField, valStr);
                                setValidationError(err);
                              } else {
                                setValidationError(null);
                              }
                              return newChecked;
                            });
                          }}
                          className="w-full p-4 text-left font-semibold transition-all group duration-200 active:scale-[0.98] flex items-center justify-between border"
                          style={{
                            borderColor: isSelected ? theme.colors.primary : `${theme.colors.text}25`,
                            backgroundColor: isSelected ? `${theme.colors.primary}10` : (theme.colors.background === "#EEEAE3" ? "#FFFFFF" : `${theme.colors.text}08`),
                            color: theme.colors.text,
                            borderRadius: theme.borderRadius || "12px",
                          }}
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className="w-5 h-5 rounded flex items-center justify-center border transition-all"
                              style={{
                                borderColor: isSelected ? theme.colors.primary : `${theme.colors.text}30`,
                                backgroundColor: isSelected ? theme.colors.primary : "transparent",
                              }}
                            >
                              {isSelected && <Check size={12} style={{ color: theme.colors.background }} />}
                            </span>
                            {opt}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono theme-option-badge border">
                            {idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => {
                        handleNext(selectedCheckboxes.join(", "));
                        setSelectedCheckboxes([]);
                      }}
                      className={getButtonClassName()}
                      disabled={isButtonDisabled}
                    >
                      {renderButtonContent("OK")}
                    </Button>
                    <span className="text-[10px] font-mono" style={{ color: `${theme.colors.text}60` }}>
                      {selectedCheckboxes.length} selected
                    </span>
                  </div>
                </div>
              )}

              {activeField.type === "dropdown" && (
                <div className="space-y-4 max-w-md">
                  <select
                    value={selectedDropdown}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedDropdown(val);
                      if (layout === "split-screen" || layout === "playful-card") {
                        const err = validateField(activeField, val);
                        setValidationError(err);
                      } else {
                        setValidationError(null);
                      }
                    }}
                    onBlur={handleFieldBlur}
                    className="w-full p-4 text-lg font-semibold outline-none transition-all duration-200 appearance-none cursor-pointer"
                    style={{
                      backgroundColor: theme.colors.background === "#EEEAE3" ? "#FFFFFF" : `${theme.colors.text}08`,
                      borderColor: `${theme.colors.text}25`,
                      color: theme.colors.text,
                      borderRadius: theme.borderRadius || "12px",
                      border: `1px solid ${theme.colors.text}25`,
                    }}
                  >
                    <option value="" disabled>Select an option…</option>
                    {(activeField.options || []).map((opt: string, idx: number) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <Button
                    onClick={() => {
                      handleNext(selectedDropdown);
                      setSelectedDropdown("");
                    }}
                    className={getButtonClassName()}
                    disabled={isButtonDisabled}
                  >
                    {renderButtonContent("OK")}
                  </Button>
                </div>
              )}

              {activeField.type === "rating" && (() => {
                const maxRating = (activeField.properties as any)?.maxRating || 5;
                return (
                  <div className="flex gap-2.5 flex-wrap">
                    {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
                      <button
                        key={star}
                        onClick={() => {
                          setValidationError(null);
                          handleNext(star.toString());
                        }}
                        className="w-14 h-14 flex items-center justify-center font-bold text-lg active:scale-[0.98] transition-all duration-200 theme-rating-star border cursor-pointer"
                      >
                        <Star size={20} />
                      </button>
                    ))}
                  </div>
                );
              })()}

              {activeField.type === "date" && (
                <div className="space-y-4 max-w-sm">
                  <Input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedDate(val);
                      if (layout === "split-screen" || layout === "playful-card") {
                        const err = validateField(activeField, val);
                        setValidationError(err);
                      } else {
                        setValidationError(null);
                      }
                    }}
                    onBlur={handleFieldBlur}
                    style={{
                      backgroundColor: theme.colors.background === "#EEEAE3" ? "#FFFFFF" : `${theme.colors.text}08`,
                      borderColor: `${theme.colors.text}25`,
                      color: theme.colors.text,
                      borderRadius: theme.borderRadius,
                    }}
                  />
                  <Button
                    onClick={() => {
                      handleNext(selectedDate);
                      setSelectedDate("");
                    }}
                    className={getButtonClassName()}
                    disabled={isButtonDisabled}
                  >
                    {renderButtonContent("OK")}
                  </Button>
                </div>
              )}

              {validationError && (() => {
                if (layout === "minimalist-card") {
                  return (
                    <div className="text-red-700 text-xs font-medium italic mt-2 text-left font-serif animate-in fade-in duration-300">
                      * {validationError}
                    </div>
                  );
                }
                if (layout === "split-screen") {
                  return (
                    <div className="absolute z-30 bottom-[calc(100%+8px)] left-4 right-4 sm:left-auto sm:right-auto bg-red-500/15 backdrop-blur-md border border-red-500/30 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-[0_8px_32px_0_rgba(239,68,68,0.15)] flex items-center gap-2 animate-in zoom-in-95 duration-200 text-left">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-ping shrink-0" />
                      <AlertCircle size={13} className="text-red-400 shrink-0" />
                      <span style={{ textShadow: "0 0 8px rgba(239,68,68,0.5)" }}>{validationError}</span>
                      <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-red-500/15 border-r border-b border-red-500/30 rotate-45 backdrop-blur-md pointer-events-none" />
                    </div>
                  );
                }
                if (layout === "wizard-console") {
                  return (
                    <div className="mt-4 border-l-2 border-[#ff007f] pl-3 py-1 bg-[#ff007f]/5 font-mono text-xs text-[#ff007f] animate-in slide-in-from-left duration-150">
                      <div className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 bg-[#ff007f] animate-pulse" />
                        &gt;&gt;&gt; ERROR: FIELD_VALIDATION_FAILED
                      </div>
                      <div className="opacity-90 mt-1">&gt;&gt;&gt; MESSAGE: {validationError}</div>
                    </div>
                  );
                }
                if (layout === "dashboard") {
                  return (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm flex items-start gap-3 animate-in fade-in duration-200 mt-4 text-left">
                      <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-red-800">Validation Error</h4>
                        <p className="text-xs text-red-700 mt-0.5 font-medium">{validationError}</p>
                      </div>
                    </div>
                  );
                }
                if (layout === "playful-card") {
                  return (
                    <div className="absolute -top-14 left-6 right-6 sm:left-auto bg-[#ff2a85] border-2 border-[#5c2a18] text-white text-xs font-extrabold px-4 py-2.5 rounded-2xl shadow-[4px_4px_0px_#5c2a18] flex items-center gap-2 animate-bounce text-left">
                      <span className="text-sm select-none">🚨</span>
                      <span>{validationError}</span>
                      <div className="absolute -bottom-[7px] left-6 w-3 h-3 bg-[#ff2a85] border-r-2 border-b-2 border-[#5c2a18] rotate-45" />
                    </div>
                  );
                }
                return (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2 animate-in fade-in duration-200 max-w-md mt-4 text-left">
                    <AlertCircle size={14} className="shrink-0 text-red-500" />
                    <span>{validationError}</span>
                  </div>
                );
              })()}
            </fm.div>
          ) : (
            <div className="text-center text-zinc-500 text-xs font-mono animate-pulse">
              loading form components...
            </div>
          )
        ) : (
          <fm.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-sm space-y-6"
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg"
              style={{
                backgroundColor: `${theme.colors.primary}15`,
                border: `1px solid ${theme.colors.primary}30`,
                boxShadow: `0 10px 15px -3px ${theme.colors.primary}10`,
              }}
            >
              <Check 
                size={28} 
                style={{ color: theme.colors.primary }} 
              />
            </div>
            <div>
              <h3 
                className="text-2xl font-bold tracking-tight mb-2 theme-heading"
                style={{ color: theme.colors.text }}
              >
                Thank you!
              </h3>
              <p 
                className="text-xs leading-relaxed"
                style={{ color: `${theme.colors.text}a0` }}
              >
                Your response has been securely recorded. You may close this tab.
              </p>
            </div>
            <div 
              className="pt-2 text-[10px] font-mono flex items-center justify-center gap-0.5"
              style={{ color: `${theme.colors.text}60` }}
            >
              <span>Powered by</span>
              <span className="font-semibold">
                atra<span style={{ color: theme.colors.primary }}>.io</span>
              </span>
            </div>
          </fm.div>
        )}
      </Ap>
    );
  };

  const completionPercent = fields.length > 0 ? Math.round((currentIndex / fields.length) * 100) : 0;

  return (
    <div 
      className="min-h-screen flex flex-col select-none overflow-hidden relative"
      style={{
        backgroundColor: theme.colors.background,
        backgroundImage: theme.name === "Glassmorphism Aurora" 
          ? "radial-gradient(circle at 50% 50%, #1e1b4b 0%, #090514 100%)" 
          : theme.name === "Premium Obsidian Gold"
          ? "radial-gradient(circle at 50% 50%, #1c1917 0%, #0c0a09 100%)"
          : undefined,
        color: theme.colors.text,
        fontFamily: theme.fontFamily ? `"${theme.fontFamily}", sans-serif` : "var(--font-inter), sans-serif",
      }}
    >
      {/* Dynamic font stylesheet loading */}
      {fontsUrl && (
        <link
          rel="stylesheet"
          href={fontsUrl}
        />
      )}

      {/* Inject custom theme hover/active CSS properties */}
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />


      {/* Top running progress bar */}
      {!submitted && layout !== "split-screen" && layout !== "wizard-console" && (
        <div 
          className="fixed top-0 left-0 w-full h-[3px] z-50"
          style={{ backgroundColor: `${theme.colors.text}10` }}
        >
          <div 
            className="h-full transition-all duration-500" 
            style={{ 
              width: `${completionPercent}%`,
              backgroundColor: theme.colors.primary
            }}
          />
        </div>
      )}

      {/* Split-Screen Layout wrapper */}
      {layout === "split-screen" && (
        <div className="flex-grow flex flex-col lg:flex-row overflow-hidden h-full">
          {/* Left Hero Panel */}
          <div 
            className="w-full lg:w-[42%] flex flex-col justify-between p-8 lg:p-16 relative overflow-hidden shrink-0 border-b lg:border-b-0 lg:border-r border-white/5"
            style={{
              backgroundImage: "radial-gradient(circle at 10% 20%, rgba(30, 27, 75, 0.6) 0%, rgba(9, 5, 20, 0.9) 100%)",
            }}
          >
            {/* Ambient radial aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
            <div className="space-y-4 relative z-10 my-auto">
              <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight theme-heading leading-tight">
                {form.title}
              </h1>
              <p className="text-sm opacity-70 leading-relaxed max-w-md">
                {form.description || "Conversational form experience. Powered by patra.io."}
              </p>
            </div>
            
            {!submitted && (
              <div className="flex items-center gap-4 relative z-10 mt-8">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="transparent" />
                  <circle cx="32" cy="32" r="28" stroke={theme.colors.primary} strokeWidth="4" fill="transparent"
                          strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * completionPercent) / 100}
                          className="transition-all duration-500" />
                </svg>
                <div className="text-xs">
                  <div className="font-bold">{completionPercent}% completed</div>
                  <div className="opacity-60">{currentIndex} of {fields.length} steps answered</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Form Panel */}
          <div className="flex-grow flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
            <div className="w-full max-w-md p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-2xl shadow-2xl relative">
              {renderCanvas()}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Layout wrapper */}
      {layout === "dashboard" && (
        <div className="flex-grow flex overflow-hidden h-full">
          {/* Left Sidebar */}
          {renderSidebar()}

          {/* Right Form Panel */}
          <div className="flex-grow flex items-center justify-center p-6 md:p-12 overflow-y-auto">
            <div className={`w-full max-w-lg p-8 rounded-xl bg-card border border-border shadow-sm ${
              isShaking ? "theme-shake-effect" : ""
            }`}>
              {renderCanvas()}
            </div>
          </div>
        </div>
      )}

      {/* Wizard Console Layout wrapper */}
      {layout === "wizard-console" && (
        <div className="flex-grow flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className={`w-full max-w-2xl bg-[#09090b] border border-[#39ff14]/30 rounded-lg p-6 font-mono shadow-2xl relative overflow-hidden ${
              isShaking ? "theme-shake-effect" : ""
            }`}
            style={{ boxShadow: "0 0 30px rgba(57, 255, 20, 0.05)" }}
          >
            {/* Terminal header */}
            <div className="flex justify-between items-center border-b border-[#39ff14]/20 pb-3 mb-6 text-xs text-[#39ff14]/60">
              <span>[PATRA_OS_TERMINAL v1.0.0]</span>
              <span>SYS_STATUS: ACTIVE</span>
            </div>

            {/* ASCII Progress bar */}
            {!submitted && (
              <div className="mb-6 text-xs text-[#39ff14] flex justify-between items-center border border-[#39ff14]/10 p-2.5 bg-[#00ff66]/5">
                <span>PROGRESS:</span>
                <span className="font-bold font-mono text-sm tracking-wider">
                  {(() => {
                    const barsCount = Math.round(completionPercent / 10);
                    const barsStr = "■".repeat(barsCount) + "□".repeat(10 - barsCount);
                    return `[${barsStr}] ${completionPercent}%`;
                  })()}
                </span>
              </div>
            )}

            {renderCanvas()}
          </div>
        </div>
      )}

      {/* Playful Card Layout wrapper */}
      {layout === "playful-card" && (
        <div className="flex-grow flex items-center justify-center p-6 overflow-y-auto">
          <div 
            className={`w-full max-w-lg p-8 bg-white border-[3px] border-[#5c2a18] shadow-[8px_8px_0px_#5c2a18] rounded-[32px] transition-all duration-300 relative ${
              isShaking ? "theme-shake-effect" : ""
            }`}
          >
            {/* Playful Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#ffe033] border-2 border-[#5c2a18] z-20" />
            <div className="absolute -bottom-4 -right-4 w-10 h-10 rounded-full bg-[#ff2a85] border-2 border-[#5c2a18] z-20" />
            {renderCanvas()}
          </div>
        </div>
      )}

      {/* Minimalist Card Layout wrapper */}
      {layout === "minimalist-card" && (
        <div className="flex-grow flex items-center justify-center p-6 overflow-y-auto">
          <div 
            className="w-full max-w-lg p-10 bg-white border border-black/10 rounded-sm shadow-sm relative font-serif"
          >
            {/* Elegant page numbering indicator */}
            {!submitted && (
              <div className="absolute top-6 right-8 text-[10px] font-mono tracking-widest uppercase opacity-40">
                p. {currentIndex + 1} / {fields.length}
              </div>
            )}
            {renderCanvas()}
          </div>
        </div>
      )}

      {/* Default Layout wrapper */}
      {layout === "default-centered" && (
        <div className="flex-grow flex items-center justify-center px-6 md:px-12 py-16">
          {renderCanvas()}
        </div>
      )}

      {/* Navigation header layout details */}
      {!submitted && navHistory.length > 1 && (
        <div 
          className="fixed top-6 left-6 flex items-center gap-2 z-40 p-1.5 border shadow-md"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: `${theme.colors.text}20`,
            borderRadius: theme.borderRadius,
          }}
        >
          <button
            onClick={handleBack}
            className="p-2 text-xs rounded-md transition-colors flex items-center gap-1 theme-back-btn cursor-pointer"
            style={{ borderRadius: `calc(${theme.borderRadius || '8px'} - 2px)` }}
          >
            <ChevronLeft size={14} /> Back
          </button>
        </div>
      )}
    </div>
  );
};

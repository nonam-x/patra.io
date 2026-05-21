"use client";

import React from "react";
import {
  Plus,
  Heart,
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
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";

interface AddFieldMenuProps {
  onAddField: (type: string) => void;
}

export const fieldTypesList = [
  { type: "welcome", label: "Welcome Screen", category: "Structure", icon: Heart, color: "text-[#EC4899]" },
  { type: "thank_you", label: "Thank You Screen", category: "Structure", icon: Check, color: "text-[#22D3EE]" },
  { type: "short_text", label: "Short Text", category: "Input", icon: Type, color: "text-[#8B5CF6]" },
  { type: "long_text", label: "Long Text", category: "Input", icon: AlignLeft, color: "text-[#8B5CF6]" },
  { type: "email", label: "Email Address", category: "Input", icon: Mail, color: "text-[#8B5CF6]" },
  { type: "number", label: "Number Input", category: "Input", icon: Binary, color: "text-[#8B5CF6]" },
  { type: "multiple_choice", label: "Multiple Choice", category: "Selection", icon: List, color: "text-[#3B82F6]" },
  { type: "checkbox", label: "Checkboxes", category: "Selection", icon: CheckSquare, color: "text-[#3B82F6]" },
  { type: "dropdown", label: "Dropdown Select", category: "Selection", icon: ChevronDown, color: "text-[#3B82F6]" },
  { type: "rating", label: "Star Rating", category: "Feedback", icon: Star, color: "text-amber-400" },
  { type: "date", label: "Date Picker", category: "Feedback", icon: Calendar, color: "text-[#EC4899]" },
];

export function AddFieldMenu({ onAddField }: AddFieldMenuProps) {
  // Group fields by category
  const categories = Array.from(new Set(fieldTypesList.map((f) => f.category)));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-[#A1A1AA] hover:text-white p-1.5 hover:bg-[#18181B] rounded transition-colors flex items-center justify-center">
          <Plus size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#111111] border-[#27272A] text-white w-52 text-xs p-1 shadow-2xl">
        {categories.map((category, catIdx) => (
          <React.Fragment key={category}>
            {catIdx > 0 && <DropdownMenuSeparator className="bg-[#27272A]" />}
            <DropdownMenuLabel className="text-[10px] text-[#71717A] uppercase font-mono font-bold px-2.5 py-1.5">
              {category}
            </DropdownMenuLabel>
            {fieldTypesList
              .filter((f) => f.category === category)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.type}
                    onClick={() => onAddField(item.type)}
                    className="hover:bg-[#18181B] cursor-pointer flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-xs"
                  >
                    <Icon size={12} className={item.color} />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                );
              })}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

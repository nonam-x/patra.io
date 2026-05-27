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
  { type: "welcome", label: "Welcome Screen", category: "Structure", icon: Heart, color: "text-muted-foreground" },
  { type: "thank_you", label: "Thank You Screen", category: "Structure", icon: Check, color: "text-muted-foreground" },
  { type: "short_text", label: "Short Text", category: "Input", icon: Type, color: "text-muted-foreground" },
  { type: "long_text", label: "Long Text", category: "Input", icon: AlignLeft, color: "text-muted-foreground" },
  { type: "email", label: "Email Address", category: "Input", icon: Mail, color: "text-muted-foreground" },
  { type: "number", label: "Number Input", category: "Input", icon: Binary, color: "text-muted-foreground" },
  { type: "multiple_choice", label: "Multiple Choice", category: "Selection", icon: List, color: "text-muted-foreground" },
  { type: "checkbox", label: "Checkboxes", category: "Selection", icon: CheckSquare, color: "text-muted-foreground" },
  { type: "dropdown", label: "Dropdown Select", category: "Selection", icon: ChevronDown, color: "text-muted-foreground" },
  { type: "rating", label: "Star Rating", category: "Feedback", icon: Star, color: "text-muted-foreground" },
  { type: "date", label: "Date Picker", category: "Feedback", icon: Calendar, color: "text-muted-foreground" },
];

export function AddFieldMenu({ onAddField }: AddFieldMenuProps) {
  // Group fields by category
  const categories = Array.from(new Set(fieldTypesList.map((f) => f.category)));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-secondary rounded-lg transition-all duration-200 flex items-center justify-center">
          <Plus size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border text-foreground w-56 text-xs p-1.5 shadow-xl rounded-xl">
        {categories.map((category, catIdx) => (
          <React.Fragment key={category}>
            {catIdx > 0 && <DropdownMenuSeparator className="bg-border/50 my-1" />}
            <DropdownMenuLabel className="text-[10px] text-muted-foreground/70 font-medium px-2.5 py-1.5">
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
                    className="hover:bg-secondary cursor-pointer flex items-center gap-2.5 py-2.5 px-2.5 rounded-lg text-xs transition-all duration-200"
                  >
                    <Icon size={14} className="text-muted-foreground/60" />
                    <span className="font-medium">{item.label}</span>
                  </DropdownMenuItem>
                );
              })}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

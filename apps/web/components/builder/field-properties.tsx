import React, { useState, useEffect } from "react";
import { Trash2, Plus, Check, Settings, Sliders } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { trpc } from "~/trpc/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";

interface Field {
  id: string;
  type: string;
  label: string;
  placeholder?: string | null;
  required?: boolean;
  options?: string[] | null;
  conditionalRules?: any;
}

interface FieldPropertiesProps {
  field: Field | null;
  fields: Field[];
  onUpdateFieldProperty: (fieldId: string, property: string, value: any) => void;
  onDeleteField: (fieldId: string) => void;
  onAddFieldOption: (field: any) => void;
  onUpdateFieldOption: (field: any, optionIdx: number, val: string) => void;
  onDeleteFieldOption: (field: any, optionIdx: number) => void;

  // Global form properties
  formThemeId?: string | null;
  formDescription?: string | null;
  onUpdateFormTheme?: (themeId: string | null) => void;
  onUpdateFormProperty?: (property: string, value: any) => void;
  isOpen?: boolean;
}

export function FieldProperties({
  field,
  fields,
  onUpdateFieldProperty,
  onDeleteField,
  onAddFieldOption,
  onUpdateFieldOption,
  onDeleteFieldOption,
  formThemeId,
  formDescription,
  onUpdateFormTheme,
  onUpdateFormProperty,
  isOpen = false,
}: FieldPropertiesProps) {
  const { data: themes, isLoading: themesLoading } = trpc.theme.list.useQuery();
  const [activeTab, setActiveTab] = useState<string>("question");

  useEffect(() => {
    if (field) {
      setActiveTab("question");
    } else {
      setActiveTab("settings");
    }
  }, [field]);

  const otherFields = fields.filter((f) => f.id !== field?.id);
  const showPlaceholder = field ? !["welcome", "thank_you", "rating", "date"].includes(field.type) : false;
  const showRequired = field ? !["welcome", "thank_you"].includes(field.type) : false;
  const showChoices = field ? ["multiple_choice", "checkbox", "dropdown"].includes(field.type) : false;
  const showConditional = field ? field.type !== "welcome" : false;

  const handleToggleRequired = (checked: boolean) => {
    if (field) {
      onUpdateFieldProperty(field.id, "required", checked);
    }
  };

  const handleDeleteClick = () => {
    if (field && confirm("Are you sure you want to delete this question?")) {
      onDeleteField(field.id);
    }
  };

  return (
    <aside className={`w-80 border-l border-border bg-card flex flex-col flex-shrink-0 overflow-hidden font-sans transition-transform duration-300 z-40 fixed lg:relative top-14 lg:top-0 bottom-0 right-0 ${
      isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
    }`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Headers */}
        <div className="p-4 border-b border-border bg-card flex-shrink-0">
          <TabsList className="grid w-full grid-cols-2 bg-muted border border-border p-0.5 rounded-lg h-9">
            <TabsTrigger 
              value="question" 
              className="text-[11px] font-bold tracking-tight rounded-md py-1.5 h-7 transition-all flex items-center justify-center gap-1.5"
            >
              <Sliders size={12} />
              Question
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="text-[11px] font-bold tracking-tight rounded-md py-1.5 h-7 transition-all flex items-center justify-center gap-1.5"
            >
              <Settings size={12} />
              Theme & Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* QUESTION TAB */}
          <TabsContent value="question" className="p-6 space-y-6 mt-0">
            {!field ? (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center mx-auto text-muted-foreground">
                  <Sliders size={16} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-foreground">No field selected</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Select a question from the structure panel to edit its settings.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Title and delete action */}
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-wider font-mono">
                    Question Type: <span className="text-primary">{field.type.replace("_", " ")}</span>
                  </span>
                  <Button
                    onClick={handleDeleteClick}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-muted h-8 w-8 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>

                {/* Question Label */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                    Question Title
                  </label>
                  <Input
                    type="text"
                    value={field.label}
                    onChange={(e) => onUpdateFieldProperty(field.id, "label", e.target.value)}
                    className="bg-background border-border text-xs text-foreground focus-visible:ring-primary focus:border-primary rounded-lg"
                  />
                </div>

                {/* Placeholder */}
                {showPlaceholder && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                      Placeholder
                    </label>
                    <Input
                      type="text"
                      value={field.placeholder || ""}
                      onChange={(e) => onUpdateFieldProperty(field.id, "placeholder", e.target.value)}
                      placeholder="Respondent text prompt..."
                      className="bg-background border-border text-xs text-foreground focus-visible:ring-primary focus:border-primary rounded-lg"
                    />
                  </div>
                )}

                {/* Required Switch */}
                {showRequired && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted border border-border shadow-sm">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-foreground">Required Field</div>
                      <div className="text-[10px] text-muted-foreground">Must be answered to proceed</div>
                    </div>
                    <Switch checked={!!field.required} onCheckedChange={handleToggleRequired} />
                  </div>
                )}

                {/* Conditional Logic Section */}
                {showConditional && (
                  <div className="pt-5 border-t border-border space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                        Conditional Logic
                      </label>
                    </div>

                    <div className="p-3.5 rounded-xl bg-muted border border-border space-y-3.5 shadow-sm">
                      <p className="text-[10px] text-muted-foreground leading-normal font-sans">
                        Show this question only when a preceding question matches a condition.
                      </p>

                      <div className="space-y-2">
                        <label className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">
                          DEPENDS ON QUESTION
                        </label>
                        <select
                          className="w-full bg-background border border-border text-[11px] rounded-lg p-2 text-foreground outline-none focus:border-primary transition-colors"
                          value={field.conditionalRules?.showIf?.fieldId || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              onUpdateFieldProperty(field.id, "conditionalRules", {
                                showIf: { fieldId: val, operator: "equals", value: "" },
                              });
                            } else {
                              onUpdateFieldProperty(field.id, "conditionalRules", null);
                            }
                          }}
                        >
                          <option value="">(None - Always Display)</option>
                          {otherFields.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.label || "Untitled Question"}
                            </option>
                          ))}
                        </select>
                      </div>

                      {field.conditionalRules?.showIf?.fieldId && (
                        <div className="space-y-2">
                          <label className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">
                            EQUALS VALUE
                          </label>
                          <Input
                            type="text"
                            placeholder="e.g. Option 1, Yes, etc."
                            value={field.conditionalRules?.showIf?.value || ""}
                            onChange={(e) => {
                              onUpdateFieldProperty(field.id, "conditionalRules", {
                                showIf: {
                                  ...field.conditionalRules.showIf,
                                  value: e.target.value,
                                },
                              });
                            }}
                            className="bg-background border-border text-[11px] h-8 text-foreground focus:border-primary rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Options list config */}
                {showChoices && (
                  <div className="pt-5 border-t border-border space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                        Choices List
                      </label>
                      <Button
                        onClick={() => onAddFieldOption(field)}
                        variant="ghost"
                        size="sm"
                        className="text-[10px] text-primary font-bold hover:underline p-0 h-auto hover:bg-transparent"
                      >
                        <Plus size={12} className="inline mr-0.5" /> Add
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {(field.options || []).length === 0 ? (
                        <p className="text-[10px] text-muted-foreground italic text-center py-2">
                          No options. Add one using the button above.
                        </p>
                      ) : (
                        (field.options || []).map((opt: string, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Input
                              type="text"
                              value={opt}
                              onChange={(e) => onUpdateFieldOption(field, idx, e.target.value)}
                              className="bg-background border-border text-xs h-8.5 text-foreground focus:border-primary rounded-lg"
                            />
                            <Button
                              onClick={() => onDeleteFieldOption(field, idx)}
                              variant="ghost"
                              size="icon"
                              className="p-2 hover:bg-muted text-muted-foreground hover:text-red-600 rounded-lg shrink-0 h-8 w-8"
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="p-6 space-y-6 mt-0">
            <div className="space-y-5">
              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                  Form Description
                </label>
                <textarea
                  value={formDescription || ""}
                  onChange={(e) => onUpdateFormProperty?.("description", e.target.value)}
                  placeholder="Describe your form..."
                  className="w-full bg-background border border-border text-xs text-foreground rounded-lg p-2.5 focus:border-primary focus:ring-0 outline-none h-24 resize-none leading-relaxed"
                />
              </div>

              {/* Theme Picker */}
              <div className="space-y-3 pt-5 border-t border-border">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                  Active Theme
                </label>
                
                <div className="space-y-2">
                  {themesLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {themes?.map((t: any) => {
                        const isActive = formThemeId === t.id;
                        const colors = t.colors as { primary: string; background: string; text: string };
                        return (
                          <button
                            key={t.id}
                            onClick={() => onUpdateFormTheme?.(t.id)}
                            className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                              isActive
                                ? "border-primary bg-primary/5"
                                : "border-border bg-muted hover:border-muted-foreground/30"
                            }`}
                          >
                            <div className="space-y-1 min-w-0 flex-1 pr-2">
                              <div className="text-xs font-semibold text-foreground truncate flex items-center gap-1.5">
                                {t.name}
                                {t.isSystem && (
                                  <span className="text-[8px] text-muted-foreground bg-muted-foreground/10 px-1 rounded uppercase font-mono">sys</span>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <span className="w-3 h-3 rounded-full border border-zinc-700" style={{ backgroundColor: colors.background }} title="Background" />
                                <span className="w-3 h-3 rounded-full border border-zinc-700" style={{ backgroundColor: colors.primary }} title="Primary" />
                                <span className="w-3 h-3 rounded-full border border-zinc-700" style={{ backgroundColor: colors.text }} title="Text" />
                              </div>
                            </div>
                            {isActive && <Check size={14} className="text-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground font-sans leading-normal">
                  Go to the <Link href="/dashboard/themes" className="text-primary hover:underline">Themes Gallery</Link> to create custom brand styles.
                </p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}

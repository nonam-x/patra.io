import React, { useState, useEffect } from "react";
import { Trash2, Plus, Check, Settings, Sliders, X } from "lucide-react";
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
  validations?: Record<string, any> | null;
  properties?: Record<string, any> | null;
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
  formVisibility?: string;
  formSettings?: Record<string, any>;
  onUpdateFormTheme?: (themeId: string | null) => void;
  onUpdateFormProperty?: (property: string, value: any) => void;
  isOpen?: boolean;
  onClose?: () => void;
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
  formVisibility,
  formSettings,
  onUpdateFormTheme,
  onUpdateFormProperty,
  isOpen = false,
  onClose,
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
  const showValidations = field ? ["short_text", "long_text", "number", "rating"].includes(field.type) : false;

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
    <aside className={`w-[300px] border-l border-border bg-card flex flex-col flex-shrink-0 font-sans transition-all duration-300 ease-in-out z-40 fixed lg:relative top-12 lg:top-0 bottom-0 right-0 ${
      isOpen
        ? "translate-x-0 opacity-100"
        : "translate-x-full lg:translate-x-full lg:w-0 lg:opacity-0 lg:border-l-0 overflow-hidden pointer-events-none"
    }`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Headers */}
        <div className="px-4 pt-4 pb-3 border-b border-border/50 flex-shrink-0 flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
              type="button"
              aria-label="Close settings"
            >
              <X size={15} />
            </button>
          )}
          <TabsList className="grid w-full grid-cols-2 bg-secondary/80 border border-border/40 p-0.5 rounded-xl h-9 flex-1">
            <TabsTrigger
              value="question"
              className="text-[11px] font-medium rounded-lg py-1.5 h-7 transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <Sliders size={12} />
              Question
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-[11px] font-medium rounded-lg py-1.5 h-7 transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <Settings size={12} />
              Design
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
          {/* QUESTION TAB */}
          <TabsContent value="question" className="p-5 space-y-5 mt-0">
            {!field ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center mx-auto text-muted-foreground">
                  <Sliders size={16} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-foreground">No field selected</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Select a question to edit its properties.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Type header and delete */}
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium text-muted-foreground capitalize">
                    {field.type.replace("_", " ")}
                  </span>
                  <Button
                    onClick={handleDeleteClick}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-50 h-7 w-7 rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>

                {/* Question Label */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground">
                    Title
                  </label>
                  <Input
                    type="text"
                    value={field.label}
                    onChange={(e) => onUpdateFieldProperty(field.id, "label", e.target.value)}
                    className="bg-background border-border text-xs text-foreground focus-visible:ring-primary focus:border-primary rounded-lg h-9"
                  />
                </div>

                {/* Placeholder */}
                {showPlaceholder && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Placeholder
                    </label>
                    <Input
                      type="text"
                      value={field.placeholder || ""}
                      onChange={(e) => onUpdateFieldProperty(field.id, "placeholder", e.target.value)}
                      placeholder="Hint text..."
                      className="bg-background border-border text-xs text-foreground focus-visible:ring-primary focus:border-primary rounded-lg h-9"
                    />
                  </div>
                )}

                {/* Required Switch */}
                {showRequired && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/50">
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-foreground">Required</div>
                      <div className="text-[10px] text-muted-foreground">Must be answered</div>
                    </div>
                    <Switch checked={!!field.required} onCheckedChange={handleToggleRequired} />
                  </div>
                )}

                {/* Conditional Logic Section */}
                {showConditional && (
                  <div className="pt-4 border-t border-border/50 space-y-3">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Conditional logic
                    </label>

                    <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-3">
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        Show this question based on a previous answer.
                      </p>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-muted-foreground block">
                          Depends on
                        </label>
                        <select
                          className="w-full bg-background border border-border text-[11px] rounded-lg p-2 text-foreground outline-none focus:border-primary transition-colors duration-200"
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
                          <option value="">None — always show</option>
                          {otherFields.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.label || "Untitled"}
                            </option>
                          ))}
                        </select>
                      </div>

                      {field.conditionalRules?.showIf?.fieldId && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-medium text-muted-foreground block">
                            Equals value
                          </label>
                          <Input
                            type="text"
                            placeholder="e.g. Option 1, Yes"
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
                  <div className="pt-4 border-t border-border/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-medium text-muted-foreground">
                        Choices
                      </label>
                      <Button
                        onClick={() => onAddFieldOption(field)}
                        variant="ghost"
                        size="sm"
                        className="text-[10px] text-primary font-medium hover:underline p-0 h-auto hover:bg-transparent"
                      >
                        <Plus size={12} className="inline mr-0.5" /> Add
                      </Button>
                    </div>

                    <div className="space-y-1.5">
                      {(field.options || []).length === 0 ? (
                        <p className="text-[10px] text-muted-foreground text-center py-3">
                          No options yet.
                        </p>
                      ) : (
                        (field.options || []).map((opt: string, idx: number) => (
                          <div key={idx} className="flex gap-1.5 items-center">
                            <Input
                              type="text"
                              value={opt}
                              onChange={(e) => onUpdateFieldOption(field, idx, e.target.value)}
                              className="bg-background border-border text-xs h-8 text-foreground focus:border-primary rounded-lg flex-1"
                            />
                            <Button
                              onClick={() => onDeleteFieldOption(field, idx)}
                              variant="ghost"
                              size="icon"
                              className="p-1.5 hover:bg-secondary text-muted-foreground/40 hover:text-red-500 rounded-lg shrink-0 h-7 w-7 transition-all duration-200"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Validations Section */}
                {showValidations && field && (
                  <div className="pt-4 border-t border-border/50 space-y-3">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Validation Rules
                    </label>

                    {(field.type === "short_text" || field.type === "long_text") && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] text-muted-foreground">Min length</label>
                            <Input
                              type="number"
                              min={0}
                              value={field.validations?.minLength ?? ""}
                              onChange={(e) => {
                                const val = e.target.value ? parseInt(e.target.value) : undefined;
                                onUpdateFieldProperty(field.id, "validations", {
                                  ...(field.validations || {}),
                                  minLength: val,
                                });
                              }}
                              placeholder="0"
                              className="bg-background border-border text-[11px] h-8 rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-muted-foreground">Max length</label>
                            <Input
                              type="number"
                              min={0}
                              value={field.validations?.maxLength ?? ""}
                              onChange={(e) => {
                                const val = e.target.value ? parseInt(e.target.value) : undefined;
                                onUpdateFieldProperty(field.id, "validations", {
                                  ...(field.validations || {}),
                                  maxLength: val,
                                });
                              }}
                              placeholder="∞"
                              className="bg-background border-border text-[11px] h-8 rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground">Regex pattern</label>
                          <Input
                            type="text"
                            value={field.validations?.pattern ?? ""}
                            onChange={(e) => {
                              onUpdateFieldProperty(field.id, "validations", {
                                ...(field.validations || {}),
                                pattern: e.target.value || undefined,
                              });
                            }}
                            placeholder="e.g. ^[A-Z].*"
                            className="bg-background border-border text-[11px] h-8 rounded-lg font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {field.type === "number" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground">Min value</label>
                          <Input
                            type="number"
                            value={field.validations?.min ?? ""}
                            onChange={(e) => {
                              const val = e.target.value ? parseFloat(e.target.value) : undefined;
                              onUpdateFieldProperty(field.id, "validations", {
                                ...(field.validations || {}),
                                min: val,
                              });
                            }}
                            placeholder="-∞"
                            className="bg-background border-border text-[11px] h-8 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground">Max value</label>
                          <Input
                            type="number"
                            value={field.validations?.max ?? ""}
                            onChange={(e) => {
                              const val = e.target.value ? parseFloat(e.target.value) : undefined;
                              onUpdateFieldProperty(field.id, "validations", {
                                ...(field.validations || {}),
                                max: val,
                              });
                            }}
                            placeholder="∞"
                            className="bg-background border-border text-[11px] h-8 rounded-lg"
                          />
                        </div>
                      </div>
                    )}

                    {field.type === "rating" && (
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Max stars</label>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={field.properties?.maxRating ?? 5}
                          onChange={(e) => {
                            const val = Math.min(10, Math.max(1, parseInt(e.target.value) || 5));
                            onUpdateFieldProperty(field.id, "properties", {
                              ...(field.properties || {}),
                              maxRating: val,
                            });
                          }}
                          className="bg-background border-border text-[11px] h-8 rounded-lg w-20"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="p-5 space-y-5 mt-0">
            <div className="space-y-5">
              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={formDescription || ""}
                  onChange={(e) => onUpdateFormProperty?.("description", e.target.value)}
                  placeholder="Add a description for your form..."
                  className="w-full bg-background border border-border text-xs text-foreground rounded-lg p-2.5 focus:border-primary focus:ring-0 outline-none h-20 resize-none leading-relaxed transition-colors duration-200"
                />
              </div>

              {/* Theme Picker */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Theme
                </label>

                <div className="space-y-2">
                  {themesLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 rounded-lg bg-secondary animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto scrollbar-hide">
                      {themes?.map((t: any) => {
                        const isActive = formThemeId === t.id;
                        const colors = t.colors as { primary: string; background: string; text: string };
                        return (
                          <button
                            key={t.id}
                            onClick={() => onUpdateFormTheme?.(t.id)}
                            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${
                              isActive
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border/50 bg-secondary/30 hover:border-border hover:bg-secondary/60"
                            }`}
                          >
                            <div className="space-y-1.5 min-w-0 flex-1 pr-2">
                              <div className="text-xs font-medium text-foreground truncate flex items-center gap-1.5">
                                {t.name}
                                {t.isSystem && (
                                  <span className="text-[8px] text-muted-foreground bg-secondary px-1.5 rounded uppercase font-medium">sys</span>
                                )}
                              </div>
                              <div className="flex gap-1.5">
                                <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: colors.background }} />
                                <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: colors.primary }} />
                                <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: colors.text }} />
                              </div>
                            </div>
                            {isActive && <Check size={14} className="text-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Visit the <Link href="/dashboard/themes" className="text-primary hover:underline">Themes Gallery</Link> to create custom styles.
                </p>
              </div>

              {/* Visibility */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Visibility
                </label>
                <select
                  className="w-full bg-background border border-border text-[11px] rounded-lg p-2.5 text-foreground outline-none focus:border-primary transition-colors duration-200"
                  value={formVisibility || "public"}
                  onChange={(e) => onUpdateFormProperty?.("visibility", e.target.value)}
                >
                  <option value="public">Public — listed in explore</option>
                  <option value="unlisted">Unlisted — link only</option>
                  <option value="private">Private — creator only</option>
                </select>
              </div>

              {/* Form Settings */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Form Settings
                </label>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted-foreground">Max responses</label>
                    <Input
                      type="number"
                      min={0}
                      value={formSettings?.maxResponses ?? ""}
                      onChange={(e) => {
                        const val = e.target.value ? parseInt(e.target.value) : undefined;
                        onUpdateFormProperty?.("settings", {
                          ...(formSettings || {}),
                          maxResponses: val,
                        });
                      }}
                      placeholder="Unlimited"
                      className="bg-background border-border text-[11px] h-8 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/50">
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-foreground">Progress bar</div>
                      <div className="text-[10px] text-muted-foreground">Show step indicator</div>
                    </div>
                    <Switch
                      checked={formSettings?.showProgressBar !== false}
                      onCheckedChange={(checked) => {
                        onUpdateFormProperty?.("settings", {
                          ...(formSettings || {}),
                          showProgressBar: checked,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}

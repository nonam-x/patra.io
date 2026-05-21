"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "~/trpc/client";
import { useAuth } from "~/hooks/use-auth";
import { toast } from "sonner";
import { BuilderHeader } from "~/components/builder/builder-header";
import { FieldList } from "~/components/builder/field-list";
import { FieldCanvas } from "~/components/builder/field-canvas";
import { FieldProperties } from "~/components/builder/field-properties";
import { PreviewMode } from "~/components/builder/preview-mode";
import { ShareDialog } from "~/components/builder/share-dialog";
import { Button } from "~/components/ui/button";

export default function FormBuilderPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { user, isLoading: authLoading } = useAuth();

  // Selected Field and UI states
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [savingState, setSavingState] = useState<"saved" | "saving" | "idle">("saved");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formSlug, setFormSlug] = useState("");
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // tRPC Queries
  const { data: form, isLoading: formLoading, refetch: refetchForm } =
    trpc.form.getById.useQuery({ id }, { enabled: !!user });

  // tRPC Mutations
  const updateFormMutation = trpc.form.update.useMutation({
    onMutate: () => setSavingState("saving"),
    onSuccess: () => {
      setSavingState("saved");
      refetchForm();
    },
    onError: () => setSavingState("idle"),
  });

  const publishFormMutation = trpc.form.publish.useMutation({
    onSuccess: () => {
      toast.success("Form published to production!");
      refetchForm();
    },
  });

  const unpublishFormMutation = trpc.form.unpublish.useMutation({
    onSuccess: () => {
      toast.success("Form unpublished");
      refetchForm();
    },
  });

  const createFieldMutation = trpc.field.create.useMutation({
    onMutate: () => setSavingState("saving"),
    onSuccess: (newField: any) => {
      setSavingState("saved");
      refetchForm();
      setSelectedFieldId(newField.id);
      setLeftSidebarOpen(false);
      toast.success("Field added");
    },
  });

  const updateFieldMutation = trpc.field.update.useMutation({
    onMutate: () => setSavingState("saving"),
    onSuccess: () => {
      setSavingState("saved");
      refetchForm();
    },
    onError: () => setSavingState("idle"),
  });

  const deleteFieldMutation = trpc.field.delete.useMutation({
    onMutate: () => setSavingState("saving"),
    onSuccess: () => {
      setSavingState("saved");
      refetchForm();
      setSelectedFieldId(null);
      toast.success("Field removed");
    },
  });

  const reorderFieldsMutation = trpc.field.reorder.useMutation({
    onMutate: () => setSavingState("saving"),
    onSuccess: () => {
      setSavingState("saved");
      refetchForm();
    },
  });

  // Automatically select first field if none selected
  useEffect(() => {
    if (form && form.fields && form.fields.length > 0 && !selectedFieldId) {
      setSelectedFieldId((form.fields[0] as any).id);
    }
  }, [form, selectedFieldId]);

  useEffect(() => {
    if (form) {
      setFormSlug(form.slug);
    }
  }, [form]);

  // Auth Redirects
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || formLoading || !form) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-[#A1A1AA] text-xs animate-pulse font-mono uppercase tracking-wider">
          loading canvas editor...
        </div>
      </div>
    );
  }

  const fields = (form.fields || []) as any[];
  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  const handleAddField = async (type: string) => {
    const nextOrder = fields.length;
    let label = `Question ${nextOrder + 1}`;
    let options: string[] | undefined = undefined;

    if (type === "welcome") {
      label = "Welcome to our conversational form!";
    } else if (type === "thank_you") {
      label = "Thank you for responding!";
    } else if (["multiple_choice", "checkbox", "dropdown"].includes(type)) {
      options = ["Option 1", "Option 2", "Option 3"];
    }

    await createFieldMutation.mutateAsync({
      formId: id,
      type: type as any,
      label,
      order: nextOrder,
      required: false,
      options,
    });
  };

  const handleUpdateFieldProperty = (fieldId: string, property: string, value: any) => {
    updateFieldMutation.mutate({
      id: fieldId,
      [property]: value,
    });
  };

  const handleAddFieldOption = (field: any) => {
    const currentOptions = field.options || [];
    const newOptions = [...currentOptions, `Option ${currentOptions.length + 1}`];
    handleUpdateFieldProperty(field.id, "options", newOptions);
  };

  const handleUpdateFieldOption = (field: any, optionIdx: number, val: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[optionIdx] = val;
    handleUpdateFieldProperty(field.id, "options", newOptions);
  };

  const handleDeleteFieldOption = (field: any, optionIdx: number) => {
    const newOptions = (field.options || []).filter((_: any, idx: number) => idx !== optionIdx);
    handleUpdateFieldProperty(field.id, "options", newOptions);
  };

  const handleReorderFields = (fieldIds: string[]) => {
    reorderFieldsMutation.mutate({
      formId: id,
      fieldIds,
    });
  };

  const handleTogglePublish = () => {
    if (form.status === "published") {
      unpublishFormMutation.mutate({ id });
    } else {
      publishFormMutation.mutate({ id });
    }
  };

  const handleTitleChange = (newTitle: string) => {
    updateFormMutation.mutate({ id, title: newTitle });
  };

  return (
    <div className="h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col font-sans select-none overflow-hidden relative">
      <BuilderHeader
        formId={id}
        title={form.title}
        status={form.status}
        savingState={savingState}
        onTitleChange={handleTitleChange}
        onTogglePublish={handleTogglePublish}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenPreview={() => setIsPreviewOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Floating Toggle buttons for mobile/tablet */}
        <div className="lg:hidden absolute top-4 left-4 z-30 flex gap-2">
          <Button
            onClick={() => {
              setLeftSidebarOpen(!leftSidebarOpen);
              setRightSidebarOpen(false);
            }}
            variant="outline"
            size="sm"
            className="bg-[#111111]/90 hover:bg-[#18181B] border-[#27272A] text-[#A1A1AA] hover:text-white backdrop-blur-xs text-[10px] h-8 rounded-lg font-bold font-mono tracking-wider shadow-md"
          >
            Structure
          </Button>
        </div>

        <div className="lg:hidden absolute top-4 right-4 z-30 flex gap-2">
          <Button
            onClick={() => {
              setRightSidebarOpen(!rightSidebarOpen);
              setLeftSidebarOpen(false);
            }}
            variant="outline"
            size="sm"
            className="bg-[#111111]/90 hover:bg-[#18181B] border-[#27272A] text-[#A1A1AA] hover:text-white backdrop-blur-xs text-[10px] h-8 rounded-lg font-bold font-mono tracking-wider shadow-md"
          >
            Options
          </Button>
        </div>

        {/* Backdrops */}
        {leftSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-30 top-14"
            onClick={() => setLeftSidebarOpen(false)}
          />
        )}
        {rightSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-30 top-14"
            onClick={() => setRightSidebarOpen(false)}
          />
        )}

        <FieldList
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={(id) => {
            setSelectedFieldId(id);
            setLeftSidebarOpen(false);
          }}
          onReorderFields={handleReorderFields}
          onAddField={handleAddField}
          isOpen={leftSidebarOpen}
        />

        <FieldCanvas
          field={selectedField}
          onUpdateFieldLabel={(label) => handleUpdateFieldProperty(selectedField!.id, "label", label)}
        />

        <FieldProperties
          field={selectedField}
          fields={fields}
          onUpdateFieldProperty={handleUpdateFieldProperty}
          onDeleteField={(fieldId) => deleteFieldMutation.mutate({ id: fieldId })}
          onAddFieldOption={handleAddFieldOption}
          onUpdateFieldOption={handleUpdateFieldOption}
          onDeleteFieldOption={handleDeleteFieldOption}
          
          formThemeId={form.themeId}
          formDescription={form.description}
          onUpdateFormTheme={(themeId) => updateFormMutation.mutate({ id, themeId })}
          onUpdateFormProperty={(property, value) => {
            updateFormMutation.mutate({ id, [property]: value });
          }}
          isOpen={rightSidebarOpen}
        />
      </div>

      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        formSlug={formSlug}
        isPublished={form.status === "published"}
      />

      {isPreviewOpen && (
        <PreviewMode
          fields={fields}
          theme={form.theme as any}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
}

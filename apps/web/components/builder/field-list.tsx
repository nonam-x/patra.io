"use client";

import React from "react";
import { GripVertical, X } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AddFieldMenu } from "./add-field-menu";
import { fieldTypesList } from "./add-field-menu";

interface Field {
  id: string;
  type: string;
  label: string;
}

interface FieldListProps {
  fields: Field[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onReorderFields: (fieldIds: string[]) => void;
  onAddField: (type: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function FieldList({
  fields,
  selectedFieldId,
  onSelectField,
  onReorderFields,
  onAddField,
  isOpen = false,
  onClose,
}: FieldListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      const reordered = arrayMove(fields, oldIndex, newIndex);
      onReorderFields(reordered.map((f) => f.id));
    }
  };

  const getFieldIcon = (type: string) => {
    const matched = fieldTypesList.find((f) => f.type === type);
    if (!matched) return null;
    const Icon = matched.icon;
    return <Icon size={14} className="text-muted-foreground" />;
  };

  return (
    <aside className={`w-[260px] border-r border-border bg-card flex flex-col justify-between flex-shrink-0 font-sans transition-all duration-300 ease-in-out z-40 fixed lg:relative top-12 lg:top-0 bottom-0 left-0 ${
      isOpen
        ? "translate-x-0 opacity-100"
        : "-translate-x-full lg:-translate-x-full lg:w-0 lg:opacity-0 lg:border-r-0 overflow-hidden pointer-events-none"
    }`}>
      <div className="p-3 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-2 pb-3 mb-1 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
                type="button"
                aria-label="Close panel"
              >
                <X size={13} />
              </button>
            )}
            <span className="text-[11px] font-medium text-muted-foreground">
              Fields
            </span>
          </div>
          <AddFieldMenu onAddField={onAddField} />
        </div>

        {fields.length === 0 ? (
          <div className="text-[11px] text-muted-foreground text-center py-12 px-6 leading-relaxed">
            <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center mx-auto mb-3">
              <span className="text-lg">+</span>
            </div>
            No fields yet. Click + to add your first question.
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 scrollbar-hide pt-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1 pb-4">
                  {fields.map((field, idx) => (
                    <SortableItem
                      key={field.id}
                      field={field}
                      index={idx}
                      isSelected={selectedFieldId === field.id}
                      onClick={() => onSelectField(field.id)}
                      icon={getFieldIcon(field.type)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </aside>
  );
}

interface SortableItemProps {
  field: Field;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

function SortableItem({ field, index, isSelected, onClick, icon }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 40 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-all duration-200 group relative ${
        isSelected
          ? "bg-secondary border border-border text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
      }`}
    >
      {/* Active indicator */}
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
      )}

      <div className="flex items-center gap-2.5 overflow-hidden select-none pr-6">
        {icon}
        <span className="truncate max-w-[140px] font-medium text-[12px]">
          {field.label || `Question ${index + 1}`}
        </span>
      </div>

      <button
        type="button"
        className="absolute right-2 text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={12} />
      </button>
    </div>
  );
}

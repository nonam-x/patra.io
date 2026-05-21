"use client";

import React from "react";
import { GripVertical } from "lucide-react";
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
}

export function FieldList({
  fields,
  selectedFieldId,
  onSelectField,
  onReorderFields,
  onAddField,
  isOpen = false,
}: FieldListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px drag before starting sort
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
    return <Icon size={14} className={matched.color} />;
  };

  return (
    <aside className={`w-64 border-r border-[#27272A] bg-[#111111] flex flex-col justify-between flex-shrink-0 font-sans transition-transform duration-300 z-40 fixed lg:relative top-14 lg:top-0 bottom-0 left-0 ${
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    }`}>
      <div className="p-4 flex flex-col h-full overflow-hidden space-y-4">
        <div className="flex justify-between items-center px-1 flex-shrink-0">
          <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">
            Form Structure
          </span>
          <AddFieldMenu onAddField={onAddField} />
        </div>

        {fields.length === 0 ? (
          <div className="text-[10px] text-[#A1A1AA] text-center p-8 bg-[#18181B]/50 rounded-lg border border-dashed border-[#27272A] font-mono leading-relaxed">
            No questions added. Click the + button above to add structure.
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 pr-1 -mr-1">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1.5 pb-4">
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
      className={`p-2 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition-all duration-200 group relative ${
        isSelected
          ? "bg-primary border-primary text-primary-foreground"
          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:bg-muted/80"
      }`}
    >
      <div className="flex items-center gap-2 overflow-hidden select-none pr-6">
        {icon}
        <span className="truncate max-w-[130px] font-semibold">
          {field.label || `Question ${index + 1}`}
        </span>
      </div>

      <button
        type="button"
        className="absolute right-2 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={13} />
      </button>
    </div>
  );
}

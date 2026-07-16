"use client";

import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldControl } from "@/components/program-renderer/FormRenderer";
import { groupBySection, widthClass } from "@/lib/program-forms/utils";
import type { FieldWidth, ProgramFormField } from "@/lib/program-forms/types";
import { cn } from "@/lib/utils";

const WIDTH_ORDER: FieldWidth[] = ["third", "half", "full"];

function snapWidth(ratio: number): FieldWidth {
  if (ratio < 0.42) return "third";
  if (ratio < 0.75) return "half";
  return "full";
}

interface FieldCanvasProps {
  fields: ProgramFormField[];
  selectedId: string | null;
  readOnly?: boolean;
  onSelect: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onChangeWidth: (id: string, width: FieldWidth) => void;
  onAddField: () => void;
  onDeleteField: (id: string) => void;
}

function SortableFieldCard({
  field,
  selected,
  readOnly,
  onSelect,
  onDelete,
  onChangeWidth,
}: {
  field: ProgramFormField;
  selected: boolean;
  readOnly?: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onChangeWidth: (width: FieldWidth) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id, disabled: readOnly });

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [resizePreview, setResizePreview] = useState<FieldWidth | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  const displayWidth = resizePreview ?? field.width ?? "full";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isResizing ? undefined : transition,
  };

  const setRefs = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    cardRef.current = node;
  };

  const handleResizeStart = (e: ReactPointerEvent) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();

    const card = cardRef.current;
    const grid = card?.parentElement;
    if (!card || !grid) return;

    const gridRect = grid.getBoundingClientRect();
    const startLeft = card.getBoundingClientRect().left;
    const pointerId = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(pointerId);
    setIsResizing(true);

    const onMove = (ev: PointerEvent) => {
      const usable = gridRect.width;
      if (usable <= 0) return;
      const ratio = Math.max(0.1, Math.min(1, (ev.clientX - startLeft) / usable));
      setResizePreview(snapWidth(ratio));
    };

    const onUp = (ev: PointerEvent) => {
      const usable = gridRect.width;
      const ratio =
        usable > 0
          ? Math.max(0.1, Math.min(1, (ev.clientX - startLeft) / usable))
          : 1;
      const next = snapWidth(ratio);
      setResizePreview(null);
      setIsResizing(false);
      if (next !== (field.width ?? "full")) onChangeWidth(next);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const cycleWidth = () => {
    if (readOnly) return;
    const current = field.width ?? "full";
    const idx = WIDTH_ORDER.indexOf(current);
    const next = WIDTH_ORDER[(idx + 1) % WIDTH_ORDER.length];
    onChangeWidth(next);
  };

  return (
    <div
      ref={setRefs}
      style={style}
      className={cn(
        widthClass(displayWidth),
        "group relative rounded-md border bg-white p-3 transition-colors dark:bg-zinc-900",
        selected
          ? "border-primary ring-1 ring-primary/30"
          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
        isDragging && "z-10 opacity-70 shadow-md",
        isResizing && "border-primary/60 ring-1 ring-primary/20"
      )}
      onClick={onSelect}
    >
      {!readOnly && (
        <div className="absolute left-1 top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            className="cursor-grab touch-none rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      )}

      {!readOnly && (
        <div className="absolute right-1 top-1 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            className="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            onClick={(e) => {
              e.stopPropagation();
              cycleWidth();
            }}
            title="Cycle width: full → third → half"
            aria-label="Change field width"
          >
            {displayWidth}
          </button>
          <button
            type="button"
            className="rounded p-0.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete field"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="space-y-1.5 pt-1">
        <Label>
          {field.label || "Untitled"}
          {field.required && <span className="text-red-500"> *</span>}
        </Label>
        {field.help_text && (
          <p className="text-xs text-zinc-500">{field.help_text}</p>
        )}
        <FieldControl field={field} value={undefined} readOnly />
      </div>

      {!readOnly && (
        <button
          type="button"
          className={cn(
            "absolute inset-y-2 right-0 z-20 w-2 cursor-ew-resize rounded-r-md",
            "opacity-0 group-hover:opacity-100",
            "hover:bg-primary/20",
            isResizing && "opacity-100 bg-primary/30"
          )}
          onPointerDown={handleResizeStart}
          onClick={(e) => e.stopPropagation()}
          aria-label="Resize field width"
          title="Drag to resize"
        />
      )}
    </div>
  );
}

export function FieldCanvas({
  fields,
  selectedId,
  readOnly,
  onSelect,
  onReorder,
  onChangeWidth,
  onAddField,
  onDeleteField,
}: FieldCanvasProps) {
  const sorted = useMemo(
    () => fields.slice().sort((a, b) => a.sort_order - b.sort_order),
    [fields]
  );
  const sections = useMemo(() => groupBySection(sorted), [sorted]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = sorted.map((f) => f.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next = [...ids];
    const [moved] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, moved);
    onReorder(next);
  };

  if (sorted.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-200 bg-white px-4 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
          <Plus className="h-5 w-5 text-zinc-500" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            No fields yet
          </p>
          <p className="text-xs text-zinc-500">
            Add questions applicants will answer on this form.
          </p>
        </div>
        {!readOnly && (
          <Button type="button" size="sm" className="mt-1" onClick={onAddField}>
            <Plus className="h-4 w-4" />
            Add your first field
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Form layout
          </h3>
          <p className="text-xs text-zinc-500">
            Drag to reorder · drag the right edge to shrink or expand
          </p>
        </div>
        {!readOnly && (
          <Button
            type="button"
            size="sm"
            className="h-8 px-2.5 text-xs"
            onClick={onAddField}
          >
            <Plus className="h-3.5 w-3.5" />
            Field
          </Button>
        )}
      </div>

      <div className="p-4 sm:p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sorted.map((f) => f.id)}
            strategy={rectSortingStrategy}
          >
            <div className="space-y-8">
              {sections.map(({ section, items }) => (
                <section key={section}>
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    {section}
                  </h4>
                  <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                    {items.map((field) => (
                      <SortableFieldCard
                        key={field.id}
                        field={field}
                        selected={selectedId === field.id}
                        readOnly={readOnly}
                        onSelect={() => onSelect(field.id)}
                        onDelete={() => onDeleteField(field.id)}
                        onChangeWidth={(width) =>
                          onChangeWidth(field.id, width)
                        }
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {!readOnly && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-4 w-full justify-start text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            onClick={onAddField}
          >
            <Plus className="h-3.5 w-3.5" />
            Add field
          </Button>
        )}
      </div>
    </div>
  );
}

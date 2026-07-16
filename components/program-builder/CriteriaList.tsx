"use client";

import { useMemo } from "react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProgramEvaluationCriteria } from "@/lib/program-forms/types";

interface CriteriaListProps {
  criteria: ProgramEvaluationCriteria[];
  selectedId: string | null;
  readOnly?: boolean;
  onSelect: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onAddCriteria: () => void;
  onDeleteCriteria: (id: string) => void;
}

function SortableRow({
  item,
  selected,
  readOnly,
  onSelect,
  onDelete,
}: {
  item: ProgramEvaluationCriteria;
  selected: boolean;
  readOnly?: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, disabled: readOnly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-1 rounded-md border px-2 py-1.5 text-sm transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-transparent hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/70",
        isDragging &&
          "z-10 bg-white opacity-70 shadow-md dark:bg-zinc-900"
      )}
    >
      {!readOnly && (
        <button
          type="button"
          className="cursor-grab touch-none text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}
      <button
        type="button"
        className="flex-1 truncate text-left"
        onClick={onSelect}
      >
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {item.label || "Untitled"}
        </span>
        <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
          {item.criteria_type}
        </span>
        {item.weight > 0 && (
          <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">
            · w{item.weight}
          </span>
        )}
      </button>
      {!readOnly && (
        <button
          type="button"
          className="text-zinc-400 opacity-0 hover:text-red-600 group-hover:opacity-100 dark:text-zinc-500 dark:hover:text-red-400"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete criterion"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function CriteriaList({
  criteria,
  selectedId,
  readOnly,
  onSelect,
  onReorder,
  onAddCriteria,
  onDeleteCriteria,
}: CriteriaListProps) {
  const sorted = useMemo(
    () => criteria.slice().sort((a, b) => a.sort_order - b.sort_order),
    [criteria]
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = sorted.map((c) => c.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next = [...ids];
    const [moved] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, moved);
    onReorder(next);
  };

  return (
    <div className="flex h-full flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Criteria
        </h3>
        {!readOnly && (
          <Button
            type="button"
            size="sm"
            className="h-8 px-2.5 text-xs"
            onClick={onAddCriteria}
          >
            <Plus className="h-3.5 w-3.5" />
            Criterion
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sorted.length === 0 ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 px-4 py-8 text-center">
            <div className="rounded-full bg-zinc-100 p-3">
              <Plus className="h-5 w-5 text-zinc-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-800">No criteria yet</p>
              <p className="text-xs text-zinc-500">
                Add scoring items reviewers will use to evaluate applications.
              </p>
            </div>
            {!readOnly && (
              <Button
                type="button"
                size="sm"
                className="mt-1"
                onClick={onAddCriteria}
              >
                <Plus className="h-4 w-4" />
                Add your first criterion
              </Button>
            )}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sorted.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-0.5">
                {sorted.map((item) => (
                  <SortableRow
                    key={item.id}
                    item={item}
                    selected={selectedId === item.id}
                    readOnly={readOnly}
                    onSelect={() => onSelect(item.id)}
                    onDelete={() => onDeleteCriteria(item.id)}
                  />
                ))}
                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                    onClick={onAddCriteria}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add criterion
                  </Button>
                )}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

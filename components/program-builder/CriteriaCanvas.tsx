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
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CriteriaControl } from "@/components/program-renderer/ScoringForm";
import { groupBySection } from "@/lib/program-forms/utils";
import type { ProgramEvaluationCriteria } from "@/lib/program-forms/types";
import { cn } from "@/lib/utils";

interface CriteriaCanvasProps {
  criteria: ProgramEvaluationCriteria[];
  selectedId: string | null;
  readOnly?: boolean;
  onSelect: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onAddCriteria: () => void;
  onDeleteCriteria: (id: string) => void;
}

function SortableCriteriaCard({
  criterion,
  selected,
  readOnly,
  onSelect,
  onDelete,
}: {
  criterion: ProgramEvaluationCriteria;
  selected: boolean;
  readOnly?: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: criterion.id, disabled: readOnly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "col-span-12 group relative rounded-md border bg-white p-3 transition-colors dark:bg-zinc-900",
        selected
          ? "border-primary ring-1 ring-primary/30"
          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
        isDragging && "z-10 opacity-70 shadow-md"
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
          <span className="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
            0–10
          </span>
          <button
            type="button"
            className="rounded p-0.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete question"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="space-y-1.5 pt-1">
        <Label>
          {criterion.label || "Untitled question"}
          {criterion.required && <span className="text-red-500"> *</span>}
        </Label>
        {criterion.description && (
          <p className="text-xs text-zinc-500">{criterion.description}</p>
        )}
        <CriteriaControl
          criterion={criterion}
          value={undefined}
          readOnly
          showComment={false}
        />
      </div>
    </div>
  );
}

export function CriteriaCanvas({
  criteria,
  selectedId,
  readOnly,
  onSelect,
  onReorder,
  onAddCriteria,
  onDeleteCriteria,
}: CriteriaCanvasProps) {
  const sorted = useMemo(
    () => criteria.slice().sort((a, b) => a.sort_order - b.sort_order),
    [criteria]
  );
  const sections = useMemo(() => groupBySection(sorted), [sorted]);

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

  if (sorted.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-200 bg-white px-4 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
          <Plus className="h-5 w-5 text-zinc-500" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            No questions yet
          </p>
          <p className="text-xs text-zinc-500">
            Add questions reviewers will score from 0 to 10.
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
            Add your first question
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
            Evaluation questions
          </h3>
          <p className="text-xs text-zinc-500">
            Drag to reorder · each question is scored 0–10
          </p>
        </div>
        {!readOnly && (
          <Button
            type="button"
            size="sm"
            className="h-8 px-2.5 text-xs"
            onClick={onAddCriteria}
          >
            <Plus className="h-3.5 w-3.5" />
            Question
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
            items={sorted.map((c) => c.id)}
            strategy={rectSortingStrategy}
          >
            <div className="space-y-8">
              {sections.map(({ section, items }) => (
                <section key={section}>
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    {section}
                  </h4>
                  <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                    {items.map((criterion) => (
                      <SortableCriteriaCard
                        key={criterion.id}
                        criterion={criterion}
                        selected={selectedId === criterion.id}
                        readOnly={readOnly}
                        onSelect={() => onSelect(criterion.id)}
                        onDelete={() => onDeleteCriteria(criterion.id)}
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
            onClick={onAddCriteria}
          >
            <Plus className="h-3.5 w-3.5" />
            Add question
          </Button>
        )}
      </div>
    </div>
  );
}

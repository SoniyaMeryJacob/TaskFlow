"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import TaskColumn from "@/components/TaskColumn";
import TaskForm from "@/components/TaskForm";
import { Task } from "@/types/task";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

async function fetchTasks() {
  const { data } = await api.get<Task[]>("/tasks");
  return data;
}

export default function Home() {
  const queryClient = useQueryClient();

  // fetch
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // search
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(needle));
  }, [q, tasks]);

  // mutation for status update (drag)
  const updateTask = useMutation({
    mutationFn: async (payload: Partial<Task> & { id: string }) =>
      api.put(`/tasks/${payload.id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // dnd sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  // drag end
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const task = tasks.find((t) => t.id === String(active.id));
    const newStatus = String(over.id) as Task["status"];
    if (!task || task.status === newStatus) return;

    // optimistic UI
    queryClient.setQueryData<Task[]>(["tasks"], (prev) =>
      prev ? prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)) : prev
    );

    updateTask.mutate(
      { id: task.id, status: newStatus },
      { onError: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }) }
    );
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        TaskFlow – Kanban Board
      </h1>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tasks by title…"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Create form */}
      <TaskForm />

      {isLoading && (
        <p className="text-center text-gray-500 mt-6 animate-pulse">Loading tasks...</p>
      )}
      {isError && (
        <p className="text-center text-red-500 mt-6">Failed to load tasks. Please try again.</p>
      )}

      {!isLoading && !isError && (
        <DndContext sensors={sensors} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* NOTE: TaskColumn must accept `id` when using DnD */}
            <TaskColumn id="TODO" title="To Do" tasks={filtered.filter((t) => t.status === "TODO")} />
            <TaskColumn
              id="IN_PROGRESS"
              title="In Progress"
              tasks={filtered.filter((t) => t.status === "IN_PROGRESS")}
            />
            <TaskColumn id="DONE" title="Done" tasks={filtered.filter((t) => t.status === "DONE")} />
          </div>
        </DndContext>
      )}
    </main>
  );
}

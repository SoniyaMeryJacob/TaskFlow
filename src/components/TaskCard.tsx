// src/components/TaskCard.tsx
"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import TaskModal from "../components/TaskModal"; // <- new modal

// Priority badge styles (same as before)
const priorityColors: Record<string, string> = {
  LOW: "bg-yellow-100 text-yellow-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-red-100 text-red-800",
};

export default function TaskCard({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => api.delete(`/tasks/${task.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      alert("❌ Failed to delete task. Please try again.");
    },
  });

  const handleDelete = () => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    deleteMutation.mutate();
  };

  return (
    <>
      <div className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
        {/* Header (title + actions) */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              className="p-1 text-gray-400 hover:text-blue-600"
              title="Edit Task"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={16} />
            </button>
            <button
              className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
              title="Delete Task"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Footer (priority + status) */}
        <div className="mt-3 flex items-center justify-between">
          {task.priority && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </span>
          )}
          <span className="text-xs text-gray-500">
            {task.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {isEditing && <TaskModal task={task} onClose={() => setIsEditing(false)} />}
    </>
  );
}

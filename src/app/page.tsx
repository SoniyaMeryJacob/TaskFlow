"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import TaskColumn from "@/components/TaskColumn";
import TaskForm from "@/components/TaskForm";
import { Task } from "@/types/task";

async function fetchTasks() {
  const { data } = await api.get<Task[]>("/tasks");
  return data;
}

export default function Home() {
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">TaskFlow - Kanban Board</h1>
      <TaskForm />

      {isLoading && (
        <p className="text-center text-gray-500 mt-6 animate-pulse">Loading tasks...</p>
      )}

      {isError && (
        <p className="text-center text-red-500 mt-6">Failed to load tasks. Please try again.</p>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <TaskColumn title="To Do" tasks={tasks.filter((t) => t.status === "TODO")} />
          <TaskColumn title="In Progress" tasks={tasks.filter((t) => t.status === "IN_PROGRESS")} />
          <TaskColumn title="Done" tasks={tasks.filter((t) => t.status === "DONE")} />
        </div>
      )}
    </main>
  );
}

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
  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">TaskFlow - Kanban Board</h1>
      <TaskForm />
      <div className="flex flex-col md:flex-row gap-4">
        <TaskColumn title="To Do" tasks={tasks.filter((t) => t.status === "TODO")} />
        <TaskColumn title="In Progress" tasks={tasks.filter((t) => t.status === "IN_PROGRESS")} />
        <TaskColumn title="Done" tasks={tasks.filter((t) => t.status === "DONE")} />
      </div>
    </main>
  );
}

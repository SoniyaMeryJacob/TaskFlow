"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

type FormData = z.infer<typeof schema>;

export default function TaskForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post("/tasks", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white shadow rounded mb-4">
      <input {...register("title")} placeholder="Task title" className="border p-2 w-full mb-2" />
      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      <textarea {...register("description")} placeholder="Description" className="border p-2 w-full mb-2" />
      <select {...register("status")} className="border p-2 w-full mb-2">
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>
      <select {...register("priority")} className="border p-2 w-full mb-2">
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      <button type="submit" disabled={mutation.isPending} className="bg-blue-500 text-white p-2 rounded">
        {mutation.isPending ? "Saving..." : "Add Task"}
      </button>
    </form>
  );
}

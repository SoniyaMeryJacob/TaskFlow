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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post("/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      reset();
    },
    onError: () => {
      alert("❌ Failed to save task. Please try again."); // simple error display
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="p-6 bg-white shadow rounded-xl max-w-xl mx-auto"
    >
      <h2 className="text-lg font-semibold mb-4">Add Task</h2>

      {/* Title */}
      <input
        {...register("title")}
        placeholder="Task title"
        className={`border p-2 w-full mb-1 rounded ${errors.title ? "border-red-500" : ""}`}
      />
      {errors.title && <p className="text-red-500 text-sm mb-2">{errors.title.message}</p>}

      {/* Description */}
      <textarea
        {...register("description")}
        placeholder="Description"
        className="border p-2 w-full mb-2 rounded"
      />

      {/* Status & Priority */}
      <div className="flex gap-2">
        <select {...register("status")} className="border p-2 flex-1 rounded">
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <select {...register("priority")} className="border p-2 flex-1 rounded">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-blue-500 text-white p-2 rounded w-full mt-3 hover:bg-blue-600 transition disabled:opacity-50"
      >
        {mutation.isPending ? "Saving..." : "Add Task"}
      </button>
    </form>
  );
}

import { Task } from "@/types/task";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="p-3 bg-white rounded shadow mb-2">
      <h3 className="font-bold">{task.title}</h3>
      {task.description && <p className="text-sm">{task.description}</p>}
      <span className="text-xs text-gray-500">{task.priority}</span>
    </div>
  );
}

import { Task } from "@/types/task";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition">
      <h3 className="font-semibold text-gray-800">{task.title}</h3>
      {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span className="uppercase">{task.priority}</span>
        <span>{task.status.replace("_", " ")}</span>
      </div>
    </div>
  );
}

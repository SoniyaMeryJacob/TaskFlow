import { Task } from "@/types/task";
import TaskCard from "./TaskCard";

export default function TaskColumn({ title, tasks }: { title: string; tasks: Task[] }) {
  return (
    <div className="flex-1 bg-gray-50 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">{title}</h2>
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <p className="text-sm text-gray-500">No tasks</p>
        )}
      </div>
    </div>
  );
}

import { Task } from "@/types/task";
import TaskCard from "./TaskCard";

export default function TaskColumn({ title, tasks }: { title: string; tasks: Task[] }) {
  return (
    <div className="w-full md:w-1/3 p-2">
      <h2 className="font-semibold mb-2">{title}</h2>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

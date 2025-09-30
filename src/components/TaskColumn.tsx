import { Task } from '@/types/task';
import TaskCard from './TaskCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';


export default function TaskColumn({
title,
id,
tasks,
}: {
title: string;
id: 'TODO' | 'IN_PROGRESS' | 'DONE';
tasks: Task[];
}) {
const { setNodeRef, isOver } = useDroppable({ id, data: { type: 'column', status: id } });


return (
<div
ref={setNodeRef}
className={`flex flex-col rounded-2xl p-4 shadow-inner border border-gray-100 ${
isOver ? 'bg-blue-50' : 'bg-gray-50'
}`}
>
<h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
<SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
<div className="flex-1 space-y-3">
{tasks.length > 0 ? (
tasks.map((task) => <TaskCard key={task.id} task={task} />)
) : (
<p className="text-sm text-gray-400 italic">No tasks</p>
)}
</div>
</SortableContext>
</div>
);
}
import { NextResponse } from "next/server";
import { Task } from "@/types/task";
import tasks from "@/data/tasks.json";

let taskList: Task[] = tasks.map(task => ({
  ...task,
  status: task.status as Task["status"],
  priority: task.priority as Task["priority"]
}));

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const index = taskList.findIndex((t) => t.id === params.id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  taskList[index] = { ...taskList[index], ...body };
  return NextResponse.json(taskList[index]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const index = taskList.findIndex((t) => t.id === params.id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const deleted = taskList.splice(index, 1);
  return NextResponse.json(deleted[0]);
}

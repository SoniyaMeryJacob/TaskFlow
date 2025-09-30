import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import tasks from "@/data/tasks.json";
import { Task } from "@/types/task";

let taskList: Task[] = tasks.map(task => ({
  ...task,
  status: task.status as Task["status"],
  priority: task.priority as Task["priority"],
}));

export async function GET() {
  return NextResponse.json(taskList);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newTask: Task = {
    id: uuidv4(),
    title: body.title,
    description: body.description || "",
    status: body.status || "TODO",
    priority: body.priority || "MEDIUM",
  };
  taskList.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}

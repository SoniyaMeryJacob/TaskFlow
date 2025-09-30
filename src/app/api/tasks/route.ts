import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import tasks from "@/data/tasks.json";
import { Task } from "@/types/task";

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newTask: Task = { id: uuidv4(), ...body };
  tasks.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}

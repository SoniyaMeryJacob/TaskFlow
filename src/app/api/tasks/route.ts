export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { z } from "zod";
import { getAll, create } from "@/lib/db";

const TaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

export async function GET() {
  const tasks = await getAll();
  return Response.json(tasks);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = TaskSchema.parse(body);
    const task = await create(parsed);
    return Response.json(task, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

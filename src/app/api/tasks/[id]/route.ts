import { z } from "zod";
import { update, remove } from "@/lib/db";

const PatchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;              // ✅ read params without fancy TS types
    const body = await req.json();
    const patch = PatchSchema.parse(body);

    const updated = await update(id, patch);
    if (!updated) return Response.json({ error: "Not found" }, { status: 404 });

    return Response.json(updated);
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const ok = await remove(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}

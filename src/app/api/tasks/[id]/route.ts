export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { z } from "zod";
import { update, remove } from "@/lib/db";

const PatchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

// Helper to get the last path segment as id
function getIdFromUrl(req: Request) {
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/");
  return parts[parts.length - 1];
}

export async function PUT(req: Request) {
  try {
    const id = getIdFromUrl(req);
    const body = await req.json();
    const patch = PatchSchema.parse(body);

    const updated = await update(id, patch);
    if (!updated) return Response.json({ error: "Not found" }, { status: 404 });

    return Response.json(updated);
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const id = getIdFromUrl(req);
  const ok = await remove(id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { update, remove } from '@/lib/db';
import { z } from 'zod';


const PatchSchema = z.object({
title: z.string().min(1).optional(),
description: z.string().optional(),
status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});


export async function PUT(
req: NextRequest,
{ params }: { params: { id: string } }
) {
try {
const body = await req.json();
const patch = PatchSchema.parse(body);
const updated = await update(params.id, patch);
if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
return NextResponse.json(updated);
} catch (e) {
return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
}


export async function DELETE(
_req: NextRequest,
{ params }: { params: { id: string } }
) {
const ok = await remove(params.id);
if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
return NextResponse.json({ ok: true });
}
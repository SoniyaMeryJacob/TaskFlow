import { NextRequest, NextResponse } from 'next/server';
import { getAll, create } from '@/lib/db';
import { z } from 'zod';


const TaskSchema = z.object({
title: z.string().min(1),
description: z.string().optional(),
status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});


export async function GET() {
const tasks = await getAll();
return NextResponse.json(tasks);
}


export async function POST(req: NextRequest) {
try {
const body = await req.json();
const parsed = TaskSchema.parse(body);
const task = await create(parsed);
return NextResponse.json(task, { status: 201 });
} catch (e) {
return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
}
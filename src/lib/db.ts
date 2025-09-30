import { Task } from '@/types/task';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';


const DB_PATH = path.join(process.cwd(), 'tasks.json');
let memory: Task[] | null = null;


async function load(): Promise<Task[]> {
if (memory) return memory;
try {
const raw = await fs.readFile(DB_PATH, 'utf-8');
memory = JSON.parse(raw) as Task[];
} catch {
memory = [];
}
return memory!;
}


async function persist(data: Task[]) {
memory = data;
try {
await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
} catch {
// likely running on a read-only FS (e.g., Vercel). Keep in-memory.
}
}


export async function getAll(): Promise<Task[]> {
return load();
}


export async function create(input: Omit<Task, 'id'>): Promise<Task> {
const db = await load();
const task: Task = { id: randomUUID(), ...input };
db.unshift(task);
await persist(db);
return task;
}


export async function update(id: string, patch: Partial<Task>): Promise<Task | null> {
const db = await load();
const idx = db.findIndex((t) => t.id === id);
if (idx === -1) return null;
db[idx] = { ...db[idx], ...patch, id };
await persist(db);
return db[idx];
}


export async function remove(id: string): Promise<boolean> {
const db = await load();
const before = db.length;
const next = db.filter((t) => t.id !== id);
await persist(next);
return next.length !== before;
}
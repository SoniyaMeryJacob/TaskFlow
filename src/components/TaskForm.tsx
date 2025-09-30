'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
const schema = z.object({
title: z.string().min(1, 'Title is required'),
description: z.string().optional(),
status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});


type FormData = z.infer<typeof schema>;


export default function TaskForm() {
const queryClient = useQueryClient();
const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
resolver: zodResolver(schema),
defaultValues: { status: 'TODO', priority: 'MEDIUM' },
});


const mutation = useMutation({
mutationFn: (data: FormData) => api.post('/tasks', data),
onSuccess: () => {
queryClient.invalidateQueries({ queryKey: ['tasks'] });
reset({ title: '', description: '', status: 'TODO', priority: 'MEDIUM' });
},
onError: () => {
alert('❌ Failed to save task. Please try again.');
},
});


return (
<form
onSubmit={handleSubmit((data) => mutation.mutate(data))}
className="p-6 bg-white shadow-lg rounded-2xl max-w-xl mx-auto border border-gray-100"
>
<h2 className="text-xl font-semibold mb-5 text-gray-800">Add Task</h2>


<div className="mb-4">
<input
{...register('title')}
placeholder="Task title"
className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
errors.title ? 'border-red-500' : 'border-gray-300'
}`}
/>
{errors.title && (
<p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
)}
</div>


<div className="mb-4">
<textarea
{...register('description')}
placeholder="Description"
rows={3}
className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
/>
</div>
<div className="flex gap-3 mb-4">
<select
{...register('status')}
className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
>
<option value="TODO">To Do</option>
<option value="IN_PROGRESS">In Progress</option>
<option value="DONE">Done</option>
</select>


<select
{...register('priority')}
className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
>
<option value="LOW">Low</option>
<option value="MEDIUM">Medium</option>
<option value="HIGH">High</option>
</select>
</div>


<button
type="submit"
disabled={mutation.isPending}
className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
>
{mutation.isPending ? 'Saving...' : 'Add Task'}
</button>
</form>
);
}
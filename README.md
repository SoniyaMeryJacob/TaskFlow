# TaskFlow – Mini Kanban Board

A small Kanban board application built with **Next.js (App Router)** and **TypeScript**.  
It allows users to create, edit, delete, and drag tasks across columns ("To Do", "In Progress", "Done").

This project was designed as a take-home task to demonstrate modern React/Next.js development, state management, API handling, and user experience.

---

## ✨ Features

### Core Requirements

- ✅ Next.js (App Router) + TypeScript
- ✅ Mock API with Next.js **Route Handlers** (`/api/tasks`)
- ✅ CRUD operations (create, update, delete, fetch)
- ✅ **TanStack Query v5** for server state management
- ✅ **Axios** for API requests
- ✅ **React Hook Form + Zod** for form state & validation
- ✅ Responsive Kanban board (To Do / In Progress / Done)
- ✅ Automatic UI refresh on mutations

### Bonus Features

- 🎯 **Drag & Drop** with `dnd-kit` to move tasks between columns (updates status via PUT)
- 🔍 **Search/filter** tasks by title
- 🔔 **Toast notifications** (success & error states) with [sonner](https://sonner.emilkowal.ski/)
- ⚡ **Optimistic updates** for smooth UX
- 🟦 Loading & error states (graceful fallback UI)

---

## 🛠️ Tech Stack

- [Next.js 14+](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query v5](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [dnd-kit](https://dndkit.com/)
- [sonner](https://sonner.emilkowal.ski/) (toasts)

---

## 📂 Project Structure

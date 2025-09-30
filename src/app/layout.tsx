import type { Metadata } from 'next';
import './globals.css';
import Providers from '../app/providers';


export const metadata: Metadata = {
title: 'TaskFlow – Kanban',
description: 'Mini Kanban Board with Next.js, TanStack Query, and dnd-kit',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<Providers>{children}</Providers>
</body>
</html>
);
}
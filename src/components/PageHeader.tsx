import type { ReactNode } from "react";

export default function PageHeader({ title, children }: { title: string; children: ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-400">{children}</p>
    </header>
  );
}

"use client";

import ErrorView from "@/components/ErrorView";

/** Erros de layouts (ex.: backend indisponível ao validar a sessão no layout protegido). */
export default function RootError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <ErrorView {...props} />
    </main>
  );
}

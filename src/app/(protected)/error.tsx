"use client";

import ErrorView from "@/components/ErrorView";

/** Erros das páginas protegidas (renderizado dentro do <main> do layout). */
export default function ProtectedError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorView {...props} />;
}

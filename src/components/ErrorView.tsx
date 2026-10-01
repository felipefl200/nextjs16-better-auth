"use client";

import { useEffect } from "react";

type ErrorViewProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorView({ error, reset }: ErrorViewProps) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <section
      role="alert"
      aria-labelledby="error-title"
      className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-md w-full">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg aria-hidden="true" focusable="false" className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 id="error-title" className="text-2xl font-bold text-white mb-2">
          Algo deu errado!
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          Não foi possível carregar esta página. Verifique sua conexão ou tente novamente.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
        >
          Tentar novamente
        </button>
      </div>
    </section>
  );
}

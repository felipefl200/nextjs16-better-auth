"use client";

import { useState, useTransition } from "react";
import { makeLogoutUseCase } from "@/infrastructure/auth/clientAuth";
import { toErrorMessage } from "@/components/auth/errorMessage";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    setError(null);
    startTransition(async () => {
      try {
        await makeLogoutUseCase().execute();
        window.location.assign("/login");
      } catch (err) {
        setError(toErrorMessage(err, "Não foi possível sair. Tente novamente."));
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <p role="alert" className={error ? "text-xs text-red-400" : "sr-only"}>
        {error}
      </p>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        aria-busy={isPending}
        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-all font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? "Saindo..." : "Sair"}
      </button>
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FetchAuthGateway } from "@/src/infrastructure/auth/FetchAuthGateway";
import { AuthenticateTwoFactorUseCase } from "@/src/application/use-cases/AuthenticateTwoFactorUseCase";

function getSafeRedirectUrl(urlParam: string | null): string {
  if (!urlParam) return "/dashboard";
  if (urlParam.startsWith("/") && !urlParam.startsWith("//") && !urlParam.includes(":")) {
    return urlParam;
  }
  return "/dashboard";
}

function TwoFactorChallengeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirectTo = searchParams.get("redirectTo");
  const targetUrl = getSafeRedirectUrl(rawRedirectTo);

  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(true);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const gateway = new FetchAuthGateway();
      const useCase = new AuthenticateTwoFactorUseCase(gateway);

      if (useBackupCode) {
        await useCase.executeBackupCode(code.trim(), trustDevice);
      } else {
        await useCase.executeTotp(code.trim(), trustDevice);
      }

      // Autenticado com sucesso via 2FA -> navega para a URL solicitada ou /dashboard
      router.push(targetUrl);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Falha na validação do 2FA. Tente novamente.");
      }
      setIsPending(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl">
      <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-white mb-2 text-center">
        Verificação em Duas Etapas
      </h1>
      <p className="text-gray-400 text-center mb-8 text-sm">
        {useBackupCode
          ? "Digite um dos seus códigos de backup salvos"
          : "Abra seu aplicativo autenticador (Google Authenticator / Authy) e digite o código de 6 dígitos"}
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {useBackupCode
              ? "Código de Backup"
              : "Código de Autenticação (6 dígitos)"}
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={useBackupCode ? "ex: a1b2c3d4e5" : "000000"}
            maxLength={useBackupCode ? 20 : 6}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none placeholder-gray-600 text-center font-mono text-lg tracking-widest text-white"
            required
            autoFocus
          />
        </div>

        <div className="flex items-center space-x-3 bg-gray-950/50 p-3 rounded-xl border border-gray-800/80">
          <input
            id="trustDevice"
            type="checkbox"
            checked={trustDevice}
            onChange={(e) => setTrustDevice(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-indigo-500 focus:ring-indigo-500/20"
          />
          <label
            htmlFor="trustDevice"
            className="text-xs text-gray-300 cursor-pointer"
          >
            Lembrar deste dispositivo por 30 dias
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending || !code.trim()}
          className="w-full py-3 px-4 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? "Verificando..." : "Confirmar e Entrar"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-800/80 text-center">
        <button
          type="button"
          onClick={() => {
            setUseBackupCode(!useBackupCode);
            setCode("");
            setError(null);
          }}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          {useBackupCode
            ? "← Usar aplicativo de autenticação (TOTP)"
            : "Não tem acesso ao celular? Usar código de backup"}
        </button>
      </div>
    </div>
  );
}

export default function TwoFactorChallengePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-indigo-500/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />

      <Suspense fallback={<div className="text-white text-sm">Carregando...</div>}>
        <TwoFactorChallengeForm />
      </Suspense>
    </div>
  );
}

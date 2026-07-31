"use client";

import { useActionState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FetchAuthGateway } from "@/src/infrastructure/auth/FetchAuthGateway";
import { LoginUseCase } from "@/src/application/use-cases/LoginUseCase";

function getSafeRedirectUrl(urlParam: string | null): string {
  if (!urlParam) return "/dashboard";
  if (urlParam.startsWith("/") && !urlParam.startsWith("//") && !urlParam.includes(":")) {
    return urlParam;
  }
  return "/dashboard";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirectTo = searchParams.get("redirectTo");
  const targetUrl = getSafeRedirectUrl(rawRedirectTo);

  const [state, formAction, isPending] = useActionState(
    async (prevState: { error: string | null }, formData: FormData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        const gateway = new FetchAuthGateway();
        const loginUseCase = new LoginUseCase(gateway);
        const result = await loginUseCase.execute(email, password);

        if (result?.twoFactorRedirect) {
          router.push(`/login/2fa?redirectTo=${encodeURIComponent(targetUrl)}`);
          router.refresh();
          return { error: null };
        }

        // Se sucesso sem 2FA, navega para a URL solicitada ou /dashboard
        router.push(targetUrl);
        router.refresh();
        return { error: null };
      } catch (err: unknown) {
        if (err instanceof Error) {
          return { error: err.message };
        } else {
          return { error: "Erro ao realizar login." };
        }
      }
    },
    { error: null },
  );

  return (
    <div className="relative z-10 w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-bold text-white mb-2 text-center">
        Bem-vindo de volta
      </h1>
      <p className="text-gray-400 text-center mb-8">
        Faça login para acessar sua conta
      </p>

      {state.error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            E-mail
          </label>
          <input
            name="email"
            type="email"
            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none placeholder-gray-500"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Senha
          </label>
          <input
            name="password"
            type="password"
            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none placeholder-gray-500"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-400 text-sm">
        Ainda não tem uma conta?{" "}
        <button
          onClick={() => router.push("/register")}
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Cadastre-se
        </button>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-indigo-500/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px]" />

      <Suspense fallback={<div className="text-white text-sm">Carregando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

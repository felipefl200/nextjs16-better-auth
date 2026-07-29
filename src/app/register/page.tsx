"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { FetchAuthGateway } from "../../infrastructure/auth/FetchAuthGateway";
import { RegisterUseCase } from "../../application/use-cases/RegisterUseCase";

export default function RegisterPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (prevState: { error: string | null }, formData: FormData) => {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        const gateway = new FetchAuthGateway();
        const registerUseCase = new RegisterUseCase(gateway);
        await registerUseCase.execute(email, password, name);

        window.location.href = "/dashboard";
        return { error: null };
      } catch (err: unknown) {
        if (err instanceof Error) {
          return { error: err.message };
        } else {
          return { error: "Erro ao realizar cadastro." };
        }
      }
    },
    { error: null },
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Criar Conta
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Junte-se a nós hoje mesmo
        </p>

        {state.error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome Completo
            </label>
            <input
              name="name"
              type="text"
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none placeholder-gray-500"
              placeholder="Seu nome"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              E-mail
            </label>
            <input
              name="email"
              type="email"
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none placeholder-gray-500"
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
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none placeholder-gray-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 bg-linear-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? "Criando..." : "Criar Conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Já tem uma conta?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
}

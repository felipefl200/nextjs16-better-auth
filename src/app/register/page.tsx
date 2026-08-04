"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { FetchAuthGateway } from "@/src/infrastructure/auth/FetchAuthGateway";
import { RegisterUseCase } from "@/src/application/use-cases/RegisterUseCase";
import { Card, Input, Button, Alert } from "@/src/components/ui";

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

        router.push("/dashboard");
        router.refresh();
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

      <Card variant="glass" className="relative z-10 w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Criar Conta
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Junte-se a nós hoje mesmo
        </p>

        {state.error && (
          <Alert variant="danger" className="mb-6">
            {state.error}
          </Alert>
        )}

        <form action={formAction} className="space-y-6">
          <Input
            label="Nome Completo"
            name="name"
            type="text"
            placeholder="Seu nome"
            required
          />

          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="seu@email.com"
            required
          />

          <Input
            label="Senha"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            isLoading={isPending}
            fullWidth
            size="lg"
          >
            {isPending ? "Criando..." : "Criar Conta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Já tem uma conta?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors cursor-pointer"
          >
            Faça login
          </button>
        </p>
      </Card>
    </div>
  );
}

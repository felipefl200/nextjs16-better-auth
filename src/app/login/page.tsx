"use client";

import { useActionState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FetchAuthGateway } from "@/src/infrastructure/auth/FetchAuthGateway";
import { LoginUseCase } from "@/src/application/use-cases/LoginUseCase";
import { UserBannedError } from "@/src/domain/errors/AuthErrors";
import { Card, Input, Button, Alert } from "@/src/components/ui";

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
    async (
      prevState: { error: string | null; isBanned?: boolean },
      formData: FormData,
    ) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        const gateway = new FetchAuthGateway();
        const loginUseCase = new LoginUseCase(gateway);
        const result = await loginUseCase.execute(email, password);

        if (result?.twoFactorRedirect) {
          router.push(`/login/2fa?redirectTo=${encodeURIComponent(targetUrl)}`);
          router.refresh();
          return { error: null, isBanned: false };
        }

        // Se sucesso sem 2FA, navega para a URL solicitada ou /dashboard
        router.push(targetUrl);
        router.refresh();
        return { error: null, isBanned: false };
      } catch (err: unknown) {
        if (err instanceof UserBannedError) {
          return { error: err.message, isBanned: true };
        } else if (err instanceof Error) {
          return { error: err.message, isBanned: false };
        } else {
          return { error: "Erro ao realizar login.", isBanned: false };
        }
      }
    },
    { error: null, isBanned: false },
  );

  return (
    <Card variant="glass" className="relative z-10 w-full max-w-md p-8">
      <h1 className="text-3xl font-bold text-white mb-2 text-center">
        Bem-vindo de volta
      </h1>
      <p className="text-gray-400 text-center mb-8">
        Faça login para acessar sua conta
      </p>

      {state.error && (
        <Alert
          variant={state.isBanned ? "warning" : "danger"}
          title={state.isBanned ? "Conta Suspensa" : undefined}
          className="mb-6"
        >
          {state.error}
        </Alert>
      )}

      <form action={formAction} className="space-y-6">
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
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-400 text-sm">
        Ainda não tem uma conta?{" "}
        <button
          onClick={() => router.push("/register")}
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
        >
          Cadastre-se
        </button>
      </p>
    </Card>
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

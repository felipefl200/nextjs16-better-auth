"use client";

import { useActionState } from "react";
import FormField from "@/components/auth/FormField";
import FormError from "@/components/auth/FormError";
import { toErrorMessage } from "@/components/auth/errorMessage";
import { makeLoginUseCase } from "@/infrastructure/auth/clientAuth";

// Os valores são devolvidos no estado porque o React 19 reseta o formulário após a action
type FormState = { error: string | null; email: string };

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: FormState, formData: FormData): Promise<FormState> => {
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      try {
        await makeLoginUseCase().execute(email, password);
        // Navegação completa para que o servidor leia os novos cookies
        window.location.assign(callbackUrl);
        return { error: null, email };
      } catch (err: unknown) {
        return { error: toErrorMessage(err, "Erro ao realizar login."), email };
      }
    },
    { error: null, email: "" },
  );

  return (
    <>
      <FormError id="login-error" message={state.error} />

      <form
        action={formAction}
        aria-describedby={state.error ? "login-error" : undefined}
        aria-busy={isPending}
      >
        <fieldset disabled={isPending} className="space-y-6">
          <legend className="sr-only">Credenciais de acesso</legend>

          <FormField
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={state.email}
            placeholder="seu@email.com"
            required
            accent="indigo"
          />

          <FormField
            label="Senha"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            accent="indigo"
          />

          <button
            type="submit"
            className="w-full py-3 px-4 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>
        </fieldset>
      </form>
    </>
  );
}

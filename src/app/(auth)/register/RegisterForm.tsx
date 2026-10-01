"use client";

import { useActionState } from "react";
import FormField from "@/components/auth/FormField";
import FormError from "@/components/auth/FormError";
import { toErrorMessage } from "@/components/auth/errorMessage";
import { makeRegisterUseCase } from "@/infrastructure/auth/clientAuth";
import { DEFAULT_LOGIN_REDIRECT } from "@/infrastructure/auth/constants";

// Os valores são devolvidos no estado porque o React 19 reseta o formulário após a action
type FormState = { error: string | null; name: string; email: string };

const MIN_PASSWORD_LENGTH = 8;

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: FormState, formData: FormData): Promise<FormState> => {
      const name = String(formData.get("name") ?? "");
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      try {
        await makeRegisterUseCase().execute(email, password, name);
        window.location.assign(DEFAULT_LOGIN_REDIRECT);
        return { error: null, name, email };
      } catch (err: unknown) {
        return { error: toErrorMessage(err, "Erro ao realizar cadastro."), name, email };
      }
    },
    { error: null, name: "", email: "" },
  );

  return (
    <>
      <FormError id="register-error" message={state.error} />

      <form
        action={formAction}
        aria-describedby={state.error ? "register-error" : undefined}
        aria-busy={isPending}
      >
        <fieldset disabled={isPending} className="space-y-6">
          <legend className="sr-only">Dados da nova conta</legend>

          <FormField
            label="Nome completo"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={state.name}
            placeholder="Seu nome"
            required
            accent="purple"
          />

          <FormField
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={state.email}
            placeholder="seu@email.com"
            required
            accent="purple"
          />

          <FormField
            label="Senha"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            minLength={MIN_PASSWORD_LENGTH}
            hint={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`}
            required
            accent="purple"
          />

          <button
            type="submit"
            className="w-full py-3 px-4 bg-linear-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? "Criando..." : "Criar conta"}
          </button>
        </fieldset>
      </form>
    </>
  );
}

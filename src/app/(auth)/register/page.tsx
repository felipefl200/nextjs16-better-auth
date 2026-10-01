import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { getOptionalSession } from "@/infrastructure/auth/getRequiredSession";
import { DEFAULT_LOGIN_REDIRECT } from "@/infrastructure/auth/constants";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = { title: "Criar conta" };

export default async function RegisterPage() {
  if (await getOptionalSession()) {
    redirect(DEFAULT_LOGIN_REDIRECT);
  }

  return (
    <AuthCard
      title="Criar conta"
      description="Junte-se a nós hoje mesmo"
      accent="purple"
      footer={
        <p>
          Já tem uma conta?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Faça login
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { getOptionalSession } from "@/infrastructure/auth/getRequiredSession";
import { sanitizeCallbackUrl } from "@/infrastructure/auth/safeRedirect";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const { callbackUrl: rawCallbackUrl } = await searchParams;
  const callbackUrl = sanitizeCallbackUrl(
    Array.isArray(rawCallbackUrl) ? rawCallbackUrl[0] : rawCallbackUrl,
  );

  if (await getOptionalSession()) {
    redirect(callbackUrl);
  }

  return (
    <AuthCard
      title="Bem-vindo de volta"
      description="Faça login para acessar seu dashboard"
      accent="indigo"
      footer={
        <p>
          Ainda não tem uma conta?{" "}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Cadastre-se
          </Link>
        </p>
      }
    >
      <LoginForm callbackUrl={callbackUrl} />
    </AuthCard>
  );
}

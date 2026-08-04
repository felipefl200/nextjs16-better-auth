import { getRequiredSession } from "@/src/infrastructure/auth/getRequiredSession";
import Link from "next/link";
import { Card, Badge } from "@/src/components/ui";

export default async function DashboardPage() {
  const session = await getRequiredSession();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Bem-vindo de volta,{" "}
          <span className="text-indigo-400 font-medium">
            {session.user.name}
          </span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="gradient">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-indigo-400">
              Seu Perfil
            </h3>
            <Badge variant="indigo" pill>
              Ativo
            </Badge>
          </div>
          <p className="text-gray-300 text-sm mb-1">
            <strong>Nome:</strong> {session.user.name}
          </p>
          <p className="text-gray-300 text-sm mb-4">
            <strong>Email:</strong> {session.user.email}
          </p>
          <Link
            href="/profile"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4"
          >
            Ver Perfil Completo →
          </Link>
        </Card>

        <Card variant="default">
          <h3 className="text-xl font-semibold text-white mb-2">Segurança</h3>
          <p className="text-gray-400 text-sm mb-4">
            Sua sessão está ativa e sincronizada pelo middleware proxy.
          </p>
          <Badge variant="success">
            Sessão Válida
          </Badge>
        </Card>

        <Card variant="default">
          <h3 className="text-xl font-semibold text-white mb-2">
            Configurações
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Gerencie suas preferências de conta e notificações.
          </p>
          <Link
            href="/settings"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4"
          >
            Ir para Configurações →
          </Link>
        </Card>
      </div>
    </div>
  );
}

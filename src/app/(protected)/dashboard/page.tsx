import { getRequiredSession } from "@/src/infrastructure/auth/getRequiredSession";
import Link from "next/link";

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
        <div className="bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-indigo-400">
              Seu Perfil
            </h3>
            <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
              Ativo
            </span>
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
        </div>

        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-2">Segurança</h3>
          <p className="text-gray-400 text-sm mb-4">
            Sua sessão está ativa e sincronizada pelo middleware proxy.
          </p>
          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            Sessão Válida
          </span>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
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
        </div>
      </div>
    </div>
  );
}

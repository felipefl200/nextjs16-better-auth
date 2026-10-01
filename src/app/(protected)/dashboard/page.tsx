import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getRequiredSession } from "@/infrastructure/auth/getRequiredSession";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { user } = await getRequiredSession();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <PageHeader title="Dashboard">
        Bem-vindo de volta, <strong className="text-indigo-400 font-medium">{user.name}</strong>
      </PageHeader>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" aria-label="Resumo da conta">
        <li>
          <article
            aria-labelledby="card-perfil"
            className="h-full bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-6 rounded-2xl"
          >
            <header className="flex justify-between items-start mb-4">
              <h2 id="card-perfil" className="text-xl font-semibold text-indigo-400">
                Seu perfil
              </h2>
              <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                Ativo
              </span>
            </header>
            <dl className="text-gray-300 text-sm mb-4 space-y-1">
              <div>
                <dt className="inline font-semibold">Nome: </dt>
                <dd className="inline">{user.name}</dd>
              </div>
              <div>
                <dt className="inline font-semibold">E-mail: </dt>
                <dd className="inline">{user.email}</dd>
              </div>
            </dl>
            <Link
              href="/profile"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4"
            >
              Ver perfil completo <span aria-hidden="true">→</span>
            </Link>
          </article>
        </li>

        <li>
          <article aria-labelledby="card-seguranca" className="h-full bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
            <h2 id="card-seguranca" className="text-xl font-semibold text-white mb-2">
              Segurança
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Sua sessão foi validada no servidor pelo backend Better Auth.
            </p>
            <p className="inline-block px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
              Sessão válida
            </p>
          </article>
        </li>

        <li>
          <article aria-labelledby="card-config" className="h-full bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
            <h2 id="card-config" className="text-xl font-semibold text-white mb-2">
              Configurações
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Gerencie suas preferências de conta e notificações.
            </p>
            <Link
              href="/settings"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4"
            >
              Ir para configurações <span aria-hidden="true">→</span>
            </Link>
          </article>
        </li>
      </ul>
    </div>
  );
}

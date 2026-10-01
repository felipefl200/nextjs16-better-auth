import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { getRequiredSession } from "@/infrastructure/auth/getRequiredSession";

export const metadata: Metadata = { title: "Meu perfil" };

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return initials || "?";
}

const fieldValue = "mt-1 text-gray-200 font-medium bg-gray-950/50 p-3 rounded-xl border border-gray-800";
const fieldLabel = "text-xs text-gray-500 uppercase tracking-wider";

export default async function ProfilePage() {
  const { user } = await getRequiredSession();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <PageHeader title="Meu perfil">Informações e detalhes da sua conta</PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section
          aria-label="Cartão do usuário"
          className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl flex flex-col items-center text-center"
        >
          <span
            aria-hidden="true"
            className="w-24 h-24 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-500/20 mb-4 border-2 border-indigo-400/30"
          >
            {getInitials(user.name)}
          </span>
          <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
          <p className="text-gray-400 text-sm mb-4">{user.email}</p>
          <p className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
            Autenticado via Better Auth
          </p>
        </section>

        <div className="lg:col-span-2 space-y-6">
          <section aria-labelledby="dados-conta" className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
            <h2 id="dados-conta" className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-3">
              Dados da conta
            </h2>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className={fieldLabel}>Nome completo</dt>
                <dd className={fieldValue}>{user.name}</dd>
              </div>

              <div>
                <dt className={fieldLabel}>Endereço de e-mail</dt>
                <dd className={fieldValue}>{user.email}</dd>
              </div>

              <div>
                <dt className={fieldLabel}>ID do usuário</dt>
                <dd className={`${fieldValue} text-gray-400! font-mono text-xs break-all`}>
                  <code>{user.id}</code>
                </dd>
              </div>

              <div>
                <dt className={fieldLabel}>Status do e-mail</dt>
                <dd
                  className={`${fieldValue} flex items-center gap-2 ${
                    user.emailVerified ? "text-emerald-400!" : "text-amber-400!"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`w-2 h-2 rounded-full ${user.emailVerified ? "bg-emerald-400" : "bg-amber-400"}`}
                  />
                  {user.emailVerified ? "Verificado" : "Não verificado"}
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="detalhes-sessao" className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
            <h2 id="detalhes-sessao" className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-3">
              Detalhes arquiteturais da sessão
            </h2>
            <ul className="text-sm text-gray-400 space-y-2 list-['✓_'] list-inside">
              <li>
                A rota foi liberada pelo <code className="text-indigo-400">proxy.ts</code> (checagem otimista do
                cookie) e validada no servidor por <code className="text-indigo-400">getRequiredSession()</code>.
              </li>
              <li>
                A sessão é buscada uma única vez por request graças ao{" "}
                <code className="text-indigo-400">cache()</code> do React.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

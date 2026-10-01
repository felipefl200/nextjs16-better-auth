import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { getRequiredSession } from "@/infrastructure/auth/getRequiredSession";

export const metadata: Metadata = { title: "Configurações" };

function ComingSoon() {
  return (
    <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold uppercase bg-gray-800 text-gray-400 rounded-full">
      Em breve
    </span>
  );
}

export default async function SettingsPage() {
  const { user } = await getRequiredSession();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <PageHeader title="Configurações">Gerencie suas preferências de conta e segurança</PageHeader>

      <div className="space-y-6">
        <section aria-labelledby="seguranca" className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
          <h2 id="seguranca" className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-3">
            Segurança da conta
          </h2>

          <ul className="space-y-4">
            <li className="flex items-center justify-between gap-4 p-4 bg-gray-950/50 rounded-xl border border-gray-800">
              <div>
                <h3 id="titulo-2fa" className="text-sm font-medium text-white">
                  Autenticação em duas etapas (2FA)
                  <ComingSoon />
                </h3>
                <p id="desc-2fa" className="text-xs text-gray-400">
                  Adicione uma camada extra de segurança à sua conta.
                </p>
              </div>
              <button
                type="button"
                disabled
                aria-describedby="titulo-2fa desc-2fa"
                className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Configurar 2FA
              </button>
            </li>

            <li className="flex items-center justify-between gap-4 p-4 bg-gray-950/50 rounded-xl border border-gray-800">
              <div>
                <h3 className="text-sm font-medium text-white">Sessões ativas</h3>
                <p className="text-xs text-gray-400">Sua sessão atual foi autenticada via NestJS &amp; Better Auth.</p>
              </div>
              <p className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Sessão atual
              </p>
            </li>
          </ul>
        </section>

        <section aria-labelledby="notificacoes" className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
          <h2 id="notificacoes" className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-3">
            Preferências de notificação
          </h2>

          <form>
            <fieldset disabled>
              <legend className="sr-only">Notificações por e-mail</legend>
              <p className="flex items-center justify-between gap-4">
                <label htmlFor="alertas-login" className="block">
                  <span className="text-sm font-medium text-white">
                    Alertas de login
                    <ComingSoon />
                  </span>
                  <span id="desc-alertas-login" className="block text-xs text-gray-400">
                    Receba notificações por e-mail sobre novos acessos à sua conta.
                  </span>
                </label>
                <input
                  id="alertas-login"
                  name="loginAlerts"
                  type="checkbox"
                  aria-describedby="desc-alertas-login"
                  className="w-5 h-5 rounded bg-gray-950 border-gray-800 text-indigo-500 focus:ring-indigo-500/20 disabled:cursor-not-allowed"
                />
              </p>
            </fieldset>
          </form>

          <div className="flex items-center justify-between gap-4 border-t border-gray-800/50 pt-4 mt-4">
            <div>
              <h3 className="text-sm font-medium text-white">Renovação automática de sessão</h3>
              <p className="text-xs text-gray-400">
                Sua sessão é renovada de forma transparente pelo SessionRefresher a cada navegação.
              </p>
            </div>
            <p className="text-xs font-medium text-indigo-400">Habilitado</p>
          </div>
        </section>

        <section aria-labelledby="info-sessao" className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
          <h2 id="info-sessao" className="text-lg font-semibold text-white mb-2">
            Informações da sessão
          </h2>
          <p className="text-xs text-gray-400">
            Conectado como <strong className="text-gray-200 font-medium">{user.email}</strong>. Esta página validou a
            sessão no servidor antes de ser renderizada.
          </p>
        </section>
      </div>
    </div>
  );
}

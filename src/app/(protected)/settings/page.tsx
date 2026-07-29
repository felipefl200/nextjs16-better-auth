import { getRequiredSession } from "@/src/infrastructure/auth/getRequiredSession";

export default async function SettingsPage() {
  const session = await getRequiredSession();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-gray-400">Gerencie suas preferências de conta e segurança</p>
      </header>

      <div className="space-y-6">
        {/* Account Security */}
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-3">
            Segurança da Conta
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-xl border border-gray-800">
              <div>
                <h4 className="text-sm font-medium text-white">Autenticação em Duas Etapas (2FA)</h4>
                <p className="text-xs text-gray-400">Adicione uma camada extra de segurança à sua conta.</p>
              </div>
              <button className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all">
                Configurar 2FA
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-xl border border-gray-800">
              <div>
                <h4 className="text-sm font-medium text-white">Sessões Ativas</h4>
                <p className="text-xs text-gray-400">Sua sessão atual foi autenticada via NestJS & Better Auth.</p>
              </div>
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Sessão Atual
              </span>
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-3">
            Preferências de Notificação
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-white">Alertas de Login</h4>
                <p className="text-xs text-gray-400">Receba notificações por e-mail sobre novos acessos à sua conta.</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded bg-gray-950 border-gray-800 text-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-800/50 pt-4">
              <div>
                <h4 className="text-sm font-medium text-white">Renovação de Sessão Automática</h4>
                <p className="text-xs text-gray-400">Sua sessão é atualizada de forma transparente pelo proxy + SessionRefresher.</p>
              </div>
              <span className="text-xs font-medium text-indigo-400">Habilitado</span>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">Informações da Sessão</h3>
          <p className="text-xs text-gray-400">
            Conectado como <span className="text-gray-200 font-medium">{session.user.email}</span>. O layout central do grupo <code className="text-indigo-400">(protected)</code> protegeu essa rota antes do carregamento.
          </p>
        </div>
      </div>
    </div>
  );
}

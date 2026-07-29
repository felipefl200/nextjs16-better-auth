import { getRequiredSession } from "@/src/infrastructure/auth/getRequiredSession";

export default async function ProfilePage() {
  const session = await getRequiredSession();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil</h1>
        <p className="text-gray-400">Informações e detalhes da sua conta</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-500/20 mb-4 border-2 border-indigo-400/30">
            {getInitials(session.user.name || "User")}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            {session.user.name}
          </h2>
          <p className="text-gray-400 text-sm mb-4">{session.user.email}</p>

          <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
            Autenticado via Better Auth
          </span>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-3">
              Dados da Conta
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                  Nome Completo
                </label>
                <div className="text-gray-200 font-medium bg-gray-950/50 p-3 rounded-xl border border-gray-800">
                  {session.user.name}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                  Endereço de E-mail
                </label>
                <div className="text-gray-200 font-medium bg-gray-950/50 p-3 rounded-xl border border-gray-800">
                  {session.user.email}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                  ID do Usuário
                </label>
                <div className="text-gray-400 font-mono text-xs bg-gray-950/50 p-3 rounded-xl border border-gray-800 break-all">
                  {session.user.id}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                  Status da Conta
                </label>
                <div className="text-emerald-400 font-medium bg-gray-950/50 p-3 rounded-xl border border-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Ativa & Verificada
                </div>
              </div>
            </div>
          </div>

          {/* Technical Info Card */}
          <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-3">
              Detalhes Arquiteturais da Sessão
            </h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>
                ✓ A autorização desta rota foi herdada pelo{" "}
                <code className="text-indigo-400">layout.tsx</code> em{" "}
                <code className="text-indigo-400">app/(protected)</code>.
              </p>
              <p>
                ✓ A sessão foi resolvida via{" "}
                <code className="text-indigo-400">getRequiredSession()</code>{" "}
                reutilizando a memoização do Next.js.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

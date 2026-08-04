import { createServerAdminGateway } from '@/src/infrastructure/admin/ServerAdminGatewayFactory';
import { ListUsersUseCase } from '@/src/application/use-cases/admin/ListUsersUseCase';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const gateway = await createServerAdminGateway();
  const listUsersUseCase = new ListUsersUseCase(gateway);

  let totalUsers = 0;
  let bannedCount = 0;
  let adminCount = 0;

  try {
    const [totalRes, bannedRes, adminRes] = await Promise.all([
      listUsersUseCase.execute({ limit: 1 }),
      listUsersUseCase.execute({ limit: 1, filterField: 'banned', filterValue: true }),
      listUsersUseCase.execute({ limit: 1, filterField: 'role', filterValue: 'admin' }),
    ]);

    totalUsers = totalRes.total;
    bannedCount = bannedRes.total;
    adminCount = adminRes.total;
  } catch {
    // Fallback gracioso
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm font-medium">Total de Usuários</span>
            <span className="text-indigo-400 font-bold text-xs bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
              Registrados
            </span>
          </div>
          <p className="text-4xl font-extrabold text-white">{totalUsers}</p>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm font-medium">Administradores</span>
            <span className="text-purple-400 font-bold text-xs bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">
              Role: Admin
            </span>
          </div>
          <p className="text-4xl font-extrabold text-white">{adminCount}</p>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm font-medium">Usuários Banidos</span>
            <span className="text-rose-400 font-bold text-xs bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20">
              Restringidos
            </span>
          </div>
          <p className="text-4xl font-extrabold text-white">{bannedCount}</p>
        </div>
      </div>

      <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/users"
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium rounded-xl border border-gray-700 transition-all"
          >
            Gerenciar Usuários
          </Link>
          <Link
            href="/admin/users/new"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            Cadastrar Novo Usuário
          </Link>
        </div>
      </div>
    </div>
  );
}

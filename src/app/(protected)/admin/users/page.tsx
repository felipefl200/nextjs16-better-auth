import { createServerAdminGateway } from '@/src/infrastructure/admin/ServerAdminGatewayFactory';
import { ListUsersUseCase } from '@/src/application/use-cases/admin/ListUsersUseCase';
import { User } from '@/src/domain/entities/User';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    offset?: string;
    limit?: string;
    banned?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q || '';
  const offset = parseInt(params.offset || '0', 10);
  const limit = parseInt(params.limit || '10', 10);
  const bannedFilter = params.banned;

  const gateway = await createServerAdminGateway();
  const listUsersUseCase = new ListUsersUseCase(gateway);

  let users: User[] = [];
  let total = 0;
  let error = '';

  try {
    const filterField = bannedFilter !== undefined ? 'banned' : undefined;
    const filterValue = bannedFilter === 'true';

    const result = await listUsersUseCase.execute({
      limit,
      offset,
      searchField: q ? 'name' : undefined,
      searchValue: q || undefined,
      filterField,
      filterValue: filterField ? filterValue : undefined,
    });
    users = result.users;
    total = result.total;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Erro ao carregar usuários';
  }

  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
        <form method="GET" className="flex items-center space-x-3 w-full sm:w-auto">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por nome..."
            className="px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors w-full sm:w-64"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium rounded-xl border border-gray-700 transition-all"
          >
            Buscar
          </button>
        </form>

        <div className="flex space-x-2">
          <Link
            href="/admin/users"
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              bannedFilter === undefined
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                : 'bg-gray-800/40 text-gray-400 border-gray-800 hover:text-white'
            }`}
          >
            Todos
          </Link>
          <Link
            href="/admin/users?banned=false"
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              bannedFilter === 'false'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-gray-800/40 text-gray-400 border-gray-800 hover:text-white'
            }`}
          >
            Ativos
          </Link>
          <Link
            href="/admin/users?banned=true"
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              bannedFilter === 'true'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : 'bg-gray-800/40 text-gray-400 border-gray-800 hover:text-white'
            }`}
          >
            Banidos
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-950/80 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4">Usuário</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">2FA</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                        user.isAdmin
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-gray-800 text-gray-300 border-gray-700'
                      }`}
                    >
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.twoFactorEnabled ? (
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Habilitado
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Desabilitado</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.banned ? (
                      <span className="text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        Banido
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Ativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4"
                    >
                      Gerenciar →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>
            Página {currentPage} de {totalPages} ({total} usuários)
          </span>
          <div className="flex space-x-2">
            {offset > 0 && (
              <Link
                href={`/admin/users?offset=${Math.max(0, offset - limit)}&limit=${limit}&q=${q}`}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg border border-gray-700"
              >
                Anterior
              </Link>
            )}
            {offset + limit < total && (
              <Link
                href={`/admin/users?offset=${offset + limit}&limit=${limit}&q=${q}`}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg border border-gray-700"
              >
                Próxima
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

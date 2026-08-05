import { createServerAdminGateway } from '@/src/infrastructure/admin/ServerAdminGatewayFactory';
import { ListUsersUseCase } from '@/src/application/use-cases/admin/ListUsersUseCase';
import { User } from '@/src/domain/entities/User';
import Link from 'next/link';
import { Button, Input, Badge, Alert } from '@/src/components/ui';

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
  // Sanitiza paginação: valores seguros mesmo com query string manipulada
  const offset = Math.max(0, parseInt(params.offset || '0', 10) || 0);
  const limit = Math.min(Math.max(parseInt(params.limit || '10', 10) || 10, 1), 100);
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
  // Preserva o filtro ativo nos links de paginação
  const bannedParam = bannedFilter !== undefined ? `&banned=${bannedFilter}` : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
        <form method="GET" className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Mantém o filtro de status ao buscar por nome */}
          {bannedFilter !== undefined && (
            <input type="hidden" name="banned" value={bannedFilter} />
          )}
          <Input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por nome..."
            className="w-full sm:w-64 py-2 text-sm"
          />
          <Button type="submit" variant="secondary" size="md">
            Buscar
          </Button>
        </form>

        <div className="flex space-x-2">
          <Link
            href="/admin/users"
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
              bannedFilter === undefined
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                : 'bg-gray-800/40 text-gray-400 border-gray-800 hover:text-white'
            }`}
          >
            Todos
          </Link>
          <Link
            href="/admin/users?banned=false"
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
              bannedFilter === 'false'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-gray-800/40 text-gray-400 border-gray-800 hover:text-white'
            }`}
          >
            Ativos
          </Link>
          <Link
            href="/admin/users?banned=true"
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
              bannedFilter === 'true'
                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                : 'bg-gray-800/40 text-gray-400 border-gray-800 hover:text-white'
            }`}
          >
            Banidos
          </Link>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

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
                    <Badge variant={user.isAdmin ? 'indigo' : 'neutral'} pill>
                      {user.role || 'user'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {user.twoFactorEnabled ? (
                      <Badge variant="success">Habilitado</Badge>
                    ) : (
                      <span className="text-xs text-gray-500">Desabilitado</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.banned ? (
                      <Badge variant="danger">Banido</Badge>
                    ) : (
                      <Badge variant="success">Ativo</Badge>
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
                href={`/admin/users?offset=${Math.max(0, offset - limit)}&limit=${limit}&q=${q}${bannedParam}`}
              >
                <Button variant="secondary" size="sm">Anterior</Button>
              </Link>
            )}
            {offset + limit < total && (
              <Link
                href={`/admin/users?offset=${offset + limit}&limit=${limit}&q=${q}${bannedParam}`}
              >
                <Button variant="secondary" size="sm">Próxima</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

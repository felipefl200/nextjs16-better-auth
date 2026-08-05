import { createServerAdminGateway } from '@/src/infrastructure/admin/ServerAdminGatewayFactory';
import { getRequiredAdminSession } from '@/src/infrastructure/auth/getRequiredAdminSession';
import { GetUserUseCase } from '@/src/application/use-cases/admin/GetUserUseCase';
import UserManagementActions from './UserManagementActions';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Já memoizado pelo cache() executado no layout — sem chamada extra.
  const adminSession = await getRequiredAdminSession();

  const gateway = await createServerAdminGateway();
  const getUserUseCase = new GetUserUseCase(gateway);
  let targetUser = null;
  let error = '';
  try {
    targetUser = await getUserUseCase.execute(id);
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Erro ao carregar dados do usuário';
  }

  if (error || !targetUser) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
        <p className="font-semibold">{error || 'Usuário não encontrado.'}</p>
        <Link href="/admin/users" className="mt-4 inline-block text-xs underline">
          ← Voltar para listagem
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{targetUser.name}</h2>
          <p className="text-gray-400 text-sm">{targetUser.email}</p>
        </div>
        <Link
          href="/admin/users"
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          ← Voltar para Lista
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
            Informações Gerais
          </h3>
          <div className="text-sm space-y-2">
            <div>
              <span className="text-gray-500">ID: </span>
              <span className="text-gray-300 font-mono text-xs">{targetUser.id}</span>
            </div>
            <div>
              <span className="text-gray-500">Role: </span>
              <span className="font-semibold text-indigo-400">{targetUser.role || 'user'}</span>
            </div>
            <div>
              <span className="text-gray-500">2FA Habilitado: </span>
              <span className={targetUser.twoFactorEnabled ? 'text-emerald-400 font-medium' : 'text-gray-400'}>
                {targetUser.twoFactorEnabled ? 'Sim' : 'Não'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Status: </span>
              <span className={targetUser.banned ? 'text-rose-400 font-medium' : 'text-emerald-400 font-medium'}>
                {targetUser.banned ? 'Banido' : 'Ativo'}
              </span>
            </div>
            {targetUser.banned && targetUser.banReason && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs">
                <strong>Motivo do Ban:</strong> {targetUser.banReason}
              </div>
            )}
          </div>
        </div>

        <UserManagementActions
          targetUser={targetUser.toDTO()}
          currentUserId={adminSession.user.id}
        />
      </div>
    </div>
  );
}

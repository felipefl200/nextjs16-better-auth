'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserDTO } from '@/src/domain/entities/User';
import { Card, Button, Input, Alert } from '@/src/components/ui';
import { FetchAdminGateway } from '@/src/infrastructure/admin/FetchAdminGateway';
import { SetUserRoleUseCase } from '@/src/application/use-cases/admin/SetUserRoleUseCase';
import { BanUserUseCase } from '@/src/application/use-cases/admin/BanUserUseCase';
import { UnbanUserUseCase } from '@/src/application/use-cases/admin/UnbanUserUseCase';
import { SetUserPasswordUseCase } from '@/src/application/use-cases/admin/SetUserPasswordUseCase';
import { ImpersonateUserUseCase } from '@/src/application/use-cases/admin/ImpersonateUserUseCase';
import { RemoveUserUseCase } from '@/src/application/use-cases/admin/RemoveUserUseCase';

interface UserManagementActionsProps {
  targetUser: UserDTO;
  currentUserId: string;
}

export default function UserManagementActions({
  targetUser,
  currentUserId,
}: UserManagementActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [banReason, setBanReason] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Guarda de UX complementar à guarda do use case
  const isSelf = targetUser.id === currentUserId;

  const getGateway = () => new FetchAdminGateway();

  const handleRoleChange = async (newRole: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const useCase = new SetUserRoleUseCase(getGateway());
      await useCase.execute(targetUser.id, newRole);
      setMessage({ type: 'success', text: `Role alterada para ${newRole} com sucesso!` });
      router.refresh();
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao alterar papel' });
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const useCase = new BanUserUseCase(getGateway());
      // Agora com currentUserId: impede o admin de banir a si mesmo
      await useCase.execute(targetUser.id, currentUserId, banReason.trim() || undefined);
      setMessage({ type: 'success', text: 'Usuário banido com sucesso!' });
      router.refresh();
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao banir usuário' });
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const useCase = new UnbanUserUseCase(getGateway());
      await useCase.execute(targetUser.id);
      setMessage({ type: 'success', text: 'Usuário desbanido com sucesso!' });
      router.refresh();
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao desbanir usuário' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const useCase = new SetUserPasswordUseCase(getGateway());
      await useCase.execute(targetUser.id, newPassword);
      setMessage({ type: 'success', text: 'Senha redefinida com sucesso!' });
      setNewPassword('');
      router.refresh();
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao redefinir senha' });
    } finally {
      setLoading(false);
    }
  };

  const handleImpersonate = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const useCase = new ImpersonateUserUseCase(getGateway());
      await useCase.execute(targetUser.id);
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao impersonar' });
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm(`Tem certeza que deseja EXCLUIR PERMANENTEMENTE o usuário ${targetUser.name}?`)) {
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const useCase = new RemoveUserUseCase(getGateway());
      // Agora com currentUserId: impede o admin de excluir a si mesmo
      await useCase.execute(targetUser.id, currentUserId);
      setMessage({ type: 'success', text: 'Usuário removido com sucesso!' });
      setTimeout(() => router.push('/admin/users'), 1000);
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao remover usuário' });
      setLoading(false);
    }
  };

  return (
    <Card className="space-y-6">
      <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
        Ações Administrativas
      </h3>

      {message && (
        <Alert variant={message.type === 'success' ? 'success' : 'danger'}>
          {message.text}
        </Alert>
      )}

      {isSelf && (
        <Alert variant="warning" className="text-xs">
          Você está gerenciando a sua própria conta. Banimento e exclusão
          estão desabilitados por segurança.
        </Alert>
      )}

      {/* Alterar Role */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Alterar Papel / Role
        </label>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleRoleChange('user')}
            disabled={loading || targetUser.role === 'user'}
            variant="secondary"
            size="sm"
          >
            Tornar User
          </Button>
          <Button
            onClick={() => handleRoleChange('admin')}
            disabled={loading || targetUser.role === 'admin'}
            variant="primary"
            size="sm"
          >
            Tornar Admin
          </Button>
        </div>
      </div>

      {/* Ban / Unban */}
      <div className="space-y-2 border-t border-gray-800/80 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Status de Acesso
        </label>
        {targetUser.banned ? (
          <Button
            onClick={handleUnban}
            isLoading={loading}
            variant="success"
            fullWidth
            size="md"
          >
            Desbanir Usuário
          </Button>
        ) : (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Motivo do banimento (opcional)"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              disabled={isSelf}
            />
            <Button
              onClick={handleBan}
              isLoading={loading}
              variant="danger"
              fullWidth
              size="md"
              disabled={isSelf}
            >
              Banir Usuário
            </Button>
          </div>
        )}
      </div>

      {/* Redefinir Senha */}
      <div className="space-y-2 border-t border-gray-800/80 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Redefinir Senha
        </label>
        <div className="flex items-center space-x-2">
          <Input
            type="password"
            placeholder="Nova senha (min 8)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            onClick={handleResetPassword}
            isLoading={loading}
            variant="primary"
            size="md"
            className="shrink-0"
          >
            Alterar
          </Button>
        </div>
      </div>

      {/* Impersonação */}
      <div className="space-y-2 border-t border-gray-800/80 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
          Suporte Operacional
        </label>
        <Button
          onClick={handleImpersonate}
          isLoading={loading}
          variant="warning"
          fullWidth
          size="md"
          disabled={isSelf}
        >
          Impersonar Usuário (Acessar como ele)
        </Button>
      </div>

      {/* Remover Usuário */}
      <div className="space-y-2 border-t border-gray-800/80 pt-4">
        <Button
          onClick={handleRemove}
          isLoading={loading}
          variant="danger-outline"
          fullWidth
          size="md"
          disabled={isSelf}
        >
          Remover Usuário Permanentemente
        </Button>
      </div>
    </Card>
  );
}

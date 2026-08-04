'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserDTO } from '@/src/domain/entities/User';
import { Card, Button, Input, Alert } from '@/src/components/ui';

interface UserManagementActionsProps {
  targetUser: UserDTO;
}

export default function UserManagementActions({ targetUser }: UserManagementActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // States para formulários
  const [banReason, setBanReason] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const executeAction = async (endpoint: string, body: Record<string, unknown>, successText: string) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/auth/admin/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: targetUser.id, ...body }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha na operação');
      }

      setMessage({ type: 'success', text: successText });
      router.refresh();
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro desconhecido' });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (newRole: string) => {
    executeAction('set-role', { role: newRole }, `Role alterada para ${newRole} com sucesso!`);
  };

  const handleBan = () => {
    executeAction('ban-user', { banReason: banReason || undefined }, 'Usuário banido com sucesso!');
  };

  const handleUnban = () => {
    executeAction('unban-user', {}, 'Usuário desbanido com sucesso!');
  };

  const handleResetPassword = () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Informe uma nova senha com no mínimo 6 caracteres.' });
      return;
    }
    executeAction('set-user-password', { newPassword }, 'Senha redefinida com sucesso!');
    setNewPassword('');
  };

  const handleImpersonate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin/impersonate-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: targetUser.id }),
      });

      if (!res.ok) throw new Error('Falha ao impersonar usuário');

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
    executeAction('remove-user', {}, 'Usuário removido!');
    setTimeout(() => router.push('/admin/users'), 1000);
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
            />
            <Button
              onClick={handleBan}
              isLoading={loading}
              variant="danger"
              fullWidth
              size="md"
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
            placeholder="Nova senha (min 6)"
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
        >
          Remover Usuário Permanentemente
        </Button>
      </div>
    </Card>
  );
}

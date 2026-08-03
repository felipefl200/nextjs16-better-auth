'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/src/domain/entities/User';

interface UserManagementActionsProps {
  targetUser: User;
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
    <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl space-y-6">
      <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
        Ações Administrativas
      </h3>

      {message && (
        <div
          className={`p-3 rounded-xl text-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Alterar Role */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Alterar Papel / Role
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleRoleChange('user')}
            disabled={loading || targetUser.role === 'user'}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-xs font-medium text-white rounded-lg border border-gray-700"
          >
            Tornar User
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            disabled={loading || targetUser.role === 'admin'}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-medium text-white rounded-lg border border-purple-500/30"
          >
            Tornar Admin
          </button>
        </div>
      </div>

      {/* Ban / Unban */}
      <div className="space-y-2 border-t border-gray-800/80 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Status de Acesso
        </label>
        {targetUser.banned ? (
          <button
            onClick={handleUnban}
            disabled={loading}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Desbanir Usuário
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Motivo do banimento (opcional)"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              onClick={handleBan}
              disabled={loading}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Banir Usuário
            </button>
          </div>
        )}
      </div>

      {/* Redefinir Senha */}
      <div className="space-y-2 border-t border-gray-800/80 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Redefinir Senha
        </label>
        <div className="flex space-x-2">
          <input
            type="password"
            placeholder="Nova senha (min 6)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Alterar
          </button>
        </div>
      </div>

      {/* Impersonação */}
      <div className="space-y-2 border-t border-gray-800/80 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Suporte Operacional
        </label>
        <button
          onClick={handleImpersonate}
          disabled={loading}
          className="w-full py-2 bg-amber-600/80 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition-all"
        >
          Impersonar Usuário (Acessar como ele)
        </button>
      </div>

      {/* Remover Usuário */}
      <div className="space-y-2 border-t border-gray-800/80 pt-4">
        <button
          onClick={handleRemove}
          disabled={loading}
          className="w-full py-2 bg-gray-950 hover:bg-rose-950 text-rose-400 hover:text-rose-300 border border-rose-900/40 text-xs font-semibold rounded-xl transition-all"
        >
          Remover Usuário Permanentemente
        </button>
      </div>
    </div>
  );
}

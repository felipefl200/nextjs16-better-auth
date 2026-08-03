'use client';

import { useState } from 'react';

interface ImpersonationBannerProps {
  impersonatedBy?: string | null;
  targetUserName?: string;
}

export default function ImpersonationBanner({
  impersonatedBy,
  targetUserName,
}: ImpersonationBannerProps) {
  const [loading, setLoading] = useState(false);

  if (!impersonatedBy) {
    return null;
  }

  const handleStopImpersonating = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin/stop-impersonating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Falha ao encerrar impersonação');
      }

      window.location.href = '/admin/users';
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-500 text-gray-950 font-medium text-xs px-6 py-2.5 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-2">
        <span className="font-bold uppercase tracking-wider bg-amber-950 text-amber-300 px-2 py-0.5 rounded">
          Modo Impersonação Ativo
        </span>
        <span>
          Você está navegando como <strong>{targetUserName || 'outro usuário'}</strong>.
        </span>
      </div>

      <button
        onClick={handleStopImpersonating}
        disabled={loading}
        className="px-3 py-1 bg-gray-950 hover:bg-gray-900 text-amber-300 rounded font-semibold text-xs transition-colors border border-amber-400/40"
      >
        {loading ? 'Saindo...' : 'Encerrar Impersonação ✕'}
      </button>
    </div>
  );
}

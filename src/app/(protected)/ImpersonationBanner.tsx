'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui';

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
        <span className="font-bold uppercase tracking-wider bg-amber-950 text-amber-300 px-2 py-0.5 rounded-lg">
          Modo Impersonação Ativo
        </span>
        <span>
          Você está navegando como <strong>{targetUserName || 'outro usuário'}</strong>.
        </span>
      </div>

      <Button
        onClick={handleStopImpersonating}
        isLoading={loading}
        variant="secondary"
        size="sm"
      >
        {loading ? 'Saindo...' : 'Encerrar Impersonação ✕'}
      </Button>
    </div>
  );
}

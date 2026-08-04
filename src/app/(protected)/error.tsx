'use client';

import { useEffect } from 'react';
import { Card, Button } from '@/src/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Protected route error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
      <Card className="bg-red-500/10 border-red-500/20 p-8 max-w-md w-full">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Algo deu errado!</h2>
        <p className="text-gray-400 mb-8 text-sm">
          Não foi possível carregar esta página. Verifique sua conexão ou tente novamente.
        </p>
        <Button
          onClick={() => reset()}
          variant="danger"
          fullWidth
          size="lg"
        >
          Tentar Novamente
        </Button>
      </Card>
    </div>
  );
}

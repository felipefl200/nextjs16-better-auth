'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const MIN_INTERVAL_MS = 30_000;

export default function SessionRefresher() {
  const router = useRouter();
  const pathname = usePathname();
  const lastRefreshRef = useRef(0);

  const refreshSession = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshRef.current < MIN_INTERVAL_MS) return;
    lastRefreshRef.current = now;

    try {
      const res = await fetch('/api/auth/get-session', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });
      if (res.status === 401) {
        // Sessão expirou de fato ou é inválida — redireciona
        router.push('/login');
      }
    } catch {
      // Falha de rede local — não desloga o usuário otimista
    }
  }, [router]);

  useEffect(() => {
    refreshSession();
  }, [pathname, refreshSession]);

  return null;
}

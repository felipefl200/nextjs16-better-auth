'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Componente client-side que sincroniza a sessão real no back-end.
 *
 * Como o proxy (middleware.ts) agora faz apenas uma checagem otimista do cookie,
 * a renovação real do cookie e a validação profunda ocorrem através dessa chamada
 * originada no cliente, vinculada a eventos de navegação.
 */
export default function SessionRefresher() {
  const router = useRouter();
  const pathname = usePathname();

  const refreshSession = useCallback(async () => {
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

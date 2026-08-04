import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getRequiredSession } from './getRequiredSession';

import { Session } from '@/src/domain/entities/Session';

/**
 * Função utilitária do lado do servidor para garantir uma sessão administrativa.
 * Valida a sessão real via get-session no backend e verifica a role admin.
 * A proteção é server-side — não confia em estado do cliente.
 */
export const getRequiredAdminSession = cache(async (): Promise<Session> => {
  const session = await getRequiredSession();

  if (!session.user.isAdmin) {
    redirect('/dashboard');
  }

  return session;
});

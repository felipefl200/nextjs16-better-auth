import { cache } from "react";
import { redirect } from "next/navigation";
import { Session } from "@/domain/entities/Session";
import { GetSessionUseCase } from "@/application/use-cases/GetSessionUseCase";
import { createServerAuthGateway } from "./ServerAuthGatewayFactory";
import { LOGIN_PATH } from "./constants";

/**
 * Busca a sessão no backend uma única vez por request (memoizado com `cache` do React),
 * mesmo que layout e página chamem a função.
 */
const fetchSession = cache(async (): Promise<Session | null> => {
  const gateway = await createServerAuthGateway();
  return new GetSessionUseCase(gateway).execute();
});

/**
 * Garante uma sessão válida no servidor ou redireciona para o login.
 * Deve ser chamada por toda página protegida: o layout não é re-renderizado
 * em navegações client-side.
 */
export async function getRequiredSession(): Promise<Session> {
  const session = await fetchSession();

  if (!session) {
    redirect(LOGIN_PATH);
  }

  return session;
}

/** Retorna a sessão atual ou `null`, sem lançar se o backend estiver indisponível. */
export async function getOptionalSession(): Promise<Session | null> {
  try {
    return await fetchSession();
  } catch {
    return null;
  }
}

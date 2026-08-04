import { redirect } from "next/navigation";
import { cache } from "react";
import { createServerAuthGateway } from "./ServerAuthGatewayFactory";

import { Session } from "@/src/domain/entities/Session";
import { GetSessionUseCase } from "@/src/application/use-cases/GetSessionUseCase";

/**
 * Função utilitária do lado do servidor para garantir uma sessão.
 * Instancia os Use Cases necessários e redireciona caso a sessão não exista.
 * Utiliza cache() do React para memoizar a chamada por requisição no mesmo ciclo de renderização.
 */
export const getRequiredSession = cache(async (): Promise<Session> => {
  const gateway = await createServerAuthGateway();
  const getSessionUseCase = new GetSessionUseCase(gateway);
  const session = await getSessionUseCase.execute();

  if (!session) {
    redirect("/login");
  }

  return session;
});

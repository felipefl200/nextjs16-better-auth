import { redirect } from "next/navigation";
import { createServerAuthGateway } from "./ServerAuthGatewayFactory";

import { Session } from "@/src/domain/entities/Session";
import { GetSessionUseCase } from "@/src/application/use-cases/GetSessionUseCase";

/**
 * Função utilitária do lado do servidor para garantir uma sessão.
 * Instancia os Use Cases necessários e redireciona caso a sessão não exista.
 * Aproveita o cache automático do React/Next.js para requisições fetch.
 */
export async function getRequiredSession(): Promise<Session> {
  const gateway = await createServerAuthGateway();
  const getSessionUseCase = new GetSessionUseCase(gateway);
  const session = await getSessionUseCase.execute();

  if (!session) {
    redirect("/login");
  }

  return session;
}

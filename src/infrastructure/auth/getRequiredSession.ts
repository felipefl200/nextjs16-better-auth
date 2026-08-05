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
    // Cookie existe no browser mas a sessão é inválida/revogada no backend.
    // Em Server Components (RSC) do Next.js 16+, cookies().delete() lança erro.
    // Passamos o parâmetro ?error=session_expired para que o proxy (Middleware)
    // interceptes a requisição de /login e apague os cookies via resposta HTTP.
    redirect("/login?error=session_expired");
  }

  return session;
});


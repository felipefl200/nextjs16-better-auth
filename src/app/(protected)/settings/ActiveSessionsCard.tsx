"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FetchAuthGateway } from "@/src/infrastructure/auth/FetchAuthGateway";
import { RevokeSessionUseCase } from "@/src/application/use-cases/RevokeSessionUseCase";
import { Button, Alert } from "@/src/components/ui";

export interface ActiveSessionDTO {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

interface ActiveSessionsCardProps {
  userId?: string;
  currentSessionToken: string;
  initialSessions: ActiveSessionDTO[];
}

export default function ActiveSessionsCard({
  currentSessionToken,
  initialSessions,
}: ActiveSessionsCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRefresh = () => {
    setError(null);
    setSuccess(null);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleRevoke = async (token: string) => {
    setRevokingToken(token);
    setError(null);
    setSuccess(null);
    try {
      const gateway = new FetchAuthGateway();
      const useCase = new RevokeSessionUseCase(gateway);
      await useCase.execute(token);
      setSuccess("Sessão revogada com sucesso.");
      startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Falha ao revogar a sessão.",
      );
    } finally {
      setRevokingToken(null);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-950/50 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-white">Sessões Ativas</h4>
          <p className="text-xs text-gray-400">
            Gerencie os dispositivos e navegadores autenticados em sua conta.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          isLoading={isPending}
        >
          Atualizar
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="text-xs py-2 px-3">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="text-xs py-2 px-3">
          {success}
        </Alert>
      )}

      {initialSessions.length === 0 ? (
        <div className="text-xs text-gray-400 py-2">
          Nenhuma sessão ativa encontrada.
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {initialSessions.map((sess) => {
            const isCurrent = sess.token === currentSessionToken;
            return (
              <div
                key={sess.id}
                className="flex items-center justify-between p-3 bg-gray-900/80 rounded-lg border border-gray-800 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">
                      {sess.userAgent || "Navegador Desconhecido"}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                        Esta Sessão
                      </span>
                    )}
                  </div>
                  <div className="text-gray-400 space-x-3 text-[11px]">
                    <span>IP: {sess.ipAddress || "Localhost"}</span>
                    <span>
                      Criada em: {new Date(sess.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Expira em: {new Date(sess.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {!isCurrent && (
                  <Button
                    variant="danger-outline"
                    size="sm"
                    isLoading={revokingToken === sess.token}
                    onClick={() => handleRevoke(sess.token)}
                  >
                    Revogar
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

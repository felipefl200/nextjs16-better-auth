"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FetchAuthGateway } from "@/src/infrastructure/auth/FetchAuthGateway";
import { RevokeSessionUseCase } from "@/src/application/use-cases/RevokeSessionUseCase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Alert,
} from "@/src/components/ui";
import { ActiveSessionItem } from "./components/ActiveSessionItem";

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
  initialError?: string | null;
}

export default function ActiveSessionsCard({
  currentSessionToken,
  initialSessions,
  initialError = null,
}: ActiveSessionsCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const [revokedTokens, setRevokedTokens] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(initialError);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRefresh = () => {
    setError(null);
    setSuccess(null);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleRevoke = async (token: string) => {
    const isCurrentSession = token === currentSessionToken;
    setRevokingToken(token);
    setError(null);
    setSuccess(null);

    try {
      const gateway = new FetchAuthGateway();
      const useCase = new RevokeSessionUseCase(gateway);
      await useCase.execute(token);

      if (isCurrentSession) {
        setSuccess("Sessão atual revogada. Redirecionando para o login...");
        window.location.assign("/login");
        return;
      }

      // Otimista: remove da lista imediatamente
      setRevokedTokens((prev) =>
        prev.includes(token) ? prev : [...prev, token],
      );
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

  const sessions = initialSessions.filter(
    (s) => !revokedTokens.includes(s.token),
  );

  return (
    <Card variant="default">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">Sessões Ativas</CardTitle>
          <CardDescription className="text-xs">
            Gerencie os dispositivos e navegadores autenticados em sua conta.
          </CardDescription>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          isLoading={isPending}
          className="whitespace-nowrap shrink-0"
        >
          Atualizar
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {error && (
          <Alert variant="danger" className="text-xs">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="text-xs">
            {success}
          </Alert>
        )}

        {sessions.length === 0 ? (
          <div className="text-xs text-gray-400 py-3 text-center bg-gray-900/50 rounded-xl border border-gray-800">
            Nenhuma sessão ativa encontrada.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((sess) => (
              <ActiveSessionItem
                key={sess.id}
                session={sess}
                isCurrent={sess.token === currentSessionToken}
                isRevoking={revokingToken === sess.token}
                onRevoke={handleRevoke}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

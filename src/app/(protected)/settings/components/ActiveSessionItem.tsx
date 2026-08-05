"use client";

import { useState } from "react";
import { parseUserAgent } from "../utils/parseUserAgent";
import { Button, Badge } from "@/src/components/ui";

export interface ActiveSessionItemDTO {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

interface ActiveSessionItemProps {
  session: ActiveSessionItemDTO;
  isCurrent: boolean;
  isRevoking: boolean;
  onRevoke: (token: string) => void;
}

export function ActiveSessionItem({
  session,
  isCurrent,
  isRevoking,
  onRevoke,
}: ActiveSessionItemProps) {
  const [showFullUa, setShowFullUa] = useState(false);
  const parsedUa = parseUserAgent(session.userAgent);

  const formattedCreated = new Date(session.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedExpires = new Date(session.expiresAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="p-4 bg-gray-900/80 rounded-xl border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-gray-700/80">
      <div className="flex items-start gap-3.5 min-w-0">
        {/* Device Icon */}
        <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shrink-0 mt-0.5">
          {parsedUa.deviceType === "mobile" ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">
              {parsedUa.friendlyName}
            </span>
            {isCurrent && (
              <Badge variant="success" className="whitespace-nowrap shrink-0">
                Esta Sessão
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-x-4 gap-y-1 text-xs text-gray-400 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
              </svg>
              IP: {session.ipAddress || "Localhost"}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Criada em: {formattedCreated}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Expira em: {formattedExpires}
            </span>
          </div>

          {/* User Agent Toggle Detail */}
          {session.userAgent && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowFullUa(!showFullUa)}
                className="text-[11px] text-gray-500 hover:text-gray-400 font-medium underline cursor-pointer"
              >
                {showFullUa ? "Ocultar detalhes do agente" : "Ver detalhes do navegador"}
              </button>
              {showFullUa && (
                <p className="mt-1.5 p-2 bg-black/60 rounded-lg text-[10px] font-mono text-gray-400 break-all border border-gray-800">
                  {session.userAgent}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0 self-end sm:self-center">
        <Button
          variant="danger-outline"
          size="sm"
          isLoading={isRevoking}
          onClick={() => onRevoke(session.token)}
          className="whitespace-nowrap"
        >
          {isCurrent ? "Sair desta sessão" : "Revogar"}
        </Button>
      </div>
    </div>
  );
}

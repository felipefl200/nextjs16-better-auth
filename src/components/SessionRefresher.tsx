"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { makeGetSessionUseCase } from "@/infrastructure/auth/clientAuth";
import { buildLoginUrl } from "@/infrastructure/auth/safeRedirect";

/**
 * Valida a sessão no back-end a cada navegação client-side.
 *
 * O proxy faz apenas uma checagem otimista do cookie e o layout protegido não
 * re-renderiza ao navegar; esta chamada (sem `disableRefresh`) também renova o cookie.
 */
export default function SessionRefresher() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    makeGetSessionUseCase()
      .execute()
      .then((session) => {
        if (!cancelled && !session) {
          router.replace(buildLoginUrl(pathname));
        }
      })
      .catch(() => {
        // Falha de rede ou erro do servidor: mantém o usuário na página
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return null;
}

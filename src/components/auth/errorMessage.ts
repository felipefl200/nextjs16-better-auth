import { AuthError } from "@/domain/errors/AuthErrors";

/** Exibe ao usuário apenas mensagens de erros conhecidos do domínio. */
export function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof AuthError ? err.message : fallback;
}

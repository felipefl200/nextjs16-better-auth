import { DEFAULT_LOGIN_REDIRECT } from "./constants";

/**
 * Aceita apenas caminhos relativos à aplicação, evitando open redirect
 * (ex.: `//evil.com`, `https://evil.com`, `/\evil.com`).
 */
export function sanitizeCallbackUrl(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return DEFAULT_LOGIN_REDIRECT;
  }
  return value;
}

export function buildLoginUrl(callbackUrl: string): string {
  const params = new URLSearchParams({ callbackUrl });
  return `/login?${params.toString()}`;
}

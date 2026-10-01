import { cookies } from "next/headers";
import { API_URL } from "@/infrastructure/config/env";
import { AUTH_COOKIE_PREFIX } from "./constants";
import { FetchAuthGateway } from "./FetchAuthGateway";

function isAuthCookie(name: string): boolean {
  return (
    name.startsWith(`${AUTH_COOKIE_PREFIX}.`) ||
    name.startsWith(`__Secure-${AUTH_COOKIE_PREFIX}.`)
  );
}

export async function createServerAuthGateway() {
  const cookieStore = await cookies();
  // Repassa ao backend apenas os cookies do Better Auth
  const authCookies = cookieStore
    .getAll()
    .filter((c) => isAuthCookie(c.name))
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return new FetchAuthGateway({
    baseUrl: `${API_URL}/api/auth`,
    headers: authCookies ? { Cookie: authCookies } : {},
  });
}

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { AUTH_COOKIE_PREFIX } from "@/infrastructure/auth/constants";
import { buildLoginUrl } from "@/infrastructure/auth/safeRedirect";

/** Rotas acessíveis sem sessão. As demais são protegidas por padrão. */
const PUBLIC_PATHS = new Set(["/", "/login", "/register"]);

/**
 * Checagem otimista: apenas verifica a presença do cookie de sessão.
 * A validação real acontece no servidor via `getRequiredSession`.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request, { cookiePrefix: AUTH_COOKIE_PREFIX });
  if (!sessionCookie) {
    return NextResponse.redirect(new URL(buildLoginUrl(pathname + search), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

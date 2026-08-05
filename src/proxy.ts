import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const AUTH_PATHS = ["/login", "/login/2fa", "/register"];
const SESSION_COOKIE_NAMES = [
  "meu-app.session_token",
  "meu-app.session_data",
  "meu-app_two_factor",
  "meu-app.two_factor",
  "session_token",
  "two_factor",
];

/**
 * Remove cookies de sessão da resposta HTTP para que o browser os apague.
 */
function clearSessionCookiesInResponse(res: NextResponse): void {
  SESSION_COOKIE_NAMES.forEach((name) => {
    res.cookies.delete(name);
  });
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isSessionExpired = searchParams.get("error") === "session_expired";
  const sessionCookie =
    getSessionCookie(request, { cookiePrefix: "meu-app" }) ||
    request.cookies.get("meu-app.session_token")?.value;

  const isAuthPath = AUTH_PATHS.includes(pathname);

  // 1. Tratamento especial quando o backend sinaliza que o cookie no browser caducou (sessão expirada/revogada em DB)
  if (isSessionExpired && isAuthPath) {
    const response = NextResponse.next();
    clearSessionCookiesInResponse(response);
    return response;
  }

  // 2. Proteção da rota de desafio 2FA (/login/2fa)
  if (pathname === "/login/2fa") {
    const hasTwoFactorCookie =
      request.cookies.get("meu-app.two_factor")?.value ||
      request.cookies.get("two_factor")?.value ||
      request.cookies.get("meu-app_two_factor")?.value;

    if (!hasTwoFactorCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (sessionCookie && !isSessionExpired) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 3. Usuário com cookie navegando em rotas públicas de autenticação -> redireciona pro dashboard
  if (sessionCookie && !isSessionExpired && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 4. Rotas protegidas sem cookie de sessão -> redireciona pro /login preservando redirectTo
  if (!sessionCookie && !isAuthPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/login/2fa",
    "/register",
  ],
};


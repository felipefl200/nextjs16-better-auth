import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie =
    getSessionCookie(request, { cookiePrefix: "meu-app" }) ||
    request.cookies.get("meu-app.session_token")?.value;

  // 1. Se o usuário já está autenticado e tenta acessar /login, /login/2fa ou /register, envia pro dashboard
  if (
    sessionCookie &&
    (pathname === "/login" || pathname === "/login/2fa" || pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Proteção da rota de desafio 2FA (/login/2fa)
  if (pathname === "/login/2fa") {
    // Verifica se existe o cookie de 2FA pendente emitido pelo Better Auth durante a etapa 1 do login
    const hasTwoFactorCookie =
      request.cookies.get("meu-app.two_factor")?.value ||
      request.cookies.get("two_factor")?.value ||
      request.cookies.get("meu-app_two_factor")?.value;

    if (!hasTwoFactorCookie) {
      // Sem o cookie temporário do 2FA, o acesso direto é proibido -> redireciona para o login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. Proteção genérica de rotas privadas se não houver sessão ativa
  if (
    !sessionCookie &&
    pathname !== "/login" &&
    pathname !== "/login/2fa" &&
    pathname !== "/register"
  ) {
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

import { AuthGateway } from "@/application/ports/AuthGateway";
import {
  AuthError,
  InvalidCredentialsError,
  InvalidEmailError,
  NetworkError,
  UserAlreadyExistsError,
  WeakPasswordError,
} from "@/domain/errors/AuthErrors";
import { Session } from "@/domain/entities/Session";
import { User } from "@/domain/entities/User";

type BetterAuthErrorBody = { code?: string; message?: string };

type SessionResponse = {
  session: { expiresAt: string };
  user: { id: string; email: string; name: string; emailVerified?: boolean };
} | null;

export class FetchAuthGateway implements AuthGateway {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(options?: {
    baseUrl?: string;
    headers?: Record<string, string>;
  }) {
    // No cliente (browser) usamos o rewrite relativo; no servidor precisamos da URL absoluta da API
    this.baseUrl = options?.baseUrl || "/api/auth";
    this.headers = options?.headers || {};
  }

  async login(email: string, password: string): Promise<void> {
    const res = await this.request("/sign-in/email", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw await this.toAuthError(res, "Falha no login");
    }
  }

  async register(email: string, password: string, name: string): Promise<void> {
    const res = await this.request("/sign-up/email", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      throw await this.toAuthError(res, "Falha no cadastro");
    }
  }

  async getSession(): Promise<Session | null> {
    const isServer = typeof window === "undefined";
    const queryParams = isServer ? "?disableRefresh=true" : "";
    const res = await this.request(`/get-session${queryParams}`, {
      method: "GET",
      cache: "no-store", // Sempre validar com o servidor
    });

    if (res.status === 401) {
      return null;
    }
    if (!res.ok) {
      throw new AuthError(`Falha ao obter sessão: ${res.status}`);
    }

    // O Better Auth responde 200 com corpo `null` quando não há sessão
    const data = (await res.json().catch(() => null)) as SessionResponse;
    if (!data?.session || !data.user) {
      return null;
    }

    const user = new User(
      data.user.id,
      data.user.email,
      data.user.name,
      Boolean(data.user.emailVerified),
    );
    return new Session(user, new Date(data.session.expiresAt));
  }

  async logout(): Promise<void> {
    const res = await this.request("/sign-out", { method: "POST" });

    if (!res.ok) {
      throw await this.toAuthError(res, "Falha no logout");
    }
  }

  private async request(path: string, init: RequestInit): Promise<Response> {
    const headers: Record<string, string> = { ...this.headers };
    if (init.body) {
      headers["Content-Type"] = "application/json";
    }

    try {
      return await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers,
        credentials: "include",
      });
    } catch {
      throw new NetworkError();
    }
  }

  private async toAuthError(res: Response, fallback: string): Promise<AuthError> {
    const body = (await res.json().catch(() => null)) as BetterAuthErrorBody | null;
    const code = body?.code ?? "";

    if (code === "INVALID_EMAIL_OR_PASSWORD" || res.status === 401) {
      return new InvalidCredentialsError();
    }
    if (code.startsWith("USER_ALREADY_EXISTS")) {
      return new UserAlreadyExistsError();
    }
    if (code === "PASSWORD_TOO_SHORT" || code === "PASSWORD_TOO_LONG") {
      return new WeakPasswordError();
    }
    if (code === "INVALID_EMAIL") {
      return new InvalidEmailError();
    }
    return new AuthError(`${fallback}. Tente novamente mais tarde.`);
  }
}

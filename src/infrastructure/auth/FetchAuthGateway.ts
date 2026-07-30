import { AuthGateway } from "@/src/application/ports/AuthGateway";
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  AuthError,
} from "../../domain/errors/AuthErrors";
import { Session } from "@/src/domain/entities/Session";
import { User } from "@/src/domain/entities/User";

export class FetchAuthGateway implements AuthGateway {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(options?: {
    baseUrl?: string;
    headers?: Record<string, string>;
  }) {
    // No cliente (browser) usamos o proxy relativo, no servidor (middleware) precisamos da URL absoluta da API
    this.baseUrl = options?.baseUrl || "/api/auth";
    this.headers = options?.headers || {};
  }

  async login(email: string, password: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 400) {
        throw new InvalidCredentialsError();
      }
      throw new AuthError(`Falha no login: ${res.statusText}`);
    }
  }

  async register(email: string, password: string, name: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      if (res.status === 400 || res.status === 409) {
        throw new UserAlreadyExistsError();
      }
      throw new AuthError(`Falha no cadastro: ${res.statusText}`);
    }
  }

  async getSession(): Promise<Session | null> {
    const isServer = typeof window === "undefined";
    const queryParams = isServer ? "?disableRefresh=true" : "";
    const res = await fetch(`${this.baseUrl}/get-session${queryParams}`, {
      method: "GET",
      headers: {
        ...this.headers,
      },
      credentials: "include",
      cache: "no-store", // Sempre validar com o servidor
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    // O retorno do better-auth costuma ter data.session e data.user
    if (!data || !data.session || !data.user) {
      return null;
    }

    const user = new User(data.user.id, data.user.email, data.user.name);
    return new Session(
      data.session.token,
      user,
      new Date(data.session.expiresAt),
    );
  }

  async logout(): Promise<void> {
    const res = await fetch(`${this.baseUrl}/sign-out`, {
      method: "POST",
      headers: {
        ...this.headers,
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new AuthError(`Falha no logout: ${res.statusText}`);
    }
  }
}

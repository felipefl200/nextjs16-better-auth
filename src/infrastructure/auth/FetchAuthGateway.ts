import { AuthGateway } from "@/src/application/ports/AuthGateway";
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  UserBannedError,
  AuthError,
} from "@/src/domain/errors/AuthErrors";
import { Session } from "@/src/domain/entities/Session";
import { User } from "@/src/domain/entities/User";

function translateErrorMessage(
  msg?: string,
  fallback: string = "Ocorreu um erro no servidor.",
): string {
  if (!msg) return fallback;
  const lower = msg.toLowerCase();

  if (
    lower.includes("cannot post") ||
    lower.includes("cannot get") ||
    lower.includes("not found") ||
    lower.includes("404")
  ) {
    return "Rota de autenticação não encontrada no servidor.";
  }
  if (
    lower.includes("invalid email or password") ||
    lower.includes("invalid credentials") ||
    lower.includes("invalid password")
  ) {
    return "E-mail ou senha incorretos.";
  }
  if (lower.includes("user not found")) {
    return "Usuário não encontrado.";
  }
  if (
    lower.includes("user already exists") ||
    lower.includes("email already in use") ||
    lower.includes("já está em uso")
  ) {
    return "Este e-mail já está em uso por outra conta.";
  }
  if (lower.includes("unauthorized") || lower.includes("forbidden")) {
    return "Acesso não autorizado. Faça login para continuar.";
  }
  if (lower.includes("banned") || lower.includes("suspens")) {
    return "Sua conta foi banida. Entre em contato com o suporte se achar que isso é um erro.";
  }
  if (lower.includes("invalid code") || lower.includes("invalid totp")) {
    return "Código de autenticação inválido ou expirado.";
  }
  if (lower.includes("failed to fetch")) {
    return "Não foi possível conectar ao servidor. Verifique sua conexão de rede.";
  }

  return msg;
}

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

  async login(
    email: string,
    password: string,
  ): Promise<{ twoFactorRedirect?: boolean }> {
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
      const data = await res.json().catch(() => ({}));
      if (
        res.status === 403 ||
        data?.code === "BANNED_USER" ||
        data?.code === "USER_BANNED" ||
        (typeof data?.message === "string" &&
          (data.message.toLowerCase().includes("banid") ||
            data.message.toLowerCase().includes("suspens")))
      ) {
        throw new UserBannedError(translateErrorMessage(data?.message, "Sua conta foi banida."));
      }

      if (res.status === 401 || res.status === 400) {
        throw new InvalidCredentialsError();
      }
      throw new AuthError(
        translateErrorMessage(data?.message || res.statusText, "Falha no login."),
      );
    }

    const data = await res.json().catch(() => ({}));
    return { twoFactorRedirect: Boolean(data?.twoFactorRedirect) };
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
      const data = await res.json().catch(() => ({}));
      throw new AuthError(
        translateErrorMessage(data?.message || res.statusText, "Falha no cadastro."),
      );
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

    const user = new User(
      data.user.id,
      data.user.email,
      data.user.name,
      data.user.image ?? null,
      Boolean(data.user.twoFactorEnabled),
      data.user.role ?? undefined,
      data.user.banned ?? undefined,
      data.user.banReason ?? null,
      data.user.banExpires ? new Date(data.user.banExpires) : null,
    );
    return new Session(
      data.session.token,
      user,
      new Date(data.session.expiresAt),
      data.session.impersonatedBy ?? null,
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
      throw new AuthError("Falha ao encerrar a sessão.");
    }
  }

  async enableTwoFactor(
    password: string,
  ): Promise<{ totpURI: string; backupCodes: string[] }> {
    const res = await fetch(`${this.baseUrl}/two-factor/enable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new AuthError(
        translateErrorMessage(data?.message || res.statusText, "Falha ao habilitar 2FA."),
      );
    }

    const data = await res.json();
    return {
      totpURI: data.totpURI || "",
      backupCodes: data.backupCodes || [],
    };
  }

  async verifyTotp(code: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/two-factor/verify-totp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
      credentials: "include",
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      throw new AuthError("Código de autenticação inválido ou expirado.");
    }
  }

  async disableTwoFactor(password: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/two-factor/disable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      throw new AuthError(
        "Senha incorreta. Não foi possível desabilitar o 2FA.",
      );
    }
  }

  async authenticateTotp(code: string, trustDevice?: boolean): Promise<void> {
    const res = await fetch(`${this.baseUrl}/two-factor/verify-totp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
      credentials: "include",
      body: JSON.stringify({ code, trustDevice }),
    });

    if (!res.ok) {
      throw new AuthError("Código de 6 dígitos inválido.");
    }
  }

  async authenticateBackupCode(
    code: string,
    trustDevice?: boolean,
  ): Promise<void> {
    const res = await fetch(`${this.baseUrl}/two-factor/verify-backup-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
      credentials: "include",
      body: JSON.stringify({ code, trustDevice }),
    });

    if (!res.ok) {
      throw new AuthError("Código de backup inválido.");
    }
  }

  async updateProfile(data: {
    name?: string;
    email?: string;
    image?: string;
  }): Promise<void> {
    if (data.name || data.image) {
      const payload: { name?: string; image?: string } = {};
      if (data.name) payload.name = data.name;
      if (data.image) payload.image = data.image;

      const resName = await fetch(`${this.baseUrl}/update-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!resName.ok) {
        const errorData = await resName.json().catch(() => ({}));
        throw new AuthError(
          translateErrorMessage(errorData.message, "Falha ao atualizar o perfil do usuário."),
        );
      }
    }

    if (data.email) {
      const resEmail = await fetch(`${this.baseUrl}/change-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers,
        },
        credentials: "include",
        body: JSON.stringify({ newEmail: data.email }),
      });

      const errorData = await resEmail.json().catch(() => ({}));

      if (
        !resEmail.ok ||
        errorData?.status === false ||
        errorData?.error ||
        errorData?.code === "USER_ALREADY_EXISTS" ||
        errorData?.code === "EMAIL_ALREADY_IN_USE"
      ) {
        const msg = typeof errorData?.message === "string" ? errorData.message.toLowerCase() : "";
        const code = errorData?.code || "";

        if (
          resEmail.status === 400 ||
          resEmail.status === 409 ||
          resEmail.status === 422 ||
          code === "USER_ALREADY_EXISTS" ||
          code === "EMAIL_ALREADY_IN_USE" ||
          msg.includes("already") ||
          msg.includes("exist") ||
          msg.includes("in use") ||
          msg.includes("uso")
        ) {
          throw new UserAlreadyExistsError("Este e-mail já está em uso por outra conta.");
        }

        throw new AuthError(
          translateErrorMessage(errorData?.message, "Falha ao solicitar alteração de e-mail."),
        );
      }
    }
  }

  async uploadAvatar(file: File): Promise<{ filename: string }> {
    const formData = new FormData();
    formData.append("avatar", file);

    const targetUrl = `${this.baseUrl.replace(/\/api\/auth$/, "")}/api/upload/avatar`;

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        ...this.headers,
      },
      credentials: "include",
      body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new AuthError(
        translateErrorMessage(data.message, "Falha ao fazer upload da imagem de perfil."),
      );
    }

    return { filename: data.filename };
  }
}

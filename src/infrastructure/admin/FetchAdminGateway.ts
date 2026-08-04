import {
  AdminGateway,
  ListUsersParams,
  ListUsersResult,
  UserSession,
} from '@/src/application/ports/AdminGateway';
import { User } from '@/src/domain/entities/User';
import { AdminError, ForbiddenError } from '@/src/domain/errors/AdminErrors';

export class FetchAdminGateway implements AdminGateway {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(options?: {
    baseUrl?: string;
    headers?: Record<string, string>;
  }) {
    this.baseUrl = options?.baseUrl || '/api/auth';
    this.headers = options?.headers || {};
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
        ...(options.headers as Record<string, string>),
      },
      credentials: 'include',
    });

    if (res.status === 401 || res.status === 403) {
      throw new ForbiddenError();
    }

    if (!res.ok) {
      let message = '';
      try {
        const json = await res.json();
        message = json.message || json.error || '';
      } catch {
        message = await res.text().catch(() => '');
      }

      const lower = message.toLowerCase();
      if (lower.includes('cannot post') || lower.includes('cannot get') || res.status === 404) {
        throw new AdminError('Rota administrativa não encontrada no servidor.');
      }

      throw new AdminError(message || `Falha na operação administrativa (código HTTP ${res.status}).`);
    }

    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  }

  private mapUser(data: Record<string, unknown>): User {
    if (!data) {
      throw new AdminError('Dados do usuário não foram retornados pela API');
    }
    return new User(
      data.id as string,
      data.email as string,
      data.name as string,
      (data.image as string) ?? null,
      Boolean(data.twoFactorEnabled),
      (data.role as string) ?? undefined,
      (data.banned as boolean) ?? undefined,
      (data.banReason as string) ?? null,
      data.banExpires ? new Date(data.banExpires as string) : null,
    );
  }

  async listUsers(params?: ListUsersParams): Promise<ListUsersResult> {
    const query = new URLSearchParams();

    if (params?.limit !== undefined)
      query.set('limit', String(params.limit));
    if (params?.offset !== undefined)
      query.set('offset', String(params.offset));
    if (params?.searchField && params?.searchValue) {
      query.set('searchField', params.searchField);
      query.set('searchValue', params.searchValue);
      if (params.searchOperator) query.set('searchOperator', params.searchOperator);
    }
    if (params?.sortBy) {
      query.set('sortBy', params.sortBy);
      if (params.sortDirection) query.set('sortDirection', params.sortDirection);
    }
    if (params?.filterField && params?.filterValue !== undefined) {
      query.set('filterField', params.filterField);
      query.set('filterValue', String(params.filterValue));
      if (params.filterOperator) query.set('filterOperator', params.filterOperator);
    }

    const queryString = query.toString();
    const path = `/admin/list-users${queryString ? `?${queryString}` : ''}`;

    const data = await this.request<{
      users: Record<string, unknown>[];
      total: number;
      limit: number;
      offset: number;
    }>(path, { method: 'GET' });

    return {
      users: data.users.map((u) => this.mapUser(u)),
      total: data.total,
      limit: data.limit,
      offset: data.offset,
    };
  }

  async getUser(userId: string): Promise<User> {
    const data = await this.request<Record<string, unknown>>(
      `/admin/get-user?id=${encodeURIComponent(userId)}`,
      { method: 'GET' },
    );
    const userObj = (data && typeof data === 'object' && 'user' in data && data.user)
      ? (data.user as Record<string, unknown>)
      : data;
    return this.mapUser(userObj);
  }

  async createUser(input: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }): Promise<User> {
    const data = await this.request<Record<string, unknown>>(
      '/admin/create-user',
      {
        method: 'POST',
        body: JSON.stringify(input),
      },
    );
    const userObj = (data && typeof data === 'object' && 'user' in data && data.user)
      ? (data.user as Record<string, unknown>)
      : data;
    return this.mapUser(userObj);
  }

  async setRole(userId: string, role: string): Promise<void> {
    await this.request('/admin/set-role', {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    });
  }

  async setUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<void> {
    await this.request('/admin/set-user-password', {
      method: 'POST',
      body: JSON.stringify({ userId, newPassword }),
    });
  }

  async updateUser(
    userId: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    await this.request('/admin/update-user', {
      method: 'POST',
      body: JSON.stringify({ userId, data }),
    });
  }

  async banUser(
    userId: string,
    banReason?: string,
    banExpiresIn?: number,
  ): Promise<void> {
    await this.request('/admin/ban-user', {
      method: 'POST',
      body: JSON.stringify({ userId, banReason, banExpiresIn }),
    });
  }

  async unbanUser(userId: string): Promise<void> {
    await this.request('/admin/unban-user', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async listUserSessions(userId: string): Promise<UserSession[]> {
    const data = await this.request<{
      sessions: Array<{
        id: string;
        token: string;
        userId: string;
        expiresAt: string;
        createdAt: string;
        ipAddress?: string | null;
        userAgent?: string | null;
        impersonatedBy?: string | null;
      }>;
    }>('/admin/list-user-sessions', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    return data.sessions.map((s) => ({
      id: s.id,
      token: s.token,
      userId: s.userId,
      expiresAt: new Date(s.expiresAt),
      createdAt: new Date(s.createdAt),
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      impersonatedBy: s.impersonatedBy,
    }));
  }

  async revokeUserSession(sessionToken: string): Promise<void> {
    await this.request('/admin/revoke-user-session', {
      method: 'POST',
      body: JSON.stringify({ sessionToken }),
    });
  }

  async revokeUserSessions(userId: string): Promise<void> {
    await this.request('/admin/revoke-user-sessions', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async impersonateUser(userId: string): Promise<void> {
    await this.request('/admin/impersonate-user', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async stopImpersonating(): Promise<void> {
    await this.request('/admin/stop-impersonating', {
      method: 'POST',
    });
  }

  async removeUser(userId: string): Promise<void> {
    await this.request('/admin/remove-user', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }
}

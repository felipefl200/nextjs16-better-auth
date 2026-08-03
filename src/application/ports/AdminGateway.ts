import { User } from '@/src/domain/entities/User';

export interface ListUsersParams {
  limit?: number;
  offset?: number;
  searchField?: 'email' | 'name';
  searchValue?: string;
  searchOperator?: 'contains' | 'starts_with' | 'ends_with';
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filterField?: string;
  filterValue?: string | boolean;
  filterOperator?: 'eq' | 'ne' | 'lt' | 'gt' | 'lte' | 'gte';
}

export interface ListUsersResult {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}

export interface UserSession {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  impersonatedBy?: string | null;
}

export interface AdminGateway {
  listUsers(params?: ListUsersParams): Promise<ListUsersResult>;
  getUser(userId: string): Promise<User>;
  createUser(input: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }): Promise<User>;
  setRole(userId: string, role: string): Promise<void>;
  setUserPassword(userId: string, newPassword: string): Promise<void>;
  updateUser(userId: string, data: Record<string, unknown>): Promise<void>;
  banUser(
    userId: string,
    banReason?: string,
    banExpiresIn?: number,
  ): Promise<void>;
  unbanUser(userId: string): Promise<void>;
  listUserSessions(userId: string): Promise<UserSession[]>;
  revokeUserSession(sessionToken: string): Promise<void>;
  revokeUserSessions(userId: string): Promise<void>;
  impersonateUser(userId: string): Promise<void>;
  stopImpersonating(): Promise<void>;
  removeUser(userId: string): Promise<void>;
}

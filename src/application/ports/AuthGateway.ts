import { Session } from "@/src/domain/entities/Session";

export interface EnableTwoFactorResult {
  totpURI: string;
  backupCodes: string[];
}

export interface ActiveSession {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AuthGateway {
  login(
    email: string,
    password: string,
  ): Promise<{ twoFactorRedirect?: boolean }>;
  register(email: string, password: string, name: string): Promise<void>;
  getSession(): Promise<Session | null>;
  logout(): Promise<void>;
  enableTwoFactor(password: string): Promise<EnableTwoFactorResult>;
  verifyTotp(code: string): Promise<void>;
  disableTwoFactor(password: string): Promise<void>;
  authenticateTotp(code: string, trustDevice?: boolean): Promise<void>;
  authenticateBackupCode(code: string, trustDevice?: boolean): Promise<void>;
  updateProfile(data: { name?: string; email?: string; image?: string }): Promise<void>;
  uploadAvatar(file: File): Promise<{ filename: string }>;
  listSessions(): Promise<ActiveSession[]>;
  revokeSession(token: string): Promise<void>;
}


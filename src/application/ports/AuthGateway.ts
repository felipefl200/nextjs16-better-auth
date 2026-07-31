import { Session } from "@/src/domain/entities/Session";

export interface EnableTwoFactorResult {
  totpURI: string;
  backupCodes: string[];
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
}

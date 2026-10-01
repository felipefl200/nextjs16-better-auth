import { Session } from "@/domain/entities/Session";

export interface AuthGateway {
  login(email: string, password: string): Promise<void>;
  register(email: string, password: string, name: string): Promise<void>;
  getSession(): Promise<Session | null>;
  logout(): Promise<void>;
}

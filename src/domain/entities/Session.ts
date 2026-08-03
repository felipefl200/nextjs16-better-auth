import { User } from './User';

export class Session {
  constructor(
    public readonly token: string,
    public readonly user: User,
    public readonly expiresAt: Date,
    public readonly impersonatedBy?: string | null,
  ) {}

  get isImpersonating(): boolean {
    return Boolean(this.impersonatedBy);
  }
}

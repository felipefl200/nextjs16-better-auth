export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly twoFactorEnabled?: boolean,
    public readonly role?: string,
    public readonly banned?: boolean,
    public readonly banReason?: string | null,
    public readonly banExpires?: Date | null,
  ) {}

  get isAdmin(): boolean {
    if (!this.role) return false;
    return this.role
      .split(',')
      .map((r) => r.trim())
      .includes('admin');
  }
}

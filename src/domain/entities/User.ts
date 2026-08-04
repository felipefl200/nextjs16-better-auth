export interface UserDTO {
  id: string;
  email: string;
  name: string;
  twoFactorEnabled?: boolean;
  role?: string;
  banned?: boolean;
  banReason?: string | null;
  banExpires?: string | null;
  isAdmin: boolean;
}

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

  toDTO(): UserDTO {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      twoFactorEnabled: this.twoFactorEnabled,
      role: this.role,
      banned: this.banned,
      banReason: this.banReason,
      banExpires: this.banExpires ? this.banExpires.toISOString() : null,
      isAdmin: this.isAdmin,
    };
  }
}

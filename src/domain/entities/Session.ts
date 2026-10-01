import { User } from "./User";

export class Session {
  constructor(
    public readonly user: User,
    public readonly expiresAt: Date,
  ) {}
}

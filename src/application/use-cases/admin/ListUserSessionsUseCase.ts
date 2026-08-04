import { AdminGateway, UserSession } from '../../ports/AdminGateway';

export class ListUserSessionsUseCase {
  constructor(private adminGateway: AdminGateway) {}

  async execute(userId: string): Promise<UserSession[]> {
    if (!userId) {
      throw new Error('userId é obrigatório');
    }
    return this.adminGateway.listUserSessions(userId);
  }
}

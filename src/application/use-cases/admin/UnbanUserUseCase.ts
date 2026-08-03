import { AdminGateway } from '../../ports/AdminGateway';

export class UnbanUserUseCase {
  constructor(private adminGateway: AdminGateway) {}

  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('userId é obrigatório');
    }
    return this.adminGateway.unbanUser(userId);
  }
}

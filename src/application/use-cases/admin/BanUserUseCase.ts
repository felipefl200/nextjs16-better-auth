import { AdminGateway } from '../../ports/AdminGateway';

export class BanUserUseCase {
  constructor(private adminGateway: AdminGateway) {}

  async execute(
    userId: string,
    currentUserId: string,
    banReason?: string,
    banExpiresIn?: number,
  ): Promise<void> {
    if (!userId) {
      throw new Error('userId é obrigatório');
    }
    if (userId === currentUserId) {
      throw new Error('Não é possível banir a si mesmo');
    }
    return this.adminGateway.banUser(userId, banReason, banExpiresIn);
  }
}

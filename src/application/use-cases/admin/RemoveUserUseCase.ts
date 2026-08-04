import { AdminGateway } from '../../ports/AdminGateway';

export class RemoveUserUseCase {
  constructor(private adminGateway: AdminGateway) {}

  async execute(userId: string, currentUserId?: string): Promise<void> {
    if (!userId) {
      throw new Error('userId é obrigatório');
    }
    if (currentUserId && userId === currentUserId) {
      throw new Error('Não é possível remover a si mesmo');
    }
    return this.adminGateway.removeUser(userId);
  }
}

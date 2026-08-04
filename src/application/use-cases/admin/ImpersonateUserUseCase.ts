import { AdminGateway } from '../../ports/AdminGateway';

export class ImpersonateUserUseCase {
  constructor(private adminGateway: AdminGateway) {}

  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('userId é obrigatório');
    }
    return this.adminGateway.impersonateUser(userId);
  }
}

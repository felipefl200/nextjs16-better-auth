import { AdminGateway } from '../../ports/AdminGateway';

export class SetUserPasswordUseCase {
  constructor(private adminGateway: AdminGateway) {}

  async execute(userId: string, newPassword: string): Promise<void> {
    if (!userId) {
      throw new Error('userId é obrigatório');
    }
    if (!newPassword || newPassword.length < 8) {
      throw new Error('A senha deve ter no mínimo 8 caracteres');
    }
    return this.adminGateway.setUserPassword(userId, newPassword);
  }
}

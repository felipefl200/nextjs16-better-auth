import { AdminGateway } from '../../ports/AdminGateway';

export class SetUserPasswordUseCase {
  constructor(private adminGateway: AdminGateway) {}

  async execute(userId: string, newPassword: string): Promise<void> {
    if (!userId) {
      throw new Error('userId é obrigatório');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres');
    }
    return this.adminGateway.setUserPassword(userId, newPassword);
  }
}

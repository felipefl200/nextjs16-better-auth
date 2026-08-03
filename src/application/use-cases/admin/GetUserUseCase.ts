import { User } from '@/src/domain/entities/User';
import { AdminGateway } from '../../ports/AdminGateway';

export class GetUserUseCase {
  constructor(private adminGateway: AdminGateway) {}

  async execute(userId: string): Promise<User> {
    if (!userId) {
      throw new Error('userId é obrigatório');
    }
    return this.adminGateway.getUser(userId);
  }
}
